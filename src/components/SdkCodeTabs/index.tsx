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
 * Renders the active TypeScript server SDK example.
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

  // Legacy Go, Java, and .NET props remain accepted so older MDX compiles, but
  // their tabs are intentionally hidden until those SDKs are ready to advertise.
  void java;
  void go;
  void dotnet;

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
