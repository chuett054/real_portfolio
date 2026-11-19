import * as React from 'react';
import styles from './Content.module.css';
import StatsChart from './StatsChart';
import AskCole from './AskCole';

const EXPERIENCE_ENTRIES = [
  {
    slug: 'cloudflare',
    year: '2026',
    date: 'Summer 2026',
    company: 'Cloudflare',
    location: 'San Francisco',
    role: 'Product Manager Intern',
    bullets: [],
    content: [
      { type: 'h', text: 'AI Search' },
      {
        type: 'p',
        text: "At Cloudflare, I was a product manager on the AI Search team. AI Search is Cloudflare's managed search product: you point it at your data, like files in a storage bucket or a website, and it handles the indexing, embeddings, and retrieval, so developers can add AI answers grounded in their own content to an app with a few lines of code.",
      },
      { type: 'h', text: 'Try it' },
      {
        type: 'p',
        text: 'You can try my product here. Ask a question like "When is Cole doing an Ironman?" It runs on a real AI Search instance that searches a set of documents about me, built from this site.',
      },
      {
        type: 'ask',
        suggestions: [
          'When is Cole doing an Ironman?',
          'How big did Blackout Detail get?',
          'What did Cole work on at Cloudflare?',
        ],
      },
      {
        type: 'p',
        text: 'This is just a demo, but the product has a bunch of use cases, including support chatbots that answer from help docs, internal knowledge-base search, documentation search, and product search.',
      },
      { type: 'h', text: 'My summer' },
      {
        type: 'p',
        text: 'Over the summer, I talked to a bunch of customers, including Chick-fil-A and Thrive Capital, and worked on a dashboard redesign and on increasing the accuracy of our product with physical documents (OCR).',
      },
    ],
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
    date: '2026 – Present',
    company: 'Ironman Training',
    blurb: 'Training to swim, bike, and run an Ironman triathlon',
    bullets: [],
    content: [
      { type: 'h', text: 'Why' },
      {
        type: 'p',
        text: "I am currently training to become an Ironman. An Ironman is a 2.4 mile swim, a 112 mile bike, and a 26.2 mile run, all in one race.",
      },
      {
        type: 'p',
        text: "I don't really know why I got into the sport, but some of my earliest memories are watching my dad at his races, so that probably contributes to it. I have never liked endurance sports either, so it's a bit strange.",
      },
      { type: 'h', text: 'The goal' },
      {
        type: 'p',
        text: "My goal is to go back to my study abroad location in Copenhagen, Denmark to complete my first full-length Ironman in 2027. Copenhagen is very flat, so it's considered an easy bike and run compared to the other locations.",
      },
      { type: 'h', text: 'My first triathlon' },
      {
        type: 'p',
        text: 'Nov 15, 2026 · Tampa, FL · International distance (quarter Ironman): 0.5 mile swim, 20 mile bike, 6.2 mile run',
      },
      {
        type: 'p',
        text: 'My goals were to finish, swim in under 20 minutes, bike in under 1 hour, and run in under 1 hour.',
      },
      {
        type: 'p',
        text: 'My splits were 17:18 swim (hit), 1:02:11 bike (slight miss), and 58:58 run (hit).',
      },
      {
        type: 'p',
        text: 'I finished 2nd/8 participants in my age group, which hurts even more because first place was only 6 minutes faster.',
      },
      {
        type: 'gallery',
        items: [
          {
            src: '/ironman-lagoon-podium.jpg',
            alt: 'Cole on the second-place podium step holding a medal at the Lagoon Triathlon',
          },
          {
            src: '/ironman-lagoon-results.jpg',
            alt: 'Results for Male 20–24: Cole Huetten in 2nd place out of 8',
          },
        ],
      },
      { type: 'h', text: 'Upcoming' },
      {
        type: 'list',
        items: [
          'Apr 4, 2027 · IRONMAN 70.3 Oceanside, CA (half Ironman): 1.2 mile swim, 56 mile bike, 13.1 mile run',
          '2027 · IRONMAN Copenhagen, Denmark (full Ironman): 2.4 mile swim, 112 mile bike, 26.2 mile run',
        ],
      },
    ],
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
    date: '2022 – Present',
    company: 'Blackout Detail',
    blurb: "I started and ran a company that cleaned cars at the customer's home",
    bullets: [],
    // Longer write-up, in order. Block types: h, p, img, gallery, photos, stats, ask, list.
    content: [
      { type: 'h', text: 'Why I started' },
      {
        type: 'p',
        text: 'I founded Blackout Detail during high school in order to pay for college.',
      },
      { type: 'h', text: 'The timing' },
      {
        type: 'p',
        text: 'I started the company in 2022 (the red arrow seen below) before mobile detailing took off in popularity around the beginning of 2026, as you can see by the spike in internet traffic searching for mobile detailing.',
      },
      {
        type: 'img',
        src: '/blackout-trends.png',
        alt: 'Google Trends chart of US search interest in "mobile detailing" from 2004 to now, with a red arrow at 2022 and a large spike in early 2026',
      },
      { type: 'h', text: 'Growing it' },
      {
        type: 'p',
        text: 'At the business peak, I employed 6 people and owned a fleet of 3 vans/trailers and generated profit well into 6 figures in just under 3 years.',
      },
      {
        type: 'p',
        text: 'I also attempted to lease a shop, which entailed hours upon hours of cold emailing (who would ever let a minor do that). In hindsight, it was a great choice not to do that.',
      },
      {
        type: 'photos',
        // Add photos here: { src: '/blackout-1.jpg', alt: 'What the photo shows', caption: 'Optional caption' }
        // Put the image files in the public/ folder. Empty slots only show on the dev server.
        items: [],
        slots: 4,
      },
      { type: 'h', text: 'Today' },
      {
        type: 'p',
        text: "I hardly run the business anymore (I'll detail friends' and family's cars from time to time), but I still get a bunch of calls and website clicks from people who find it on Google. The chart below shows the numbers from my business's Google Business Profile analytics.",
      },
      {
        type: 'stats',
        tabs: [
          {
            key: 'calls',
            label: 'Calls',
            unit: 'calls',
            caption: 'Calls from my Google Business Profile, Jun – Nov 2026',
            data: [
              { label: 'Jun', fullLabel: 'Jun 2026', value: 47 },
              { label: 'Jul', fullLabel: 'Jul 2026', value: 70 },
              { label: 'Aug', fullLabel: 'Aug 2026', value: 72 },
              { label: 'Sep', fullLabel: 'Sep 2026', value: 50 },
              { label: 'Oct', fullLabel: 'Oct 2026', value: 59 },
              { label: 'Nov', fullLabel: 'Nov 2026', value: 9, partial: true },
            ],
          },
          {
            key: 'clicks',
            label: 'Website clicks',
            unit: 'clicks',
            caption: 'Website clicks from my Google Business Profile, Jun – Nov 2026',
            data: [
              { label: 'Jun', fullLabel: 'Jun 2026', value: 13 },
              { label: 'Jul', fullLabel: 'Jul 2026', value: 13 },
              { label: 'Aug', fullLabel: 'Aug 2026', value: 18 },
              { label: 'Sep', fullLabel: 'Sep 2026', value: 13 },
              { label: 'Oct', fullLabel: 'Oct 2026', value: 7 },
              { label: 'Nov', fullLabel: 'Nov 2026', value: 0, partial: true },
            ],
          },
        ],
      },
      { type: 'h', text: 'Other cool/funny things' },
      {
        type: 'list',
        items: [
          'I detailed 2 cars over $300,000 USD',
          'I once crashed a car that I was detailing',
          'I had a partnership with the Minnesota Vikings',
          "My Google business page got shut down multiple times because I wouldn't respond to enough people fast enough",
        ],
      },
    ],
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

  // The home page's scroll height is recalculated a few frames after the
  // route changes (see App.js), so a single scrollTo gets clamped near the
  // top. Keep re-applying until the position sticks, for up to ~1.5s.
  const target = Math.max(targetScroll, 0);
  const startedAt = performance.now();

  const tryScroll = () => {
    window.scrollTo(0, target);
    const reached = Math.abs(getCurrentScrollY() - target) < 2;
    if (!reached && performance.now() - startedAt < 1500) {
      window.requestAnimationFrame(tryScroll);
    }
  };

  window.requestAnimationFrame(tryScroll);

  try {
    sessionStorage.removeItem(HOME_SCROLL_STORAGE_KEY);
  } catch {
    // No-op if storage is unavailable.
  }
}

// Photo grid. Until photos are added, dashed placeholder slots show on the
// dev server only, so the live site never shows empty boxes.
function PhotoGrid({ items, slots = 0 }) {
  const showPlaceholders = process.env.NODE_ENV === 'development';
  const emptySlots = showPlaceholders ? Math.max(slots - items.length, 0) : 0;

  if (!items.length && !emptySlots) {
    return null;
  }

  return (
    <div className={styles.photoGrid}>
      {items.map((photo) => (
        <figure key={photo.src} className={styles.photo}>
          <img src={photo.src} alt={photo.alt} loading="lazy" />
          {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
        </figure>
      ))}
      {Array.from({ length: emptySlots }, (_, i) => (
        <div key={`slot-${i}`} className={styles.photoSlot}>
          Photo {items.length + i + 1}
        </div>
      ))}
    </div>
  );
}

function DetailContent({ blocks }) {
  return (
    <div className={styles.detailBody}>
      {blocks.map((block, index) => {
        if (block.type === 'img') {
          return (
            <figure key={index} className={styles.detailFigure}>
              <img src={block.src} alt={block.alt} loading="lazy" />
            </figure>
          );
        }

        if (block.type === 'h') {
          return (
            <h2 key={index} className={styles.detailHeading}>
              {block.text}
            </h2>
          );
        }

        if (block.type === 'ask') {
          return <AskCole key={index} suggestions={block.suggestions} />;
        }

        if (block.type === 'gallery') {
          return (
            <div key={index} className={styles.gallery}>
              {block.items.map((photo) => (
                <img key={photo.src} src={photo.src} alt={photo.alt} loading="lazy" />
              ))}
            </div>
          );
        }

        if (block.type === 'photos') {
          return <PhotoGrid key={index} items={block.items} slots={block.slots} />;
        }

        if (block.type === 'stats') {
          return <StatsChart key={index} tabs={block.tabs} />;
        }

        if (block.type === 'list') {
          return (
            <div key={index}>
              {block.title ? (
                <p className={styles.detailListTitle}>{block.title}</p>
              ) : null}
              <ul className={styles.detailBodyList}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          );
        }

        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
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

      {entry.content ? <DetailContent blocks={entry.content} /> : null}
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
