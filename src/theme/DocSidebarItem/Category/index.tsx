import React from 'react';
import {useDocSidebarItemsExpandedState} from '@docusaurus/plugin-content-docs/client';
import {useCollapsible, Collapsible} from '@docusaurus/theme-common';
import {ThemeClassNames, useThemeConfig} from '@docusaurus/theme-common';
import DocSidebarItems from '@theme/DocSidebarItems';
import clsx from 'clsx';
import type {Props} from '@theme/DocSidebarItem/Category';
import {
  Rocket,
  BookOpen,
  Grid3x3,
  Package,
  Code2,
  Zap,
  Workflow,
  Box,
  KeyRound,
  Key,
  Bell,
  MessageSquare,
  HardDrive,
  Database,
  RefreshCw,
  Timer,
  Shield,
  FileText,
  Settings2,
  Layers,
  Share2,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Heart,
  Webhook,
  Activity,
  type LucideIcon,
} from 'lucide-react';

// Map category labels to Lucide icons - matches workbench icons
const iconMap: Record<string, LucideIcon> = {
  'Getting Started': Rocket,
  'Tutorials': BookOpen,
  'Apps': Grid3x3,
  'Products': Package,
  'Operators': Code2,
  'Actions': Zap,
  'Features': Workflow,
  'Jobs': Box,
  'Sessions': KeyRound,
  'Notifications': Bell,
  'Message Brokers': MessageSquare,
  'Storage': HardDrive,
  'Database Actions': Database,
  'Database Migrations': RefreshCw,
  'Quotas': Timer,
  'Fallbacks': Shield,
  'Logs': FileText,
  'Webhooks': Webhook,
  'Configuring Message Brokers': Settings2,
  'Configuring Storage': Settings2,
  'Sequencing Events': Layers,
  'Event Types': Layers,
  'Caching': Layers,
  'Databases': Database,
  'Notification Messages': Bell,
  'Graphs': Share2,
  'Resilience': Shield,
  'Reference': BookOpen,
  'Templates': Bell,
  'Healthchecks': Activity,
  'Secrets': Key,
};

// Clean emoji prefix from label if present
function cleanLabel(label: string): string {
  return label.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\uFE0F?\s*/u, '').replace(/^[^\w\s]\s*/u, '');
}

function useCategoryHrefWithSSRFallback(item: Props['item']): string | undefined {
  return item.href;
}

export default function DocSidebarItemCategory({
  item,
  activePath,
  level,
  index,
  ...props
}: Props): JSX.Element {
  const {docs} = useThemeConfig();
  const cleanedLabel = cleanLabel(item.label);
  const IconComponent = iconMap[cleanedLabel] || FolderOpen;
  const href = useCategoryHrefWithSSRFallback(item);

  const {collapsed, setCollapsed} = useCollapsible({
    initialState: () => !item.collapsible || item.collapsed,
  });
  const {expandedItem, setExpandedItem} = useDocSidebarItemsExpandedState();

  const updateCollapsed = (toCollapsed = !collapsed) => {
    setExpandedItem(toCollapsed ? null : item);
    setCollapsed(toCollapsed);
  };

  React.useEffect(() => {
    if (expandedItem != null && expandedItem !== item && item.collapsible) {
      setCollapsed(true);
    }
  }, [expandedItem, item]);

  const isActive = item.items?.some((subItem) => {
    if (subItem.type === 'link') {
      return subItem.href === activePath;
    }
    return false;
  });

  const isTopLevel = level === 1;
  const ChevronIcon = collapsed ? ChevronRight : ChevronDown;

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        'menu__list-item',
        {
          'menu__list-item--collapsed': collapsed,
        },
      )}>
      <div
        className={clsx('menu__link', 'sidebar-category-link', {
          'menu__link--sublist': item.collapsible,
          'menu__link--active': isActive,
        })}
        onClick={
          item.collapsible
            ? (e) => {
                e.preventDefault();
                updateCollapsed();
              }
            : undefined
        }
        aria-expanded={item.collapsible ? !collapsed : undefined}
        role="button"
        tabIndex={0}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        {...props}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isTopLevel && (
            <IconComponent
              size={18}
              className="sidebar-icon"
              style={{
                opacity: 0.9,
                flexShrink: 0,
              }}
            />
          )}
          <span className="sidebar-label">{cleanedLabel}</span>
        </span>
        {item.collapsible && (
          <ChevronIcon
            size={16}
            className="sidebar-chevron"
            style={{
              opacity: 0.6,
              flexShrink: 0,
              transition: 'transform 0.2s ease',
            }}
          />
        )}
      </div>
      <Collapsible
        lazy
        as="ul"
        className="menu__list"
        collapsed={collapsed}>
        <DocSidebarItems
          items={item.items}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  );
}
