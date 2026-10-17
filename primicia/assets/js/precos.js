/*
  TABELA DE PREÇOS DA PRIMÍCIA. Este é o único arquivo que precisa ser corrigido.

  ATENÇÃO: todos os valores abaixo são SUGESTÕES iniciais (palpites de mercado
  para um ateliê pequeno). A Eliane precisa conferir e trocar pelos valores dela.

  Como ler:
  - maoDeObra: [mínimo, máximo] em R$ por peça, só a costura.
  - tecido: [mínimo, máximo] em R$ por peça, gasto de tecido e aviamentos
    quando a Primícia compra o material. Esse valor é multiplicado pelo
    "fator" do tecido escolhido (1 = tecido comum; 1.5 = 50% mais caro).
  - Para mudar um preço, troque só os números. Mantenha vírgulas e colchetes.
*/
window.PRECOS = {
  whatsapp: '5567992895088',
  email: 'primicia.eliane@outlook.com',

  // Peças que a Eliane consegue costurar por semana em um modelo simples.
  capacidadeSemanal: 60,

  // Desconto na mão de obra conforme o tamanho do lote (total de peças).
  descontoTiragem: [
    { aPartirDe: 1, desconto: 0 },
    { aPartirDe: 30, desconto: 0.05 },
    { aPartirDe: 60, desconto: 0.10 },
    { aPartirDe: 100, desconto: 0.15 }
  ],

  // Abaixo do pedido mínimo, a mão de obra sobe este percentual.
  acrescimoAbaixoMinimo: 0.30,

  // Multiplica a mão de obra conforme o nível de detalhe da peça.
  detalhe: {
    simples: { nome: 'Simples', fator: 1, dica: 'Poucas costuras, sem recortes nem aplicações.' },
    medio: { nome: 'Médio', fator: 1.25, dica: 'Recortes, bolsos, elástico, viés ou forro.' },
    elaborado: { nome: 'Elaborado', fator: 1.5, dica: 'Muitos recortes, bojo, renda, babados, acabamento fino.' }
  },

  // Graduação: R$ por tamanho a mais (por modelo). Ex.: P, M e G = 2 tamanhos a mais.
  graduacaoPorTamanho: [40, 70],

  segmentos: {
    infantil: {
      nome: 'Infantil',
      chamada: 'Bodies, vestidos, conjuntos e pijamas com acabamento macio.',
      pedidoMinimo: 20,
      grade: true,
      modelagemPiloto: [180, 300],
      pilotoDias: [7, 10],
      pecas: {
        body: { nome: 'Body de bebê', maoDeObra: [16, 26], tecido: [8, 14] },
        vestido: { nome: 'Vestido infantil', maoDeObra: [30, 55], tecido: [14, 26] },
        conjunto: { nome: 'Conjunto infantil', maoDeObra: [28, 48], tecido: [14, 24] },
        pijama: { nome: 'Pijama infantil', maoDeObra: [24, 40], tecido: [12, 22] }
      },
      tecidos: {
        malha: { nome: 'Malha de algodão', fator: 1 },
        tricoline: { nome: 'Tricoline', fator: 1 },
        moletinho: { nome: 'Moletinho', fator: 1.2 },
        linho: { nome: 'Linho', fator: 1.6 }
      }
    },
    fitness: {
      nome: 'Fitness',
      chamada: 'Leggings, tops, shorts e conjuntos em tecidos com elastano.',
      pedidoMinimo: 20,
      grade: true,
      modelagemPiloto: [180, 320],
      pilotoDias: [7, 10],
      pecas: {
        legging: { nome: 'Legging', maoDeObra: [20, 32], tecido: [16, 26] },
        top: { nome: 'Top', maoDeObra: [16, 28], tecido: [8, 14] },
        short: { nome: 'Short', maoDeObra: [16, 26], tecido: [10, 16] },
        conjunto: { nome: 'Conjunto (top + legging ou short)', maoDeObra: [34, 56], tecido: [24, 38] }
      },
      tecidos: {
        suplex: { nome: 'Suplex', fator: 1 },
        poliamida: { nome: 'Poliamida', fator: 1.3 },
        dryfit: { nome: 'Dry fit', fator: 0.9 }
      }
    },
    lingerie: {
      nome: 'Lingerie',
      chamada: 'Calcinhas, sutiãs, conjuntos e camisolas com delicadeza.',
      pedidoMinimo: 20,
      grade: true,
      modelagemPiloto: [200, 350],
      pilotoDias: [7, 12],
      pecas: {
        calcinha: { nome: 'Calcinha', maoDeObra: [12, 22], tecido: [5, 10] },
        sutia: { nome: 'Sutiã ou top', maoDeObra: [22, 40], tecido: [10, 18] },
        conjunto: { nome: 'Conjunto (sutiã + calcinha)', maoDeObra: [32, 58], tecido: [15, 26] },
        camisola: { nome: 'Camisola ou pijama', maoDeObra: [28, 48], tecido: [16, 28] }
      },
      tecidos: {
        microfibra: { nome: 'Microfibra', fator: 1 },
        renda: { nome: 'Renda', fator: 1.4 },
        algodao: { nome: 'Algodão com elastano', fator: 0.9 },
        tule: { nome: 'Tule', fator: 1.1 }
      }
    },
    casual: {
      nome: 'Moda casual',
      chamada: 'Camisetas, blusas, vestidos, calças e saias para o dia a dia.',
      pedidoMinimo: 20,
      grade: true,
      modelagemPiloto: [180, 320],
      pilotoDias: [7, 10],
      pecas: {
        camiseta: { nome: 'Camiseta', maoDeObra: [18, 28], tecido: [12, 20] },
        blusa: { nome: 'Blusa', maoDeObra: [24, 40], tecido: [12, 22] },
        vestido: { nome: 'Vestido', maoDeObra: [38, 70], tecido: [22, 40] },
        calca: { nome: 'Calça', maoDeObra: [38, 65], tecido: [24, 42] },
        saia: { nome: 'Saia', maoDeObra: [26, 45], tecido: [14, 26] }
      },
      tecidos: {
        malha: { nome: 'Malha de algodão', fator: 1 },
        viscose: { nome: 'Viscose', fator: 1 },
        crepe: { nome: 'Crepe', fator: 1.1 },
        jeans: { nome: 'Jeans', fator: 1.4 },
        linho: { nome: 'Linho', fator: 1.6 }
      }
    },
    praia: {
      nome: 'Moda praia',
      chamada: 'Biquínis, maiôs e saídas de praia.',
      pedidoMinimo: 20,
      grade: true,
      modelagemPiloto: [200, 340],
      pilotoDias: [7, 12],
      pecas: {
        biquini: { nome: 'Biquíni', maoDeObra: [26, 45], tecido: [10, 18] },
        maio: { nome: 'Maiô', maoDeObra: [32, 55], tecido: [14, 24] },
        saida: { nome: 'Saída de praia', maoDeObra: [28, 50], tecido: [16, 30] }
      },
      tecidos: {
        lycra: { nome: 'Lycra de praia', fator: 1 },
        uv: { nome: 'Lycra com proteção UV', fator: 1.3 }
      }
    },
    uniformes: {
      nome: 'Uniformes',
      chamada: 'Polos, jalecos, aventais e camisetas para equipes.',
      pedidoMinimo: 20,
      grade: true,
      modelagemPiloto: [150, 280],
      pilotoDias: [5, 8],
      pecas: {
        polo: { nome: 'Camisa polo', maoDeObra: [24, 38], tecido: [16, 26] },
        jaleco: { nome: 'Jaleco', maoDeObra: [40, 70], tecido: [26, 42] },
        avental: { nome: 'Avental', maoDeObra: [16, 28], tecido: [10, 18] },
        camiseta: { nome: 'Camiseta', maoDeObra: [18, 28], tecido: [12, 20] }
      },
      tecidos: {
        piquet: { nome: 'Piquet', fator: 1 },
        gabardine: { nome: 'Gabardine', fator: 1.1 },
        brim: { nome: 'Brim', fator: 1 },
        pv: { nome: 'Malha PV', fator: 0.9 }
      }
    },
    criativa: {
      nome: 'Costura criativa',
      chamada: 'Nécessaires, ecobags, bolsas, naninhas, kits e brindes. A partir de 1 peça.',
      pedidoMinimo: 1,
      grade: false,
      modelagemPiloto: [60, 150],
      pilotoDias: [3, 7],
      pecas: {
        necessaire: { nome: 'Nécessaire', maoDeObra: [18, 35], tecido: [8, 16] },
        ecobag: { nome: 'Ecobag', maoDeObra: [15, 28], tecido: [8, 15] },
        bolsa: { nome: 'Bolsa de tecido', maoDeObra: [45, 90], tecido: [20, 40] },
        almofada: { nome: 'Almofada', maoDeObra: [25, 45], tecido: [12, 24] },
        naninha: { nome: 'Naninha ou boneca de pano', maoDeObra: [35, 60], tecido: [10, 20] },
        kitMaternidade: { nome: 'Kit maternidade', maoDeObra: [120, 220], tecido: [50, 90] },
        brinde: { nome: 'Brinde personalizado', maoDeObra: [12, 30], tecido: [5, 12] }
      },
      tecidos: {
        tricoline: { nome: 'Tricoline estampada', fator: 1 },
        lona: { nome: 'Lona ou sarja', fator: 1.2 },
        linho: { nome: 'Linho', fator: 1.5 },
        feltro: { nome: 'Feltro', fator: 0.9 },
        plush: { nome: 'Plush ou soft', fator: 1.2 }
      }
    }
  }
};
