# Como colocar um trabalho novo no site

A seção **"Feito na Primícia"** só aparece no site depois que existe pelo menos um trabalho cadastrado.

## 1. Fotografe antes de entregar

Faça três fotos de cada trabalho, **antes** de o pacote sair:

1. **O lote inteiro junto**, todas as peças dobradas ou penduradas lado a lado. É essa foto que mostra para uma marca que a Eliane dá conta de produzir.
2. **Uma peça sozinha**, bem arrumada. Essa vira a foto principal.
3. **O acabamento de perto**: costura, barra, a peça do avesso. É aí que aparecem os 48 anos de experiência.

Para as fotos ficarem boas:
- Use luz de janela, sem flash.
- Ponha a peça em fundo liso: parede clara, lençol branco esticado ou papel pardo.
- Passe a peça antes. Peça amassada parece descuido.
- Prefira foto quadrada (o card do site corta a imagem em quadrado).
- Peça de marca de cliente só vai para o site **com autorização dele**.

## 2. Diminua o tamanho das fotos

Foto direto do celular pesa 3 a 5 MB e deixa o site lento. Para diminuir sem esforço, mande a foto para você mesma no WhatsApp e salve a que voltou: ela fica com uns 200 KB.

Dê nomes simples aos arquivos, sem espaço, sem acento e com letras minúsculas. Exemplos:
`ecobags-cafe-2026-10.jpg`, `ecobags-cafe-lote.jpg`, `ecobags-cafe-detalhe.jpg`

## 3. Coloque no site pelo GitHub (pelo celular ou pelo computador)

1. Abra o repositório e entre na pasta `primicia/assets/img/trabalhos/`.
2. Toque em **Add file → Upload files**, escolha as fotos e salve (**Commit changes**).
3. Abra o arquivo `primicia/assets/js/trabalhos.js` e toque no lápis (**Edit**).
4. Copie o **Modelo** que está no topo do arquivo e cole entre os colchetes de `window.TRABALHOS = [` e `];`. Apague as barras do comentário.
5. Troque os dados: nome dos arquivos de foto, título, quantidade, prazo, tecido, técnicas e mês.
6. Se já houver outro trabalho na lista, coloque uma **vírgula** entre o `}` de um e o `{` do próximo.
7. Salve (**Commit changes**). Em poucos minutos o site mostra o trabalho novo.

Os erros mais comuns: esquecer a vírgula entre dois trabalhos, ou escrever o nome do arquivo diferente do que foi enviado. Se a seção sumir depois de uma edição, é quase sempre um desses dois.

## 4. Ou mande para a Claude publicar

Mande no chat as fotos e estas informações:
- o que é a peça e para quem foi;
- quantas peças foram e em quantos dias ficaram prontas;
- o tecido e as técnicas usadas;
- se o cliente autorizou aparecer o nome dele.

A Claude ajusta as fotos e publica.
