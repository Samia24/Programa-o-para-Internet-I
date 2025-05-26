
function getById(id) {
  return document.getElementById(id);
}

function getByTagName(nameTag) {
  return document.getElementsByTagName(nameTag);
}

function getByName(name) {
  return document.getElementsByName(name);
}

function selectByAttribute(nameAttribute) {
  return document.querySelectorAll(nameAttribute);
}

let h1Principal = getById('titulo1');
h1Principal.innerText = "Turma ADS-Especial";
console.log(h1Principal);
console.log(typeof(h1Principal));

let h2Subtitulo1 = getById('subtitulo1');
h2Subtitulo1.innerText = "Disciplina em turma especial - Programação para Internet I";
console.log(h2Subtitulo1);

let h3Conteudos = getById('conteudos');
h3Conteudos.innerText = "===== Conteúdos Ministrados =====";
console.log(h3Conteudos);

let cont1 = getById('cont1');
cont1.innerText = "Como criar seu portfólio usando ferramentas da web";
console.log(cont1);

let cont2 = getById('cont2');
cont2.innerText = "Introdução a HTML e CSS";
console.log(cont2);

let cont3 = getById('cont3');
cont3.innerText = "Como criar seu buscador";
console.log(cont3);

let cont4 = getById('cont4');
cont4.innerText = "Aprendendo D.O.M.";
console.log(cont4);

let checkAtv = getById('checkAtv');
checkAtv.innerText = "Check de Atividades";
console.log(checkAtv);

function calcular_qtd_atv() {
  const checkboxes = selectByAttribute('input[type="checkbox"][value="atividade"]');
  let contador = 0;

  checkboxes.forEach(cb => {
    if (cb.checked) {
      contador++;
    }
  });

  getById('resultadoQtdAtv').innerText = `Você entregou ${contador} atividade(s).`;
} 

function calcular_qtd_paragrafos(){
  let tagP = getByTagName('p');
  let cont = 0;

  for (let i = 0; i < tagP.length; i++) {
    cont++;
  }

  getById('resultadoTagP').innerText = `Qtd de parágrafos = ${cont}.`;
}

let discentes = getById('discentes');
discentes.innerText = "Discentes Matriculados: ";
console.log(discentes);


let botaoAlterar = getById('botaoAlterar');
botaoAlterar.addEventListener('click', function() {
  let paragrafo = getById('alterarParagrafo');
// altera o texto do parágrafo
  paragrafo.textContent = '- Sâmia Dantas Braga';
});

function limparParagrafo() {
  let paragrafo = getById('alterarParagrafo'); 
  paragrafo.textContent = ''; 
}

getById('alterarParagrafo').style.color = 'palevioletred';

let caixaAlta = getById('caixaAlta');
caixaAlta.innerText = 'Copiar texto para caixa alta';
console.log(caixaAlta);

function copiarParaCaixaAlta() { 
  const entrada = getById('caixa1'); 
  const saida = getById('caixa2'); 
  if (entrada && saida) { 
    saida.value = entrada.value.toUpperCase(); 
  } 
}

let altoContraste = getById('altoContraste');
altoContraste.innerText = 'Alto Contraste';
console.log(altoContraste);


function ativarContraste() { 
  let corpoTexto = getById('corpoTexto'); 
  corpoTexto.style.backgroundColor = 'black'; 
  corpoTexto.style.color = 'white'; 
} 

function resetarCores() { 
  let corpoTexto = getById('corpoTexto'); 
  corpoTexto.style.backgroundColor = 'white'; 
  corpoTexto.style.color = 'black';
} 

let alterarTamFonte = getById('alterarTamFonte');
alterarTamFonte.innerText = 'Alterar Tamanho da Fonte';
console.log(alterarTamFonte);


function aumentarFonte() { 
  let corpoTexto = getById('corpoTexto'); 
  const tamanhoAtual = parseFloat(getComputedStyle(corpoTexto).fontSize); 
  corpoTexto.style.fontSize = (tamanhoAtual + 2) + 'px'; 
} 

function diminuirFonte() { 
  let corpoTexto = getById('corpoTexto'); 
  const tamanhoAtual = parseFloat(getComputedStyle(corpoTexto).fontSize); 
  if (tamanhoAtual > 10) { 
    corpoTexto.style.fontSize = (tamanhoAtual - 2) + 'px'; 
  } 
}

let calculadora = getById('calculadora');
calculadora.innerText = 'Calculadora';
console.log(calculadora);

 function calcular() { 
  let v1 = parseFloat(getById('valor1').value); 
  let v2 = parseFloat(getById('valor2').value); 
  let operacoes = getByName('operacao'); 
  let operacaoSelecionada = ''; 
  
  for (let i = 0; i < operacoes.length; i++) { 
    if (operacoes[i].checked) { 
      operacaoSelecionada = operacoes[i].value; 
      break; 
    } 
  } 
  
  let resultado = ''; 
  if (isNaN(v1) || isNaN(v2)) { 
    resultado = 'Por favor, digite dois números válidos.'; 
  } else { 
    if (operacaoSelecionada === 'soma') { 
      resultado = `Resultado: ${v1 + v2}`; 
    } else if (operacaoSelecionada === 'subtracao') { resultado = `Resultado: ${v1 - v2}`; 

    } else if (operacaoSelecionada === 'multiplicacao') { 
      resultado = `Resultado: ${v1 * v2}`; 
    } else if (operacaoSelecionada === 'divisao') { 
      if (v2 === 0) { 
        resultado = 'Erro: divisão por zero.'; 
      } 
      else { 
        resultado = `Resultado: ${v1 / v2}`; 
      } 
    } 
  } 

  getById('resultado').textContent = resultado; 
}

let addItem = getById('addItem');
addItem.innerText = 'Adicionar Item na Lista';
console.log(addItem);

function adicionarNaLista() { 
  let entrada = getById('entradaTexto'); 
  let texto = entrada.value.trim(); 
  if (texto !== '') { 
    let novaLi = document.createElement('li');
    novaLi.textContent = texto;
    getById('listaItens').appendChild(novaLi); 
    entrada.value = ''; 
    entrada.focus(); 
  } 
}

let selected = getById('selected');
selected.innerText = 'Adicionar no Select';
console.log(selected);

function adicionarNoSelect() {
  let entrada = getById('entradaTextoSelect');
  let texto = entrada.value.trim();
  if (texto !== '') {
    let novaOpcao = document.createElement('option');
    novaOpcao.textContent = texto;
    novaOpcao.value = texto;
    getById('listaSelect').appendChild(novaOpcao);
    entrada.value = '';
    entrada.focus();
  }
}
