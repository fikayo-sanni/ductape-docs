import React from 'react';
import styles from './styles.module.css';

export default function PreviewBanner(): JSX.Element {
  return (
    <div className={styles.previewBanner}>
      <div className={styles.previewBadge}>Preview</div>
      <div className={styles.previewContent}>
        <strong>Preview Feature</strong> — This feature is currently in preview and under active development.
        APIs and functionality may change. We recommend testing thoroughly before using in production.
      </div>
    </div>
  );
}
