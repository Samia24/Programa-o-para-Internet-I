import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

// Aqui será armazenado tudo (em memória e depois no arquivo JSON)
const paginasArmazenadas = {};

// Set para guardar links já visitados, ele evita visitar a mesma página mais de 1x.
const paginasVisitadas = new Set();

//Set - guarda URLs únicas

async function crawlPagina(url) {
    // A função has(valor) do Set serve para verificar se o valor já está dentro dele.
    if (paginasVisitadas.has(url)) {
        return; // Já visitou, então não precisa visitar de novo.
    }
    // Se ainda não foi visitada, ele adiciona a URL no Set.
    paginasVisitadas.add(url);
      
    try {
        
        // Faz uma requisição http solicitando o conteúdo da página e devolve um html a ser interpretado pelo cheerios.
        const resposta = await axios.get(url);

        const html = resposta.data;

        // Carrega o arquivo html (o conteúdo da página)
        const $ = cheerio.load(html);
        const links = [];

        /* Seleciona todos os links da página HTML;
           Depois faz um loop para cada <a> encontrada, passando o índice e o objeto que representa a tag <a> atual.
        */
        $('a').each((i, elemento) => {
            const href = $(elemento).attr('href');
            if (href) {
                // Ele pega o href ex: matrix.html e troca com o final da url http://..../blade_runner.html e fica http://..../matrix.html.
                const urlAbsoluta = new URL(href, url).href;
                // Armazena o texto que vem entre as tags <a>Texto</a> e a urlAbsoluta da página acessada, no vetor links.
                links.push(urlAbsoluta);
            }
        });

        // Armazena a página atual
        paginasArmazenadas[url] = { html, links };


        // Chama recursivamente para cada link encontrado e armazenado no vetor.
        for (const link of links) {
            // O await faz com que o código espere terminar de processar a próxima página antes de ir para o próximo link.
            await crawlPagina(link);
        }

    } catch (erro) {
        // Emite um erro caso não consiga acessar o link.
        console.error(`Erro ao acessar a página ${url}: ${erro.message}`);
    }
}

/**
 * Salva os dados das páginas em um arquivo JSON
 */
function salvarEmArquivoJSON() {
     // Cria um novo objeto para armazenar os dados de forma organizada
    const estruturaFormatada = {
        // Esse array vai conter um objeto para cada página visitada
        paginas: []
    };
    // Percorre todas as páginas armazenadas no crawler
    for (const [url, { html, links }] of Object.entries(paginasArmazenadas)) {
        // Para cada URL, cria um objeto
        estruturaFormatada.paginas.push({
            Página: url,
            Conteúdo: html, // O HTML bruto será armazenado como "Conteúdo"
            Links: links
        });
    }
    // Converte o objeto JavaScript para uma string JSON formatada
    fs.writeFileSync('paginas.json', JSON.stringify(estruturaFormatada, null, 2), 'utf-8');
    console.log('\u2705 Dados salvos no arquivo paginas.json');
}

// Função que busca um termo em todas as páginas armazenadas e ranqueia os resultados
function buscarTermo(termo) {
    // Vetor para armazenar os resultados com pontuação de cada página
    const resultados = [];

    // Percorre todas as entradas do objeto paginasArmazenadas
    for (const [url, { html, links }] of Object.entries(paginasArmazenadas)) {
        // Carrega o conteúdo HTML da página usando cheerio
        const $ = cheerio.load(html);
        // Converte todo texto do html pra minúsculo
        const texto = html.toLowerCase();
        const termoLower = termo.toLowerCase();
        // Conta quantas vezes o termo aparece no texto 
        const ocorrencias = (texto.match(new RegExp(termoLower, 'g')) || []).length; 
        /* A função .match() busca todos os trechos que batem com o padrão passado. Se encontrar, retorna um
        array com todos os resultados.
        RegExp -> cria uma nova expressão regular baseada no termo
        g -> significa global, ou seja, vai procurar todas as ocorrências e não parar na primeira encontrada
        */
        // Se não encontrar nada, retorna um array vazio e o length será 0.

        // Conta quantas outras páginas possuem link para esta página atual
        const linksRecebidos = Object.entries(paginasArmazenadas).filter(([paginaUrl, pagina]) => 
            pagina.links.includes(url) && paginaUrl !== url).length;

        // Verifica se a própria página contém um link para si mesma
        const possuiAutoreferencia = links.includes(url);
        
        // Pega o tamanho do texto de cada url verificada
        const tamanho = html.length;
        
        // Calcula a pontuação com base nas regras definidas:
        // +10 por cada link recebido, +10 por ocorrência do termo, -15 se tiver autoreferência
        let pontuacao = 0;
        pontuacao += linksRecebidos * 10;
        pontuacao += ocorrencias * 5;
        if (possuiAutoreferencia) pontuacao -= 15;
        // Adiciona os dados dessa página no vetor de resultados
        if(ocorrencias > 0){
            resultados.push({
            url,
            pontuacao,
            linksRecebidos,
            ocorrencias,
            possuiAutoreferencia,
            tamanho
            });
        }
    }

    // Ordena os resultados com os critérios de desempate:
    // 1. Maior pontuação
    // 2. Mais links recebidos
    // 3. Mais ocorrências do termo
    // 4. Se ainda empatar, páginas sem autoreferência vêm primeiro
    resultados.sort((a, b) => {
        if (b.pontuacao !== a.pontuacao) return b.pontuacao - a.pontuacao;
        if (b.linksRecebidos !== a.linksRecebidos) return b.linksRecebidos - a.linksRecebidos;
        if (b.ocorrencias !== a.ocorrencias) return b.ocorrencias - a.ocorrencias;
        if (a.possuiAutoreferencia !== b.possuiAutoreferencia) return a.possuiAutoreferencia - b.possuiAutoreferencia;
        return b.tamanho - a.tamanho; // maior conteúdo vence
    });

    // Exibe os resultados da busca no terminal como tabela
    console.log(`\nResultado para: "${termo}"`);
    console.table(resultados, ['url', 'pontuacao', 'linksRecebidos', 'ocorrencias', 'possuiAutoreferencia', 'tamanho']);
}

// Exemplo de uso:
const urlInicial = 'https://anacadad.github.io/Atv2_PI/blade_runner.html';
async function iniciar() {
    await crawlPagina(urlInicial); // espera todo o rastreamento
    console.log('\nTotal de páginas salvas:', Object.keys(paginasArmazenadas).length);
    salvarEmArquivoJSON();         // salva com conteúdo completo
  
    buscarTermo('Matrix');
    buscarTermo('Ficção Científica');
    buscarTermo('Realidade');
    buscarTermo('Universo');
    buscarTermo('Viagem');
    buscarTermo('tem');
    buscarTermo('filme');
}
  
iniciar(); 
