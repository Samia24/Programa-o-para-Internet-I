import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const pastaHtml = path.resolve('paginas');
const arquivoSalvo = path.resolve(pastaHtml, 'salvo.txt');

// Set para guardar links já visitados
const paginasVisitadas = new Set();

async function crawlPagina(url) {
    if (paginasVisitadas.has(url)) {
        return; // Já visitou, então sai
      }
    
      console.log(`Visitando: ${url}`);
      paginasVisitadas.add(url);
      
    try {
        
        const resposta = await axios.get(url);

        // Verifica se o arquivo existe, se não existir, cria
        if (!fs.existsSync(arquivoSalvo)) {
            fs.writeFileSync(arquivoSalvo, '');
        }

        const conteudo = fs.readFileSync(arquivoSalvo,'utf-8');
        const $ = cheerio.load(resposta.data);

        // SALVA o conteúdo da página 
        fs.appendFileSync(arquivoSalvo, `\n\n=== Página: ${url} ===\n`);
        fs.appendFileSync(arquivoSalvo, resposta.data);

        const links = [];

        $('a').each((i, elemento) => {
            const texto = $(elemento).text();
            const href = $(elemento).attr('href');
            if (href) {
                links.push({ texto, href });
            }
        });
        // Chama recursivamente para cada link encontrado
        for (const link of links) {
            await crawlPagina(link.href);
        }

        console.log("Links encontrados:", links);

    } catch (erro) {
        console.error("Erro ao acessar a página:", erro.message);
    }
}


// Exemplo de uso:
crawlPagina('https://developer.mozilla.org');

