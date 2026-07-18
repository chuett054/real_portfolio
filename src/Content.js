import * as React from 'react';
import styles from './Content.module.css';

const EXPERIENCE_ENTRIES = [
  {
    slug: 'cloudflare',
    date: 'Summer 2026',
    company: 'Cloudflare',
    location: 'San Francisco',
    role: 'Product Manager Intern',
    readTime: '1 minute read',
  },
  {
    slug: 'travelers',
    date: 'Summer 2025',
    company: 'Travelers Insurance',
    location: 'Minneapolis',
    role: 'Software Engineering Intern',
    readTime: '1 minute read',
  },
  {
    slug: 'sassa',
    date: '2024',
    company: 'SASSA',
    location: 'Minneapolis',
    role: 'Software Engineering Intern',
    readTime: '1 minute read',
  },
];

const BLOG_ENTRIES = [
  {
    slug: 'introducing-cole',
    title: 'Introducing Cole',
    date: 'July 17, 2026',
    readTime: '3 minute read',
  },
];

const EXPERIENCE_BY_SLUG = EXPERIENCE_ENTRIES.reduce((map, experience) => {
  map[experience.slug] = experience;
  return map;
}, {});

const BLOG_BY_SLUG = BLOG_ENTRIES.reduce((map, post) => {
  map[post.slug] = post;
  return map;
}, {});

function getRouteFromHash(hash) {
  if (!hash) {
    return null;
  }

  const normalizedHash = hash.replace(/^#\/?/, '');
  const [route, slug] = normalizedHash.split('/');

  if (route === 'experience' && slug && EXPERIENCE_BY_SLUG[slug]) {
    return { type: 'experience', slug };
  }

  if (route === 'blog' && slug && BLOG_BY_SLUG[slug]) {
    return { type: 'blog', slug };
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

function buildExperienceArticle(experience) {
  return {
    slug: experience.slug,
    title: experience.company,
    subtitle: experience.role,
    date: experience.date,
    readTime: experience.readTime,
  };
}

function getActiveArticle(route) {
  if (!route) {
    return null;
  }

  if (route.type === 'blog') {
    return BLOG_BY_SLUG[route.slug] || null;
  }

  const experience = EXPERIENCE_BY_SLUG[route.slug];
  return experience ? buildExperienceArticle(experience) : null;
}

function Face() {
  const [activeRoute, setActiveRoute] = React.useState(() =>
    getRouteFromHash(window.location.hash),
  );

  const activeArticle = getActiveArticle(activeRoute);

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

  if (activeArticle) {
    return (
      <main className={styles.printPage}>
        <img
          className={styles.printBackgroundImage}
          src="/cube.svg"
          alt="Printable website"
          aria-hidden="true"
        />
        <div className={styles.printContent}>
          <article className={styles.blogArticle}>
            <button
              type="button"
              className={styles.backArrowButton}
              onClick={handleBackArrowClick}
              aria-label="Back to home"
            >
              ←
            </button>
            <div className={styles.blogHeader}>
              <h1 className={styles.blogTitle}>{activeArticle.title}</h1>
              {activeArticle.subtitle ? (
                <p className={styles.blogSubtitle}>{activeArticle.subtitle}</p>
              ) : null}
              <p className={styles.blogMeta}>
                {activeArticle.date} · {activeArticle.readTime}
              </p>
            </div>
          </article>
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
            <ul>
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

            <article>
              <ul className={`${styles.tight} ${styles.experienceList}`}>
                {EXPERIENCE_ENTRIES.map((experience) => (
                  <li key={experience.slug}>
                    <a
                      href={`#/experience/${experience.slug}`}
                      className={styles.experienceCardLink}
                      onClick={handleDetailLinkClick}
                    >
                      <span className={styles.cardMain}>
                        <span className={styles.cardTitle}>
                          {experience.role}
                        </span>
                        <span className={styles.cardSub}>
                          {experience.company}
                        </span>
                      </span>
                      <span className={styles.cardMeta}>
                        <span className={styles.cardMetaPrimary}>
                          {experience.location}
                        </span>
                        <span className={styles.cardMetaSecondary}>
                          {experience.date}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section>
            <h2>Blog</h2>
            <hr />
            <article>
              <ul className={`${styles.tight} ${styles.experienceList}`}>
                {BLOG_ENTRIES.map((post) => (
                  <li key={post.slug}>
                    <a
                      href={`#/blog/${post.slug}`}
                      className={styles.experienceCardLink}
                      onClick={handleDetailLinkClick}
                    >
                      <span className={styles.cardMain}>
                        <span className={styles.cardTitle}>{post.title}</span>
                      </span>
                      <span className={styles.cardMeta}>
                        <span className={styles.cardMetaPrimary}>
                          {post.date}
                        </span>
                        <span className={styles.cardMetaSecondary}>
                          {post.readTime}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section>
            <h2>Education</h2>
            <hr />

            <article>
              <ul className={`${styles.tight} ${styles.experienceList}`}>
                <li>
                  <div className={styles.experienceCardStatic}>
                    <span className={styles.cardMain}>
                      <span className={styles.cardTitle}>
                        Bachelor of Science, Computer Science
                      </span>
                      <span className={styles.cardSub}>
                        University of Minnesota
                      </span>
                    </span>
                    <span className={styles.cardMeta}>
                      <span className={styles.cardMetaPrimary}>Minneapolis</span>
                    </span>
                  </div>
                </li>
              </ul>
            </article>
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

          <footer />
        </div>
      </div>
    </main>
  );
}

export default Face;
