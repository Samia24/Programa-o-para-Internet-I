import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const pastaHtml = path.resolve('paginas');
const arquivoSalvo = path.resolve(pastaHtml, 'salvo.txt');

// Set para guardar links já visitados, ele evita visitar a mesma página mais de 1x.
const paginasVisitadas = new Set();

async function crawlPagina(url) {
    // A função has(valor) do Set serve para verificar se o valor já está dentro dele.
    if (paginasVisitadas.has(url)) {
        return; // Já visitou, então não precisa visitar de novo.
    }
    // Mostra a url que está visitando no momento.
    console.log(`Visitando: ${url}`);
    // Se ainda não foi visitada, ele adiciona a URL no Set.
    paginasVisitadas.add(url);
      
    try {
        
        // Faz uma requisição http solicitando o conteúdo da página e devolve um html a ser interpretado pelo cheerios.
        const resposta = await axios.get(url);

        // Verifica se o arquivo existe, se não existir, cria
        if (!fs.existsSync(arquivoSalvo)) {
            fs.writeFileSync(arquivoSalvo, '');
        }

        const conteudoAtual = fs.readFileSync(arquivoSalvo, 'utf-8');
        
        // Verifica se a URL já foi visitada
        if (!conteudoAtual.includes(`=== Página: ${url} ===`)) {
            fs.appendFileSync(arquivoSalvo, `\n\n=== Página: ${url} ===\n`);
            fs.appendFileSync(arquivoSalvo, resposta.data);
        }

        // Carrega o arquivo html (o conteúdo da página)
        const $ = cheerio.load(resposta.data);
        const links = [];

        /* Seleciona todos os links da página HTML;
           Depois faz um loop para cada <a> encontrado, passando o índice e o objeto que representa o <a> atual.
        */
        $('a').each((i, elemento) => {
            const texto = $(elemento).text();
            const href = $(elemento).attr('href');
            if (href) {
                // Ele pega o href ex: matrix.html e troca com o final da url http://..../blade_runner.html e fica http://..../matrix.html.
                const urlAbsoluta = new URL(href, url).href;
                // Armazena o texto que vem entre as tags <a>Texto</a> e a urlAbsoluta da página acessada, no vetor links.
                links.push({ texto, href: urlAbsoluta });
            }
        });
        // Chama recursivamente para cada link encontrado e armazenado no vetor.
        for (const link of links) {
            // O await faz com que o código espere terminar de processar a próxima página antes de ir para o próximo link.
            await crawlPagina(link.href);
        }
        // Mostra os objetos adicionados no vetor link.
        console.log("Links encontrados:", links);

    } catch (erro) {
        // Emite um erro caso não consiga acessar o link.
        console.error("Erro ao acessar a página:", erro.message);
    }
}


// Exemplo de uso:
crawlPagina('https://anacadad.github.io/Atv2_PI/blade_runner.html');

