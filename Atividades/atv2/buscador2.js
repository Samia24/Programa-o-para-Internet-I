import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

// Objeto para armazenar o conteúdo das páginas visitadas
const paginasArmazenadas = {};
// Objeto para registrar se uma página já foi visitada
const paginasVisitadas = {};

// Função assíncrona que faz o "crawler" (varredura) de uma página
async function crawlPagina(url) {
  // Verifica se a página já foi visitada
  if (paginasVisitadas[url]) {
    return; // Se já foi, encerra a função
  }
  // Marca a página como visitada
  paginasVisitadas[url] = true;

  try {
    // Faz a requisição HTTP para obter o conteúdo da página
    const resposta = await axios.get(url);
    const html = resposta.data; // Armazena o HTML da resposta
    const $ = cheerio.load(html); // Carrega o HTML no cheerio para manipulação
    const links = []; // Lista para armazenar os links encontrados na página

    // Seleciona todas as tags <a> da página
    const tags = $('a');
    for (let i = 0; i < tags.length; i++) {
      const href = tags[i].attribs['href']; // Pega o atributo href da tag. Ex: /matrix.html
      if (href) {
        const urlAbsoluta = new URL(href, url).href; // Converte para URL absoluta
        links[links.length] = urlAbsoluta; // Adiciona na lista de links
      }
    }

    // Armazena o HTML e os links encontrados para a URL atual
    paginasArmazenadas[url] = { html, links };

    // Chama recursivamente a função para cada link encontrado
    for (let i = 0; i < links.length; i++) {
      await crawlPagina(links[i]);
    }
  } catch (erro) {
    // Caso ocorra erro na requisição, exibe no console
    console.error(`Erro ao acessar a página ${url}: ${erro.message}`);
  }
}

// Função que salva as páginas armazenadas em um arquivo JSON
function salvarEmArquivoJSON() {
  const estruturaFormatada = { paginas: [] }; // Estrutura final a ser salva
  const entradas = Object.entries(paginasArmazenadas); /* Converte o objeto para array de pares chave/valor,
  onde, a chave é a url da página e valor o conteúdo html + links relacionados*/

  for (let i = 0; i < entradas.length; i++) {
    const url = entradas[i][0];  // a chave -> URL da página
    const html = entradas[i][1].html; // o conteúdo HTML da página
    const links = entradas[i][1].links; // os links extraídos da página
    // Adiciona um novo objeto no array paginas (que está dentro de estruturaFormatada)
    estruturaFormatada.paginas[estruturaFormatada.paginas.length] = {
      Pagina: url,
      Conteudo: html,
      Links: links
    };
  }

  // Escreve o conteúdo no arquivo 'paginas.json'
  fs.writeFileSync('paginas.json', JSON.stringify(estruturaFormatada, null, 2), 'utf-8');
  console.log('\u2705 Dados salvos no arquivo paginas.json');
}

// Função que busca um termo nas páginas salvas e pontua as ocorrências
function buscarTermo(termo) {
  const resultados = [];
  const termoLower = termo.toLowerCase(); // Transforma o termo para minúsculas
  const paginas = Object.entries(paginasArmazenadas); // Lista de páginas

  // Itera sobre cada página para analisar o conteúdo
  for (let i = 0; i < paginas.length; i++) {
    const url = paginas[i][0];
    const html = paginas[i][1].html.toLowerCase();
    const links = paginas[i][1].links;

    // Conta quantas vezes o termo aparece na página
    let ocorrencias = 0;
    // pos guarda o índice (posição) da primeira vez que termoLower aparece dentro do conteúdo HTML
    let pos = html.indexOf(termoLower);
    // Quando pos for -1 é pq não encontrou mais ocorrencias
    while (pos !== -1) {
      ocorrencias++;
      // Procura o termo de novo, começando depois da posição encontrada
      pos = html.indexOf(termoLower, pos + termoLower.length);
    }

    // Conta quantas outras páginas têm links apontando para essa
    let linksRecebidos = 0;
    for (let j = 0; j < paginas.length; j++) {
      const outraUrl = paginas[j][0];
      const linksOutros = paginas[j][1].links;
      if (outraUrl !== url) {
        for (let k = 0; k < linksOutros.length; k++) {
          if (linksOutros[k] === url) {
            linksRecebidos++;
            break;
          }
        }
      }
    }

    // Verifica se a página possui link para si mesma
    let possuiAutoreferencia = false;
    for (let k = 0; k < links.length; k++) {
      if (links[k] === url) {
        possuiAutoreferencia = true;
        break;
      }
    }

    // Calcula a pontuação da página com base nas regras
    let pontuacao = 0;
    pontuacao += linksRecebidos * 10;
    pontuacao += ocorrencias * 5;
    if (possuiAutoreferencia) pontuacao -= 15;

    // Adiciona os dados nos resultados
    resultados[resultados.length] = {
      url,
      pontuacao,
      linksRecebidos,
      ocorrencias,
      possuiAutoreferencia
    };
  }

  // Ordena os resultados com base na pontuação e critérios de desempate
  for (let i = 0; i < resultados.length - 1; i++) {
    for (let j = 0; j < resultados.length - 1 - i; j++) {
      const a = resultados[j];
      const b = resultados[j + 1];
      if (
        b.pontuacao > a.pontuacao ||
        (b.pontuacao === a.pontuacao && b.linksRecebidos > a.linksRecebidos) ||
        (b.pontuacao === a.pontuacao && b.linksRecebidos === a.linksRecebidos && b.ocorrencias > a.ocorrencias) ||
        (b.pontuacao === a.pontuacao && b.linksRecebidos === a.linksRecebidos && b.ocorrencias === a.ocorrencias && !b.possuiAutoreferencia && a.possuiAutoreferencia)
      ) {
        // Troca de posição se a página seguinte for melhor ranqueada
        const temp = resultados[j];
        resultados[j] = resultados[j + 1];
        resultados[j + 1] = temp;
      }
    }
  }

  // Exibe os resultados no console
  console.log(`\nResultado para: "${termo}"`);
  console.table(resultados, ['url', 'pontuacao', 'linksRecebidos', 'ocorrencias', 'possuiAutoreferencia']);
}

// URL inicial para começar a varredura
const urlInicial = 'https://anacadad.github.io/Atv2_PI/blade_runner.html';

// Função principal que inicia o processo de varredura e busca
async function iniciar() {
  await crawlPagina(urlInicial); // Inicia o crawler
  console.log('\nTotal de páginas salvas:', Object.keys(paginasArmazenadas).length); // Exibe quantas páginas foram salvas
  salvarEmArquivoJSON(); // Salva os dados no arquivo

  // Realiza buscas por termos específicos
  buscarTermo('Matrix');
  buscarTermo('Ficção Científica');
  buscarTermo('Realidade');
  buscarTermo('Universo');
  buscarTermo('Viagem');
}

// Executa a função principal
iniciar();
