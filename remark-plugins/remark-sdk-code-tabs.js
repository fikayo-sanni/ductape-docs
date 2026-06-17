const {visit} = require('unist-util-visit');
const {
  shouldSkipFile,
  shouldSkipBlock,
  translateToJava,
  translateToGo,
  translateToDotnet,
} = require('./translateSdkSnippet');

const SDK_LANGS = new Set(['typescript', 'ts', 'tsx']);

/**
 * Wraps TypeScript fenced code blocks in <SdkCodeTabs> with Java, Go, and .NET translations.
 */
function remarkSdkCodeTabs() {
  return (tree, file) => {
    const filepath = file.history?.[0] ?? file.path ?? '';
    const normalizedPath = filepath.replace(/\\/g, '/');
    if (shouldSkipFile(normalizedPath)) {
      return;
    }

    visit(tree, 'code', (node, index, parent) => {
      if (!parent || index == null) {
        return;
      }

      if (node.lang && SDK_LANGS.has(node.lang)) {
        const typescript = node.value ?? '';
        if (shouldSkipBlock(typescript)) {
          return;
        }

        parent.children[index] = {
          type: 'mdxJsxFlowElement',
          name: 'SdkCodeTabs',
          attributes: [
            stringAttribute('typescript', typescript),
            stringAttribute('java', translateToJava(typescript)),
            stringAttribute('go', translateToGo(typescript)),
            stringAttribute('dotnet', translateToDotnet(typescript)),
          ],
          children: [],
        };
        return;
      }

      // Replace npm install blocks with multi-SDK install tabs (NestJS uses its own install line)
      if (
        node.lang === 'bash' &&
        typeof node.value === 'string' &&
        /@ductape\/sdk/.test(node.value) &&
        !/@ductape\/nestjs/.test(node.value) &&
        /npm install/.test(node.value)
      ) {
        parent.children[index] = {
          type: 'mdxJsxFlowElement',
          name: 'SdkInstallTabs',
          attributes: [],
          children: [],
        };
      }
    });
  };
}

/** @param {string} name @param {string} value */
function stringAttribute(name, value) {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: JSON.stringify(value),
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'Literal',
                value,
                raw: JSON.stringify(value),
              },
            },
          ],
        },
      },
    },
  };
}

module.exports = remarkSdkCodeTabs;
