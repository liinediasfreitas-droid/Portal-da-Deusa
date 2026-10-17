/*
  TRABALHOS DA PRIMÍCIA: o portfólio que aparece no site.

  Enquanto a lista estiver vazia, a seção "Feito na Primícia" fica escondida.
  Passo a passo completo em COMO-ADICIONAR-TRABALHO.md.

  Para adicionar um trabalho:
  1. Suba a foto em primicia/assets/img/trabalhos/ (nome sem espaço nem acento,
     ex.: ecobags-cafe-2026-10.jpg).
  2. Copie o modelo abaixo para dentro dos colchetes de TRABALHOS, tire as
     barras de comentário e troque os dados. Separe um trabalho do outro com vírgula.

  Modelo:
  {
    foto: 'ecobags-cafe-2026-10.jpg',
    fotosExtras: ['ecobags-cafe-lote.jpg', 'ecobags-cafe-detalhe.jpg'],
    titulo: 'Ecobags para cafeteria',
    segmento: 'criativa',
    peca: 'ecobag',
    quantidade: 40,
    prazoDias: 8,
    tecido: 'Lona crua',
    tecnicas: ['Costura reta', 'Alça reforçada', 'Etiqueta aplicada'],
    mes: '2026-10',
    cliente: ''
  }

  O que é cada campo:
  - foto: a foto principal (a que aparece no card).
  - fotosExtras: opcional. Lote inteiro, detalhe do acabamento, peça por dentro.
  - segmento: infantil, fitness, lingerie, casual, praia, uniformes ou criativa.
  - peca: o código da peça em precos.js (ex.: legging, ecobag, necessaire).
    Liga o botão "Quero algo parecido" ao simulador. Se não souber, deixe ''.
  - quantidade e prazoDias: números, sem aspas. Se não souber, deixe 0.
  - mes: ano-mês da entrega (ex.: '2026-10'). Os mais recentes aparecem primeiro.
  - cliente: só preencha com autorização do cliente. Senão, deixe ''.
*/
window.TRABALHOS = [
];
