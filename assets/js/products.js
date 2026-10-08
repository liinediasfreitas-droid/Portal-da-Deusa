// Fonte única dos produtos do protótipo. Preços só onde a cliente informou.
const CATEGORIAS = [
  { id: 'banhos', nome: 'Banhos Planetários', desc: 'Ervas ligadas a cada planeta e dia da semana.' },
  { id: 'garrafadas', nome: 'Garrafadas', desc: 'Plantas medicinais e sabedoria ancestral.' },
  { id: 'chas', nome: 'Chás Encantados', desc: 'Infusões botânicas com intenção.' },
  { id: 'cuidados', nome: 'Cuidados e Aromas', desc: 'Sabonetes, sprays e águas rituais.' },
];

const PRODUTOS = [
  {
    id: 'banho-sol', cat: 'banhos', nome: 'Banho Planetário Sol', img: 'banho-sol.jpg',
    tag: 'Domingo · Vitalidade · Luz', preco: 'R$ 50,00',
    resumo: 'Ativa a luz interior, renova a energia e fortalece a presença.',
    ervas: ['Alecrim', 'Calêndula', 'Louro', 'Erva de São João', 'Girassol', 'Casca de Laranja', 'Manjericão'],
    uso: 'Domingo, pela manhã. Intenção: vitalidade, clareza e sucesso.',
  },
  {
    id: 'banho-lua', cat: 'banhos', nome: 'Banho Planetário Lua', img: 'banho-lua.jpg',
    tag: 'Segunda-feira · Intuição · Emoções', preco: 'R$ 50,00',
    resumo: 'Harmoniza as emoções, acalma a mente e desperta a intuição.',
    ervas: ['Rosa Branca', 'Melissa', 'Artemísia', 'Malva', 'Amora'],
    uso: 'Segunda-feira, à noite (após 18h). Intenção: intuição e equilíbrio emocional.',
  },
  {
    id: 'banho-marte', cat: 'banhos', nome: 'Banho Planetário Marte', img: 'banho-marte.jpg',
    tag: 'Terça-feira · Ação · Coragem', preco: 'R$ 50,00',
    resumo: 'Quebra estagnações, protege, revigora e desperta a energia vital.',
    ervas: ['Manjericão Roxo', 'Pimenta Rosa', 'Hortelã-Pimenta', 'Gengibre', 'Espinheira-Santa'],
    uso: 'Terça-feira, pela manhã. Intenção: ação, coragem e proteção.',
  },
  {
    id: 'banho-mercurio', cat: 'banhos', nome: 'Banho Planetário Mercúrio', img: 'banho-mercurio.jpg',
    tag: 'Quarta-feira · Inteligência · Comunicação', preco: 'R$ 50,00',
    resumo: 'Clareza de ideias, foco, fluidez na comunicação e aprendizado.',
    ervas: ['Tomilho', 'Sálvia', 'Capim-Limão', 'Lavanda', 'Erva-Doce'],
    uso: 'Quarta-feira, pela manhã. Intenção: clareza mental, estudo e comunicação.',
  },
  {
    id: 'banho-jupiter', cat: 'banhos', nome: 'Banho Planetário Júpiter', img: 'banho-jupiter.jpg',
    tag: 'Quinta-feira · Expansão · Sabedoria', preco: 'R$ 50,00',
    resumo: 'Abre portas, atrai prosperidade e eleva a consciência.',
    ervas: ['Louro', 'Dente de Leão', 'Cravo', 'Canela', 'Erva-Doce'],
    uso: 'Quinta-feira, pela manhã. Intenção: expansão, prosperidade e sabedoria.',
  },
  {
    id: 'banho-venus', cat: 'banhos', nome: 'Banho Planetário Vênus', img: null, breve: true,
    tag: 'Sexta-feira · Amor · Beleza', preco: null,
    resumo: 'Em breve.', ervas: [], uso: '',
  },
  {
    id: 'banho-saturno', cat: 'banhos', nome: 'Banho Planetário Saturno', img: null, breve: true,
    tag: 'Sábado · Estrutura · Proteção', preco: null,
    resumo: 'Em breve.', ervas: [], uso: '',
  },
  {
    id: 'garrafada-afrodite', cat: 'garrafadas', nome: 'Garrafada da Deusa Afrodite', img: 'garrafada-afrodite.jpg',
    tag: 'Beleza de dentro para fora', preco: null,
    resumo: 'Cuida da pele, do cabelo e da autoestima, para a mulher que reconhece a própria beleza.',
    ervas: ['Farinha de Uva', 'Rosa Vermelha', 'Cardamomo', 'Dente de Leão', 'Maçã'],
    uso: 'De brinde, cardápio segundo a MTC da estação.',
  },
  {
    id: 'garrafada-desinflamacao', cat: 'garrafadas', nome: 'Garrafada Desinflamação do Corpo', img: 'garrafada-desinflamacao.jpg',
    tag: 'Entrada da primavera', preco: null,
    resumo: 'Criada para desinflamar, aumentar a imunidade e melhorar a digestão.',
    ervas: ['Ipê-roxo', 'Barbatimão', 'Manjerona', 'Anis-estrelado'],
    uso: 'De brinde, cardápio segundo a MTC da estação.',
  },
  {
    id: 'garrafada-desparasitacao', cat: 'garrafadas', nome: 'Garrafada Desparasitação', img: 'garrafada-desparasitacao.jpg',
    tag: 'Limpeza e equilíbrio', preco: null,
    resumo: 'Plantas que auxiliam na limpeza interna e no equilíbrio do organismo.',
    ervas: ['Cravo', 'Mastruz', 'Agoniada', 'Açafrão'],
    uso: 'De brinde, cardápio segundo a MTC da estação.',
  },
  {
    id: 'garrafada-mulher-40', cat: 'garrafadas', nome: 'Garrafada da Mulher 40+', img: 'garrafada-mulher-40.jpg',
    tag: 'Perimenopausa · Menopausa · Vitalidade', preco: null,
    resumo: 'Nutre, equilibra e fortalece o corpo da mulher em todas as fases da vida.',
    ervas: ['Maca Peruana', 'Linhaça', 'Açafrão', 'Amora', 'Louro', 'Feno Grego', 'Artemísia', 'Ginseng', 'Farinha de Uva'],
    uso: 'De brinde, cardápio segundo a MTC da estação.',
  },
  {
    id: 'garrafadas-medicinais', cat: 'garrafadas', nome: 'Garrafadas Personalizadas', img: 'garrafadas-medicinais.jpg',
    tag: 'Plantas que curam, fé que protege', preco: null,
    resumo: 'Menopausa, adenomiose, endometriose, fibromialgia, dores musculares, cistite, gastrite, diabetes, gordura no fígado, depressão, enxaqueca, dom da reza, alinhamento mediúnico e muito mais.',
    ervas: [], uso: '',
  },
  {
    id: 'cha-do-sol', cat: 'chas', nome: 'Chá do Sol', img: 'cha-do-sol.jpg',
    tag: 'Vitalidade · Alegria · Presença', preco: null,
    resumo: 'Infusão botânica para nutrir a energia, despertar a vitalidade e iluminar o dia. Lata de 100 ml.',
    ervas: ['Calêndula', 'Casca de Laranja', 'Erva-Cidreira', 'Hibisco'], uso: '',
  },
  {
    id: 'agua-florida', cat: 'cuidados', nome: 'Água Florida', img: 'agua-florida.jpg',
    tag: 'Purificação · Proteção · Magnetismo', preco: null,
    resumo: 'Spray de 60 ml com ervas, resinas, flores e óleos essenciais.',
    ervas: ['Copal', 'Palo Santo', 'Anis Estrelado', 'Casca de Laranja', 'Canela', 'Rosas'], uso: '',
  },
  {
    id: 'sabonetes', cat: 'cuidados', nome: 'Sabonetes Artesanais', img: 'sabonetes.jpg',
    tag: 'Feitos à mão', preco: null,
    resumo: 'Sabonetes artesanais com a árvore da vida em relevo.', ervas: [], uso: '',
  },
  {
    id: 'sprays-ervas', cat: 'cuidados', nome: 'Sprays de Ervas', img: 'spray-ervas.jpg',
    tag: 'Aromas e limpeza energética', preco: null,
    resumo: 'Sprays com folhas frescas em infusão, como o Spray de Alecrim.', ervas: [], uso: '',
  },
];
