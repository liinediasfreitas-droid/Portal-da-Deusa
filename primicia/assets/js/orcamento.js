(function () {
  const P = window.PRECOS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const form = $('#wiz');
  const TOTAL_ETAPAS = 5;
  let etapa = 1;
  let foto = null;
  let fotoUrl = null;

  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const faixa = ([a, b]) => (a === b ? brl.format(a) : `${brl.format(a)} a ${brl.format(b)}`);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const waLink = (texto) => `https://wa.me/${P.whatsapp}?text=${encodeURIComponent(texto)}`;

  // Tema claro/escuro (sem escolha salva, segue o sistema)
  const root = document.documentElement;
  const nav = $('.top nav');
  const temaBtn = document.createElement('button');
  temaBtn.className = 'theme'; temaBtn.type = 'button';
  const escuro = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const syncTema = () => {
    temaBtn.textContent = escuro() ? '☀' : '☾';
    temaBtn.setAttribute('aria-label', escuro() ? 'Mudar para versão clara' : 'Mudar para versão escura');
  };
  temaBtn.addEventListener('click', () => {
    root.dataset.theme = escuro() ? 'light' : 'dark';
    try { localStorage.setItem('tema-primicia', root.dataset.theme); } catch (e) {}
    syncTema();
  });
  nav.append(temaBtn); syncTema();

  // Links gerais de WhatsApp
  $$('[data-wa]').forEach((a) => (a.href = waLink('Olá, Eliane! Vim pelo site da Primícia e queria conversar sobre uma produção.')));

  // Segmentos: cards da seção "Para quem" e opções da etapa 1
  const chip = (name, value, html, checked) =>
    `<label class="chip"><input type="radio" name="${name}" value="${value}"${checked ? ' checked' : ''}><span>${html}</span></label>`;

  $('#segs').innerHTML = Object.entries(P.segmentos).map(([id, s]) =>
    `<button type="button" class="seg${id === 'criativa' ? ' seg--destaque' : ''}" data-seg="${id}">
      <h3>${s.nome}</h3><p>${s.chamada}</p><span>Simular →</span>
    </button>`).join('');
  $('#opt-seg').innerHTML = Object.entries(P.segmentos).map(([id, s]) => chip('seg', id, s.nome)).join('');
  $('#opt-detalhe').innerHTML = Object.entries(P.detalhe).map(([id, d], i) =>
    chip('detalhe', id, `${d.nome}<small>${d.dica}</small>`, i === 0)).join('');

  const valor = (name) => (form.elements[name] ? form.elements[name].value : '');
  const inteiro = (name) => parseInt(valor(name), 10);
  const segAtual = () => P.segmentos[valor('seg')];

  function montarSegmento() {
    const s = segAtual();
    if (!s) return;
    $('#pecas-box').hidden = false;
    $('#opt-peca').innerHTML = Object.entries(s.pecas).map(([id, p]) => chip('peca', id, p.nome)).join('');
    $('#opt-tecido').innerHTML = Object.entries(s.tecidos).map(([id, t]) => chip('tecido', id, t.nome)).join('') +
      chip('tecido', 'indefinido', 'Ainda não sei');
    $('#tamanhos-field').hidden = !s.grade;
    const qtd = form.elements.qtd;
    if (s.pedidoMinimo === 1 && qtd.value === '30') qtd.value = '10';
    if (s.pedidoMinimo > 1 && inteiro('qtd') < s.pedidoMinimo && qtd.dataset.mexido !== '1') qtd.value = '30';
    avisoMinimo();
  }

  function avisoMinimo() {
    const s = segAtual();
    const el = $('#aviso-minimo');
    const qtd = inteiro('qtd');
    el.hidden = !(s && qtd > 0 && qtd < s.pedidoMinimo);
    if (!el.hidden) {
      el.textContent = `O pedido mínimo em ${s.nome.toLowerCase()} é de ${s.pedidoMinimo} peças por modelo. ` +
        `Abaixo disso a Eliane avalia caso a caso e a costura fica cerca de ${Math.round(P.acrescimoAbaixoMinimo * 100)}% mais cara.`;
    }
  }

  form.addEventListener('change', (e) => {
    if (e.target.name === 'seg') montarSegmento();
    if (e.target.name === 'compra') $('#tecidos-box').hidden = valor('compra') !== 'primicia';
    erro('');
  });
  form.elements.qtd.addEventListener('input', (e) => { e.target.dataset.mexido = '1'; avisoMinimo(); });

  // Foto de referência (fica no aparelho até a pessoa compartilhar)
  const fotoInput = $('#foto');
  fotoInput.addEventListener('change', () => {
    const f = fotoInput.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { erro('Escolha um arquivo de imagem (foto, print ou desenho).'); fotoInput.value = ''; return; }
    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    foto = f; fotoUrl = URL.createObjectURL(f);
    const img = $('#foto-preview');
    img.src = fotoUrl; img.hidden = false;
    $('#upload').classList.add('tem-foto');
    $('#foto-remover').hidden = false;
  });
  $('#foto-remover').addEventListener('click', () => {
    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    foto = null; fotoUrl = null; fotoInput.value = '';
    $('#foto-preview').hidden = true;
    $('#upload').classList.remove('tem-foto');
    $('#foto-remover').hidden = true;
  });

  // Navegação entre etapas
  function erro(msg) { const el = $('#wiz-erro'); el.textContent = msg; el.hidden = !msg; }

  function validar(n) {
    if (n === 1) {
      if (!valor('seg')) return 'Escolha o tipo de produção.';
      if (!valor('peca')) return 'Escolha a peça.';
    }
    if (n === 2 && valor('compra') === 'primicia' && !valor('tecido')) return 'Escolha o tecido ou marque "Ainda não sei".';
    if (n === 3) {
      const modelos = inteiro('modelos'), qtd = inteiro('qtd'), tam = inteiro('tamanhos');
      if (!(modelos >= 1 && modelos <= 20)) return 'Informe de 1 a 20 modelos.';
      if (!(qtd >= 1 && qtd <= 5000)) return 'Informe quantas peças por modelo (de 1 a 5000).';
      if (segAtual().grade && !(tam >= 1 && tam <= 10)) return 'Informe de 1 a 10 tamanhos.';
    }
    if (n === 5 && !valor('nome').trim()) return 'Diga seu nome para a Eliane saber com quem está falando.';
    return '';
  }

  function irPara(n) {
    etapa = n;
    $$('.step', form).forEach((f) => (f.hidden = Number(f.dataset.step) !== n));
    $('#wiz-bar').style.width = `${(n / TOTAL_ETAPAS) * 100}%`;
    $('#wiz-label').textContent = `Etapa ${n} de ${TOTAL_ETAPAS}`;
    $('#wiz-voltar').hidden = n === 1;
    $('#wiz-seguir').textContent = n === TOTAL_ETAPAS ? 'Ver minha estimativa' : 'Continuar';
    erro('');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = validar(etapa);
    if (msg) { erro(msg); return; }
    if (etapa < TOTAL_ETAPAS) {
      irPara(etapa + 1);
      form.scrollIntoView({ block: 'start' });
      const primeiro = $(`.step[data-step="${etapa}"] input:not([type=hidden]), .step[data-step="${etapa}"] textarea`, form);
      if (primeiro && etapa === 5) primeiro.focus({ preventScroll: true });
    } else {
      mostrarResultado();
    }
  });
  $('#wiz-voltar').addEventListener('click', () => irPara(etapa - 1));

  // Abre o simulador já com o segmento (e, se vier, a peça) marcado
  function escolher(seg, peca) {
    const r = $(`#opt-seg input[value="${seg}"]`);
    if (!r) return;
    r.checked = true; montarSegmento();
    const p = peca && $(`#opt-peca input[value="${peca}"]`);
    if (p) p.checked = true;
    $('#result').hidden = true; form.hidden = false; irPara(1);
    $('#orcamento').scrollIntoView({ block: 'start' });
  }
  window.PrimiciaSimulador = { escolher };
  $$('#segs .seg').forEach((b) => b.addEventListener('click', () => escolher(b.dataset.seg)));

  // Cálculo da estimativa
  function calcular() {
    const s = segAtual();
    const peca = s.pecas[valor('peca')];
    const modelos = inteiro('modelos');
    const qtd = inteiro('qtd');
    const total = modelos * qtd;
    const tamanhos = s.grade ? inteiro('tamanhos') : 1;
    const det = P.detalhe[valor('detalhe')] || P.detalhe.simples;
    const compraPrimicia = valor('compra') === 'primicia';
    const tecido = s.tecidos[valor('tecido')];
    const temMolde = form.elements.temMolde.checked;

    const desconto = P.descontoTiragem.filter((f) => total >= f.aPartirDe).pop().desconto;
    const abaixo = qtd < s.pedidoMinimo;
    const acrescimo = abaixo ? P.acrescimoAbaixoMinimo : 0;
    const fatorTecido = tecido ? tecido.fator : 1;

    const porPeca = [0, 1].map((i) => {
      const mo = peca.maoDeObra[i] * det.fator * (1 - desconto) * (1 + acrescimo);
      const tec = compraPrimicia ? peca.tecido[i] * fatorTecido : 0;
      return Math.round(mo + tec);
    });
    const modelagem = temMolde ? [0, 0] : s.modelagemPiloto.map((v) => v * modelos);
    const graduacao = s.grade && tamanhos > 1 ? P.graduacaoPorTamanho.map((v) => v * (tamanhos - 1) * modelos) : [0, 0];
    const totalGeral = [0, 1].map((i) => Math.round((porPeca[i] * total + modelagem[i] + graduacao[i]) / 10) * 10);

    // Prazo em dias úteis: peça-piloto + produção (capacidade semanal, ajustada pelo detalhe)
    const diasProducao = (total * det.fator / P.capacidadeSemanal) * 5;
    const piloto = temMolde ? [0, 0] : s.pilotoDias;
    const dias = [Math.ceil(piloto[0] + diasProducao), Math.ceil(piloto[1] + diasProducao * 1.3) + 2];
    const prazo = dias[1] <= 15 ? `${dias[0]} a ${dias[1]} dias úteis` : `${Math.ceil(dias[0] / 5)} a ${Math.ceil(dias[1] / 5)} semanas`;
    const loteGrande = total > P.capacidadeSemanal * 8;

    return { s, peca, modelos, qtd, total, tamanhos, det, compraPrimicia, tecido, temMolde, desconto, abaixo,
      porPeca, modelagem, graduacao, totalGeral, prazo, loteGrande };
  }

  function textoTecido(r) {
    if (!r.compraPrimicia) return 'Eu forneço o tecido';
    return `${r.tecido ? r.tecido.nome : 'A definir'} (a Primícia compra)`;
  }

  function mensagem(r, fotoAnexada) {
    const linhas = [
      'Olá, Eliane! Fiz a simulação no site da Primícia.',
      '',
      `*Nome:* ${valor('nome').trim()}`
    ];
    if (valor('marca').trim()) linhas.push(`*Marca:* ${valor('marca').trim()}`);
    if (valor('cidade').trim()) linhas.push(`*Cidade:* ${valor('cidade').trim()}`);
    linhas.push('',
      `*Segmento:* ${r.s.nome}`,
      `*Peça:* ${r.peca.nome}`,
      `*Tecido:* ${textoTecido(r)}`,
      `*Quantidade:* ${r.modelos > 1 ? `${r.modelos} modelos × ${r.qtd} peças = ${r.total} peças` : `${r.total} peça${r.total > 1 ? 's' : ''}`}`);
    if (r.s.grade) linhas.push(`*Tamanhos:* ${r.tamanhos}`);
    linhas.push(`*Detalhe:* ${r.det.nome}`,
      `*Molde:* ${r.temMolde ? 'Já tenho molde ou peça-piloto' : 'Preciso de modelagem e peça-piloto'}`);
    if (valor('obs').trim()) linhas.push(`*Observações:* ${valor('obs').trim()}`);
    linhas.push('',
      `*Estimativa do site:* ${faixa(r.porPeca)} por peça · total ${faixa(r.totalGeral)} · prazo ${r.prazo}`);
    if (foto && !fotoAnexada) linhas.push('', 'Tenho uma foto de referência e vou enviar aqui na conversa.');
    if (!foto) linhas.push('', 'Ainda não enviei foto de referência.');
    return linhas.join('\n');
  }

  let ultimo = null;
  function mostrarResultado() {
    const r = calcular();
    ultimo = r;
    $('#r-titulo').textContent = `${r.total} × ${r.peca.nome}`;
    $('#r-peca').textContent = faixa(r.porPeca);
    $('#r-total').textContent = faixa(r.totalGeral);
    $('#r-prazo').textContent = r.prazo;

    const det = [
      ['Segmento', r.s.nome],
      ['Tecido', textoTecido(r)],
      ['Detalhe', r.det.nome]
    ];
    if (!r.temMolde) det.push(['Modelagem e peça-piloto', `${faixa(r.modelagem)} (uma vez${r.modelos > 1 ? `, ${r.modelos} modelos` : ''})`]);
    if (r.graduacao[1] > 0) det.push(['Graduação de tamanhos', faixa(r.graduacao)]);
    if (r.desconto) det.push(['Desconto de lote', `${Math.round(r.desconto * 100)}% na costura`]);
    if (r.abaixo) det.push(['Pequena tiragem', `abaixo do mínimo de ${r.s.pedidoMinimo} peças: costura +${Math.round(P.acrescimoAbaixoMinimo * 100)}%`]);
    if (r.loteGrande) det.push(['Lote grande', 'produzido com a equipe de costureiras; o prazo final é combinado na conversa']);
    $('#r-det').innerHTML = det.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');

    const podeCompartilhar = foto && navigator.canShare && navigator.canShare({ files: [foto] });
    $('#enviar').textContent = podeCompartilhar ? 'Enviar com a foto' : 'Enviar pelo WhatsApp';
    $('#enviar-wa').hidden = !podeCompartilhar;
    $('#enviar-wa').href = waLink(mensagem(r, false));
    $('#enviar-dica').hidden = true;

    form.hidden = true;
    const box = $('#result');
    box.hidden = false;
    box.scrollIntoView({ block: 'start' });
    box.focus({ preventScroll: true });
  }

  function dica(msg) { const el = $('#enviar-dica'); el.textContent = msg; el.hidden = !msg; }

  async function copiar(texto) {
    try { await navigator.clipboard.writeText(texto); return true; } catch (e) {
      const t = document.createElement('textarea');
      t.value = texto; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.append(t); t.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) {}
      t.remove();
      return ok;
    }
  }

  $('#enviar').addEventListener('click', async () => {
    const r = ultimo;
    if (foto && navigator.canShare && navigator.canShare({ files: [foto] })) {
      const texto = mensagem(r, true);
      // Alguns aplicativos descartam o texto quando vai junto com a foto: deixa copiado por garantia.
      const copiado = await copiar(texto);
      dica(`Escolha o WhatsApp e a conversa com a Primícia, (67) 99289-5088.${copiado ? ' Se o texto não aparecer, é só colar: ele já está copiado.' : ''}`);
      try { await navigator.share({ files: [foto], text: texto }); } catch (e) {
        if (e.name !== 'AbortError') window.open(waLink(mensagem(r, false)), '_blank', 'noopener');
      }
      return;
    }
    window.open(waLink(mensagem(r, false)), '_blank', 'noopener');
    dica(foto ? 'Abrimos a conversa com o resumo. Agora é só anexar a sua foto de referência por lá.' : 'Abrimos a conversa com o resumo no WhatsApp.');
  });

  $('#copiar').addEventListener('click', async () => {
    dica((await copiar(mensagem(ultimo, false))) ? 'Resumo copiado.' : 'Não deu para copiar automaticamente neste navegador.');
  });

  $('#refazer').addEventListener('click', () => {
    $('#result').hidden = true;
    form.hidden = false;
    irPara(1);
    form.scrollIntoView({ block: 'start' });
  });

  irPara(1);
})();
