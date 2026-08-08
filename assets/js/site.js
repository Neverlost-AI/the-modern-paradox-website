const button = document.querySelector('.menu-button');
const links = document.querySelector('.nav-links');
if (button && links) {
  button.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

(() => {
  const STORAGE_KEY = 'tmp-part-iv-read-along';
  const TRACKS = {
    '01': {
      title: 'The Modern Übermensch and Systems',
      hash: '#modern-ubermensch-and-systems',
      src: '../../assets/audio/part-iv/01-modern-ubermensch-and-systems.mp3'
    },
    '02': {
      title: 'The Übermensch as Operator',
      hash: '#ubermensch-as-operator',
      src: '../../assets/audio/part-iv/02-ubermensch-as-operator.mp3'
    },
    '03': {
      title: 'Organizational Coherence: Fragmentation',
      hash: '#organizational-coherence',
      src: '../../assets/audio/part-iv/03-organizational-coherence-fragmentation.mp3'
    },
    '04': {
      title: 'Organizational Coherence: Demonstrated Value',
      hash: '#demonstrated-value',
      src: '../../assets/audio/part-iv/04-organizational-coherence-fragmentation.mp3'
    },
    '05': {
      title: 'Consciousness and Reorganization',
      hash: '#consciousness-reorganization',
      src: '../../assets/audio/part-iv/05-consciousness-and-reorganization.mp3'
    },
    '06': {
      title: 'Coherence, the Operator, and Neverlost',
      hash: '#coherence-operator-neverlost',
      src: '../../assets/audio/part-iv/06-coherence-operator-neverlost.mp3'
    }
  };

  // Keep the canonical audio path for section 04 explicit.
  TRACKS['04'].src = '../../assets/audio/part-iv/04-organizational-coherence-demonstrated-value.mp3';

  const HASH_TO_TRACK = Object.fromEntries(
    Object.entries(TRACKS).map(([track, data]) => [data.hash, track])
  );

  const readStoredState = () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const state = JSON.parse(raw);
      if (!state || !TRACKS[state.track]) return null;
      return state;
    } catch (_) {
      return null;
    }
  };

  const writeStoredState = (state) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...state,
        savedAt: Date.now()
      }));
    } catch (_) {
      // The pages still work without session storage; only cross-page handoff is lost.
    }
  };

  const trackFromCard = (card) => {
    if (!card) return null;
    const match = card.id && card.id.match(/^track-(\d{2})$/);
    return match ? match[1] : null;
  };

  const loadStylesheetOnce = (href, id) => {
    if (document.getElementById(id)) return;
    const stylesheet = document.createElement('link');
    stylesheet.id = id;
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    document.head.appendChild(stylesheet);
  };

  const setupListeningPageHandoff = () => {
    const cards = Array.from(document.querySelectorAll('.audio-card'));
    if (!cards.length) return;

    if (document.currentScript) {
      loadStylesheetOnce(
        new URL('../css/inline-reader.css', document.currentScript.src).href,
        'tmp-inline-reader-css'
      );
    }

    let lastActiveCard = null;
    let readerDocumentPromise = null;

    const getReaderDocument = () => {
      if (!readerDocumentPromise) {
        const readerUrl = new URL('../read/part-iv/', window.location.href);
        readerDocumentPromise = fetch(readerUrl, { credentials: 'same-origin' })
          .then((response) => {
            if (!response.ok) throw new Error(`Reader request failed: ${response.status}`);
            return response.text();
          })
          .then((html) => new DOMParser().parseFromString(html, 'text/html'));
      }
      return readerDocumentPromise;
    };

    const setLinkState = (link, open) => {
      link.setAttribute('aria-expanded', open ? 'true' : 'false');
      link.textContent = open ? 'Hide reader ↑' : 'Read along ↓';
    };

    const closeInlineReader = (card) => {
      const panel = card.querySelector('.inline-reader-panel');
      const link = card.querySelector('a[href*="read/part-iv/"]');
      if (panel) panel.hidden = true;
      if (link) setLinkState(link, false);
    };

    const closeOtherReaders = (activeCard) => {
      cards.forEach((card) => {
        if (card !== activeCard) closeInlineReader(card);
      });
    };

    const buildInlineReader = async (card, track, link) => {
      let panel = card.querySelector('.inline-reader-panel');
      if (panel) {
        const opening = panel.hidden;
        if (opening) closeOtherReaders(card);
        panel.hidden = !opening;
        setLinkState(link, opening);
        return;
      }

      const originalLabel = link.textContent;
      link.textContent = 'Loading reader…';
      link.setAttribute('aria-busy', 'true');

      try {
        const readerDocument = await getReaderDocument();
        const sectionId = TRACKS[track].hash.slice(1);
        const sourceHeading = readerDocument.getElementById(sectionId);
        if (!sourceHeading) throw new Error(`Reader section not found: ${sectionId}`);

        panel = document.createElement('div');
        panel.className = 'inline-reader-panel';
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-label', `${TRACKS[track].title} reader`);

        const toolbar = document.createElement('div');
        toolbar.className = 'inline-reader-toolbar';
        toolbar.innerHTML = `
          <div>
            <div class="inline-reader-kicker">Read along · Section ${track}</div>
            <div class="inline-reader-helper">The text below matches the recording above.</div>
          </div>
          <button class="inline-reader-close" type="button" aria-label="Close reader">Close</button>
        `;

        const body = document.createElement('div');
        body.className = 'inline-reader-body';

        let node = sourceHeading;
        while (node && node.tagName !== 'HR') {
          body.appendChild(node.cloneNode(true));
          node = node.nextElementSibling;
        }

        panel.append(toolbar, body);
        card.appendChild(panel);

        toolbar.querySelector('.inline-reader-close').addEventListener('click', () => {
          panel.hidden = true;
          setLinkState(link, false);
          link.focus({ preventScroll: true });
        });

        closeOtherReaders(card);
        setLinkState(link, true);
      } catch (_) {
        // Preserve the existing full-reader link as a reliable fallback.
        window.location.href = link.href;
      } finally {
        link.removeAttribute('aria-busy');
        if (link.textContent === 'Loading reader…') link.textContent = originalLabel;
      }
    };

    cards.forEach((card) => {
      const audio = card.querySelector('audio');
      const track = trackFromCard(card);
      const readerLink = card.querySelector('a[href*="read/part-iv/"]');
      if (!audio || !track) return;

      audio.addEventListener('play', () => {
        lastActiveCard = card;
      });

      audio.addEventListener('timeupdate', () => {
        if (audio.currentTime > 0) lastActiveCard = card;
      });

      if (readerLink) {
        setLinkState(readerLink, false);
        readerLink.addEventListener('click', (event) => {
          event.preventDefault();
          lastActiveCard = card;
          writeStoredState({
            track,
            currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
            shouldResume: !audio.paused && !audio.ended
          });
          buildInlineReader(card, track, readerLink);
        });
      }
    });

    // The hero and bottom full-reader links still open the dedicated reader page.
    document.querySelectorAll('a[href*="read/part-iv/"]').forEach((readerLink) => {
      if (readerLink.closest('.audio-card')) return;
      readerLink.addEventListener('click', () => {
        const card = lastActiveCard;
        if (!card) return;

        const audio = card.querySelector('audio');
        const track = trackFromCard(card);
        if (!audio || !track) return;

        writeStoredState({
          track,
          currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
          shouldResume: !audio.paused && !audio.ended
        });
      });
    });
  };

  const setupReader = () => {
    const readerNav = document.querySelector('.reader-nav');
    const reader = document.querySelector('.reader');
    if (!readerNav || !reader) return;

    if (document.currentScript) {
      loadStylesheetOnce(
        new URL('../css/read-along.css', document.currentScript.src).href,
        'tmp-read-along-css'
      );
    }

    const shell = document.createElement('div');
    shell.className = 'read-along-shell';
    shell.innerHTML = `
      <div class="read-along-inner">
        <div class="read-along-copy">
          <div class="read-along-label">Read along</div>
          <div class="read-along-title" data-read-along-title></div>
          <div class="read-along-status" data-read-along-status aria-live="polite"></div>
        </div>
        <audio class="read-along-audio" controls preload="metadata" data-read-along-audio>
          Your browser does not support the audio element.
        </audio>
        <a class="read-along-back" href="../../part-iv/">Audio sections →</a>
      </div>
    `;
    readerNav.insertAdjacentElement('afterend', shell);

    const player = shell.querySelector('[data-read-along-audio]');
    const title = shell.querySelector('[data-read-along-title]');
    const status = shell.querySelector('[data-read-along-status]');
    const backLink = shell.querySelector('.read-along-back');

    const syncStickyOffset = () => {
      const navTop = parseFloat(getComputedStyle(readerNav).top) || 0;
      shell.style.top = `${navTop + readerNav.offsetHeight}px`;
    };
    syncStickyOffset();
    window.addEventListener('resize', syncStickyOffset);

    const formatTime = (seconds) => {
      const value = Math.max(0, Math.floor(seconds || 0));
      const minutes = Math.floor(value / 60);
      const remainder = String(value % 60).padStart(2, '0');
      return `${minutes}:${remainder}`;
    };

    let activeTrack = null;
    let lastSavedSecond = -1;

    const persistPlayerState = () => {
      if (!activeTrack) return;
      writeStoredState({
        track: activeTrack,
        currentTime: Number.isFinite(player.currentTime) ? player.currentTime : 0,
        shouldResume: !player.paused && !player.ended
      });
    };

    const loadTrack = (track, startTime = 0, shouldResume = false) => {
      if (!TRACKS[track]) return;

      activeTrack = track;
      lastSavedSecond = -1;
      const data = TRACKS[track];
      title.textContent = `${track} · ${data.title}`;
      status.textContent = startTime > 1
        ? `Continue from ${formatTime(startTime)}`
        : 'Audio for this reading section';

      player.pause();
      player.src = data.src;
      player.load();

      player.addEventListener('loadedmetadata', () => {
        if (startTime > 0 && Number.isFinite(player.duration)) {
          player.currentTime = Math.min(startTime, Math.max(0, player.duration - 0.25));
        }

        if (shouldResume) {
          player.play()
            .then(() => {
              status.textContent = `Playing from ${formatTime(player.currentTime)}`;
            })
            .catch(() => {
              status.textContent = `Press play to continue from ${formatTime(player.currentTime)}`;
            });
        }
      }, { once: true });
    };

    const params = new URLSearchParams(window.location.search);
    const queryTrack = params.get('track');
    const hashTrack = HASH_TO_TRACK[window.location.hash];
    const stored = readStoredState();
    const storedIsFresh = stored && (Date.now() - (stored.savedAt || 0) < 6 * 60 * 60 * 1000);

    const initialTrack = (queryTrack && TRACKS[queryTrack] && queryTrack)
      || hashTrack
      || (storedIsFresh && stored.track)
      || '01';

    const canResumeStored = storedIsFresh && stored.track === initialTrack;
    loadTrack(
      initialTrack,
      canResumeStored ? Number(stored.currentTime) || 0 : 0,
      canResumeStored ? Boolean(stored.shouldResume) : false
    );

    readerNav.querySelectorAll('a[href^="#"]').forEach((navLink) => {
      navLink.addEventListener('click', () => {
        const track = HASH_TO_TRACK[navLink.getAttribute('href')];
        if (!track || track === activeTrack) return;
        const keepPlaying = !player.paused && !player.ended;
        loadTrack(track, 0, keepPlaying);
      });
    });

    player.addEventListener('play', () => {
      status.textContent = 'Playing · follow the section below';
      persistPlayerState();
    });

    player.addEventListener('pause', () => {
      if (!player.ended) {
        status.textContent = `Paused at ${formatTime(player.currentTime)}`;
      }
      persistPlayerState();
    });

    player.addEventListener('timeupdate', () => {
      const wholeSecond = Math.floor(player.currentTime || 0);
      if (wholeSecond !== lastSavedSecond && wholeSecond % 3 === 0) {
        lastSavedSecond = wholeSecond;
        persistPlayerState();
      }
    });

    player.addEventListener('ended', () => {
      status.textContent = 'Section complete · choose the next section above';
      persistPlayerState();
    });

    backLink.addEventListener('click', persistPlayerState);
    window.addEventListener('pagehide', persistPlayerState);
  };

  setupListeningPageHandoff();
  setupReader();
})();
