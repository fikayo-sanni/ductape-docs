import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import {sdkTabLabel} from '@site/src/components/LanguageTabLabel/tabLabel';
import type {SdkLanguageId} from '@site/src/components/LanguageTabLabel';

export type SdkCodeTabsProps = {
  typescript: string;
  java?: string;
  go?: string;
  dotnet?: string;
  groupId?: string;
};

function renderCode(language: string, code: string) {
  return <CodeBlock language={language}>{code.trimEnd()}</CodeBlock>;
}

/**
 * Renders the same SDK example in TypeScript, Java, Go, and .NET tabs.
 * Populated automatically by the remark-sdk-code-tabs plugin for ```ts blocks.
 */
export default function SdkCodeTabs({
  typescript,
  java,
  go,
  dotnet,
  groupId = 'sdk-language',
}: SdkCodeTabsProps): JSX.Element {
  const tabs: Array<{
    value: SdkLanguageId;
    text: string;
    language: string;
    code: string;
  }> = [{value: 'typescript', text: 'TypeScript', language: 'typescript', code: typescript}];

  if (java) {
    tabs.push({value: 'java', text: 'Java', language: 'java', code: java});
  }
  if (go) {
    tabs.push({value: 'go', text: 'Go', language: 'go', code: go});
  }
  if (dotnet) {
    tabs.push({value: 'dotnet', text: '.NET', language: 'csharp', code: dotnet});
  }

  return (
    <Tabs groupId={groupId} queryString>
      {tabs.map((tab, index) => (
        <TabItem
          key={tab.value}
          value={tab.value}
          label={sdkTabLabel(tab.value, tab.text)}
          default={index === 0}>
          {renderCode(tab.language, tab.code)}
        </TabItem>
      ))}
    </Tabs>
  );
}
