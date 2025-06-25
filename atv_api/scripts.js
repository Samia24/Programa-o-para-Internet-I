function getById(id){
    return document.getElementById(id);
}

let botaoBuscarDog = getById("botaoBuscarDog");

botaoBuscarDog.addEventListener('click', buscarDog);

async function buscarDog() {
  let nomeDog = getById('nomeRacaCachorro').value.toLowerCase();
  let cachorro = getById('cachorro');

  // Limpa mensagens e imagem anteriores
  getById('mostrarErro').innerText = "";
  cachorro.src = "";
  cachorro.alt = "";

  if (!nomeDog) {
    mostrarErro.innerText = "Por favor, digite uma raça de cachorro.";
    return;
  }

  try {
    const headers = {
      "x-api-key": "live_6MLnYARDIGQyDQL002YZmVIOGD3DOMKgqod5o7xh4d9YOauN4KBeeKR9mJpRzDXx"
    };

    // Faz requisição à API para obter a lista de todas as raças de cachorros
    const racasResponse = await fetch("https://api.thedogapi.com/v1/breeds", { headers });
    // Converte a resposta da API para um array de objetos JSON
    const racas = await racasResponse.json();

    // Procura dentro do array de raças o nome digitado 
    const raca = racas.find(r => r.name.toLowerCase().includes(nomeDog));
    
    // Se nenhuma raça for encontrada, mostra o erro
    if (!raca){
        throw new Error("Erro ao buscar o Doguinho 😔");
    }
    
    // Faz uma nova requisição à API para buscar uma imagem da raça encontrada
    // O parâmetro breed_id define que queremos imagens dessa raça específica
    const imagemResponse = await fetch(
      "https://api.thedogapi.com/v1/images/search?breed_id=" + raca.id, { headers });
    const imagens = await imagemResponse.json();
    
    cachorro.src = imagens[0].url;
    cachorro.alt = `Imagem de um ${raca.name}`;
    
  } catch (e) {
    getById('mostrarErro').innerText = "Erro ao buscar o Doguinho 😔";
    
  }
}


let botaoBuscarCoquetel = getById('botaoBuscarCoquetel');

botaoBuscarCoquetel.addEventListener('click', buscarCoquetel);

async function buscarCoquetel() {
    let nomeCoquetel = getById("nomeCoquetel").value;
    let url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + nomeCoquetel;

    let instrucoes = getById('instrucoes');
    let erro3 = getById('erro3');
    erro3.innerText = "";

    instrucoes.innerText = "";

    if (!nomeCoquetel) {
        erro3.innerText = "Digite o nome de um coquetel.";
        return;
    }

    try{

        let response = await fetch(url);
        if (!response.ok) {
            throw new Error("Erro ao buscar Coquetel 😔");
        }

        let json = await response.json();

        // Pega o primeiro drink referente ao nome digitado e mostra as instruções de como fazer
        let drink = json.drinks[0];
        instrucoes.innerText = drink.strInstructionsES;
        
    } catch(e) {
        getById('erro3').innerText = "Erro ao buscar Coquetel 😔";
    }
}

let botaoBuscarMusica = getById("botaoBuscarMusica");
botaoBuscarMusica.addEventListener("click", buscarMusica);

async function buscarMusica() { 
  let nomeMusica = getById("nomeMusica").value;
  let resultado = getById("resultadoMusicas");
  let erro = getById("erroMusica");

  resultado.innerHTML = "";
  erro.innerText = "";

  if (!nomeMusica) {
    erro.innerText = "Digite o nome de uma música.";
    return;
  }
  // Monta a URL para a API do iTunes, passando o nome da música, limitando a qtd de músicas em 5
  //let url = `https://itunes.apple.com/search?term=${encodeURIComponent(nomeMusica)}&entity=song&limit=5`;
  let url = "https://itunes.apple.com/search?term="+ encodeURIComponent(nomeMusica) + "&entity=song&limit=5";

  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro ao buscar músicas.");
    }

    let json = await response.json();
    
    // Para cada música retornada, cria uma div com as informações e insere no resultado
    json.results.forEach(musica => {
      let div = document.createElement("div");
      div.innerHTML = `
        <p><strong>Música:</strong> ${musica.trackName}</p>
        <p><strong>Artista:</strong> ${musica.artistName}</p>
        <img src="${musica.artworkUrl100}" alt="Capa do álbum">
        <audio controls src="${musica.previewUrl}"></audio>
        <hr>
      `;
      resultado.appendChild(div);
    });

  } catch (e) {
    erro.innerText = "Erro ao buscar músicas.";
  }
}

let botaoEnviarPost = getById("botaoEnviarPost");
botaoEnviarPost.addEventListener("click", enviarPost);

async function enviarPost() {
  const titulo = getById("tituloPost").value;
  const corpo = getById("corpoPost").value;
  const resposta = getById("respostaPost");

  resposta.innerText = "";

  if (!titulo || !corpo) {
    resposta.innerText = "Preencha o título e o conteúdo!";
    return;
  }

  try {
    // Faz a requisição POST para a API JSONPlaceholder, enviando os dados do post
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        // Define o tipo de conteúdo enviado como JSON
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({ // Converte o objeto em string JSON 
        title: titulo,
        body: corpo,
        userId: 1
      })
    });

    const json = await response.json();
    resposta.innerText = `Post criado com sucesso!
            {
            "id": ${json.id}
            "title": ${json.title}
            "body": ${json.body}
            }`;
  } catch (error) {
    resposta.innerText = "Erro ao enviar o post.";
  }
}

/* Execução via terminal - cURL
Método POST: curl -X POST https://jsonplaceholder.typicode.com/posts -H "Content-Type: application/json" -d "{\"title\": \"Meu título teste\", \"body\": \"Este é o corpo do post\", \"userId\": 1}"
Métodos GET:
- Cachorro: curl -H "x-api-key: live_6MLnYARDIGQyDQL002YZmVIOGD3DOMKgqod5o7xh4d9YOauN4KBeeKR9mJpRzDXx" https://api.thedogapi.com/v1/breeds
- Coquetel: curl "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita"
- iTunes: curl "https://itunes.apple.com/search?term=beatles&entity=song&limit=5"

*/