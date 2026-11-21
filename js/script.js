const currentYear = document.getElementById('current-year');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));
const sections = Array.from(document.querySelectorAll('main section[id], header section[id]'));

// Keep the mobile menu state synchronized with the button's accessibility state.
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Let keyboard users dismiss the mobile menu and return to its button.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const updateActiveLink = () => {
  if (!sections.length) {
    return;
  }

  const scrollPosition = window.scrollY + 160;
  let currentId = sections[0].id;

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navAnchors.forEach((link) => {
    const isCurrent = link.getAttribute('href') === `#${currentId}`;
    link.setAttribute('aria-current', isCurrent ? 'true' : 'false');
  });
};

// Highlight the section that is closest to the current reading position.
if (navAnchors.length) {
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

const initializeProjectFilters = () => {
  const filters = document.querySelector('.project-filters');
  const filterButtons = Array.from(document.querySelectorAll('.project-filter-button'));
  const projectCards = Array.from(document.querySelectorAll('.project-card[data-category]'));
  const filterStatus = document.querySelector('.project-filter-status');

  if (!filters || !filterButtons.length || !projectCards.length || !filterStatus) {
    return;
  }

  const updateProjects = (selectedCategory) => {
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const isVisible = selectedCategory === 'all' || card.dataset.category === selectedCategory;
      card.hidden = !isVisible;
      visibleCount += Number(isVisible);
    });

    filterButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === selectedCategory));
    });

    filterStatus.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'}.`;
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => updateProjects(button.dataset.filter));
  });

  filters.hidden = false;
  updateProjects('all');
};

initializeProjectFilters();

const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const fields = ['name', 'email', 'message'];

const setFieldError = (fieldId, message) => {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);

  if (!field || !error) {
    return;
  }

  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getFieldError = (fieldId, value) => {
  if (fieldId === 'name' && value.length < 2) {
    return 'Enter your name using at least 2 non-space characters.';
  }

  if (fieldId === 'email' && !isValidEmail(value)) {
    return 'Enter an email address in the format name@example.com.';
  }

  if (fieldId === 'message' && value.length < 10) {
    return 'Write a message using at least 10 non-space characters.';
  }

  return '';
};

const clearFormStatus = () => {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = '';
  formStatus.classList.remove('is-error', 'is-success');
};

// Validate locally because this static portfolio has no message-delivery backend.
if (form) {
  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);

    if (!field) {
      return;
    }

    field.addEventListener('input', () => {
      clearFormStatus();

      if (field.getAttribute('aria-invalid') === 'true') {
        setFieldError(fieldId, getFieldError(fieldId, field.value.trim()));
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const invalidFields = fields.filter((fieldId) => {
      const field = document.getElementById(fieldId);
      const errorMessage = field ? getFieldError(fieldId, field.value.trim()) : '';
      setFieldError(fieldId, errorMessage);
      return Boolean(errorMessage);
    });

    if (invalidFields.length) {
      if (formStatus) {
        formStatus.textContent = 'Please correct the highlighted fields and try again.';
        formStatus.classList.remove('is-success');
        formStatus.classList.add('is-error');
      }

      document.getElementById(invalidFields[0])?.focus();
      return;
    }

    if (formStatus) {
      formStatus.textContent = 'Message accepted — all fields passed validation. Nothing was sent or stored.';
      formStatus.classList.remove('is-error');
      formStatus.classList.add('is-success');
    }

    form.reset();
  });
}

/* ---------- Assignment 3: state helpers ---------- */

// localStorage can throw (private mode, blocked storage), so every access is guarded.
const storage = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Storage is a convenience; the page still works without it.
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Ignore storage failures.
    }
  },
};

/* ---------- Theme: remembered light/dark mode ---------- */

const initializeTheme = () => {
  const toggle = document.getElementById('theme-toggle');
  const label = toggle?.querySelector('.theme-toggle-label');

  if (!toggle || !label) {
    return;
  }

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    label.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  };

  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  toggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    // Stored as a plain string so the inline head script can read it before paint.
    try {
      localStorage.setItem('portfolio.theme', nextTheme);
    } catch (error) {
      // Theme still changes for this visit.
    }
  });
};

initializeTheme();

/* ---------- Visitor name: stored greeting with show/hide form ---------- */

const initializeVisitor = () => {
  const visitor = document.getElementById('visitor');
  const visitorForm = document.getElementById('visitor-form');
  const nameInput = document.getElementById('visitor-name');
  const greeting = document.getElementById('visitor-greeting');
  const resetButton = document.getElementById('visitor-reset');

  if (!visitor || !visitorForm || !nameInput || !greeting || !resetButton) {
    return;
  }

  const getGreetingWord = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good morning';
    }

    return hour < 18 ? 'Good afternoon' : 'Good evening';
  };

  const render = () => {
    const name = storage.get('portfolio.visitorName', '');
    const hasName = Boolean(name);

    greeting.textContent = hasName ? `${getGreetingWord()}, ${name} — welcome to my portfolio!` : '';
    visitorForm.hidden = hasName;
    resetButton.hidden = !hasName;
  };

  visitorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim().replace(/\s+/g, ' ');

    if (name.length < 2) {
      greeting.textContent = 'Please enter at least 2 characters.';
      nameInput.focus();
      return;
    }

    storage.set('portfolio.visitorName', name);
    nameInput.value = '';
    render();
    resetButton.focus();
  });

  resetButton.addEventListener('click', () => {
    storage.remove('portfolio.visitorName');
    render();
    nameInput.focus();
  });

  visitor.hidden = false;
  render();
};

initializeVisitor();

/* ---------- Time on site: counter that survives reloads within a tab ---------- */

const initializeTimeOnSite = () => {
  const output = document.getElementById('time-on-site');

  if (!output) {
    return;
  }

  let seconds = 0;

  try {
    seconds = Number(sessionStorage.getItem('portfolio.timeOnSite')) || 0;
  } catch (error) {
    seconds = 0;
  }

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const rest = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${rest}`;
  };

  output.textContent = formatTime(seconds);

  window.setInterval(() => {
    // Only count time while the tab is actually visible.
    if (document.hidden) {
      return;
    }

    seconds += 1;
    output.textContent = formatTime(seconds);

    try {
      sessionStorage.setItem('portfolio.timeOnSite', String(seconds));
    } catch (error) {
      // Counter keeps running in memory.
    }
  }, 1000);
};

initializeTimeOnSite();

/* ---------- GitHub API: fetch, filter, sort, and remember the view ---------- */

const GITHUB_USER = 'RaedowKfupm';
const REPO_CACHE_KEY = 'portfolio.repoCache';
const REPO_CACHE_MS = 10 * 60 * 1000;

const initializeRepos = () => {
  const list = document.getElementById('repo-list');
  const status = document.getElementById('repo-status');
  const retryButton = document.getElementById('repo-retry');
  const searchInput = document.getElementById('repo-search');
  const languageSelect = document.getElementById('repo-language');
  const sortSelect = document.getElementById('repo-sort');

  if (!list || !status || !retryButton || !searchInput || !languageSelect || !sortSelect) {
    return;
  }

  let repos = [];
  const savedView = storage.get('portfolio.repoView', {});
  sortSelect.value = ['updated', 'name', 'stars'].includes(savedView.sort) ? savedView.sort : 'updated';
  searchInput.value = typeof savedView.search === 'string' ? savedView.search : '';

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
  };

  const dateFormatter = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' });

  const sorters = {
    updated: (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at),
    name: (a, b) => a.name.localeCompare(b.name),
    stars: (a, b) => b.stargazers_count - a.stargazers_count || a.name.localeCompare(b.name),
  };

  const createRepoCard = (repo) => {
    const item = document.createElement('li');
    item.className = 'repo-card';

    const title = document.createElement('h3');
    const link = document.createElement('a');
    link.href = repo.html_url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = repo.name;
    title.append(link);

    const description = document.createElement('p');
    description.textContent = repo.description || 'No description provided.';

    const meta = document.createElement('ul');
    meta.className = 'repo-meta';
    meta.setAttribute('aria-label', 'Repository details');
    [repo.language || 'No language', `★ ${repo.stargazers_count}`, `Updated ${dateFormatter.format(new Date(repo.pushed_at))}`]
      .forEach((text) => {
        const detail = document.createElement('li');
        detail.textContent = text;
        meta.append(detail);
      });

    item.append(title, description, meta);
    return item;
  };

  // Multi-step rule: search text AND language filter, then the chosen sort order.
  const render = () => {
    const query = searchInput.value.trim().toLowerCase();
    const language = languageSelect.value;

    const visibleRepos = repos
      .filter((repo) => language === 'all' || (repo.language || 'Other') === language)
      .filter((repo) => !query || `${repo.name} ${repo.description || ''}`.toLowerCase().includes(query))
      .sort(sorters[sortSelect.value]);

    list.replaceChildren(...visibleRepos.map(createRepoCard));
    storage.set('portfolio.repoView', { search: searchInput.value, language, sort: sortSelect.value });

    if (!visibleRepos.length) {
      setStatus('No repositories match your search. Try another word or language.');
      return;
    }

    setStatus(`Showing ${visibleRepos.length} of ${repos.length} repositories.`);
  };

  const populateLanguages = () => {
    const languages = [...new Set(repos.map((repo) => repo.language || 'Other'))].sort();
    languageSelect.replaceChildren(new Option('All languages', 'all'), ...languages.map((name) => new Option(name, name)));
    languageSelect.value = languages.includes(savedView.language) ? savedView.language : 'all';
  };

  const readCache = () => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(REPO_CACHE_KEY));
      return cached && Date.now() - cached.time < REPO_CACHE_MS ? cached.data : null;
    } catch (error) {
      return null;
    }
  };

  const loadRepos = async () => {
    retryButton.hidden = true;
    setStatus('Loading repositories…');

    const cached = readCache();

    if (cached) {
      repos = cached;
      populateLanguages();
      render();
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`, {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal,
      });

      if (response.status === 403 || response.status === 429) {
        throw new Error('GitHub’s request limit was reached. Please try again in a few minutes.');
      }

      if (!response.ok) {
        throw new Error(`GitHub responded with status ${response.status}.`);
      }

      // Keep only the fields the cards use, which keeps the session cache small.
      repos = (await response.json())
        .filter((repo) => !repo.fork)
        .map(({ name, description, html_url, language, stargazers_count, pushed_at }) => ({
          name, description, html_url, language, stargazers_count, pushed_at,
        }));

      try {
        sessionStorage.setItem(REPO_CACHE_KEY, JSON.stringify({ time: Date.now(), data: repos }));
      } catch (error) {
        // Caching is optional.
      }

      populateLanguages();
      render();
    } catch (error) {
      const reason = error.name === 'AbortError' ? 'The request timed out.' : error.message;
      const offline = navigator.onLine === false ? ' You appear to be offline.' : '';
      setStatus(`Sorry, repositories could not be loaded. ${reason}${offline}`, true);
      retryButton.hidden = false;
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  searchInput.addEventListener('input', () => repos.length && render());
  languageSelect.addEventListener('change', render);
  sortSelect.addEventListener('change', render);
  retryButton.addEventListener('click', loadRepos);

  loadRepos();
};

initializeRepos();
