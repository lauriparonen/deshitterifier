// helper: debounce/throttle
function throttle(fn, limit = 300) {
    let inThrottle;
    return function () {
      if (!inThrottle) {
        fn();
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
  
  // nuke numbers but not buttons
  function nukeStats() {
    const spans = document.querySelectorAll('[data-testid="tweet"] div[role="group"] span');
    spans.forEach(span => {
      const txt = span.textContent.trim();
      if (/^\d+([.,]?\d+)?[KkMm]?$/.test(txt)) {
        span.textContent = '';
      }
    });
  }
  
  // CSS inject - a janky way to make sure the styles update fully
  function injectStyle() {
    const style = document.createElement("style");
    style.textContent = `
      body {
        font-family: 'IBM Plex Mono', monospace !important;
      }
      [aria-label="Timeline: Trending now"],
      [aria-label="Who to follow"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  function runStatObserver() {
    const timeline = document.querySelector('[aria-label^="Timeline:"]');
    if (!timeline) return;
  
    const observer = new MutationObserver(() => {
      // allow tweet internals to render before nuking
      setTimeout(nukeStats, 100);
    });
  
    observer.observe(timeline, {
      childList: true,
      subtree: true,
    });
  
    // periodic lazy nuke for missed tweets
    setInterval(nukeStats, 3000);
  }
  
  
  injectStyle();       
  nukeStats();         
  runStatObserver();   
  window.addEventListener('scroll', throttle(nukeStats, 300)); // lazy scroll rescue
  
  