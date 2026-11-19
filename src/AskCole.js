import * as React from 'react';
import styles from './AskCole.module.css';

// Maps AI Search source documents to pages on this site.
const SOURCE_PAGES = {
  'about-cole.md': { label: 'About Cole', href: '#/' },
  'cloudflare.md': { label: 'Cloudflare', href: '#/experience/cloudflare' },
  'dis-copenhagen.md': { label: 'DIS Copenhagen', href: '#/experience/dis-copenhagen' },
  'travelers.md': { label: 'Travelers', href: '#/experience/travelers' },
  'sassa.md': { label: 'SASSA', href: '#/experience/sassa' },
  'ironman.md': { label: 'Ironman Training', href: '#/experience/ironman' },
  'blackout-detail.md': { label: 'Blackout Detail', href: '#/experience/blackout-detail' },
  'side-projects.md': { label: 'Side projects', href: '#/' },
};

const MAX_LENGTH = 300;

// The site renders its content three times (for the folded-paper effect in
// App.js), so the widget's state lives in one shared store and every copy
// shows the same thing.
const INITIAL = {
  question: '',
  asked: '',
  status: 'idle', // idle | loading | done | error
  answer: '',
  sources: [],
  error: '',
};

let shared = INITIAL;
const listeners = new Set();

function setShared(patch) {
  shared = { ...shared, ...patch };
  listeners.forEach((listener) => listener(shared));
}

function useShared() {
  const [state, setState] = React.useState(shared);
  React.useEffect(() => {
    listeners.add(setState);
    setState(shared);
    return () => listeners.delete(setState);
  }, []);
  return state;
}

async function ask(text) {
  const q = text.trim();
  if (!q || shared.status === 'loading') return;

  setShared({
    question: q,
    asked: q,
    status: 'loading',
    answer: '',
    sources: [],
    error: '',
  });

  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question: q }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong. Try again.');
    }

    setShared({
      status: 'done',
      answer: data.answer || "I couldn't find an answer to that.",
      sources: (data.sources || [])
        .map((source) => SOURCE_PAGES[source.key])
        .filter(Boolean)
        .slice(0, 2),
    });
  } catch (err) {
    setShared({
      status: 'error',
      error:
        err instanceof TypeError
          ? "Couldn't reach the demo. Check your connection and try again."
          : err.message,
    });
  }
}

/**
 * "Ask about Cole" demo backed by a real Cloudflare AI Search instance
 * (POST /api/ask, handled by worker/index.js).
 */
function AskCole({ suggestions = [] }) {
  const { question, asked, status, answer, sources, error } = useShared();

  function handleSubmit(event) {
    event.preventDefault();
    ask(question);
  }

  const loading = status === 'loading';

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <span className={styles.title}>Ask about Cole</span>
        <span className={styles.badge}>Powered by Cloudflare AI Search</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={question}
          maxLength={MAX_LENGTH}
          placeholder="Ask a question about Cole"
          aria-label="Ask a question about Cole"
          onChange={(event) => setShared({ question: event.target.value })}
          disabled={loading}
        />
        <button
          className={styles.submit}
          type="submit"
          disabled={loading || !question.trim()}
          aria-label="Ask"
        >
          {loading ? '…' : '→'}
        </button>
      </form>

      {suggestions.length ? (
        <div className={styles.suggestions}>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className={styles.chip}
              onClick={() => ask(s)}
              disabled={loading}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {status !== 'idle' ? (
        <div className={styles.result} aria-live="polite">
          <p className={styles.asked}>{asked}</p>

          {loading ? (
            <p className={styles.loading}>
              Searching
              <span className={styles.dots} aria-hidden="true">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </p>
          ) : null}

          {status === 'done' ? (
            <>
              <p className={styles.answer}>{answer}</p>
              {sources.length ? (
                <p className={styles.sources}>
                  Sources:{' '}
                  {sources.map((s, i) => (
                    <React.Fragment key={s.label}>
                      {i ? ', ' : ''}
                      <a className={styles.sourceLink} href={s.href}>
                        {s.label}
                      </a>
                    </React.Fragment>
                  ))}
                </p>
              ) : null}
            </>
          ) : null}

          {status === 'error' ? <p className={styles.error}>{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export default AskCole;
