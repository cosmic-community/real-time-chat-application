const fs = require('fs');
const path = require('path');

// Build-time script injection for console capture
function injectConsoleCapture() {
  const buildDir = path.join(process.cwd(), '.next');
  const outDir = path.join(process.cwd(), 'out');
  
  // Determine which directory to process
  const targetDir = fs.existsSync(outDir) ? outDir : (fs.existsSync(buildDir) ? buildDir : null);
  
  if (!targetDir) {
    console.log('No build directory found, skipping console capture injection');
    return;
  }
  
  const consoleScript = `
<script>
(function() {
  if (window.self === window.top) return;
  const logs = [];
  const MAX_LOGS = 500;
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  function captureLog(level, args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, (key, value) => {
            if (typeof value === 'function') return '[Function]';
            if (value instanceof Error) return value.toString();
            return value;
          }, 2);
        } catch (e) {
          return '[Object]';
        }
      }
      return String(arg);
    }).join(' ');
    
    const logEntry = { timestamp, level, message, url: window.location.href };
    logs.push(logEntry);
    if (logs.length > MAX_LOGS) logs.shift();
    
    try {
      window.parent.postMessage({ type: 'console-log', log: logEntry }, '*');
    } catch (e) {}
    
    originalConsole[level].apply(console, args);
  }
  
  console.log = function(...args) { captureLog('log', args); };
  console.warn = function(...args) { captureLog('warn', args); };
  console.error = function(...args) { captureLog('error', args); };
  console.info = function(...args) { captureLog('info', args); };
  console.debug = function(...args) { captureLog('debug', args); };
  
  window.addEventListener('error', function(event) {
    captureLog('error', [\`Unhandled Error: \${event.message}\`, \`File: \${event.filename}:\${event.lineno}:\${event.colno}\`]);
  });
  
  window.addEventListener('unhandledrejection', function(event) {
    captureLog('error', ['Unhandled Promise Rejection:', event.reason]);
  });
  
  function sendMessage(type, data) {
    try {
      window.parent.postMessage({ type, ...data }, '*');
    } catch (e) {}
  }
  
  function sendRouteChange() {
    sendMessage('route-change', {
      route: {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        href: window.location.href
      },
      timestamp: new Date().toISOString()
    });
  }
  
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    sendRouteChange();
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    sendRouteChange();
  };
  
  window.addEventListener('popstate', sendRouteChange);
  window.addEventListener('hashchange', sendRouteChange);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      sendMessage('console-capture-ready', {
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
      sendRouteChange();
    });
  } else {
    sendMessage('console-capture-ready', {
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
    sendRouteChange();
  }
})();
</script>`;

  function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        processDirectory(itemPath);
      } else if (path.extname(item) === '.html') {
        let content = fs.readFileSync(itemPath, 'utf8');
        
        // Only inject if not already present and has </head> tag
        if (!content.includes('console-capture-ready') && content.includes('</head>')) {
          content = content.replace('</head>', `${consoleScript}</head>`);
          fs.writeFileSync(itemPath, content);
          console.log(`Injected console capture into: ${itemPath}`);
        }
      }
    });
  }
  
  try {
    processDirectory(targetDir);
    console.log('Console capture script injection completed');
  } catch (error) {
    console.error('Error injecting console capture script:', error);
  }
}

// Run the injection
injectConsoleCapture();