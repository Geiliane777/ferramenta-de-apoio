// ============================================================
// NAVEGAÇÃO ENTRE SEÇÕES
// ============================================================

function showSection(sectionId, el) {
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const section = document.getElementById(sectionId);

  if (section) {
    section.classList.add('active');
  }

  if (el) {
    el.classList.add('active');
  }

  closeSidebar();
}


// ============================================================
// MENU MOBILE
// ============================================================

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (sidebar) {
    sidebar.classList.toggle('open');
  }

  if (overlay) {
    overlay.classList.toggle('open');
  }
}

function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (sidebar) {
    sidebar.classList.remove('open');
  }

  if (overlay) {
    overlay.classList.remove('open');
  }
}


// ============================================================
// TEMA CLARO / ESCURO
// ============================================================

function syncAndToggle(source) {
  const isChecked = source.checked;

  document.querySelectorAll('.theme-checkbox').forEach(checkbox => {
    checkbox.checked = isChecked;
  });

  document.body.classList.toggle('light-mode', isChecked);
}


// ============================================================
// COPIAR TEXTO
// ============================================================

function copiarTexto(id) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    return;
  }

  const texto = elemento.innerText;

  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {
    navigator.clipboard.writeText(texto)
      .then(() => {
        mostrarCopiado();
      })
      .catch(() => {
        copiarFallback(texto);
      });
  } else {
    copiarFallback(texto);
  }
}

function copiarFallback(texto) {
  const textarea = document.createElement('textarea');

  textarea.value = texto;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  try {
    document.execCommand('copy');
    mostrarCopiado();
  } catch (erro) {
    console.error('Não foi possível copiar o texto:', erro);
  }

  document.body.removeChild(textarea);
}

function mostrarCopiado() {
  const botoes = document.querySelectorAll('.btn-ghost');

  botoes.forEach(botao => {
    const textoOriginal = botao.innerHTML;

    botao.innerHTML = '✓ Copiado!';

    setTimeout(() => {
      botao.innerHTML = textoOriginal;
    }, 2000);
  });
}


// ============================================================
// CALCULADORA DE MULTA
// ============================================================

function calcularMulta() {
  const mensalidadeInput = document.getElementById('mensalidade');
  const mesesInput = document.getElementById('meses');

  if (!mensalidadeInput || !mesesInput) {
    return;
  }

  const valorMensalidade = parseFloat(
    mensalidadeInput.value.replace(',', '.')
  );

  const mesesFaltantes = parseInt(
    mesesInput.value
  );

  if (
    isNaN(valorMensalidade) ||
    isNaN(mesesFaltantes) ||
    valorMensalidade <= 0 ||
    mesesFaltantes <= 0
  ) {
    alert('Informe valores válidos.');
    return;
  }

  const totalRestante =
    valorMensalidade * mesesFaltantes;

  const valorMulta =
    totalRestante * 0.20;

  const resultado = document.getElementById('resultadoMulta');

  if (!resultado) {
    return;
  }

  resultado.innerHTML = `
    <div class="calc-result-grid">

      <div class="calc-card">
        <div class="calc-card-label">
          Mensalidade
        </div>

        <div class="calc-card-value">
          R$ ${valorMensalidade.toFixed(2).replace('.', ',')}
        </div>
      </div>

      <div class="calc-card">
        <div class="calc-card-label">
          Meses restantes
        </div>

        <div class="calc-card-value">
          ${mesesFaltantes}
        </div>
      </div>

      <div class="calc-card">
        <div class="calc-card-label">
          Total restante
        </div>

        <div class="calc-card-value">
          R$ ${totalRestante.toFixed(2).replace('.', ',')}
        </div>
      </div>

      <div class="calc-card highlight">
        <div class="calc-card-label">
          Multa de 20%
        </div>

        <div class="calc-card-value">
          R$ ${valorMulta.toFixed(2).replace('.', ',')}
        </div>
      </div>

    </div>
  `;
}


// ============================================================
// CALCULADORA DE PRÓ-RATA
// ============================================================

function calcularProporcional() {
  const valorInput =
    document.getElementById('valorPlano');

  const diasInput =
    document.getElementById('dias');

  if (!valorInput || !diasInput) {
    return;
  }

  const valorTotal = parseFloat(
    valorInput.value.replace(',', '.')
  );

  const dias = parseInt(
    diasInput.value
  );

  if (
    isNaN(valorTotal) ||
    isNaN(dias) ||
    valorTotal <= 0 ||
    dias < 1 ||
    dias > 31
  ) {
    alert('Informe um valor válido e uma quantidade de dias entre 1 e 31.');
    return;
  }

  const valorDia = valorTotal / 30;

  const valorProporcional =
    valorDia * dias;

  const resultado =
    document.getElementById('resultadoProrata');

  if (!resultado) {
    return;
  }

  resultado.innerHTML = `
    <div class="calc-result-grid">

      <div class="calc-card">
        <div class="calc-card-label">
          Valor do plano
        </div>

        <div class="calc-card-value">
          R$ ${valorTotal.toFixed(2).replace('.', ',')}
        </div>
      </div>

      <div class="calc-card">
        <div class="calc-card-label">
          Quantidade de dias
        </div>

        <div class="calc-card-value">
          ${dias}
        </div>
      </div>

      <div class="calc-card">
        <div class="calc-card-label">
          Valor por dia
        </div>

        <div class="calc-card-value">
          R$ ${valorDia.toFixed(2).replace('.', ',')}
        </div>
      </div>

      <div class="calc-card highlight">
        <div class="calc-card-label">
          Valor proporcional
        </div>

        <div class="calc-card-value">
          R$ ${valorProporcional.toFixed(2).replace('.', ',')}
        </div>
      </div>

    </div>
  `;
}


// ============================================================
// SAUDAÇÃO
// ============================================================

function getGreeting() {
  const hora = new Date().getHours();

  if (hora < 12) {
    return 'bom dia';
  }

  if (hora < 18) {
    return 'boa tarde';
  }

  return 'boa noite';
}


// ============================================================
// CAPITALIZAR NOME
// ============================================================

function capitalizarNome(nome) {
  const preposicoes = [
    'de',
    'da',
    'do',
    'das',
    'dos',
    'e'
  ];

  return nome
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((palavra, index) => {

      if (
        index > 0 &&
        preposicoes.includes(palavra)
      ) {
        return palavra;
      }

      return palavra.charAt(0).toUpperCase() +
        palavra.slice(1);
    })
    .join(' ');
}


// ============================================================
// TEXTOS
// ============================================================

const texts = {

  tentativaContato: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Realizamos uma tentativa de contato através do telefone {{TELEFONE}}, porém não conseguimos falar com você.

    Por gentileza, entre em contato conosco para que possamos dar continuidade ao seu atendimento.

    Protocolo: {{PROTOCOLO}}
  `,

  acusamosRecebimento: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Acusamos o recebimento da sua solicitação.

    Sua demanda será analisada e, assim que tivermos um retorno, entraremos em contato.

    Protocolo: {{PROTOCOLO}}
  `,

  comprovanteCancelamento: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Conforme solicitado, informamos que o cancelamento do seu plano foi realizado.

    Protocolo: {{PROTOCOLO}}
  `,

  acusacaoReembolso: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Acusamos o recebimento da sua solicitação de reembolso.

    A documentação será analisada pelo setor responsável e, após a conclusão da análise, você receberá um retorno.

    Protocolo: {{PROTOCOLO}}
  `,

  envioRedes: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Segue a relação de redes credenciadas disponíveis para atendimento.

    Protocolo: {{PROTOCOLO}}
  `,

  agendamento: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Para que possamos verificar o seu agendamento, precisamos das informações abaixo:

    Especialidade: {{ESPECIALIDADE}}
    Data: {{DATA}}
    Horário: {{HORARIO}}

    Protocolo: {{PROTOCOLO}}
  `,

  carteirinha: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Informamos que a carteirinha do beneficiário pode ser consultada através do aplicativo.

    Protocolo: {{PROTOCOLO}}
  `,

  semCPF: `
    Olá! {{SAUDACAO}}!

    Para localizar seu cadastro, precisamos de algumas informações adicionais.

    Por favor, informe o telefone cadastrado.

    Telefone: {{TELEFONE}}
  `,

  formularioReembolso: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Para solicitar o reembolso, é necessário preencher o formulário e encaminhar a documentação solicitada.

    Protocolo: {{PROTOCOLO}}
  `,

  boleto: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Informamos que o documento solicitado está disponível para consulta.

    Protocolo: {{PROTOCOLO}}
  `,

  guiaContratual: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Segue a orientação referente ao seu guia contratual.

    Protocolo: {{PROTOCOLO}}
  `,

  exclusaoProposta: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Recebemos sua solicitação referente à exclusão da proposta.

    Protocolo: {{PROTOCOLO}}
  `,

  demonstrativoIR: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    O demonstrativo para Imposto de Renda pode ser consultado pelos canais disponibilizados pelo plano.

    Protocolo: {{PROTOCOLO}}
  `,

  demonstrativoPJ: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Segue a orientação referente ao demonstrativo para pessoa jurídica.

    Protocolo: {{PROTOCOLO}}
  `,

  alteracaoPlano: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Recebemos sua solicitação referente à alteração do plano.

    Protocolo: {{PROTOCOLO}}
  `,

  contratoNovo: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Segue a orientação referente ao novo contrato.

    Protocolo: {{PROTOCOLO}}
  `,

  solicitaCancelamento: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Recebemos sua solicitação de cancelamento.

    O pedido será encaminhado ao setor responsável.

    {{MULTA}}

    {{MENSALIDADE}}

    Protocolo: {{PROTOCOLO}}
  `,

  coberturaTomo: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Conforme análise da cobertura contratual, seguem as informações referentes ao procedimento solicitado.

    Protocolo: {{PROTOCOLO}}
  `,

  inclusaoDepGDFC: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Para inclusão de dependente, é necessário encaminhar a documentação solicitada.

    Protocolo: {{PROTOCOLO}}
  `,

  envioToken: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    O token necessário para o procedimento foi enviado.

    Protocolo: {{PROTOCOLO}}
  `,

  envioProtocolo: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Segue o número do protocolo referente ao seu atendimento:

    Protocolo: {{PROTOCOLO}}
  `,

  posVendas: `
    Olá, {{NOME}}! {{SAUDACAO}}!

    Estamos entrando em contato para realizar o acompanhamento de pós-vendas.

    Protocolo: {{PROTOCOLO}}
  `
};


// ============================================================
// CAMPOS DINÂMICOS
// ============================================================

function togglePhoneField() {

  const finalidade =
    document.getElementById('purpose');

  if (!finalidade) {
    return;
  }

  const valor = finalidade.value;

  const nomeGroup =
    document.getElementById('nameGroup');

  const protocoloGroup =
    document.getElementById('protocolGroup');

  const genderGroup =
    document.getElementById('genderGroup');

  const phoneGroup =
    document.getElementById('phoneGroup');

  const cancelGroup =
    document.getElementById('cancelGroup');

  const appointmentGroup =
    document.getElementById('appointmentGroup');


  // Esconde campos opcionais

  if (phoneGroup) {
    phoneGroup.style.display = 'none';
  }

  if (cancelGroup) {
    cancelGroup.style.display = 'none';
  }

  if (appointmentGroup) {
    appointmentGroup.style.display = 'none';
  }


  // Campos padrão

  if (nomeGroup) {
    nomeGroup.style.display = 'block';
  }

  if (protocoloGroup) {
    protocoloGroup.style.display = 'block';
  }

  if (genderGroup) {
    genderGroup.style.display = 'block';
  }


  // Tentativa de contato

  if (valor === 'tentativaContato') {

    if (phoneGroup) {
      phoneGroup.style.display = 'block';
    }
  }


  // Sem CPF

  if (valor === 'semCPF') {

    if (nomeGroup) {
      nomeGroup.style.display = 'none';
    }

    if (protocoloGroup) {
      protocoloGroup.style.display = 'none';
    }

    if (genderGroup) {
      genderGroup.style.display = 'none';
    }

    if (phoneGroup) {
      phoneGroup.style.display = 'block';
    }
  }


  // Cancelamento

  if (valor === 'solicitaCancelamento') {

    if (cancelGroup) {
      cancelGroup.style.display = 'block';
    }
  }


  // Agendamento

  if (valor === 'agendamento') {

    if (appointmentGroup) {
      appointmentGroup.style.display = 'block';
    }
  }
}


// ============================================================
// GERAR TEXTO
// ============================================================

function generateText() {

  const finalidade =
    document.getElementById('purpose')?.value;

  const nomeInput =
    document.getElementById('name');

  const protocoloInput =
    document.getElementById('protocol');

  const telefoneInput =
    document.getElementById('phone');

  const generatedText =
    document.getElementById('generatedText');


  if (!finalidade) {
    alert('Selecione uma finalidade.');
    return;
  }


  let nome = '';

  if (nomeInput) {
    nome = nomeInput.value.trim();
  }


  // Nome não é necessário para sem CPF

  if (
    finalidade !== 'semCPF' &&
    !nome
  ) {
    alert('Informe o nome do beneficiário.');
    return;
  }


  // Capitalização

  if (nome) {
    nome = capitalizarNome(nome);
  }


  let protocolo = '';

  if (protocoloInput) {
    protocolo = protocoloInput.value.trim();
  }


  // Protocolo obrigatório na maioria dos casos

  if (
    finalidade !== 'semCPF' &&
    !protocolo
  ) {
    alert('Informe o protocolo.');
    return;
  }


  // Validar protocolo numérico

  if (
    protocolo &&
    !/^\d+$/.test(protocolo)
  ) {
    alert('O protocolo deve conter apenas números.');
    return;
  }


  // Telefone

  let telefone = '';

  if (telefoneInput) {
    telefone = telefoneInput.value.trim();
  }


  if (
    finalidade === 'tentativaContato' &&
    !telefone
  ) {
    alert('Informe o telefone.');
    return;
  }


  // Saudação

  const saudacao = getGreeting();


  // Gênero

  let tratamento = 'Prezado(a)';
  let adjetivo = 'Prezado(a)';
  let parte = '';


  const gender =
    document.querySelector(
      'input[name="gender"]:checked'
    );


  if (gender) {

    if (gender.value === 'masculino') {

      tratamento = 'Prezado';
      adjetivo = 'Prezado';
      parte = 'o';

    } else if (gender.value === 'feminino') {

      tratamento = 'Prezada';
      adjetivo = 'Prezada';
      parte = 'a';
    }
  }


  // Template

  let template = texts[finalidade];


  if (!template) {
    alert('Não foi encontrado um texto para essa finalidade.');
    return;
  }


  // ============================================================
  // AGENDAMENTO
  // ============================================================

  let especialidade = '';
  let data = '';
  let horario = '';


  if (finalidade === 'agendamento') {

    const especialidadeInput =
      document.getElementById('especialidade');

    const dataInput =
      document.getElementById('data');

    const horarioInput =
      document.getElementById('horario');


    if (especialidadeInput) {
      especialidade =
        especialidadeInput.value.trim();
    }

    if (dataInput) {
      data =
        dataInput.value.trim();
    }

    if (horarioInput) {
      horario =
        horarioInput.value.trim();
    }


    if (!especialidade || !data || !horario) {
      alert('Preencha os dados do agendamento.');
      return;
    }
  }


  // ============================================================
  // CANCELAMENTO
  // ============================================================

  let multaTexto = '';
  let mensalidadeTexto = '';


  if (finalidade === 'solicitaCancelamento') {

    const multa =
      document.querySelector(
        'input[name="multa"]:checked'
      );

    const mensalidade =
      document.querySelector(
        'input[name="mensalidade"]:checked'
      );

    if (!multa) {
      alert('Informe se haverá multa.');
      return;
    }


    if (!mensalidade) {
      alert('Informe a situação da mensalidade.');
      return;
    }


    if (multa.value === 'sim') {

      multaTexto =
        'Informamos que poderá haver cobrança de multa contratual, conforme as condições previstas no contrato.';

    } else {

      multaTexto =
        'Informamos que não haverá cobrança de multa contratual.';
    }


    if (mensalidade.value === 'sim') {

      mensalidadeTexto =
        'Também verificamos que existe mensalidade pendente.';

    } else {

      mensalidadeTexto =
        'Não identificamos mensalidade pendente.';
    }
  }


  // ============================================================
  // SUBSTITUIÇÃO DOS CAMPOS
  // ============================================================

  let texto = template
    .replaceAll('{{NOME}}', nome)
    .replaceAll('{{PROTOCOLO}}', protocolo)
    .replaceAll('{{SAUDACAO}}', saudacao)
    .replaceAll('{{TELEFONE}}', telefone)
    .replaceAll('{{TRATAMENTO}}', tratamento)
    .replaceAll('{{ADJETIVO}}', adjetivo)
    .replaceAll('{{PARTE}}', parte)
    .replaceAll('{{ESPECIALIDADE}}', especialidade)
    .replaceAll('{{DATA}}', data)
    .replaceAll('{{HORARIO}}', horario)
    .replaceAll('{{MULTA}}', multaTexto)
    .replaceAll('{{MENSALIDADE}}', mensalidadeTexto);


  // Limpa linhas extras

  texto = texto
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();


  // Mostra no resultado

  if (generatedText) {

    generatedText.innerHTML =
      texto.replace(/\n/g, '<br>');
  }
}


// ============================================================
// CONSULTAR PLANO
// ============================================================

function consultarPlano() {

  const input =
    document.getElementById('inputNumber');

  const resultado =
    document.getElementById('resultado');

  if (!input || !resultado) {
    return;
  }


  const codigo =
    input.value.trim();


  if (!codigo) {

    resultado.innerHTML = `
      <div class="calc-card">
        Informe o código do produto.
      </div>
    `;

    return;
  }


  // ============================================================
  // BASE DE PLANOS
  // ============================================================

  const planos = {

    /*
      Mantenha aqui a sua base original de planos.

      Exemplo:

      "123456": {
        nome: "Nome do plano",
        abrangencia: "Nacional",
        acomodacao: "Ambulatorial",
        contratacao: "Individual"
      }
    */

  };


  const plano = planos[codigo];


  if (!plano) {

    resultado.innerHTML = `
      <div class="calc-card highlight">
        <div class="calc-card-label">
          Resultado
        </div>

        <div class="calc-card-value">
          Plano não encontrado
        </div>
      </div>

      <p style="margin-top: 15px;">
        Verifique o código informado e tente novamente.
      </p>
    `;

    return;
  }


  resultado.innerHTML = `
    <div class="calc-result-grid">

      <div class="calc-card">
        <div class="calc-card-label">
          Produto
        </div>

        <div class="calc-card-value">
          ${plano.nome || '-'}
        </div>
      </div>

      <div class="calc-card">
        <div class="calc-card-label">
          Abrangência
        </div>

        <div class="calc-card-value">
          ${plano.abrangencia || '-'}
        </div>
      </div>

      <div class="calc-card">
        <div class="calc-card-label">
          Acomodação
        </div>

        <div class="calc-card-value">
          ${plano.acomodacao || '-'}
        </div>
      </div>

      <div class="calc-card">
        <div class="calc-card-label">
          Contratação
        </div>

        <div class="calc-card-value">
          ${plano.contratacao || '-'}
        </div>
      </div>

    </div>
  `;
}


// ============================================================
// ENTER PARA EXECUTAR
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // Inicializa campos dinâmicos

  togglePhoneField();


  // ============================================================
  // FINALIDADE
  // ============================================================

  const purpose =
    document.getElementById('purpose');

  if (purpose) {

    purpose.addEventListener(
      'change',
      togglePhoneField
    );
  }


  // ============================================================
  // ENTER NO GERADOR
  // ============================================================

  const inputsGerador =
    document.querySelectorAll(
      '#gerador input, #gerador select'
    );

  inputsGerador.forEach(input => {

    input.addEventListener('keydown', event => {

      if (
        event.key === 'Enter' &&
        input.type !== 'radio'
      ) {

        event.preventDefault();

        generateText();
      }
    });

  });


  // ============================================================
  // ENTER NA CALCULADORA DE PRÓ-RATA
  // ============================================================

  const prorataInputs =
    document.querySelectorAll(
      '#prorata input'
    );

  prorataInputs.forEach(input => {

    input.addEventListener('keydown', event => {

      if (event.key === 'Enter') {

        event.preventDefault();

        calcularProporcional();
      }
    });

  });


  // ============================================================
  // ENTER NA CALCULADORA DE MULTA
  // ============================================================

  const multaInputs =
    document.querySelectorAll(
      '#multa input'
    );

  multaInputs.forEach(input => {

    input.addEventListener('keydown', event => {

      if (event.key === 'Enter') {

        event.preventDefault();

        calcularMulta();
      }
    });

  });


  // ============================================================
  // ENTER NA CONSULTA DE PLANO
  // ============================================================

  const inputNumber =
    document.getElementById('inputNumber');

  if (inputNumber) {

    inputNumber.addEventListener(
      'keydown',
      event => {

        if (event.key === 'Enter') {

          event.preventDefault();

          consultarPlano();
        }

      }
    );
  }

});
