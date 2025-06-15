function getById(id){
    return document.getElementById(id);
}

function getBotaoClicavel(id, funcao) {
    getById(id).addEventListener('click', funcao);
    return getById(id);
}

// Mostrar/ocultar div pelo id
function toggleElemento(idElemento) {
    const elemento = getById(idElemento);
    if (elemento) {
        elemento.classList.toggle('oculto');
    }
}

function exibirErro(idMensagemErro) {
    const errorMessage = getById(idMensagemErro);
    if (errorMessage) {
        errorMessage.classList.remove('oculto');
        setTimeout(() => {
            errorMessage.classList.add('oculto');
        }, 3000);
    }
}


// Questão 1

getById('questao1').addEventListener('click', () => toggleElemento('calcularIMC'));

getBotaoClicavel('botaoIMC', calcularIMC);
    
function calcularIMC(){
    let peso = parseFloat(getById('dadosPeso').value);
    let altura = parseFloat(getById('dadosAltura').value);
    
    if(!isNaN(peso) && !isNaN(altura) && altura > 0){
        let resultado = peso / (altura ** 2);
        let classificacao = "";

        if (resultado < 18.5) {
            classificacao = "Abaixo do peso";
        } else if (resultado < 25) {
            classificacao = "Peso normal";
        } else if (resultado < 30) {
            classificacao = "Sobrepeso";
        } else if (resultado < 35) {
            classificacao = "Obesidade grau I";
        } else if (resultado < 40) {
            classificacao = "Obesidade grau II";
        } else {
            classificacao = "Obesidade grau III";
        }

        getById('resultado').textContent = `>> Seu IMC é ${resultado.toFixed(2)} (${classificacao})`;
    } else {
        exibirErro('mensagemErro');
    }
};

function limparCampos(inputIds = [], idResultado = '', textoPadrao = '') {
    inputIds.forEach(id => {
        const input = getById(id);
        if (input) input.value = '';
    });

    if (idResultado) {
        const resultado = getById(idResultado);
        if (resultado) resultado.textContent = textoPadrao;
    }
}

getBotaoClicavel('limparIMC', () => {
    limparCampos(['dadosPeso', 'dadosAltura'], 'resultado', 'Resultado');
});


// Questão 2

getById('questao2').addEventListener('click', () => toggleElemento('mostrarTexto'));

getBotaoClicavel('botaoExibir', exibirConteudo);

function exibirConteudo() {
    var conteudo = getById('caixaDeTexto').value.trim();
    
    if (conteudo != ''){
        getById('conteudo').innerHTML = conteudo;
    }else {
        exibirErro('mensagemErroQ2');
    }

}

getBotaoClicavel('limparTexto', () => {
    limparCampos(['caixaDeTexto'], 'conteudo', '');
});

// Questão 3

getById('questao3').addEventListener('click', () => toggleElemento('calcularInteracoes'));

getBotaoClicavel('botaoInteracoes', calcularInteracoes);

function calcularInteracoes(){
    let interacoes = parseFloat(getById('numInteracoes').value);
    let visualizacoes = parseFloat(getById('numVisualizacoes').value);
    
    if(!isNaN(interacoes) && !isNaN(visualizacoes)){
        let resultado = (interacoes / visualizacoes) * 100;

        getById('taxa').textContent = `>> Taxa de Engajamento: ${resultado.toFixed(0)}%`;
    } else {
        exibirErro('mensagemErroQ3');
    }
};

getBotaoClicavel('limparInteracoes', () => {
    limparCampos(['numInteracoes', 'numVisualizacoes'], 'taxa', '');
});

// Questão 4

getById('questao4').addEventListener('click', () => toggleElemento('uploadDeImagem'));

function carregarEExibirImagem() {
    const uploadInput = getById('uploadImagem');
    const resultadoDiv = getById('resultadoUpload');
    
    // a) Recebe a imagem vinda do componente
    const arquivoSelecionado = uploadInput.files[0];

    // Verifica se um arquivo foi selecionado
    if (arquivoSelecionado) {
        resultadoDiv.innerHTML = ''; // Limpa o resultado anterior

        // b) Cria a tag img
        const novaImagem = document.createElement('img');
        
        // c) Altera o atributo src da imagem
        novaImagem.src = URL.createObjectURL(arquivoSelecionado);
        novaImagem.alt = 'Imagem carregada pelo usuário';

        // d) Adiciona a imagem à div
        resultadoDiv.appendChild(novaImagem);
    } else {
        // Exibe um erro se nenhum arquivo for selecionado
        exibirErro('mensagemErroQ4');
    }
}

getBotaoClicavel('botaoCarregar', carregarEExibirImagem);

getBotaoClicavel('limparImagem', () => {
    limparCampos(['uploadImagem'], 'resultadoUpload', '');
});

// Questão 5
getById('questao5').addEventListener('click', () => toggleElemento('selectDeImagem'));

function carregarImagemDoSelect() {
    const imageSelector = getById('imageSelector');
    const imagemDisplay = getById('imagemExibida');
    const urlSelecionada = imageSelector.value;

    // Verifica se uma opção válida foi selecionada
    if (urlSelecionada) {
        // Se sim, define o 'src' da tag <img> com a URL escolhida
        imagemDisplay.src = urlSelecionada;
        const textoOpcao = imageSelector.options[imageSelector.selectedIndex].text;
        imagemDisplay.alt = textoOpcao;
        imagemDisplay.classList.remove('oculto');
    } else {
        // Se não, exibe uma mensagem de erro
        exibirErro('mensagemErroQ5');
    }
}

getBotaoClicavel('botaoCarregarImagemQ5', carregarImagemDoSelect);

function limparSelecaoQ5() {
    const imageSelector = getById('imageSelector');
    const imagemDisplay = getById('imagemExibida'); 

    // Reseta o menu <select>
    imageSelector.selectedIndex = 0;

    // Tira a foto de dentro (limpa o src) e cobre o porta-retrato (adiciona a classe 'oculto')
    imagemDisplay.src = '';
    imagemDisplay.classList.add('oculto');
}

getBotaoClicavel('limparQuadroQ5', limparSelecaoQ5);

// Questão 6
getBotaoClicavel('questao6', () => toggleElemento('selecaoDeRedes'));

function processarSelecaoRedes() {
    // Utiliza document.getElementsByName para pegar todos os checkboxes
    const checkboxes = document.getElementsByName('redesSociais');
    const resultadoDiv = getById('redesSelecionadas');
    const selecionadas = [];

    // Percorre o array de checkboxes
    for (const checkbox of checkboxes) {
        // Testa a propriedade 'checked'
        if (checkbox.checked) {
            selecionadas.push(checkbox.value);
        }
    }

    // Valida se pelo menos um foi marcado
    if (selecionadas.length > 0) {
        // Caso sim, exibe as redes selecionadas
        resultadoDiv.innerHTML = `<strong>Redes Selecionadas:</strong> ${selecionadas.join(', ')}`;
    } else {
        // Caso contrário, exibe uma mensagem de erro
        resultadoDiv.innerHTML = ''; // Limpa o resultado anterior
        exibirErro('mensagemErroQ6');
    }
}

/**
 * Limpa a seleção de todos os checkboxes e o resultado.
 */
function limparSelecaoRedes() {
    const checkboxes = document.getElementsByName('redesSociais');
    for (const checkbox of checkboxes) {
        checkbox.checked = false;
    }
    getById('redesSelecionadas').innerHTML = '';
}

// Associa as funções aos botões
getBotaoClicavel('enviarBtn', processarSelecaoRedes);
getBotaoClicavel('limparSelecaoRedes', limparSelecaoRedes);

// Questão 7
getBotaoClicavel('questao7', () => toggleElemento('adicionarHashtag'));

/**
 * Adiciona a hashtag digitada à lista <select>, após passar por todas as validações.
 */
function adicionarHashtag() {
    const inputHashtag = getById('inputHashtag');
    const listaHashtags = getById('listaHashtags');
    const textoHashtag = inputHashtag.value.trim();

    // --- INÍCIO DAS VALIDAÇÕES ---

    // b) Não permite hashtags vazias
    if (textoHashtag === '') {
        const erroDiv = getById('mensagemErroQ7');
        erroDiv.textContent = 'O campo não pode estar vazio.';
        exibirErro('mensagemErroQ7');
        return; // Interrompe a função
    }

    // c) Não permite hashtags com menos de 2 caracteres
    if (textoHashtag.length < 2) {
        const erroDiv = getById('mensagemErroQ7');
        erroDiv.textContent = 'A hashtag deve ter no mínimo 2 caracteres.';
        exibirErro('mensagemErroQ7');
        return;
    }

    // d) Não permite mais que 5 hashtags
    if (listaHashtags.options.length >= 5) {
        const erroDiv = getById('mensagemErroQ7');
        erroDiv.textContent = 'Limite de 5 hashtags atingido.';
        exibirErro('mensagemErroQ7');
        return;
    }

    // a) Não permite hashtags repetidas
    for (const option of listaHashtags.options) {
        if (option.value.toLowerCase() === textoHashtag.toLowerCase()) {
            const erroDiv = getById('mensagemErroQ7');
            erroDiv.textContent = 'Essa hashtag já foi adicionada.';
            exibirErro('mensagemErroQ7');
            return;
        }
    }

    // Se passou em todas as validações, adiciona a hashtag
    const novaOpcao = document.createElement('option');
    novaOpcao.textContent = `#${textoHashtag}`;
    novaOpcao.value = textoHashtag;
    listaHashtags.appendChild(novaOpcao);

    // Limpa e foca no input para a próxima
    inputHashtag.value = '';
    inputHashtag.focus();
}

/**
 * Limpa todas as hashtags da lista.
 */
function limparListaHashtags() {
    getById('listaHashtags').innerHTML = '';
    getById('inputHashtag').value = '';
}

// Associa as funções aos botões 
getBotaoClicavel('botaoAdicionarHashtag', adicionarHashtag);
getBotaoClicavel('limparHashtags', limparListaHashtags);

function removerHashtagSelecionada() {
    const listaHashtags = getById('listaHashtags');
    
    // 1. Utiliza a propriedade 'selectedOptions' para pegar a opção selecionada.
    // Como o select não é múltiplo, pegamos o primeiro item (índice 0).
    const opcaoSelecionada = listaHashtags.selectedOptions[0];

    // 2. Verifica se uma opção foi realmente selecionada
    if (opcaoSelecionada) {
        // 3. Utiliza 'removeChild' para remover o elemento <option> do <select>
        listaHashtags.removeChild(opcaoSelecionada);
    } else {
        // 4. Caso contrário, exibe um erro
        const erroDiv = getById('mensagemErroQ7');
        erroDiv.textContent = 'Nenhuma hashtag selecionada para remover.';
        exibirErro('mensagemErroQ7');
    }
}

// Associa a nova função ao botão "Remover Selecionada"
getBotaoClicavel('botaoRemoverHashtag', removerHashtagSelecionada);

// Questão 10
function atualizarEstadoBotoes() {
    const origem = getById('ativosDisponiveis');
    const destino = getById('carteiraInvestimentos');
    const btnDireita = getById('moverParaDireitaBtn');
    const btnEsquerda = getById('moverParaEsquerdaBtn');

    // DESABILITA BOTÃO SE A LISTA DE ORIGEM ESTIVER VAZIA
    // O botão de mover para a direita é desabilitado se a lista de origem não tiver nenhum item.
    btnDireita.disabled = origem.options.length === 0;
    
    // O botão de mover para a esquerda é desabilitado se a lista de destino não tiver nenhum item.
    btnEsquerda.disabled = destino.options.length === 0;
}

function moverItens(idOrigem, idDestino) {
    const origem = getById(idOrigem);
    const destino = getById(idDestino);
    const itensSelecionados = Array.from(origem.selectedOptions);

    // CHAMA A FUNÇÃO exibirErro SE NADA ESTIVER SELECIONADO
    if (itensSelecionados.length === 0) {
        const erroDiv = getById('mensagemErroQ10');
        erroDiv.textContent = 'Selecione pelo menos um ativo para mover.';
        exibirErro('mensagemErroQ10');
        return; 
    }

    // Move cada item selecionado para a lista de destino
    for (const item of itensSelecionados) {
        destino.appendChild(item);
    }

    // Após mover, atualiza o estado dos botões novamente
    atualizarEstadoBotoes();
}

// Ao clicar no botão da Questão 10, mostra a seção e atualiza os botões
getBotaoClicavel('questao10', () => {
    toggleElemento('moverAtivos');
    atualizarEstadoBotoes(); 
});

// Associa a função reutilizável aos botões de mover
getBotaoClicavel('moverParaDireitaBtn', () => moverItens('ativosDisponiveis', 'carteiraInvestimentos'));
getBotaoClicavel('moverParaEsquerdaBtn', () => moverItens('carteiraInvestimentos', 'ativosDisponiveis'));
