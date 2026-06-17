import React from 'react';
import {SdkLanguageTabIcon} from './icons';

export type SdkLanguageId = 'typescript' | 'java' | 'go' | 'dotnet';

type Props = {
  id: SdkLanguageId;
  text: string;
};

/**
 * Tab label with language logo (used in SdkCodeTabs / SdkInstallTabs).
 */
export default function LanguageTabLabel({id, text}: Props): JSX.Element {
  return (
    <span className="sdk-lang-tab-label">
      <SdkLanguageTabIcon id={id} />
      <span>{text}</span>
    </span>
  );
}
