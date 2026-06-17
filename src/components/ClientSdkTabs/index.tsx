import React from 'react';
import Tabs from '@theme/Tabs';

type Props = {
  children: React.ReactNode;
  /** Override default tab group (persists tab choice across pages). */
  groupId?: string;
};

/**
 * Tabs for @ductape/client vs React vs Vue code samples.
 * Use with TabItem from @theme/TabItem as children.
 */
export default function ClientSdkTabs({
  children,
  groupId = 'client-sdk',
}: Props): JSX.Element {
  return (
    <Tabs groupId={groupId} queryString>
      {children}
    </Tabs>
  );
}
