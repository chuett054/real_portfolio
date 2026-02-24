import * as React from 'react';
import styles from './Content.module.css';

function Face() {
  const [isEpetriActive, setIsEpetriActive] = React.useState(false);
  const printContentRef = React.useRef(null);

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
              <li>
                Builder/PM — All things tech, crypto, infra
              </li>

              <li>huett054@umn.edu</li>
              <li>
                <a
                  href="https://x.com/HuettenCol46630"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  x.com/colehuetten
                </a>
              </li>
            </ul>
          </article>

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
                    href="https://ur-aura.sharonzheng.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MEV Detection
                  </a>{' '}
                  &mdash; Catching scammers
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
            <h2>Work Experience</h2>
            <hr />

            <article>
              <ul className={styles.tight}>
                <li>
                  <sup>Now</sup>
                  Tokenbridge, Remote &mdash; <i>Product Manager</i>
                </li>
                <li>
                  <sup>2025</sup>
                  Travelers Insurance, Minneapolis &mdash; <i>Technical Product Manager Intern, Software Engineer Intern</i>
                </li>
                <li>
                  <sup>2024</sup>
                  University of Minnesota, Minneapolis &mdash;{' '}
                  <i>Student Researcher</i>
                </li>
                <li>
                  <sup>2024</sup>
                  SASSA, Remote &mdash; <i>Product Manager Intern </i>
                </li>
                
              </ul>
            </article>
          </section>

          <section>
            <h2>Archive</h2>
            <hr />

            <article>
              <p>"soon"</p>
            </article>
          </section>

          <section>
            <h2>In-Person Events</h2>
            <hr />
            <article>
              <p>"when im famous"</p>
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
