
function getById(id) {
    return document.getElementById(id);
}

let h1Principal = getById('principal');
h1Principal.innerText = "Aprendendo D.O.M.";
console.log(h1Principal);
console.log(typeof(h1Principal));

let divResultado1 = getById('resultado1');
divResultado1.innerText = "Escrevendo dentro da div";

let divPai = getById('pai');
let paragrafosFilhos = divPai.children;

let divResultadoFilhos = getById('resultadoFilhos');
for (var i = 0; i < paragrafosFilhos.length; i++){
    divResultadoFilhos.innerHTML += 
        '<a href=#>' + paragrafosFilhos[i].innerText + '</a><br>';
    
}

let botao1 = getById('botao1');

//Adiciona um evento ao botão
/*
botao1.addEventListener('click', () =>
    alert('clicou no botão')
); 
*/

botao1.addEventListener('click', cliqueBotao1);

function cliqueBotao1(){
    alert('clicou no botão');
};

let botaoSomar = getById('botaoSomar');

botaoSomar.addEventListener('click', somar);

function somar() {
    let textoNumero1 = getById('numero1');
    let textoNumero2 = getById('numero2');

    let soma = Number(textoNumero1.value) + Number(textoNumero2.value);
    resultadoSoma.innerText = soma;
}

let botaoInteresse = getById('botaoInteresse');

botaoInteresse.addEventListener('click', () => {
    let interesse = getById('interesse');
    let resultadoInteresse = getById('resultadoInteresse');

    let texto = "Você não tem interesse nas novidades";
    if (interesse.checked) {
        texto = "Você tem interesse nas novidades";
    }

    resultadoInteresse.innerText = texto;
});


let cidades = getById('cidades');

cidades.addEventListener('change', () => {
    let cidade = cidades.value;
    let resultadoCidade = getById('resultadoCidade');

    resultadoCidade.innerText = 'Cidade selecionada: ' +  cidade;
});

let inputCor = getById('inputCor');

inputCor.addEventListener('change', () => {
    let cor = inputCor.value;
    document.body.style.backgroundColor = cor;
});
