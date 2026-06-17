import React from 'react';
import type {TabItemProps} from '@docusaurus/theme-common/internal';
import LanguageTabLabel, {type SdkLanguageId} from './index';

/** Docusaurus TabItem `label` is typed as string but accepts React nodes at runtime. */
export function sdkTabLabel(
  id: SdkLanguageId,
  text: string,
): TabItemProps['label'] {
  return (
    <LanguageTabLabel id={id} text={text} />
  ) as TabItemProps['label'];
}
