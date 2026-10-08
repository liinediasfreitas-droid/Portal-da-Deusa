(function () {
  const $ = (s, el = document) => el.querySelector(s);

  // Tema claro/escuro (lembra a escolha; sem preferência, segue o sistema)
  const root = document.documentElement;
  const nav = $('.top nav');
  if (nav) {
    const btn = document.createElement('button');
    btn.className = 'theme'; btn.type = 'button';
    const sync = () => {
      const dark = root.dataset.theme === 'dark';
      btn.textContent = dark ? '☀' : '☾';
      btn.setAttribute('aria-label', dark ? 'Mudar para versão clara' : 'Mudar para versão escura');
    };
    btn.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('tema', root.dataset.theme); } catch (e) {}
      sync();
    });
    nav.append(btn); sync();
  }
  const IMG = 'assets/img/';

  function card(p) {
    const el = document.createElement('button');
    el.className = 'card' + (p.breve ? ' card--breve' : '');
    el.type = 'button';
    el.dataset.id = p.id;
    el.innerHTML = `
      <span class="card__img">${p.img ? `<img src="${IMG + p.img}" alt="${p.nome}" loading="lazy">` : '<span class="card__moon">☾</span>'}</span>
      <span class="card__body">
        <span class="card__tag">${p.tag}</span>
        <span class="card__name">${p.nome}</span>
        <span class="card__price">${p.breve ? 'Em breve' : p.preco || 'Consulte'}</span>
      </span>`;
    if (!p.breve) el.addEventListener('click', () => openModal(p));
    return el;
  }

  function openModal(p) {
    const m = $('#modal');
    if (!m) return;
    $('#modal-content').innerHTML = `
      <img src="${IMG + p.img}" alt="${p.nome}">
      <div class="modal__text">
        <p class="card__tag">${p.tag}</p>
        <h2>${p.nome}</h2>
        <p>${p.resumo}</p>
        ${p.ervas.length ? `<h3>Ervas e ingredientes</h3><p>${p.ervas.join(' · ')}</p>` : ''}
        ${p.uso ? `<h3>Uso</h3><p>${p.uso}</p>` : ''}
        <p class="price">${p.preco || 'Consulte'}</p>
        <button class="btn" id="saiba">Quero saber mais</button>
        <p class="proto" id="proto" hidden>Protótipo: o canal de pedidos será definido em breve.</p>
      </div>`;
    $('#saiba').addEventListener('click', () => ($('#proto').hidden = false));
    m.hidden = false;
    document.body.classList.add('lock');
    $('.modal__close').focus();
  }

  function closeModal() {
    $('#modal').hidden = true;
    document.body.classList.remove('lock');
  }

  const modal = $('#modal');
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.modal__close')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  // Catálogo
  const grid = $('#grid');
  if (grid) {
    const filtros = $('#filtros');
    let atual = location.hash.slice(1) || 'todos';
    if (atual !== 'todos' && !CATEGORIAS.some((c) => c.id === atual)) atual = 'todos';

    const render = () => {
      grid.replaceChildren(...PRODUTOS.filter((p) => atual === 'todos' || p.cat === atual).map(card));
      filtros.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === atual));
    };
    [{ id: 'todos', nome: 'Todos' }, ...CATEGORIAS].forEach((c) => {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.cat = c.id; b.textContent = c.nome;
      b.addEventListener('click', () => { atual = c.id; history.replaceState(null, '', '#' + c.id); render(); });
      filtros.append(b);
    });
    render();
  }

  // Landing: categorias e destaques
  const cats = $('#categorias');
  if (cats) {
    CATEGORIAS.forEach((c) => {
      const a = document.createElement('a');
      a.href = 'catalogo.html#' + c.id; a.className = 'cat';
      a.innerHTML = `<span class="cat__name">${c.nome}</span><span>${c.desc}</span>`;
      cats.append(a);
    });
    const dest = $('#destaques');
    ['banho-sol', 'garrafada-afrodite', 'cha-do-sol', 'agua-florida'].forEach((id) => {
      const p = PRODUTOS.find((x) => x.id === id);
      const c = card(p);
      c.addEventListener('click', () => (location.href = 'catalogo.html#' + p.cat));
      dest.append(c);
    });
  }
})();
