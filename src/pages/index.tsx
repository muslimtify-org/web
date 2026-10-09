import {useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import NightSky from '@site/src/components/NightSky';

import styles from './index.module.css';

type Feature = {title: string; desc: ReactNode};

const FEATURES: Feature[] = [
  {
    title: 'Runs offline',
    desc: 'Every prayer time is calculated on your machine, with no accounts and no tracking. The only network request is an optional location lookup.',
  },
  {
    title: '21 calculation methods',
    desc: (
      <>
        MWL, Umm al-Qura, ISNA, Egyptian, Kemenag, JAKIM, Diyanet and 14 more, for
        every madzhab.{' '}
        <Link className={styles.textLink} to="/docs/calculation-methods">
          See all methods
        </Link>
      </>
    ),
  },
  {
    title: 'Your own reminder intervals',
    desc: 'Set any number of reminders for each prayer, from 1 minute to 24 hours ahead.',
  },
  {
    title: 'Adhan or a chime',
    desc: 'Play the full Adhan or a short reminder sound, chosen per prayer. Point it at your own sound file if you prefer.',
  },
  {
    title: 'Linux and Windows',
    desc: 'Native desktop notifications on both, with packages for Arch, Fedora, Debian, Ubuntu and winget.',
  },
  {
    title: 'A small C daemon',
    desc: 'Runs as a background service from startup and stays out of your way.',
  },
];

// Sample day from the `muslimtify show` example in docs/command.md.
// dx, dy and anchor place each label clear of the curve.
const PRAYERS = [
  {name: 'Fajr', time: '04:31', dx: 12, dy: 22, anchor: 'start'},
  {name: 'Dhuhr', time: '11:50', dx: 0, dy: -16, anchor: 'middle'},
  {name: 'Asr', time: '15:04', dx: 12, dy: -8, anchor: 'start'},
  {name: 'Maghrib', time: '17:52', dx: 12, dy: -12, anchor: 'start'},
  {name: 'Isha', time: '19:01', dx: 12, dy: -2, anchor: 'start'},
] as const;

const LEAD = [
  {time: '17:22', label: '30 minutes before'},
  {time: '17:37', label: '15 minutes before'},
  {time: '17:47', label: '5 minutes before'},
  {time: '17:52', label: 'Maghrib. The Adhan plays.'},
];

// The sun's height over the sample day, drawn as one cosine around solar noon.
const SKY = {w: 960, h: 320, horizon: 170, amp: 110, noon: 11.8};
const skyX = (hour: number) => (hour / 24) * SKY.w;
const skyY = (hour: number) =>
  SKY.horizon - SKY.amp * Math.cos(((hour - SKY.noon) / 24) * 2 * Math.PI);
const toHour = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
};
const SKY_PATH = Array.from({length: 97}, (_, i) => i / 4)
  .map((hour, i) => `${i ? 'L' : 'M'}${skyX(hour).toFixed(1)} ${skyY(hour).toFixed(1)}`)
  .join(' ');

const WAYS = [
  {
    title: 'Join the Discord',
    desc: 'Ask a question, report something odd or share an idea.',
    to: 'https://discord.gg/tpNZBXmKpd',
  },
  {
    title: 'Contribute',
    desc: 'Write C, test on a new distro or translate. The contributing guide explains how.',
    to: 'https://github.com/rizukirr/muslimtify/blob/main/CONTRIBUTING.md',
  },
  {
    title: 'Sponsor on GitHub',
    desc: 'Fund the time that goes into development.',
    to: 'https://github.com/sponsors/rizukirr',
  },
];

type OsKey = 'arch' | 'fedora' | 'debian' | 'windows';
type Step = {label: string; command: string};

const REGISTER: Step = {
  label: 'Register the background service',
  command: 'muslimtify daemon install',
};
const CHECK: Step = {label: "Check today's prayer times", command: 'muslimtify show'};

const INSTALL: Record<OsKey, {label: string; prompt: string; steps: Step[]}> = {
  arch: {
    label: 'Arch',
    prompt: '$',
    steps: [{label: 'Install from the AUR', command: 'yay -S muslimtify'}, REGISTER, CHECK],
  },
  fedora: {
    label: 'Fedora',
    prompt: '$',
    steps: [
      {label: 'Enable the COPR repository', command: 'sudo dnf copr enable rizukirr/muslimtify'},
      {label: 'Install the package', command: 'sudo dnf install muslimtify'},
      REGISTER,
      CHECK,
    ],
  },
  debian: {
    label: 'Debian / Ubuntu',
    prompt: '$',
    steps: [
      {label: 'Add the PPA', command: 'sudo add-apt-repository ppa:rizukirr/muslimtify'},
      {label: 'Install the package', command: 'sudo apt update && sudo apt install muslimtify'},
      REGISTER,
      CHECK,
    ],
  },
  windows: {
    label: 'Windows',
    prompt: '>',
    steps: [{label: 'Install with winget', command: 'winget install muslimtify'}, REGISTER, CHECK],
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
  return (
    <section className={styles.section} id="features">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <Heading as="h2">Prayer times, computed on your machine</Heading>
          <p>
            Muslimtify works out each prayer from the sun&apos;s position at your
            coordinates, then notifies you before it starts.
          </p>
        </div>

        <figure className={styles.day}>
          <svg
            className={styles.daySvg}
            viewBox={`0 0 ${SKY.w} ${SKY.h}`}
            aria-hidden="true">
            <defs>
              <linearGradient
                id="skyStroke"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2={SKY.h}>
                <stop offset={SKY.horizon / SKY.h} stopColor="var(--mt-gold)" />
                <stop offset={SKY.horizon / SKY.h} stopColor="#3d5380" />
              </linearGradient>
            </defs>
            <line className={styles.horizon} x1="0" x2={SKY.w} y1={SKY.horizon} y2={SKY.horizon} />
            <text className={styles.axis} x="0" y={SKY.horizon - 8}>
              horizon
            </text>
            <path className={styles.curve} d={SKY_PATH} stroke="url(#skyStroke)" />
            {PRAYERS.map((p) => {
              const x = skyX(toHour(p.time));
              const y = skyY(toHour(p.time));
              return (
                <g key={p.name}>
                  <circle className={styles.point} cx={x} cy={y} r="6.5" />
                  <text className={styles.pointName} x={x + p.dx} y={y + p.dy} textAnchor={p.anchor}>
                    {p.name}
                    <tspan className={styles.pointTime} dx="8">
                      {p.time}
                    </tspan>
                  </text>
                </g>
              );
            })}
            {[0, 6, 12, 18, 24].map((hour) => (
              <text
                key={hour}
                className={styles.axis}
                x={skyX(hour)}
                y={SKY.h - 6}
                textAnchor={hour === 0 ? 'start' : hour === 24 ? 'end' : 'middle'}>
                {String(hour).padStart(2, '0')}:00
              </text>
            ))}
          </svg>
          <ol className={styles.times}>
            {PRAYERS.map((p) => (
              <li key={p.name}>
                {p.name} <time>{p.time}</time>
              </li>
            ))}
          </ol>
          <figcaption>
            A sample day from <code>muslimtify show</code>. Your times depend on your
            location and calculation method.
          </figcaption>
        </figure>

        <p className={styles.leadIntro}>
          By default you get three reminders before each prayer, then a notification
          when it is time to pray.
        </p>
        <ol className={styles.lead}>
          {LEAD.map((stop) => (
            <li key={stop.time}>
              <time>{stop.time}</time>
              {stop.label}
            </li>
          ))}
        </ol>

        <dl className={styles.specs}>
          {FEATURES.map((f) => (
            <div key={f.title}>
              <dt>{f.title}</dt>
              <dd>{f.desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Command({prompt, command}: {prompt: string; command: string}) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className={styles.command}>
      <span className={styles.prompt}>{prompt}</span>
      <code>{command}</code>
      <button
        type="button"
        className={styles.copyBtn}
        onClick={onCopy}
        aria-label={`Copy command: ${command}`}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

function Install() {
  const [os, setOs] = useState<OsKey>('arch');
  const {prompt, steps} = INSTALL[os];

  return (
    <section className={styles.sectionAlt} id="install">
      <div className={styles.wrap}>
        <div className={styles.installGrid}>
          <div className={styles.sectionHead} style={{marginBottom: 0}}>
            <Heading as="h2">Install from your package manager</Heading>
            <p>
              Muslimtify picks your location and calculation method automatically. You
              can change either at any time.
            </p>
            <p>
              Prebuilt binaries, the Windows installer and source builds are in the{' '}
              <Link className={styles.textLink} to="/docs/#installation">
                installation guide
              </Link>
              .
            </p>
          </div>
          <div>
            <div className={styles.tabs} role="tablist" aria-label="Operating system">
              {(Object.keys(INSTALL) as OsKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={os === key}
                  className={os === key ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                  onClick={() => setOs(key)}>
                  {INSTALL[key].label}
                </button>
              ))}
            </div>
            <div role="tabpanel">
            <ol className={styles.steps}>
              {steps.map((step) => (
                <li key={`${os}-${step.command}`}>
                  <div>
                    <p>{step.label}</p>
                    <Command prompt={prompt} command={step.command} />
                  </div>
                </li>
              ))}
            </ol>
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
        <div className={styles.installGrid}>
          <div className={styles.sectionHead} style={{marginBottom: 0}}>
            <Heading as="h2">Built in the open, by and for the ummah</Heading>
            <p>
              Muslimtify is free software under the MIT license. Everything from the
              prayer-time math to this website is public and open to changes.
            </p>
          </div>
          <ul className={styles.ways}>
            {WAYS.map((way) => (
              <li key={way.title}>
                <Link to={way.to}>
                  <strong>{way.title}</strong>
                  <span>{way.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
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
