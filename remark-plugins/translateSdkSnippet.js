/**
 * Translates TypeScript SDK snippets to Java, Go, and C# equivalents.
 * Heuristic-based; mirrors sdk/{java,go,dotnet}/docs/migration.md patterns.
 */

const fs = require('fs');
const path = require('path');

// Every file in sdk/ts/src that declares `export enum X { ... }`. Docs snippets reference these
// enums (DataTypes.STRING, AuthTypes.TOKEN, etc.) as bare values inside object literals; since
// Go/Java/.NET have no equivalent enum types to import, we resolve each reference to its
// underlying string literal (read from source, not hardcoded, so it can't drift) before doing any
// other translation.
const ENUM_SOURCE_FILES = [
  'database/types/presave.interface.ts',
  'database/types/trigger.interface.ts',
  'database/types/enums.ts',
  'database/adapters/base.adapter.ts',
  'types/inputs.types.ts',
  'types/productsBuilder.types.ts',
  'types/index.types.ts',
  'types/enums.ts',
  'types/processor.types.ts',
  'graph/types/enums.ts',
  'imports/imports.types.ts',
  'logs/logs.types.ts',
  'resilience/types/index.ts',
  'jobs/types.ts',
  'vector/types/enums.ts',
  'pricing/pricing.types.ts',
  'notifications/types/notifications.types.ts',
];

let enumValueMapCache = null;

/** Parses `export enum Name { MEMBER = 'value', ... }` blocks out of the SDK source. */
function loadEnumValueMap() {
  if (enumValueMapCache) {
    return enumValueMapCache;
  }
  const map = {};
  const sdkSrcRoot = path.join(__dirname, '..', '..', 'sdk', 'ts', 'src');
  for (const relativeFile of ENUM_SOURCE_FILES) {
    let contents;
    try {
      contents = fs.readFileSync(path.join(sdkSrcRoot, relativeFile), 'utf8');
    } catch {
      continue;
    }
    const enumPattern = /export enum (\w+)\s*\{([^}]*)\}/g;
    let enumMatch;
    while ((enumMatch = enumPattern.exec(contents))) {
      const [, enumName, body] = enumMatch;
      const members = {};
      const memberPattern = /(\w+)\s*=\s*['"]([^'"]*)['"]/g;
      let memberMatch;
      while ((memberMatch = memberPattern.exec(body))) {
        members[memberMatch[1]] = memberMatch[2];
      }
      map[enumName] = members;
    }
  }
  enumValueMapCache = map;
  return map;
}

/**
 * Replaces bare `EnumName.MEMBER` references (e.g. `DataTypes.STRING`) with the member's
 * underlying string literal, so downstream object-literal conversion treats it like any other
 * quoted string value instead of leaving an unresolved identifier behind.
 */
function resolveEnumReferences(code) {
  const enumMap = loadEnumValueMap();
  return code.replace(/\b([A-Z][A-Za-z0-9]*)\.([A-Z][A-Z0-9_]*)\b/g, (full, enumName, member) => {
    const enumDef = enumMap[enumName];
    if (enumDef && Object.prototype.hasOwnProperty.call(enumDef, member)) {
      return `'${enumDef[member]}'`;
    }
    return full;
  });
}

/** Strips TS-only type imports (e.g. `import { DataTypes } from '@ductape/sdk/types';`) that
 * have no runtime equivalent to import in Go/Java/.NET — by the time this runs, any enum values
 * from that import have already been inlined as literals by resolveEnumReferences. */
function stripTypeOnlyImports(code) {
  return code.replace(/^import\s+(?:type\s+)?\{[^}]*\}\s+from\s+['"]@ductape\/sdk\/types['"];?\n?/gm, '');
}

const SKIP_BLOCK =
  /(@ductape\/nestjs|@ductape\/react|@ductape\/client|@ductape\/vue|useDuctape|DuctapeProvider|@nestjs\/|DuctapeModule|DuctapeContext|DuctapeMethodInterceptor|DuctapeBuilderInterceptor|DuctapeContextInterceptor|DuctapeDatabaseModule|DuctapeStorageModule|@Api\b|@ApiConfig|@ApiDispatch|@Database\b|@Storage\b|@Webhook|@InjectContext|@Product\b|@Env\b|@AccessTag|@Messaging|@Notification|@Workflow|@Job\.|@Cache\b|@Graph\b|@Vector\b|@Secret\b|@Agent\b|@Warehouse|@Session|@Health|@Quota|@Fallback|@AppTag|WebhookBuilder|ModelBuilder|AgentBuilder|from 'express'|NextResponse|create-react-app|npx create|interface I[A-Z]|type I[A-Z]|export interface|export type)/;

const SKIP_FILE =
  /(?:^|\/)(?:frontend|nestjs|tutorials\/client)(?:\/|$)/;

function shouldSkipFile(filepath) {
  const normalized = filepath.replace(/\\/g, '/');
  return SKIP_FILE.test(normalized) || /\/nestjs\//.test(normalized);
}

function shouldSkipBlock(code) {
  return SKIP_BLOCK.test(code);
}

/** @param {string} ts */
function translateToJava(ts) {
  let code = ts;
  code = stripTypeOnlyImports(code);
  code = resolveEnumReferences(code);

  code = code.replace(
    /import\s+Ductape\s+from\s+['"]@ductape\/sdk['"];?\s*\n?/g,
    `import app.ductape.sdk.Ductape;
import app.ductape.sdk.core.EnvType;
import app.ductape.sdk.core.RequestContext;

`,
  );
  code = code.replace(
    /import\s+\{\s*Ductape\s*\}\s+from\s+['"]@ductape\/sdk['"];?\s*\n?/g,
    `import app.ductape.sdk.Ductape;
import app.ductape.sdk.core.EnvType;
import app.ductape.sdk.core.RequestContext;

`,
  );

  code = code.replace(
    /const\s+ductape\s*=\s*new\s+Ductape\(\{\s*accessKey:\s*([^,}]+),?\s*\}\);?/g,
    'RequestContext auth = new RequestContext(null, null, null, null, $1);\nDuctape ductape = new Ductape(EnvType.PRODUCTION, auth);',
  );

  code = code.replace(
    /const\s+ductape\s*=\s*new\s+Ductape\(\{\s*accessKey:\s*process\.env\.(\w+)!?,?\s*\}\);?/g,
    'RequestContext auth = new RequestContext(null, null, null, null, System.getenv("$1"));\nDuctape ductape = new Ductape(EnvType.PRODUCTION, auth);',
  );

  code = convertObjectCalls(code, 'ductape.api.run', 'ductape.api().run', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.api.config', 'ductape.api().config', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.api.oauth', 'ductape.api().oauth', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.api.dispatch', 'ductape.api().dispatch', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.api.import', 'ductape.api().import', 'Map<String, Object>');

  code = convertObjectCalls(code, 'ductape.product.create', 'ductape.productsService().createProduct', 'Map<String, Object>');
  code = convertObjectCalls(code, 'await ductape.product.create', 'ductape.productsService().createProduct', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.product.init', 'ductape.productsService().fetchProductByTag', 'Map<String, Object>');
  code = convertObjectCalls(code, 'await ductape.product.init', 'ductape.productsService().fetchProductByTag', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.product.fetch', 'ductape.productsService().fetchProductByTag', 'Map<String, Object>');
  code = convertObjectCalls(code, 'await ductape.product.fetch', 'ductape.productsService().fetchProductByTag', 'Map<String, Object>');

  code = convertObjectCalls(code, 'ductape.databases.connect', 'ductape.databases().connect', 'Map<String, Object>');
  code = convertObjectCalls(code, 'await ductape.databases.connect', 'ductape.databases().connect', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.databases.find', 'ductape.databases().query', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.databases.insert', 'ductape.databases().insert', 'Map<String, Object>');

  code = convertObjectCalls(code, 'ductape.graph.connect', 'ductape.graphs().connect', 'Map<String, Object>');
  code = convertObjectCalls(code, 'await ductape.graph.connect', 'ductape.graphs().connect', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.graph.traverse', 'ductape.graphs().traverse', 'Map<String, Object>');

  code = convertObjectCalls(code, 'ductape.vector.connect', 'ductape.vectors().connect', 'Map<String, Object>');
  code = convertObjectCalls(code, 'await ductape.vector.connect', 'ductape.vectors().connect', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.vector.query', 'ductape.vectors().query', 'Map<String, Object>');

  code = convertObjectCalls(code, 'ductape.cache.create', 'ductape.cacheService().create', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.cache.set', 'ductape.cacheService().set', 'Map<String, Object>');

  code = convertObjectCalls(code, 'ductape.secrets.create', 'ductape.secretService().create', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.notifications.send', 'ductape.notifications().send', 'Map<String, Object>');

  code = convertObjectCalls(code, 'ductape.workflows.dispatch', 'ductape.workflowService().dispatch', 'Map<String, Object>');
  code = convertObjectCalls(code, 'ductape.agents.run', 'ductape.agents().run', 'Map<String, Object>');

  code = code.replace(/\bawait\s+/g, '');
  code = code.replace(/\bconst\s+/g, 'Map<String, Object> ');
  code = code.replace(/\blet\s+/g, 'Map<String, Object> ');
  code = code.replace(/console\.log\(/g, 'System.out.println(');
  code = code.replace(/\.catch\(console\.error\)/g, '');
  code = code.replace(/process\.env\.(\w+)/g, 'System.getenv("$1")');
  code = code.replace(/new Date\(\)/g, 'Instant.now()');

  return wrapIfNeeded(code, 'java');
}

/** @param {string} ts */
function translateToGo(ts) {
  let code = ts;
  code = stripTypeOnlyImports(code);
  code = resolveEnumReferences(code);

  code = code.replace(
    /import\s+Ductape\s+from\s+['"]@ductape\/sdk['"];?\s*\n?/g,
    `import (
\t"context"
\t"github.com/ductape/ductape/sdk/go/core"
\tductapesdk "github.com/ductape/ductape/sdk/go/ductape"
)

`,
  );

  // Uses the "ductapesdk" import alias (not "ductape") so the package-constructor call below
  // survives the later blanket "ductape." -> "client." substitution (which targets the TS
  // variable named ductape, not the Go package).
  code = code.replace(
    /const\s+ductape\s*=\s*new\s+Ductape\(\{[^}]*accessKey:\s*([^,}]+)[^}]*\}\);?/g,
    'auth := core.NewRequestContext("", "", "", "", $1)\nclient, err := ductapesdk.New(core.EnvProduction, auth)\nif err != nil {\n\treturn err\n}',
  );

  code = convertObjectCalls(code, 'ductape.api.run', 'client.Api.Run', 'map[string]any', 'ctx, ');
  code = convertObjectCalls(code, 'ductape.api.dispatch', 'client.Api.Dispatch', 'map[string]any', 'ctx, ');
  code = convertObjectCalls(code, 'ductape.api.config', 'client.Api.Config', 'map[string]any', 'ctx, ');

  code = convertObjectCalls(code, 'ductape.product.create', 'client.Product.Create', 'map[string]any', 'ctx, ');
  code = convertObjectCalls(code, 'await ductape.product.create', 'client.Product.Create', 'map[string]any', 'ctx, ');
  code = convertObjectCalls(code, 'ductape.product.init', 'client.Product.Init', '', '');
  code = convertObjectCalls(code, 'await ductape.product.init', 'client.Product.Init', '', '');

  code = convertObjectCalls(code, 'ductape.databases.connect', 'client.Databases.Connect', 'map[string]any', 'ctx, ');
  code = convertObjectCalls(code, 'await ductape.databases.connect', 'client.Databases.Connect', 'map[string]any', 'ctx, ');
  code = convertObjectCalls(code, 'ductape.databases.find', 'client.Databases.Query', 'map[string]any', 'ctx, ');
  code = convertObjectCalls(code, 'ductape.databases.insert', 'client.Databases.Insert', 'map[string]any', 'ctx, ');

  code = convertObjectCalls(code, 'ductape.graph.connect', 'client.GraphAPI.Connect', 'map[string]any', 'ctx, ');
  code = convertObjectCalls(code, 'ductape.vector.connect', 'client.VectorAPI.Connect', 'map[string]any', 'ctx, ');
  code = convertObjectCalls(code, 'ductape.vector.query', 'client.VectorAPI.Query', 'map[string]any', 'ctx, ');

  code = convertObjectCalls(code, 'ductape.cache.create', 'client.Cache.Create', 'map[string]any', 'ctx, ');
  code = convertObjectCalls(code, 'ductape.notifications.send', 'client.Notifications.Send', 'map[string]any', 'ctx, ');

  code = code.replace(/\bawait\s+/g, '');
  // Bare object-literal assignments (not passed inline to a recognized call above, which already
  // wraps its own braces) need an explicit map[string]any{ — plain `details := {` isn't valid Go.
  code = code.replace(/\b(?:const|let)\s+(\w+)\s*=\s*\{/g, '$1 := map[string]any{');
  code = code.replace(/\bconst\s+(\w+)\s*=/g, '$1 :=');
  code = code.replace(/\blet\s+(\w+)\s*=/g, '$1 :=');
  code = code.replace(/console\.log\(/g, 'fmt.Println(');
  code = code.replace(/ductape\./g, 'client.');
  code = code.replace(/process\.env\.(\w+)/g, 'os.Getenv("$1")');

  if (!code.includes('"context"') && code.includes('ctx,')) {
    code = 'import "context"\n\n' + code;
  }

  return wrapIfNeeded(code, 'go');
}

/** @param {string} ts */
function translateToDotnet(ts) {
  let code = ts;
  code = stripTypeOnlyImports(code);
  code = resolveEnumReferences(code);

  code = code.replace(
    /import\s+Ductape\s+from\s+['"]@ductape\/sdk['"];?\s*\n?/g,
    `using Ductape.Sdk;
using Ductape.Sdk.Core;

`,
  );

  code = code.replace(
    /const\s+ductape\s*=\s*new\s+Ductape\(\{\s*accessKey:\s*([^,}]+),?\s*\}\);?/g,
    'var auth = new RequestContext(null, null, null, null, $1, null);\nvar ductape = new Ductape(EnvType.Production, auth);',
  );

  code = code.replace(
    /const\s+ductape\s*=\s*new\s+Ductape\(\{\s*accessKey:\s*process\.env\.(\w+)!?,?\s*\}\);?/g,
    'var auth = new RequestContext(null, null, null, null, Environment.GetEnvironmentVariable("$1"), null);\nvar ductape = new Ductape(EnvType.Production, auth);',
  );

  code = convertObjectCalls(code, 'ductape.api.run', 'await ductape.Api.RunAsync', 'Dictionary<string, object?>');
  code = convertObjectCalls(code, 'ductape.api.dispatch', 'await ductape.Api.DispatchAsync', 'Dictionary<string, object?>');
  code = convertObjectCalls(code, 'ductape.api.config', 'ductape.Api.Config', 'Dictionary<string, object?>');

  code = convertObjectCalls(code, 'ductape.product.create', 'await ductape.Products.CreateProductAsync', 'Dictionary<string, object?>');
  code = convertObjectCalls(code, 'await ductape.product.create', 'await ductape.Products.CreateProductAsync', 'Dictionary<string, object?>');
  code = convertObjectCalls(code, 'ductape.product.init', 'await ductape.Products.FetchProductByTagAsync', 'Dictionary<string, object?>');

  code = convertObjectCalls(code, 'ductape.databases.connect', 'ductape.Database.Connect', 'Dictionary<string, object?>');
  code = convertObjectCalls(code, 'await ductape.databases.connect', 'ductape.Database.Connect', 'Dictionary<string, object?>');
  code = convertObjectCalls(code, 'ductape.databases.find', 'ductape.Database.Query', 'Dictionary<string, object?>');
  code = convertObjectCalls(code, 'ductape.databases.insert', 'ductape.Database.Insert', 'Dictionary<string, object?>');

  code = convertObjectCalls(code, 'ductape.graph.connect', 'ductape.Graph.Connect', 'Dictionary<string, object?>');
  code = convertObjectCalls(code, 'ductape.vector.connect', 'ductape.Vector.Connect', 'Dictionary<string, object?>');
  code = convertObjectCalls(code, 'ductape.vector.query', 'ductape.Vector.Query', 'Dictionary<string, object?>');

  code = convertObjectCalls(code, 'ductape.cache.create', 'await ductape.Cache.CreateAsync', 'Dictionary<string, object?>');
  code = convertObjectCalls(code, 'ductape.notifications.send', 'await ductape.Notifications.SendAsync', 'Dictionary<string, object?>');

  // Bare object-literal assignments (not passed inline to a recognized call above, which already
  // wraps its own braces) need an explicit new Dictionary<string, object?> — plain `var details =
  // {` isn't valid C# collection-initializer syntax.
  code = code.replace(/\b(?:const|let)\s+(\w+)\s*=\s*\{/g, 'var $1 = new Dictionary<string, object?>\n{');
  code = code.replace(/\bconst\s+/g, 'var ');
  code = code.replace(/\blet\s+/g, 'var ');
  code = code.replace(/console\.log\(/g, 'Console.WriteLine(');
  code = code.replace(/process\.env\.(\w+)/g, 'Environment.GetEnvironmentVariable("$1")');
  code = code.replace(/new Date\(\)/g, 'DateTime.UtcNow');

  return wrapIfNeeded(code, 'csharp');
}

/**
 * @param {string} code
 * @param {string} callee
 * @param {string} replacement
 * @param {string} mapType
 * @param {string} [prefix='']
 */
function convertObjectCalls(code, callee, replacement, mapType, prefix = '') {
  const pattern = new RegExp(`(await\\s+)?${escapeRegex(callee)}\\(\\{`, 'g');
  return code.replace(pattern, (match, awaitKw) => {
    const awaitPrefix = awaitKw || '';
    if (mapType === 'Dictionary<string, object?>') {
      return `${awaitPrefix}${replacement}(${prefix}new ${mapType}\n{\n`;
    }
    if (mapType === 'map[string]any') {
      return `${awaitPrefix}${replacement}(${prefix}${mapType}{\n`;
    }
    if (mapType) {
      return `${awaitPrefix}${replacement}(${prefix}${mapType}.of(\n`;
    }
    return `${awaitPrefix}${replacement}(`;
  });
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Convert TS object literal syntax inside a snippet to language-specific map syntax.
 * @param {string} code
 * @param {string} lang
 */
function wrapIfNeeded(code, lang) {
  if (lang === 'java') {
    code = convertTsObjectLiteralsToJava(code);
  } else if (lang === 'go') {
    code = convertTsObjectLiteralsToGo(code);
  } else if (lang === 'csharp') {
    code = convertTsObjectLiteralsToCSharp(code);
  }
  return code.trim();
}

function convertTsObjectLiteralsToJava(code) {
  return code
    .replace(/(\w+):\s*'([^']*)'/g, '"$1", "$2"')
    .replace(/(\w+):\s*"([^"]*)"/g, '"$1", "$2"')
    .replace(/(\w+):\s*(\d+)/g, '"$1", $2')
    .replace(/(\w+):\s*(true|false)/g, '"$1", $2')
    // Trailing commas are valid in TS object literals but not in a Java Map.of(...) varargs call.
    .replace(/,(\s*)\}/g, '$1}')
    .replace(/\{(\s*)/g, 'Map.of($1')
    .replace(/\}(\s*[,;)]?)/g, ')$1');
}

function convertTsObjectLiteralsToGo(code) {
  return code
    .replace(/(\w+):\s*'([^']*)'/g, '"$1": "$2"')
    .replace(/(\w+):\s*"([^"]*)"/g, '"$1": "$2"')
    .replace(/(\w+):\s*(\d+)/g, '"$1": $2')
    .replace(/(\w+):\s*(true|false)/g, '"$1": $2');
}

function convertTsObjectLiteralsToCSharp(code) {
  return code
    .replace(/(\w+):\s*'([^']*)'/g, '["$1"] = "$2"')
    .replace(/(\w+):\s*"([^"]*)"/g, '["$1"] = "$2"')
    .replace(/(\w+):\s*(\d+)/g, '["$1"] = $2')
    .replace(/(\w+):\s*(true|false)/g, '["$1"] = $2')
    .replace(/'headers:([^']+)'/g, '"headers:$1"');
}

module.exports = {
  shouldSkipFile,
  shouldSkipBlock,
  translateToJava,
  translateToGo,
  translateToDotnet,
};
