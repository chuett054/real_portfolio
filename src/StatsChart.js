import * as React from 'react';
import styles from './StatsChart.module.css';

const HEIGHT = 250;
const PAD = { top: 52, right: 20, bottom: 30, left: 32 };

function niceMax(value) {
  if (value <= 0) return 5;
  const step = value <= 20 ? 5 : value <= 50 ? 10 : 20;
  return Math.ceil((value * 1.1) / step) * step;
}

/**
 * Small interactive area chart with tabs.
 * tabs: [{ key, label, unit, caption, data: [{ label, fullLabel, value, partial }] }]
 */
function StatsChart({ tabs }) {
  const [activeKey, setActiveKey] = React.useState(tabs[0].key);
  const [hoverIndex, setHoverIndex] = React.useState(null);
  const [width, setWidth] = React.useState(600);
  const plotRef = React.useRef(null);

  const tab = tabs.find((t) => t.key === activeKey) || tabs[0];
  const total = tab.data.reduce((sum, point) => sum + point.value, 0);

  React.useEffect(() => {
    const node = plotRef.current;
    if (!node) return undefined;

    const update = () => setWidth(Math.max(node.clientWidth, 200));
    update();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const max = niceMax(Math.max(...tab.data.map((p) => p.value)));
  const innerW = width - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const step = innerW / Math.max(tab.data.length - 1, 1);

  const points = tab.data.map((point, i) => ({
    ...point,
    x: PAD.left + i * step,
    y: PAD.top + innerH - (point.value / max) * innerH,
  }));

  const baseline = PAD.top + innerH;
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(
    1,
  )},${baseline} L${points[0].x.toFixed(1)},${baseline} Z`;

  const gridValues = [max / 2, max];
  const active = hoverIndex !== null ? points[hoverIndex] : null;

  function selectTab(key) {
    setActiveKey(key);
    setHoverIndex(null);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      const start = hoverIndex === null ? (delta > 0 ? -1 : points.length) : hoverIndex;
      const next = Math.min(Math.max(start + delta, 0), points.length - 1);
      setHoverIndex(next);
    }
  }

  // keep the tooltip inside the chart near the edges
  let tooltipStyle = null;
  if (active) {
    const edge = active.x < 70 ? 'left' : active.x > width - 70 ? 'right' : 'center';
    tooltipStyle = {
      left: `${active.x}px`,
      top: `${active.y}px`,
      transform:
        edge === 'left'
          ? 'translate(-12px, calc(-100% - 14px))'
          : edge === 'right'
          ? 'translate(calc(-100% + 12px), calc(-100% - 14px))'
          : 'translate(-50%, calc(-100% - 14px))',
    };
  }

  return (
    <div className={styles.widget}>
      <div className={styles.tabs} role="tablist" aria-label="Business Profile stats">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.key === tab.key}
            className={`${styles.tab} ${t.key === tab.key ? styles.tabActive : ''}`}
            onClick={() => selectTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.summary}>
        <span className={styles.total}>{total}</span>
        <span className={styles.caption}>{tab.caption}</span>
      </div>

      <div
        ref={plotRef}
        className={styles.plot}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg
          width={width}
          height={HEIGHT}
          className={styles.svg}
          role="img"
          aria-label={`${tab.label} per month: ${tab.data
            .map((p) => `${p.fullLabel} ${p.value}`)
            .join(', ')}`}
        >
          {gridValues.map((value) => {
            const y = PAD.top + innerH - (value / max) * innerH;
            return (
              <g key={value}>
                <line
                  x1={PAD.left}
                  x2={width - PAD.right}
                  y1={y}
                  y2={y}
                  className={styles.gridLine}
                />
                <text x={0} y={y + 4} className={styles.gridLabel}>
                  {value}
                </text>
              </g>
            );
          })}

          <line
            x1={PAD.left}
            x2={width - PAD.right}
            y1={baseline}
            y2={baseline}
            className={styles.baseline}
          />

          <path d={areaPath} className={styles.area} />
          <path d={linePath} className={styles.line} />

          {active ? (
            <line
              x1={active.x}
              x2={active.x}
              y1={PAD.top}
              y2={baseline}
              className={styles.guide}
            />
          ) : null}

          {points.map((p, i) => (
            <g key={p.label}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIndex === i ? 6 : 4}
                className={`${styles.dot} ${hoverIndex === i ? styles.dotActive : ''}`}
              />
              <text
                x={p.x}
                y={HEIGHT - 8}
                textAnchor="middle"
                className={`${styles.monthLabel} ${
                  hoverIndex === i ? styles.monthLabelActive : ''
                }`}
              >
                {p.label}
              </text>
            </g>
          ))}

          {/* invisible hit areas: one column per month, for hover, tap and keyboard */}
          {points.map((p, i) => {
            const left = i === 0 ? 0 : p.x - step / 2;
            const right = i === points.length - 1 ? width : p.x + step / 2;
            return (
              <rect
                key={`hit-${p.label}`}
                x={left}
                y={0}
                width={right - left}
                height={HEIGHT}
                className={styles.hit}
                tabIndex={0}
                aria-label={`${p.fullLabel}: ${p.value} ${tab.unit}`}
                onMouseEnter={() => setHoverIndex(i)}
                onFocus={() => setHoverIndex(i)}
                onBlur={() => setHoverIndex(null)}
                onClick={() => setHoverIndex(i)}
                onKeyDown={handleKeyDown}
              />
            );
          })}
        </svg>

        {active ? (
          <div className={styles.tooltip} style={tooltipStyle} aria-hidden="true">
            <span className={styles.tooltipValue}>
              {active.value} {active.value === 1 ? tab.unit.replace(/s$/, '') : tab.unit}
            </span>
            <span className={styles.tooltipLabel}>
              {active.fullLabel}
              {active.partial ? ' (so far)' : ''}
            </span>
          </div>
        ) : null}
      </div>

    </div>
  );
}

export default StatsChart;
