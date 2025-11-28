import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { Package, Zap, Code } from 'lucide-react';

type FeatureItem = {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Modular Architecture',
    Icon: Package,
    description: (
      <>
        Build backend systems with composable packages. Connect apps, manage environments,
        and orchestrate workflows in one unified platform.
      </>
    ),
  },
  {
    title: 'Lightning Fast',
    Icon: Zap,
    description: (
      <>
        Optimized for performance with built-in caching, fallbacks, and smart routing.
        Deploy and scale with confidence.
      </>
    ),
  },
  {
    title: 'Developer First',
    Icon: Code,
    description: (
      <>
        Type-safe SDK, comprehensive docs, and powerful features make building
        production-ready backends a breeze.
      </>
    ),
  },
];

function Feature({title, Icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Icon className={styles.featureSvg} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
