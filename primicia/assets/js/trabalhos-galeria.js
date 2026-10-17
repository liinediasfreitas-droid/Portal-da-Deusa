(function () {
  const lista = (window.TRABALHOS || []).filter((t) => t && t.foto && t.titulo);
  if (!lista.length) return; // sem trabalhos cadastrados, a seção continua escondida

  const P = window.PRECOS;
  const $ = (s, el = document) => el.querySelector(s);
  const DIR = 'assets/img/trabalhos/';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const src = (f) => DIR + encodeURIComponent(f);
  const nomeSeg = (id) => (P.segmentos[id] ? P.segmentos[id].nome : '');
  const fmtMes = (m) => {
    const [a, mm] = String(m || '').split('-').map(Number);
    if (!a || !mm) return '';
    return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(a, mm - 1, 1));
  };
  const prova = (t) => [
    t.quantidade > 0 ? `${t.quantidade} peça${t.quantidade > 1 ? 's' : ''}` : '',
    t.prazoDias > 0 ? `${t.prazoDias} dia${t.prazoDias > 1 ? 's' : ''}` : '',
    t.tecido || ''
  ].filter(Boolean).join(' · ');

  lista.sort((a, b) => String(b.mes || '').localeCompare(String(a.mes || '')));

  const sec = $('#trabalhos');
  sec.hidden = false;
  $('#nav-trabalhos').hidden = false;

  // Contador: só aparece quando já há volume para impressionar
  if (lista.length >= 5) {
    const pecas = lista.reduce((s, t) => s + (t.quantidade > 0 ? t.quantidade : 0), 0);
    const el = $('#trab-contador');
    el.textContent = `${pecas.toLocaleString('pt-BR')} peças produzidas em ${lista.length} trabalhos`;
    el.hidden = false;
  }

  // Filtro por segmento (só quando há mais de um)
  const segs = [...new Set(lista.map((t) => t.segmento).filter((s) => P.segmentos[s]))];
  const filtros = $('#trab-filtros');
  if (segs.length > 1) {
    filtros.innerHTML = ['', ...segs].map((s, i) =>
      `<label class="chip"><input type="radio" name="trab-filtro" value="${s}"${i === 0 ? ' checked' : ''}><span>${s ? esc(nomeSeg(s)) : 'Todos'}</span></label>`).join('');
    filtros.hidden = false;
    filtros.addEventListener('change', (e) => desenhar(e.target.value));
  }

  const grade = $('#trab-grade');
  function desenhar(seg) {
    grade.innerHTML = '';
    lista.filter((t) => !seg || t.segmento === seg).forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'trab';
      b.innerHTML = `
        <img src="${src(t.foto)}" alt="${esc(t.titulo)}" loading="lazy">
        <span class="trab__body">
          <span class="trab__seg">${esc(nomeSeg(t.segmento))}</span>
          <strong>${esc(t.titulo)}</strong>
          <span class="trab__prova">${esc(prova(t))}</span>
        </span>`;
      b.addEventListener('click', () => abrir(t));
      grade.append(b);
    });
  }
  desenhar('');

  // Detalhe do trabalho
  const dlg = $('#trab-det');
  function abrir(t) {
    const fotos = [t.foto, ...(Array.isArray(t.fotosExtras) ? t.fotosExtras : [])];
    const dados = [
      ['Segmento', nomeSeg(t.segmento)],
      ['Quantidade', t.quantidade > 0 ? `${t.quantidade} peças` : ''],
      ['Prazo', t.prazoDias > 0 ? `${t.prazoDias} dias` : ''],
      ['Tecido', t.tecido],
      ['Entrega', fmtMes(t.mes)],
      ['Cliente', t.cliente]
    ].filter(([, v]) => v);
    $('#trab-det-conteudo').innerHTML = `
      <img class="trab-det__foto" id="trab-det-foto" src="${src(fotos[0])}" alt="${esc(t.titulo)}">
      ${fotos.length > 1 ? `<div class="trab-det__miniaturas">${fotos.map((f, i) =>
        `<button type="button" data-foto="${esc(f)}" aria-label="Ver foto ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}><img src="${src(f)}" alt=""></button>`).join('')}</div>` : ''}
      <div class="trab-det__texto">
        <h3>${esc(t.titulo)}</h3>
        <dl class="result__det">${dados.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
        ${Array.isArray(t.tecnicas) && t.tecnicas.length ? `<ul class="trab-det__tecnicas">${t.tecnicas.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
        ${P.segmentos[t.segmento] ? '<button type="button" class="btn" id="trab-quero">Quero algo parecido</button>' : ''}
      </div>`;
    dlg.querySelectorAll('[data-foto]').forEach((b) => b.addEventListener('click', () => {
      $('#trab-det-foto').src = src(b.dataset.foto);
      dlg.querySelectorAll('[data-foto]').forEach((x) => x.removeAttribute('aria-current'));
      b.setAttribute('aria-current', 'true');
    }));
    const quero = $('#trab-quero');
    if (quero) quero.addEventListener('click', () => {
      dlg.close();
      window.PrimiciaSimulador.escolher(t.segmento, t.peca);
    });
    dlg.showModal();
  }
  $('#trab-det-fechar').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
})();
