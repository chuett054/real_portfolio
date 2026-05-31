import * as React from 'react';
import styles from './Content.module.css';

const EXPERIENCE_ENTRIES = [
  {
    slug: 'cloudflare',
    date: 'Summer 2026',
    company: 'Cloudflare',
    location: 'San Francisco',
    role: 'Product Manager Intern',
    detailIntro: 'On the AI search team. Coming Summer 2026.',
  },
  {
    slug: 'travelers',
    date: 'Summer 2025',
    company: 'Travelers Insurance',
    location: 'Minneapolis',
    role: 'Software Engineering Intern',
    detailIntro: "I built the interfaces insurance adjusters use to process AI-assisted claims, about 150 a day.",
    focus: [
      "Sat in on adjuster sessions, watched where things broke, and shipped fixes.",
      "Also handled security. Rolled out secret scanning across the whole team before anything could leak.",
    ],
  },
  {
    slug: 'umn-research',
    date: '2025',
    company: 'University of Minnesota',
    location: 'Minneapolis',
    role: 'Undergraduate Researcher',
    detailIntro: "Tried to answer: what would it actually take to put the U Card on your phone?",
    focus: [
      "Talked to 50 people across students, IT, facilities, and admin to figure out what needed to work.",
      "96% of students said they'd just leave their physical card home if mobile access existed.",
    ],
  },
  {
    slug: 'sassa',
    date: 'Summer 2024',
    company: 'SASSA',
    location: 'Minneapolis',
    role: 'Software Engineering Intern',
    detailIntro: "Teachers were struggling to find usable datasets for their classrooms. I built something to fix that.",
    focus: [
      "Used Claude to sort through 3,000+ datasets and tag them by grade level, subject, and how you'd actually teach with them.",
      "What used to take days of emailing the university now takes a few minutes.",
    ],
  },
];

const EXPERIENCE_BY_SLUG = EXPERIENCE_ENTRIES.reduce((map, experience) => {
  map[experience.slug] = experience;
  return map;
}, {});

function getExperienceSlugFromHash(hash) {
  if (!hash) {
    return null;
  }

  const normalizedHash = hash.replace(/^#\/?/, '');
  const [route, slug] = normalizedHash.split('/');

  if (route !== 'experience' || !slug) {
    return null;
  }

  return EXPERIENCE_BY_SLUG[slug] ? slug : null;
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

function Face() {
  const [isEpetriActive, setIsEpetriActive] = React.useState(false);
  const [activeExperienceSlug, setActiveExperienceSlug] = React.useState(() =>
    getExperienceSlugFromHash(window.location.hash),
  );
  const printContentRef = React.useRef(null);

  const activeExperience = activeExperienceSlug
    ? EXPERIENCE_BY_SLUG[activeExperienceSlug]
    : null;

  React.useEffect(() => {
    function getElementFromNode(node) {
      if (!node) {
        return null;
      }

      return node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    }

    function findAncestor(node, predicate) {
      let element = getElementFromNode(node);

      while (element) {
        if (predicate(element)) {
          return element;
        }
        element = element.parentElement;
      }

      return null;
    }

    function findInlineWrapper(node) {
      return findAncestor(node, (element) => element.dataset.epetriInline === 'true');
    }

    function unwrapInlineEpetri(wrapper) {
      const parent = wrapper.parentNode;
      if (!parent) {
        return;
      }

      while (wrapper.firstChild) {
        parent.insertBefore(wrapper.firstChild, wrapper);
      }
      parent.removeChild(wrapper);
      parent.normalize();
    }

    function handleShortcut(event) {
      const isPrimaryShortcut =
        (event.metaKey || event.ctrlKey) && event.shiftKey && !event.altKey;
      const isFallbackShortcut =
        !event.metaKey && !event.ctrlKey && event.shiftKey && !event.altKey;

      if (
        event.key.toLowerCase() !== 'x' ||
        (!isPrimaryShortcut && !isFallbackShortcut)
      ) {
        return;
      }

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        return;
      }

      const range = selection.getRangeAt(0);
      if (
        !printContentRef.current ||
        !printContentRef.current.contains(range.commonAncestorContainer)
      ) {
        return;
      }

      const anchorWrapper = findInlineWrapper(selection.anchorNode);
      const focusWrapper = findInlineWrapper(selection.focusNode);

      event.preventDefault();

      if (anchorWrapper && anchorWrapper === focusWrapper) {
        unwrapInlineEpetri(anchorWrapper);
        selection.removeAllRanges();
        return;
      }

      const wrapper = document.createElement('span');
      wrapper.dataset.epetriInline = 'true';
      wrapper.style.fontFamily = "'Epetri', 'Main', sans-serif";

      try {
        range.surroundContents(wrapper);
      } catch {
        const fragment = range.extractContents();
        wrapper.appendChild(fragment);
        range.insertNode(wrapper);
      }

      const updatedRange = document.createRange();
      updatedRange.selectNodeContents(wrapper);
      selection.removeAllRanges();
      selection.addRange(updatedRange);
    }

    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  React.useEffect(() => {
    function handleHashChange() {
      const experienceSlug = getExperienceSlugFromHash(window.location.hash);
      setActiveExperienceSlug(experienceSlug);

      if (experienceSlug) {
        window.scrollTo(0, 0);
        return;
      }

      restoreHomeScrollDepth();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function handleExperienceLinkClick() {
    rememberHomeScrollDepth();
  }

  function handleBackArrowClick() {
    window.location.hash = '/';
  }

  if (activeExperience) {
    return (
      <main className={styles.printPage}>
        <img
          className={styles.printBackgroundImage}
          src="/cube.svg"
          alt="Printable website"
          aria-hidden="true"
        />
        <div className={styles.printContent} ref={printContentRef}>
          <div className={styles.experienceDetailOnly}>
            <button
              type="button"
              className={styles.backArrowButton}
              onClick={handleBackArrowClick}
              aria-label="Back to home"
            >
              ←
            </button>
            <p className={styles.experienceDetailLead}>
              {activeExperience.detailIntro}
            </p>
            {activeExperience.focus && activeExperience.focus.length > 0 ? (
              <ul className={styles.experienceDetailList}>
                {activeExperience.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
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
      <div className={styles.printContent} ref={printContentRef}>
        <header>
          <div className={styles.headerIntro}>
            <div className={styles.nameRow}>
              <h1
                className={
                  isEpetriActive
                    ? `${styles.nameHeading} ${styles.epetriText}`
                    : styles.nameHeading
                }
              >
                Cole Huetten
              </h1>
              <button
                type="button"
                className={styles.fontToggleButton}
                onClick={() => setIsEpetriActive((previous) => !previous)}
              >
                {isEpetriActive ? 'translate back' : 'switch script'}
              </button>
            </div>
            {isEpetriActive ? (
              <p className={styles.fontMeaningNote}>
                <span className={styles.noteLine}>
                  "Atypography is an art movement that graphically represents
                  traditional writing systems in an unconventional way, creating
                  an authentic design that remains readable while concealing
                  text signs at first glance.
                </span>
                <span className={styles.noteLine}>
                  Highlight selected text and press Command+Shift+X to toggle
                  Atypography on or off for any text on this page."
                </span>
                <a
                  href="https://www.youtube.com/watch?v=0LOHB28lWIE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </p>
            ) : null}
          </div>
        </header>

        <div className={styles.container}>
          <article className={isEpetriActive ? styles.epetriText : undefined}>
            <ul>
              <li>All things tech</li>

              <li>huett054@umn.edu</li>
              <li>
                <a
                  href="https://x.com/ColeHuetten"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  x.com/colehuetten
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
                      onClick={handleExperienceLinkClick}
                    >
                      <sup>{experience.date}</sup>
                      {experience.company}, {experience.location} &mdash;{' '}
                      <i>{experience.role}</i>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section>
            <h2>Project Shortlist</h2>
            <hr />
            <article>
              <ul>
                <li>
                  <a
                    href="https://token-bridge.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tokenbridge
                  </a>{' '}
                  &mdash; Fair finance for all
                </li>
                <li>
                  <a
                    href="https://www.notion.so/Wildfire-Grid-Navigator-225ed4d3de3f80d19551c9cd1950da23?source=copy_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Wildfire Map
                  </a>{' '}
                  &mdash; Saving people from wildfires
                </li>
              </ul>
            </article>
          </section>

          <section>
            <h2>Archive</h2>
            <hr />

            <article>
              <p>soon</p>
            </article>
          </section>

          <section>
            <h2>In-Person Events</h2>
            <hr />
            <article>
              <p>soon</p>
            </article>
          </section>

          <section>
            <h2>Education</h2>
            <hr />

            <article>
              <div>
                <h3>
                  Bachelor of Science, Computer Science&mdash;{' '}
                  <br />
                  University of Minnesota
                </h3>
              </div>
            </article>
          </section>

          <section>
            <h2>Things I Like</h2>
            <hr />

            <article>
              <div>
                <p>
                  Stopping kids from gambling, serving justice, tokenization,
                  making unfair things fair, stopping or punishing for crime,
                  traveling with no return flight, promoting individualism,
                  reading, Formula 1, dogs.
                </p>
              </div>
            </article>
          </section>

          <footer>
            {/* <a
            href="https://drive.google.com/file/d/1xVoUFY164g3bh-2nKuJ_k3JcYntWvHYd/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer">
            PDF Version (last updated: Aug 2020)
          </a> */}
            <p className={`${styles.epetriText} ${styles.footerQuoteEpetri}`}>
              "we can all be different and time still goes on"
            </p>
            <p className={styles.footerQuotePlain}>
              We can all be different and time still goes on.
            </p>
            <p>Happy to chat, reach out!</p>
            <ul>
              <li>
                <a
                  href="https://www.linkedin.com/in/colehuetten/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </footer>
        </div>
      </div>
    </main>
  );
}

export default Face;
