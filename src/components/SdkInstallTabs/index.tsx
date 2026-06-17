import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { SDK_VERSIONS } from '@site/src/constants/sdkVersions';
import {sdkTabLabel} from '@site/src/components/LanguageTabLabel/tabLabel';

/**
 * Installation commands for each Ductape server SDK.
 */
export default function SdkInstallTabs(): JSX.Element {
  const { typescript, java, go, dotnet } = SDK_VERSIONS;

  return (
    <Tabs groupId="sdk-install" queryString>
      <TabItem value="typescript" label={sdkTabLabel('typescript', 'TypeScript')} default>
        <CodeBlock language="bash">{`npm install @ductape/sdk@${typescript}`}</CodeBlock>
      </TabItem>
      <TabItem value="java" label={sdkTabLabel('java', 'Java')}>
        <CodeBlock language="xml">{`<dependency>
  <groupId>app.ductape</groupId>
  <artifactId>sdk</artifactId>
  <version>${java}</version>
</dependency>`}</CodeBlock>
      </TabItem>
      <TabItem value="go" label={sdkTabLabel('go', 'Go')}>
        <CodeBlock language="bash">{`go get github.com/ductape/ductape/sdk/go@${go}`}</CodeBlock>
      </TabItem>
      <TabItem value="dotnet" label={sdkTabLabel('dotnet', '.NET')}>
        <CodeBlock language="bash">{`dotnet add package Ductape.Sdk --version ${dotnet}`}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
