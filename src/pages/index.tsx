import {useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import NightSky from '@site/src/components/NightSky';

import styles from './index.module.css';

type Feature = {icon: string; title: string; desc: string};

const FEATURES: Feature[] = [
  {
    icon: 'img/features/offline.png',
    title: 'Fully offline',
    desc: 'Every prayer time is computed locally with astronomical algorithms. No internet, no tracking, no accounts.',
  },
  {
    icon: 'img/features/methods.png',
    title: '21 calculation methods',
    desc: 'MWL, Umm al-Qura, ISNA, Egyptian, Kemenag, JAKIM, Diyanet, and 14 more. Every madzhab, every country.',
  },
  {
    icon: 'img/features/reminders.png',
    title: 'Reminders on your terms',
    desc: 'Notifies you 30, 15, and 5 minutes before the Adhan, or at your own custom intervals per prayer.',
  },
  {
    icon: 'img/features/adhan.png',
    title: 'Custom Adhan sounds',
    desc: 'Play a full Adhan or a gentle reminder chime when each prayer time arrives.',
  },
  {
    icon: 'img/features/platforms.png',
    title: 'Linux and Windows',
    desc: 'Native desktop notifications on both platforms, running as a background service.',
  },
  {
    icon: 'img/features/daemon.png',
    title: 'Lightweight daemon',
    desc: 'A tiny native C service that sips resources and runs from startup without getting in your way.',
  },
];

type OsKey = 'arch' | 'fedora' | 'debian' | 'windows';

const SNIPPETS: Record<OsKey, {label: string; comment: string; command: string}> = {
  arch: {
    label: 'Arch',
    comment: '# Arch Linux (AUR)',
    command: 'yay -S muslimtify && muslimtify daemon install',
  },
  fedora: {
    label: 'Fedora',
    comment: '# Fedora (COPR)',
    command:
      'sudo dnf copr enable rizukirr/muslimtify && sudo dnf install muslimtify && muslimtify daemon install',
  },
  debian: {
    label: 'Debian',
    comment: '# Debian / Ubuntu (PPA)',
    command:
      'sudo add-apt-repository ppa:rizukirr/muslimtify && sudo apt update && sudo apt install muslimtify && muslimtify daemon install',
  },
  windows: {
    label: 'Windows',
    comment: '# Windows (winget)',
    command: 'winget install muslimtify && muslimtify daemon install',
  },
};

function Hero() {
  return (
    <header className={styles.hero}>
      <NightSky />
      <div className={styles.heroScrim} />
      <div className={styles.wrap}>
        <div className={styles.heroInner}>
          <Heading as="h1" className={styles.heroTitle}>
            Keep your bearings.
            <br />
            <span className={styles.accent}>Never miss a prayer.</span>
          </Heading>
          <p className={styles.lede}>
            A daily prayer notification daemon for Muslims on Windows and Linux,
            supporting 21 global standard calculation methods, all madzhab, all country.
          </p>
          <div className={styles.ctaRow}>
            <Link className={styles.btnPrimary} to="#install">
              ↓ Download
            </Link>
            <Link className={styles.btnGhost} to="/docs/">
              Read the docs
            </Link>
          </div>
          <p className={styles.heroNote}>
            Free &amp; open source <span className={styles.dot}>·</span> MIT licensed{' '}
            <span className={styles.dot}>·</span> Written in C
          </p>
        </div>
      </div>
    </header>
  );
}

function Features() {
  const {withBaseUrl} = useBaseUrlUtils();
  return (
    <section className={styles.section} id="features">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Why Muslimtify</span>
          <Heading as="h2">Everything you need to stay on course</Heading>
          <p>
            Precise astronomical prayer-time calculation, fully local, running quietly
            as a background daemon.
          </p>
        </div>
        <div className={styles.featGrid}>
          {FEATURES.map((f) => (
            <div className={styles.card} key={f.title}>
              <div className={styles.cardIcon}>
                <img src={withBaseUrl(f.icon)} alt="" width={28} height={28} />
              </div>
              <Heading as="h3">{f.title}</Heading>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Install() {
  const [os, setOs] = useState<OsKey>('arch');
  const [copied, setCopied] = useState(false);
  const snippet = SNIPPETS[os];

  const onCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(snippet.command).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <section className={styles.sectionAlt} id="install">
      <div className={styles.wrap}>
        <div className={styles.installGrid}>
          <div className={styles.sectionHead} style={{marginBottom: 0}}>
            <span className={styles.eyebrow}>Quick start</span>
            <Heading as="h2">Install in one command</Heading>
            <p>
              Install from your package manager, register the background service, and
              you are done. Muslimtify picks your method and location automatically.
            </p>
          </div>
          <div className={styles.term}>
            <div className={styles.termBar}>
              <span className={styles.termDot} />
              <span className={styles.termDot} />
              <span className={styles.termDot} />
              <span className={styles.termTitle}>~/muslimtify</span>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={onCopy}
                aria-label="Copy install command">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className={styles.tabs} role="tablist">
              {(Object.keys(SNIPPETS) as OsKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={os === key}
                  className={os === key ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                  onClick={() => {
                    setOs(key);
                    setCopied(false);
                  }}>
                  {SNIPPETS[key].label}
                </button>
              ))}
            </div>
            <div className={styles.termBody}>
              <pre>
                <span className={styles.cmt}>
                  {snippet.comment}
                  {'\n'}
                </span>
                <span className={styles.prompt}>$</span>{' '}
                <span className={styles.cmd}>{snippet.command}</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className={styles.community} id="community">
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>The community</span>
        <Heading as="h2">Join the community</Heading>
        <p>
          Muslimtify is built in the open by and for the ummah. Whether you write C, test
          on a new distro, translate, or just share ideas, there is a place for you
          aboard.
        </p>
        <div className={styles.ctaRow}>
          <Link
            className={styles.btnPrimary}
            to="https://discord.gg/tpNZBXmKpd">
            💬 Discord
          </Link>
          <Link
            className={styles.btnGhost}
            to="https://github.com/rizukirr/muslimtify/blob/main/CONTRIBUTING.md">
            Contribute
          </Link>
          <Link className={styles.btnGhost} to="https://github.com/sponsors/rizukirr">
            ♥ Sponsor
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="A daily prayer notification daemon for Muslims on Windows and Linux, supporting 21 global standard calculation methods.">
      <main className={styles.landing}>
        <Hero />
        <Features />
        <Install />
        <Community />
      </main>
    </Layout>
  );
}
