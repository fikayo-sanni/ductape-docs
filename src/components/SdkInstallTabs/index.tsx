import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import {sdkTabLabel} from '@site/src/components/LanguageTabLabel/tabLabel';

/**
 * Installation commands for each Ductape server SDK.
 */
export default function SdkInstallTabs(): JSX.Element {
  return (
    <Tabs groupId="sdk-install" queryString>
      <TabItem value="typescript" label={sdkTabLabel('typescript', 'TypeScript')} default>
        <CodeBlock language="bash">npm install @ductape/sdk@latest</CodeBlock>
      </TabItem>
      <TabItem value="nestjs" label="NestJS">
        <CodeBlock language="bash">npm install @ductape/nestjs@latest @ductape/sdk@latest</CodeBlock>
      </TabItem>
      {/* Legacy Go, Java, and .NET install tabs are intentionally hidden. */}
    </Tabs>
  );
}
