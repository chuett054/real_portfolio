import * as React from 'react';
import styles from './Content.module.css';

const EXPERIENCE_ENTRIES = [
  {
    slug: 'cloudflare',
    year: '2026',
    date: 'Summer 2026',
    company: 'Cloudflare',
    location: 'San Francisco',
    role: 'Product Manager Intern',
    bullets: [], // add details here
  },
  {
    slug: 'dis-copenhagen',
    year: '2026',
    date: 'Spring 2026',
    company: 'DIS Copenhagen',
    location: 'Copenhagen',
    role: 'Undergraduate Researcher, LLM Safety',
    bullets: [], // add details here
  },
  {
    slug: 'travelers',
    year: '2025',
    date: 'Summer 2025',
    company: 'Travelers Insurance',
    location: 'Minneapolis',
    role: 'Software Engineering Intern',
    bullets: [], // add details here
  },
  {
    slug: 'sassa',
    year: '2024',
    date: '2024',
    company: 'SASSA',
    location: 'Minneapolis',
    role: 'Software Engineering Intern',
    bullets: [], // add details here
  },
];

const SIDE_QUEST_ENTRIES = [
  {
    slug: 'ironman',
    year: '2026',
    company: 'Ironman Training',
    blurb: 'Training to swim, bike, and run an Ironman triathlon',
    bullets: [], // add details here
  },
  {
    slug: 'boom-supersonic',
    year: '2026',
    date: '2026 – Present',
    company: 'Boom Supersonic Challenge',
    blurb: 'Building a small jet to fly supersonic',
    bullets: [], // add details here
  },
  {
    slug: 'de-googling',
    year: '2026',
    company: 'De-Googling',
    blurb: "I replaced most Google apps with private, self-hosted versions",
    bullets: [], // add details here
  },
  {
    slug: 'tokenbridge',
    year: '2025',
    company: 'Tokenbridge',
    blurb: 'I started a company that helps students pay for school',
    bullets: [], // add details here
  },
  {
    slug: 'blackout-detail',
    year: '2022',
    date: '2022 – 2023',
    company: 'Blackout Detail',
    blurb: "I started and ran a company that cleaned cars at the customer's home",
    bullets: [], // add details here
  },
];

const EDUCATION_ENTRIES = [
  {
    year: '2027',
    school: 'University of Minnesota',
    degree: 'B.A. in Computer Science, Minor in Economics',
    location: 'Minneapolis',
    date: 'Expected May 2027',
  },
  {
    year: '2026',
    school: 'DIS Copenhagen',
    degree: 'Study Abroad',
    location: 'Copenhagen, Denmark',
    date: 'Jan 2026 – May 2026',
  },
];

const ENTRY_BY_SLUG = [...EXPERIENCE_ENTRIES, ...SIDE_QUEST_ENTRIES].reduce(
  (map, entry) => {
    map[entry.slug] = entry;
    return map;
  },
  {},
);

function getRouteFromHash(hash) {
  if (!hash) {
    return null;
  }

  const normalizedHash = hash.replace(/^#\/?/, '');
  const [route, slug] = normalizedHash.split('/');

  if (route === 'experience' && slug && ENTRY_BY_SLUG[slug]?.bullets) {
    return { type: 'experience', slug };
  }

  return null;
}

const HOME_SCROLL_STORAGE_KEY = 'home-scroll-y';

function getCurrentScrollY() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function rememberHomeScrollDepth() {
  try {
    sessionStorage.setItem(HOME_SCROLL_STORAGE_KEY, String(getCurrentScrollY()));
  } catch {
    // No-op if storage is unavailable.
  }
}

function restoreHomeScrollDepth() {
  let storedValue = null;

  try {
    storedValue = sessionStorage.getItem(HOME_SCROLL_STORAGE_KEY);
  } catch {
    return;
  }

  if (storedValue === null) {
    return;
  }

  const targetScroll = Number(storedValue);
  if (!Number.isFinite(targetScroll)) {
    try {
      sessionStorage.removeItem(HOME_SCROLL_STORAGE_KEY);
    } catch {
      // No-op if storage is unavailable.
    }
    return;
  }

  const applyScroll = () => window.scrollTo(0, Math.max(targetScroll, 0));

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      applyScroll();
      window.requestAnimationFrame(applyScroll);
    });
  });

  try {
    sessionStorage.removeItem(HOME_SCROLL_STORAGE_KEY);
  } catch {
    // No-op if storage is unavailable.
  }
}

function EntryDetail({ entry, onBack }) {
  const meta = [entry.date || entry.year, entry.location].filter(Boolean);

  return (
    <article className={styles.detailPage}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        <span className={styles.backArrow} aria-hidden="true">
          ←
        </span>
        Back
      </button>

      <header className={styles.detailHeader}>
        {meta.length ? (
          <p className={styles.detailMeta}>{meta.join(' · ')}</p>
        ) : null}
        <h1 className={styles.detailTitle}>{entry.company}</h1>
        {entry.role ? <p className={styles.detailRole}>{entry.role}</p> : null}
      </header>

      {entry.bullets.length ? (
        <ul className={styles.detailList}>
          {entry.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function EntryRow({ entry, onClick, plain }) {
  const body = (
    <>
      <span className={styles.rowText}>
        <sup>{entry.year}</sup>
        <span className={styles.rowTitle}>{entry.company}</span>
        {entry.blurb ? (
          <span className={styles.rowBlurb}>{entry.blurb}</span>
        ) : null}
        {entry.location ? `, ${entry.location}` : null}
        {entry.role ? (
          <>
            {' '}
            — <i>{entry.role}</i>
          </>
        ) : null}
      </span>
      {entry.bullets ? (
        <span className={styles.rowArrow} aria-hidden="true">
          →
        </span>
      ) : null}
    </>
  );

  // Entries without bullets have no detail page, so they render as a static card.
  return (
    <li className={styles.rowItem}>
      {entry.bullets ? (
        <a
          href={`#/experience/${entry.slug}`}
          className={`${styles.row} ${styles.rowLink}`}
          onClick={onClick}
        >
          {body}
        </a>
      ) : (
        <div className={`${styles.row} ${plain ? styles.rowPlain : ''}`}>
          {body}
        </div>
      )}
    </li>
  );
}

function Face() {
  const [activeRoute, setActiveRoute] = React.useState(() =>
    getRouteFromHash(window.location.hash),
  );

  const activeEntry = activeRoute ? ENTRY_BY_SLUG[activeRoute.slug] : null;

  React.useEffect(() => {
    function handleHashChange() {
      const route = getRouteFromHash(window.location.hash);
      setActiveRoute(route);

      if (route) {
        window.scrollTo(0, 0);
        return;
      }

      restoreHomeScrollDepth();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function handleDetailLinkClick() {
    rememberHomeScrollDepth();
  }

  function handleBackArrowClick() {
    window.location.hash = '/';
  }

  if (activeEntry) {
    return (
      <main className={styles.printPage}>
        <img
          className={styles.printBackgroundImage}
          src="/cube.svg"
          alt="Printable website"
          aria-hidden="true"
        />
        <div className={styles.printContent}>
          <EntryDetail entry={activeEntry} onBack={handleBackArrowClick} />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.printPage}>
      <img
        className={styles.printBackgroundImage}
        src="/cube.svg"
        alt="Printable website"
        aria-hidden="true"
      />
      <div className={styles.printContent}>
        <header>
          <div className={styles.headerIntro}>
            <div className={styles.nameRow}>
              <h1 className={styles.nameHeading}>Cole Huetten</h1>
            </div>
          </div>
        </header>

        <div className={styles.container}>
          <article>
            <p className={styles.tagline}>
              Student — trying a bunch of things
            </p>
            <ul className={styles.contactList}>
              <li>huett054@umn.edu</li>
              <li>
                <a
                  href="https://x.com/ColeHuetten"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  x.com/colehuetten
                </a>
                <a
                  href="https://www.linkedin.com/in/colehuetten/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </article>

          <section>
            <h2>Work Experience</h2>
            <hr />
            <ul className={styles.rowList}>
              {EXPERIENCE_ENTRIES.map((entry) => (
                <EntryRow
                  key={entry.slug}
                  entry={entry}
                  onClick={handleDetailLinkClick}
                />
              ))}
            </ul>
          </section>

          <section>
            <h2>Side Quests / Projects</h2>
            <hr />
            <ul className={styles.rowList}>
              {SIDE_QUEST_ENTRIES.map((entry) => (
                <EntryRow
                  key={entry.slug}
                  entry={entry}
                  onClick={handleDetailLinkClick}
                />
              ))}
            </ul>
          </section>

          <section>
            <h2>Education</h2>
            <hr />
            <ul className={styles.rowList}>
              {EDUCATION_ENTRIES.map((entry) => (
                <EntryRow
                  key={entry.school}
                  plain
                  entry={{
                    year: entry.year,
                    company: entry.school,
                    role: entry.degree,
                    location: entry.location,
                  }}
                />
              ))}
            </ul>
          </section>

          <section>
            <h2>Things I Like</h2>
            <hr />

            <article>
              <div>
                <p className={styles.likesText}>
                  Stopping kids from gambling, serving justice, tokenization,
                  making unfair things fair, stopping or punishing for crime,
                  traveling with no return flight, promoting individualism,
                  reading, Formula 1, dogs.
                </p>
              </div>
            </article>
          </section>

          <footer className={styles.footer}>
            <p>☆</p>
            <p>Always happy to talk, say hi!</p>
            <p>
              <a href="mailto:huett054@umn.edu">Email</a>{' '}
              <a
                href="https://www.linkedin.com/in/colehuetten/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

export default Face;
