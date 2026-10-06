(() => {
  const grid = document.querySelector('[data-gallery-grid]');
  const emptyState = document.querySelector('[data-gallery-empty]');
  const filters = document.querySelector('[data-gallery-filters]');
  const dialog = document.querySelector('[data-gallery-dialog]');
  if (!grid || !emptyState || !filters || !dialog) return;

  const dialogImage = dialog.querySelector('[data-gallery-dialog-image]');
  const dialogCaption = dialog.querySelector('[data-gallery-dialog-caption]');
  const closeButton = dialog.querySelector('[data-gallery-close]');
  const previousButton = dialog.querySelector('[data-gallery-prev]');
  const nextButton = dialog.querySelector('[data-gallery-next]');
  let entries = [];
  let visibleEntries = [];
  let activeIndex = 0;
  let lastTrigger = null;

  function validEntry(entry) {
    return entry && typeof entry.src === 'string' && entry.src && typeof entry.alt === 'string' && entry.alt;
  }

  function cardSource(src) {
    return /\.webp$/i.test(src) ? src.replace(/\.webp$/i, '-800.webp') : src;
  }

  function renderCard(entry, index) {
    const article = document.createElement('article');
    article.className = 'uy-gallery-card';
    article.dataset.category = entry.category || 'general';

    const button = document.createElement('button');
    button.className = 'uy-gallery-card__media';
    button.type = 'button';
    button.setAttribute('aria-label', `Abrir imagen ${index + 1} de ${visibleEntries.length}: ${entry.alt}`);
    button.addEventListener('click', () => openDialog(index, button));

    const image = document.createElement('img');
    // Cards use the 800px variant (name-800.webp) and fall back to the original if it does not exist.
    image.addEventListener('error', () => { if (image.src !== new URL(entry.src, location.href).href) image.src = entry.src; }, { once: true });
    image.src = cardSource(entry.src);
    image.alt = entry.alt;
    image.loading = index < 3 ? 'eager' : 'lazy';
    if (index === 0) image.fetchPriority = 'high';
    image.decoding = 'async';
    image.width = 1200;
    image.height = 820;
    button.append(image);

    const body = document.createElement('div');
    body.className = 'uy-gallery-card__body';
    if (entry.categoryLabel) {
      const category = document.createElement('span');
      category.className = 'uy-gallery-card__category';
      category.textContent = entry.categoryLabel;
      body.append(category);
    }
    if (entry.title) {
      const title = document.createElement('h3');
      title.textContent = entry.title;
      body.append(title);
    }
    if (entry.date) {
      const date = document.createElement('p');
      date.className = 'uy-gallery-card__date';
      date.textContent = entry.date;
      body.append(date);
    }
    // The description is shown only in the enlarged viewer, not on the card.

    article.append(button);
    if (body.childElementCount) {
      article.append(body);
    } else {
      article.classList.add('uy-gallery-card--image-only');
    }
    return article;
  }

  function renderCards(category = 'all') {
    visibleEntries = category === 'all' ? entries : entries.filter(entry => (entry.category || 'general') === category);
    grid.replaceChildren(...visibleEntries.map(renderCard));
  }

  function renderFilters() {
    const categories = [...new Map(entries.map(entry => [entry.category || 'general', entry.categoryLabel || 'General'])).entries()];
    if (categories.length < 2) return;
    const options = [['all', 'Todas'], ...categories];
    const buttons = options.map(([value, label], index) => {
      const button = document.createElement('button');
      button.className = `gallery-filter__button${index === 0 ? ' is-active' : ''}`;
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => {
        buttons.forEach(item => item.classList.toggle('is-active', item === button));
        renderCards(value);
      });
      return button;
    });
    filters.replaceChildren(...buttons);
    filters.hidden = false;
  }

  function showActiveImage() {
    const entry = visibleEntries[activeIndex];
    if (!entry) return;
    dialogImage.src = entry.src;
    dialogImage.alt = entry.alt;
    const multiple = visibleEntries.length > 1;
    const counter = multiple ? `${activeIndex + 1} / ${visibleEntries.length}` : '';
    dialogCaption.textContent = [entry.title || entry.description, counter].filter(Boolean).join(' · ');
    dialogCaption.hidden = !dialogCaption.textContent;
    previousButton.hidden = !multiple;
    nextButton.hidden = !multiple;
  }

  function openDialog(index, trigger) {
    activeIndex = index;
    lastTrigger = trigger;
    showActiveImage();
    dialog.showModal();
  }

  function move(direction) {
    activeIndex = (activeIndex + direction + visibleEntries.length) % visibleEntries.length;
    showActiveImage();
  }

  closeButton.addEventListener('click', () => dialog.close());
  previousButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });
  dialog.addEventListener('close', () => {
    dialogImage.removeAttribute('src');
    if (lastTrigger) lastTrigger.focus();
  });

  fetch('/assets/data/galeria.json')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el catálogo de imágenes.');
      return response.json();
    })
    .then(data => {
      entries = Array.isArray(data) ? data.filter(validEntry) : [];
      if (!entries.length) return;
      emptyState.hidden = true;
      renderCards();
      renderFilters();
    })
    .catch(() => {
      emptyState.querySelector('h3').textContent = 'No se pudo cargar el catálogo visual.';
    });
})();
