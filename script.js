  // ─── Navigation ───
  function showSection(sectionId, el) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    el.classList.add('active');
    closeSidebar();
  }

  // ─── Sidebar mobile ───
  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('open');
  }

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('open');
  }

  // ─── Theme ───
  function syncAndToggle(src) {
    const other = document.getElementById(src.id === 'toggleModeBtn' ? 'toggleModeBtn2' : 'toggleModeBtn');
    if (other) other.checked = src.checked;
    document.body.classList.toggle('light-mode', src.checked);
  }

  // ─── Copy ───
  function copiarTexto(id) {
    const el = document.getElementById(id);
    const text = el.innerText;
    const btn = document.querySelector('.btn-ghost');

    function mostrarSucesso() {
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Copiado!';
      btn.style.color = 'var(--teal)';
      btn.style.borderColor = 'var(--teal)';
      setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; btn.style.borderColor = ''; }, 1800);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(mostrarSucesso).catch(() => copiarFallback(text, mostrarSucesso));
    } else {
      copiarFallback(text, mostrarSucesso);
    }
  }

  function copiarFallback(text, callback) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
    } catch(e) {}
    document.body.removeChild(ta);
  }

  // ─── Multa ───
  function calcularMulta() {
    const valorMensalidade = parseFloat(document.getElementById("valorMensalidade").value);
    const mesesFaltantes = parseInt(document.getElementById("mesesFaltantes").value);
    const resultadoEl = document.getElementById("multaResultado");
    const totalMesesContrato = 13;

    if (isNaN(valorMensalidade) || valorMensalidade <= 0 || isNaN(mesesFaltantes) || mesesFaltantes < 0) {
      resultadoEl.innerHTML = '<span style="color:rgba(255,100,100,0.8)">⚠ Insira valores válidos.</span>';
      return;
    }
    if (mesesFaltantes > totalMesesContrato) {
      resultadoEl.innerHTML = `<span style="color:rgba(255,100,100,0.8)">⚠ Os meses faltantes não podem exceder ${totalMesesContrato}.</span>`;
      return;
    }

    const totalRestante = valorMensalidade * mesesFaltantes;
    const multa = totalRestante * 0.20;

    resultadoEl.innerHTML = `
      <div class="calc-result-grid">
        <div class="calc-card">
          <div class="calc-card-label">Mensalidade</div>
          <div class="calc-card-value">R$ ${valorMensalidade.toFixed(2)}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Meses restantes</div>
          <div class="calc-card-value">${mesesFaltantes}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Total de mensalidades</div>
          <div class="calc-card-value">R$ ${totalRestante.toFixed(2)}</div>
        </div>
        <div class="calc-card highlight">
          <div class="calc-card-label">Multa a pagar (20%)</div>
          <div class="calc-card-value">R$ ${multa.toFixed(2)}</div>
        </div>
      </div>`;
  }

  // ─── Pró-rata ───
  function calcularProporcional() {
    const valorTotal = parseFloat(document.getElementById("valorTotalProduto").value);
    const dias = parseInt(document.getElementById("quantidadeDias").value);
    const resultadoElement = document.getElementById("resultadoProporcional");

    if (isNaN(valorTotal) || valorTotal <= 0 || isNaN(dias) || dias <= 0 || dias > 31) {
      resultadoElement.innerHTML = '<span style="color:rgba(255,100,100,0.8)">⚠ Insira valores válidos (dias entre 1 e 31).</span>';
      return;
    }

    const valorPorDia = valorTotal / 30;
    const valorFinal = valorPorDia * dias;

    resultadoElement.innerHTML = `
      <div class="calc-result-grid">
        <div class="calc-card">
          <div class="calc-card-label">Valor total do plano</div>
          <div class="calc-card-value">R$ ${valorTotal.toFixed(2)}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Valor por dia</div>
          <div class="calc-card-value">R$ ${valorPorDia.toFixed(2)}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Dias</div>
          <div class="calc-card-value">${dias}</div>
        </div>
        <div class="calc-card highlight">
          <div class="calc-card-label">Valor pró-rata</div>
          <div class="calc-card-value">R$ ${valorFinal.toFixed(2)}</div>
        </div>
      </div>`;
  }

  // ─── Greeter ───
  function getGreeting() {
    const h = new Date().getHours();
    return h < 12 ? "bom dia" : h < 18 ? "boa tarde" : "boa noite";
  }

  function capitalizarNome(nome) {
    const prep = ['de', 'da', 'do', 'das', 'dos', 'e'];
    return nome.trim().toLowerCase().split(/\s+/).map((w, i) => {
      if (i !== 0 && prep.includes(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');
  }

  // ─── Texts ───
  const texts = {
    tentativaContato: `Título: ODONTOGROUP - TENTATIVA DE CONTATO

{gender} {name}, {greeting}!

Tentamos contato através do telefone {phone}, porém não obtivemos sucesso.
Por gentileza, entre em contato com a nossa central de atendimento o mais breve possível referente à sua solicitação do protocolo de atendimento n.º {protocol}.`,

    acusamosRecebimento: `{gender} {name}, {greeting}!

Acusamos o recebimento da sua solicitação por meio do protocolo de n.º {protocol}, iremos verificar as informações relatadas e em breve retornaremos com mais informações.`,

    comprovanteCancelamento: `Título: ODONTOGROUP - COMPROVANTE DE CANCELAMENTO

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada através do protocolo de n.º {protocol}, segue em anexo o comprovante de cancelamento do contrato.`,

    acusacaoReembolso: `{gender} {name}, {greeting}!

Acusamos o recebimento da sua solicitação através do protocolo de n.º {protocol} e informamos que a documentação foi direcionada ao setor responsável para análise.
Em breve retornaremos o contato com mais informações.`,

    envioRedes: `Título: ODONTOGROUP - REDES DE ATENDIMENTO

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada sob protocolo de n° {protocol}, seguem abaixo redes de atendimento conforme solicitado.

(indicação de rede)

Orientamos que entre em contato com as clínicas para realizar o agendamento de consulta, caso tenha dificuldade em realizar o contato junto as clínicas, entre em contato com a nossa central de atendimento para que possamos lhe auxiliar.`,

    agendamento: `Título: ODONTOGROUP - AGENDAMENTO DE CONSULTA

{gender} {name}, {greeting}!

Em atendimento à sua solicitação, realizada sob protocolo de n° {protocol}, listamos abaixo as informações referentes ao agendamento de sua consulta:

Avaliação - {agendEspecialidade}
Dia: {agendDataHora}
Clínica: {agendClinica}

Por gentileza, chegue à consulta com antecedência de 10 minutos e leve raio-x, caso possua, isso facilita o seu atendimento.

Obs.: Caso não consiga comparecer ao agendamento informado acima, na data e horário marcado, por gentileza, orientamos que entre em contato diretamente com a clínica para realizar o reagendamento de sua consulta no prazo indicado (24horas de antecedência).`,

    carteirinha: `Título: ODONTOGROUP - CARTEIRINHA

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada por meio do protocolo de n.º {protocol}, segue em anexo sua carteirinha virtual do plano odontológico.

Baixe nosso aplicativo para acessá-la de forma simples e online. 
Caso ainda não possua nosso aplicativo, basta buscar por "OdontoGroup Associado" na loja de aplicativos do seu dispositivo celular e realizar o primeiro acesso.`,

    semCPF: `Prezado(a) cliente, {greeting}!

Acusamos o recebimento da sua solicitação e para que possamos localizar o seu contrato, informe-nos seu nome completo, CPF e telefone.`,

    formularioReembolso: `Título: ODONTOGROUP - FORMULÁRIO DE REQUISIÇÃO DE REEMBOLSO

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada através do protocolo de n.º {protocol}, segue em anexo o Formulário de Requisição de Reembolso. 

Para que nossa operadora possa prosseguir com a análise do reembolso, solicitamos a leitura do formulário com atenção, devido às exigências quanto ao preenchimento de todos os campos existentes para andamento do processo de reembolso.

Lembrando que, no formulário há campos referentes aos tratamentos odontológicos onde o profissional cirurgião-dentista deverá preencher, carimbar e assinar.

Juntamente ao formulário de reembolso, é necessário encaminhar as radiografias anteriores e posteriores ao procedimento realizado.

Solicitamos também que encaminhe, juntamente às documentações já mencionadas, a nota fiscal ou recibo de pagamento emitidos pelo Cirurgião-Dentista, com o valor correspondente aos tratamentos descritos no formulário, além do comprovante de pagamento bancário.

Esclarecemos que o comprovante de pagamento referido pode ser a via emitida pela máquina no caso de pagamento via cartão, um print do desconto em seu aplicativo bancário ou comprovante de transferência no caso de pagamento por PIX ou transferência bancária.

Ao realizar o envio da documentação completa e análise da solicitação pela Operadora, sendo essa aprovada, o pagamento do reembolso será em até 30 dias.`,

    boleto: `Título: ODONTOGROUP - BOLETO

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada através do protocolo de n.º {protocol}, segue em anexo o boleto referente ao período solicitado.`,

    guiaContratual: `Título: ODONTOGROUP - GUIA DE LEITURA CONTRATUAL

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada por meio do protocolo de n.º {protocol}, segue em anexo o Guia de Leitura Contratual contendo todas as informações referente ao produto contratado, inclusive a cobertura do plano odontológico.`,

    exclusaoProposta: `Título: ODONTOGROUP - EXCLUSÃO DE PROPOSTA

Prezados, {greeting}!

Conforme atendimento realizado através do protocolo de n.º {protocol}, por gentileza, efetuar o cancelamento da proposta em aberto nos dados abaixo:

Nome: [NOME COMPLETO]
CPF: [CPF]`,

    demonstrativoIR: `Título: ODONTOGROUP - DEMONSTRATIVO PARA IMPOSTO DE RENDA

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada por meio do protocolo de n.º {protocol}, segue em anexo o demonstrativo para comprovação de imposto de renda referente ao ano de 2025. 

Acrescentamos que o demonstrativo também está disponível em nosso aplicativo "OdontoGroup – Associado".`,

    demonstrativoPJ: `Título: ODONTOGROUP - DEMONSTRATIVO PARA IMPOSTO DE RENDA - PJ

{gender} {name}, {greeting}!

Em atendimento à sua solicitação realizada por meio do protocolo de n.º {protocol}, informamos que, por se tratar de um plano empresarial, o seu demonstrativo para Imposto de Renda deve ser solicitado diretamente ao setor de Recursos Humanos (RH) da empresa xxxxxxxxxxxxx.

Isso ocorre porque, nessa modalidade de contrato, os valores relacionados ao plano são administrados e registrados pela própria empresa responsável pelo convênio, que possui acesso ao detalhamento das contribuições utilizadas para fins de declaração.
Dessa forma, orientamos que entre em contato com a empresa/sindicato/órgão para solicitar o documento ou obter as orientações necessárias para emissão do demonstrativo.`,



    alteracaoPlano: `Título: ODONTOGROUP - ALTERAÇÃO DE PLANO

{gender} {name}, {greeting}!

Acusamos o recebimento da sua solicitação por meio do protocolo de n.º {protocol} e informamos que a documentação encaminhada foi devidamente direcionada ao setor responsável para análise e finalização do processo.

Esclarecemos que, a partir do primeiro dia do mês seguinte, a alteração estará vigente em seu cadastro e o plano poderá ser utilizado normalmente, conforme as regras e diretrizes do seu plano odontológico.

Reforçamos que é possível realizar o upgrade para qualquer um de nossos planos odontológicos a qualquer momento, de forma simples e sem a necessidade de aguardar um prazo específico. Entretanto, para realizar a regressão para um plano de menor valor (downgrade), é necessário observar o prazo mínimo de 12 meses a partir da última alteração contratual.`,

    contratoNovo: `Título: ODONTOGROUP - INFORMAÇÕES SOBRE O PLANO

{gender} {name}, {greeting}!

Acusamos o recebimento da sua solicitação por meio do protocolo de n.º {protocol} e informamos que o início de vigência do seu plano está previsto para o dia XXXXX. A partir desta data, o acesso ao aplicativo estará liberado, permitindo a consulta detalhada dos serviços contratados, bem como demais funcionalidades disponíveis para o seu plano.

Adicionalmente, informamos que, em breve, nossa equipe de boas-vindas entrará em contato para confirmar os seus dados cadastrais e fornecer todas as orientações necessárias sobre os benefícios contratados, garantindo que você aproveite ao máximo tudo o que o plano oferece.`,

    solicitaCancelamento: `Título: ODONTOGROUP - SOLICITAÇÃO DE CANCELAMENTO

{gender} {name}, {greeting}!

Acusamos o recebimento da sua manifestação por meio do WhatsApp, sob protocolo de n.º {protocol} e informamos que sua solicitação de cancelamento foi devidamente registrada e direcionada ao setor responsável para análise e providências.

O setor responsável de cancelamento realizará contato em até 3 dias úteis, para conclusão da solicitação e formalização do cancelamento.

Antecipamos que o plano possui uma vigência mínima de 12 meses, portanto {multa}

{mensalidade}

Caso seja de seu interesse, podemos encaminhar um boleto bancário com vencimento em até 5 dias a contar da data de hoje, ou, alternativamente, realizar uma nova tentativa de cobrança no cartão de crédito previamente cadastrado. Se preferir efetuar o pagamento utilizando outro cartão de crédito, também podemos encaminhar um link de pagamento para que a transação seja realizada de forma rápida e segura.`,

    coberturaTomo: `Título: ODONTOGROUP - COBERTURA DO PLANO

{gender} {name}, {greeting}!

Em atendimento à sua solicitação registrada por meio do protocolo de n.º {protocol}, informamos que, conforme as regras contratuais do seu plano, não há cobertura para a realização de tomografia.

Ressaltamos, contudo, que o seu plano contempla a cobertura de diversos procedimentos odontológicos, tais como: restaurações, profilaxia (limpeza), atendimentos em odontopediatria, extração de sisos, exames radiológicos convencionais, tratamento de canal (endodontia), pino, coroa, entre outros procedimentos previstos em contrato.

Para consultar a relação completa de procedimentos cobertos, orientamos que realize a verificação por meio do nosso aplicativo ou pelo portal do beneficiário em nosso site, seguindo os caminhos abaixo:

Aplicativo:
Página inicial > último ícone no canto inferior direito da tela > Meu Plano > Cobertura.
Site:
Acesse: https://odontogroup.s4e.com.br/sys/?TipoUsuario=1
Em seguida: insira seu CPF e senha (a mesma utilizada no aplicativo) > Portal de Informações > Cobertura/Carência.`,

    inclusaoDepGDFC: `Título: ODONTOGROUP - INCLUSÃO DE DEPENDENTES

{gender} {name}, {greeting}!

Acusamos o recebimento da sua solicitação, realizada por meio do protocolo de n.º {protocol} e inicialmente gostaríamos de esclarecer que o ressarcimento de 99% do valor do plano escolhido (limitado a R$ 30,00) é válido somente para o titular, conforme prevê o edital.

Os dependentes não receberão o ressarcimento do GDF, porém o valor para inclusão de dependentes no contrato GDF é abaixo do valor comercializado de forma particular, além dos dependentes inclusos entrarem também sem carência para nenhum procedimento.

Conforme previsto no edital, podem ser dependentes:

O(a) cônjuge ou o(a) companheiro(a), desde que não preencha os requisitos para ser beneficiário titular;
O(a) filho(a) solteiro(a) e não emancipado(a), o(a) tutelado(a) e o(a) enteado(a) menor de 21 anos, ou filho(a) estudante universitário(a) até 24 anos, e filhos(as) inválidos(as).

Que podem optar por quatro modalidades de plano, sendo eles:

Odonto Clínico: Possui cobertura para mais de 200 procedimentos, como por exemplo: restaurações, limpeza, odontopediatria, extração de siso, radiologia, canal, bloco, pino e coroa total em cerômero para os dentes da frente de canino.
Valor para o titular: R$ 0,30 (ressarcimento de R$ 29,70 realizado pelo GDF).
Valor por dependente: R$ 22,90.
Abrangência Titular: Nacional.
Abrangência Dependente: AL, DF, GO, PE e TO.

Odonto Doc: Possui toda cobertura do plano Odonto Clínico, além da documentação inicial, final e a instalação do aparelho fixo metálico convencional.
Valor para o titular: R$ 2,90 (ressarcimento de R$ 30,00 realizado pelo GDF).
Valor por dependente: R$ 32,90.
Abrangência Titular: Nacional.
Abrangência Dependente: AL, DF, GO, PE e TO.

Odonto Prótese: Possui toda cobertura do plano Odonto Clínico, além da placa de bruxismo, clareamento convencional, coroas unitárias em resina para todos os dentes, prótese parcial removível com grampo, prótese parcial removível provisória e a prótese total.
Valor para o titular: R$ 59,90 (ressarcimento de R$ 30,00 realizado pelo GDF).
Valor por dependente: R$ 89,90.
Abrangência Titular: Nacional.
Abrangência Dependente: AL, DF, GO, PE e TO.

Odonto Orto: Possui toda a cobertura do Odonto Doc, além das manutenções mensais do aparelho e o clareamento caseiro convencional após a retirada do aparelho.
Valor para o titular: R$ 80,00 (ressarcimento de R$ 30,00 realizado pelo GDF).
Valor por dependente: R$ 110,00.
Abrangência Titular: Nacional.
Abrangência Dependente: AL, DF, GO, PE e TO.

Caso deseje prosseguir com a inclusão, por gentileza, preencha corretamente o formulário de inclusão de dependentes que segue em anexo.

Destacamos que novas inclusões de dependentes em planos já ativos, tem seu início de vigência sempre para o mês seguinte.
Reforçamos que todos os planos ofertados possuem a vigência padrão de 12 meses, sendo necessário permanecer ativo durante o período de vigência. Após os 12 meses, caso possua interesse em cancelar o plano, é necessário entrar em contato conosco.`,

    envioToken: `Título: ODONTOGROUP - ENVIO DE TOKEN

{gender} {name}, {greeting}!

Em atenção à sua solicitação, registrada por meio do protocolo nº {protocol}, encaminhamos abaixo o link contendo o token de acesso, por meio do qual será possível realizar a alteração ou atualização do cartão de crédito utilizado para o pagamento das mensalidades do seu plano odontológico:

XXXXXXXXXXXX

Orientamos que o procedimento seja realizado dentro do prazo de validade do token, a fim de garantir o cadastro em tempo hábil.

Ressaltamos que o cartão de crédito informado deve, obrigatoriamente, estar em nome do atual responsável financeiro do contrato, em conformidade com as cláusulas contratuais e com a LGPD.`,

    envioProtocolo: `Título: ODONTOGROUP - ENVIO DE PROTOCOLO

{gender} {name}, {greeting}!

Em atendimento à sua solicitação, informamos que o número de protocolo referente ao seu atendimento é nº {protocol}.

Salientamos que este número deve ser utilizado como referência em eventuais contatos futuros, possibilitando maior agilidade na localização e acompanhamento da sua solicitação.`,

    posVendas: `Título: ODONTOGROUP - BOAS-VINDAS PÓS-VENDAS

{gender} {name}, {greeting}!

Seja muito bem-vindo(a) ao nosso plano odontológico! Parabenizamos você por essa excelente escolha. Estamos à disposição para acompanhá-lo(a) em toda a sua jornada conosco.
 
Caso tenha dúvidas ou precise de qualquer informação, nosso Serviço de Atendimento ao Cliente (SAC) está preparado para atendê-lo(a) com atenção e cuidado. Será um prazer falar com você.
 
Informamos que tentamos contato por telefone, por meio do número xxxxxxxxxxxx, porém, infelizmente, não obtivemos sucesso.
 
Anexamos a este e-mail o Guia de Leitura Contratual, que contém todas as informações importantes sobre o plano contratado, incluindo:
 
- Detalhamento da cobertura do seu plano;
- Vigência contratual de 12 meses;
- Cláusula de multa rescisória de 20% sobre as parcelas vincendas, conforme estipulado em contrato; Renovação automática.
- Informações sobre os prazos de carência, contados a partir de:
 
Protocolo de atendimento: {protocol}.`
  };

  function togglePhoneField() {
    const purpose = document.getElementById("purpose").value;
    const phoneGroup = document.getElementById("phoneGroup");
    const cancelamentoGroup = document.getElementById("cancelamentoGroup");
    const isSemCPF = purpose === 'semCPF';

    // Hide/show fields that are not needed for "Solicitar o CPF"
    document.getElementById("nameGroup").style.display = isSemCPF ? 'none' : '';
    document.getElementById("protocolGroup").style.display = isSemCPF ? 'none' : '';
    document.getElementById("genderGroup").style.display = isSemCPF ? 'none' : '';

    // Clear values when hiding
    if (isSemCPF) {
      document.getElementById("name").value = '';
      document.getElementById("protocol").value = '';
      document.querySelectorAll('input[name="gender"]').forEach(r => r.checked = false);
    }

    phoneGroup.style.display = purpose === 'tentativaContato' ? 'block' : 'none';
    cancelamentoGroup.style.display = purpose === 'solicitaCancelamento' ? 'block' : 'none';
    document.getElementById("agendamentoGroup").style.display = purpose === 'agendamento' ? 'block' : 'none';

    if (purpose !== 'tentativaContato') document.getElementById("phoneContact").value = '';
    if (purpose !== 'solicitaCancelamento') {
      document.querySelectorAll('input[name="vigencia"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="mensalidade"]').forEach(r => r.checked = false);
      document.getElementById("mesMensalidade").value = '';
      document.getElementById("mesMensalidadeGroup").style.display = 'none';
    }
    if (purpose !== 'agendamento') {
      document.getElementById("agendEspecialidade").value = '';
      document.getElementById("agendDataHora").value = '';
      document.getElementById("agendClinica").value = '';
    }
  }

  // ─── Enter key shortcuts ───
  document.addEventListener('DOMContentLoaded', function() {
    [['inputNumber', consultarPlano], ['name', generateText], ['protocol', generateText],
     ['valorMensalidade', calcularMulta], ['mesesFaltantes', calcularMulta],
     ['valorTotalProduto', calcularProporcional], ['quantidadeDias', calcularProporcional],
     ['mesMensalidade', generateText]
    ].forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keypress', e => { if (e.key === 'Enter') fn(); });
    });

    document.querySelectorAll('input[name="mensalidade"]').forEach(radio => {
      radio.addEventListener('change', function() {
        document.getElementById("mesMensalidadeGroup").style.display =
          this.value === 'nao' ? 'block' : 'none';
        if (this.value !== 'nao') document.getElementById("mesMensalidade").value = '';
      });
    });
  });

  function generateText() {
    let name = document.getElementById("name").value.trim();
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const gender = genderInput ? genderInput.value : '';
    const protocol = document.getElementById("protocol").value.trim();
    const purpose = document.getElementById("purpose").value;
    const resultElement = document.getElementById("generatedText");
    const greeting = getGreeting();
    const phone = document.getElementById("phoneContact").value.trim();

    if (purpose !== 'semCPF' && (!name || !gender || !protocol || !purpose)) {
      resultElement.innerHTML = '<span style="color:rgba(255,100,100,0.8)">⚠ Preencha todos os campos obrigatórios.</span>';
      return;
    }
    if (!purpose) {
      resultElement.innerHTML = '<span style="color:rgba(255,100,100,0.8)">⚠ Selecione uma finalidade.</span>';
      return;
    }
    if (purpose === 'tentativaContato' && !phone) {
      resultElement.innerHTML = '<span style="color:rgba(255,100,100,0.8)">⚠ Informe o telefone cadastrado.</span>';
      return;
    }
    if (purpose === 'solicitaCancelamento') {
      const vigencia = document.querySelector('input[name="vigencia"]:checked');
      const mensalidade = document.querySelector('input[name="mensalidade"]:checked');
      if (!vigencia || !mensalidade) {
        resultElement.innerHTML = '<span style="color:rgba(255,100,100,0.8)">⚠ Selecione as opções de vigência e mensalidades.</span>';
        return;
      }
      if (mensalidade.value === 'nao' && !document.getElementById("mesMensalidade").value.trim()) {
        resultElement.innerHTML = '<span style="color:rgba(255,100,100,0.8)">⚠ Informe o mês da última mensalidade devida.</span>';
        return;
      }
    }
    if (purpose !== 'semCPF' && !/^[0-9]+$/.test(protocol)) {
      resultElement.innerHTML = '<span style="color:rgba(255,100,100,0.8)">⚠ O campo Protocolo deve conter apenas números.</span>';
      return;
    }

    if (name) name = capitalizarNome(name);

    let genderPrefix, genderAdj, genderPart;
    switch(gender) {
      case 'masculino':
        genderPrefix = 'Prezado';
        genderAdj    = 'tranquilo';
        genderPart   = 'comunicado';
        break;
      case 'feminino':
        genderPrefix = 'Prezada';
        genderAdj    = 'tranquila';
        genderPart   = 'comunicada';
        break;
      default:
        genderPrefix = 'Prezado(a)';
        genderAdj    = 'tranquilo(a)';
        genderPart   = 'comunicado(a)';
        break;
    }

    const agendEspecialidade = document.getElementById("agendEspecialidade") ? document.getElementById("agendEspecialidade").value.trim() : '';
    const agendDataHora = document.getElementById("agendDataHora") ? document.getElementById("agendDataHora").value.trim() : '';
    const agendClinica = document.getElementById("agendClinica") ? document.getElementById("agendClinica").value.trim() : '';

    if (purpose === 'agendamento' && (!agendEspecialidade || !agendDataHora || !agendClinica)) {
      resultElement.innerHTML = '<span style="color:rgba(255,100,100,0.8)">⚠ Preencha a especialidade, data/hora e as informações da clínica.</span>';
      return;
    }

    let text = texts[purpose]
      .replace(/{name}/g, name)
      .replace(/{gender}/g, genderPrefix)
      .replace(/{genderAdj}/g, genderAdj)
      .replace(/{genderPart}/g, genderPart)
      .replace(/{greeting}/g, greeting)
      .replace(/{protocol}/g, protocol)
      .replace(/{phone}/g, phone)
      .replace(/{agendEspecialidade}/g, agendEspecialidade)
      .replace(/{agendDataHora}/g, agendDataHora)
      .replace(/{agendClinica}/g, agendClinica);

    if (purpose === 'solicitaCancelamento') {
      const vigencia = document.querySelector('input[name="vigencia"]:checked').value;
      const mensalidade = document.querySelector('input[name="mensalidade"]:checked').value;
      const mesMensalidade = document.getElementById("mesMensalidade").value.trim();

      const multaTexto = vigencia === 'sim'
        ? 'não haverá cobrança de multa contratual.'
        : 'haverá cobrança de multa contratual.';

      const mensalidadeTexto = mensalidade === 'sim'
        ? 'Reforçamos que o seu contrato possui mensalidades em aberto, portanto orientamos que entre em contato com a nossa central de atendimento, caso seja do seu interesse.'
        : `Reforçamos que o seu contrato não possui mensalidades em aberto, sendo a última mensalidade devida referente ao mês ${mesMensalidade}.`;

      text = text
        .replace(/{multa}/g, multaTexto)
        .replace(/{mensalidade}/g, mensalidadeTexto);
    }

    text = text.replace(/\n/g, '<br>');
    resultElement.innerHTML = text;
  }

  // ─── Redes de Atendimento ───
  const redesData = {
    PR: {
      siso: [
        {
          nome: "CONSULTÓRIO DRA. ISABELA VAZQUEZ - ODONTOLOGIA E HARMONIZAÇÃO FACIAL",
          endereco: "RUA ALAGOAS, 792 - SALA 1202",
          bairro: "CENTRO",
          cep: "86010-520",
          municipio: "LONDRINA",
          uf: "PARANÁ",
          celular: "(43)99138.1938",
          horarios: "Segunda a sexta 9h às 12h e de 14h às 19h"
        },
        {
          nome: "EDIOGENES SIDRONIO DA SILVA JUNIOR",
          endereco: "RUA SENADOR SOUZA NAVES, 275 - SALA 104",
          bairro: "CENTRO",
          cep: "86010-160",
          municipio: "LONDRINA",
          uf: "PARANÁ",
          celular: "(43)99975.8638"
        },
        {
          nome: "JULIANA MORTATI DE MARTIN",
          endereco: "RUA PARA, 1122 - SALA 63 EDIFÍCIO COMERCIAL OURO VERDE",
          bairro: "CENTRO",
          cep: "86010-450",
          municipio: "LONDRINA",
          uf: "PARANÁ",
          celular: "(43)99162.7971"
        }
      ]
    },
    DF: {
      bruxismo: [
        {
          nome: "ORALUS",
          endereco: "SCS QUADRA 6 BLOCO A LOTE 110 - ED ARNALDO VILHARES",
          bairro: "ASA SUL",
          cep: "70324-900",
          municipio: "BRASÍLIA",
          uf: "DISTRITO FEDERAL",
          telefone: "(61)3037.8007",
          celular: "(61)98130.0924"
        }
      ]
    }
  };

  function consultarRede() {
    const uf = document.getElementById("redeUF").value;
    const proc = document.getElementById("redeProcedimento").value;
    const el = document.getElementById("redeResultado");

    if (!uf || !proc) {
      el.innerHTML = '<div class="no-results"><div class="no-results-icon">🔍</div>Selecione o estado e o procedimento para consultar.</div>';
      return;
    }

    const clinicas = redesData[uf] && redesData[uf][proc] ? redesData[uf][proc] : [];

    if (clinicas.length === 0) {
      el.innerHTML = '<div class="no-results"><div class="no-results-icon">😔</div>Nenhum prestador encontrado para essa combinação no momento.</div>';
      return;
    }

    const html = '<div class="clinic-list">' + clinicas.map(c => {
      let rows = '';
      rows += `<div class="clinic-info-row"><strong>Endereço:</strong>${c.endereco}</div>`;
      rows += `<div class="clinic-info-row"><strong>Bairro:</strong>${c.bairro}</div>`;
      rows += `<div class="clinic-info-row"><strong>CEP:</strong>${c.cep}</div>`;
      rows += `<div class="clinic-info-row"><strong>Município:</strong>${c.municipio}</div>`;
      rows += `<div class="clinic-info-row"><strong>UF:</strong>${c.uf}</div>`;
      if (c.telefone) rows += `<div class="clinic-info-row"><strong>Telefone Fixo:</strong>${c.telefone}</div>`;
      if (c.celular)  rows += `<div class="clinic-info-row"><strong>Celular:</strong>${c.celular}</div>`;
      if (c.horarios) rows += `<div class="clinic-info-row"><strong>Horários:</strong>${c.horarios}</div>`;
      return `<div class="clinic-card"><div class="clinic-name">${c.nome}</div><div class="clinic-info">${rows}</div></div>`;
    }).join('') + '</div>';

    el.innerHTML = html;
  }

  // ─── Planos ───
  function consultarPlano() {
    const input = document.getElementById("inputNumber").value;
    const n = Number(input);
    let r = "";

    const planos = {
      411630995: "Grupo de estados.<br><strong>Abrangência:</strong> AL, BA, DF, GO, MG, PE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Coletivo empresarial.",
      702168992: "Grupo de estados.<br><strong>Abrangência:</strong> AL, BA, DF, GO, MG, PE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Coletivo empresarial.",
      473269153: "Grupo de estados.<br><strong>Abrangência:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Coletivo empresarial.",
      468299128: "Grupo de estados.<br><strong>Abrangência:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Orto Doc+Aparelho+Manutenção.<br><strong>Contratação:</strong> Coletivo empresarial.",
      486254206: "Grupo de estados.<br><strong>Abrangência:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Orto Doc+Aparelho.<br><strong>Contratação:</strong> Coletivo empresarial.",
      486113202: "Nacional.<br><strong>Abrangência:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Orto Doc+Aparelho+Manutenção+Prótese.<br><strong>Contratação:</strong> Coletivo empresarial.",
      486114201: "Nacional.<br><strong>Abrangência:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Com Prótese.<br><strong>Contratação:</strong> Coletivo empresarial.",
      481366189: "Grupo de estados.<br><strong>Abrangência:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RJ, RN, RS, SE, SP e TO.<br><strong>Formação de preço:</strong> Misto.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Emergência RN 59.<br><strong>Contratação:</strong> Coletivo empresarial.",
      442562036: "Nacional.<br><strong>Abrangência:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Coletivo empresarial.",
      437337025: "Grupo de estados.<br><strong>Abrangência:</strong> DF, GO, TO, PE, AL.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Coletivo empresarial.",
      476630160: "Nome Comercial: Coletivo Adesão Bronze II.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Municipal.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> Brasília (DF).<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Franquia.<br><strong>Rol:</strong> Com Prótese.",
      468297121: "Nome Comercial: Coletivo Adesão Mais II.B.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Grupo de Estados.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE, TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Doc+Aparelho+Manutenção.",
      484268195: "Nome Comercial: Essencial Odonto Brasília CA.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Municipal.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> Brasília (DF).<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Co-participação.<br><strong>Rol:</strong> Mínimo ANS.",
      471297148: "Nome Comercial: FR Clínico Por Adesão II.B (Single).<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Grupo de Estados.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE, TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Franquia.<br><strong>Rol:</strong> Mínimo ANS.",
      496043232: "Nome Comercial: Master Especial Premium CA.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Nacional.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Orto Doc+Aparelho+Manutenção+Prótese+Clareamento+Implante.",
      474865154: "Nome Comercial: Master Especial.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Nacional.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Co-participação.<br><strong>Rol:</strong> Doc Orto+Aparelho+Manutenção+Prótese+Clareamento.",
      489270214: "Nome Comercial: Odonto Doc CA.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Nacional.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Orto Doc+Aparelho.",
      489269211: "Nome Comercial: Odonto Doc Premium CA.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Nacional.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Orto Doc+Aparelho+Prótese.",
      489285212: "Nome Comercial: Odonto Orto CA.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Nacional.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Orto Doc+Aparelho+Manutenção+Prótese.",
      489327211: "Nome Comercial: Odonto Orto Premium CA.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Nacional.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Orto Doc+Aparelho+Manutenção+Prótese.",
      481954183: "Nome Comercial: Odonto SOS CA.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Grupo de Estados.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RJ, RN, RS, SE, SP, TO.<br><strong>Formação de preço:</strong> Misto.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Emergência RN 59.",
      467608124: "Nome Comercial: Odontoclínico Coletivo II.B.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Grupo de Estados.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE, TO.<br><strong>Formação de preço:</strong> Pré-Estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.",
      442559036: "Nome Comercial: Odontoclínico Coletivo por Adesão.<br><strong>Contratação:</strong> Coletivo por Adesão.<br><strong>Abrangência Geográfica:</strong> Nacional.<br><strong>Situação:</strong> Ativo.<br><strong>Atuação:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-Estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.",
      442561038: "Nacional.<br><strong>Abrangência:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Co-participação.<br><strong>Rol:</strong> Documentação orto+Aparelho+Manutenções.<br><strong>Contratação:</strong> Individual ou Familiar.",
      411629991: "Grupo de estados.<br><strong>Abrangência:</strong> AL, BA, DF, GO, MG, PE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Individual ou familiar.",
      473268155: "Grupo de estados.<br><strong>Abrangência:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Individual ou familiar.",
      468461133: "Municipal.<br><strong>Abrangência:</strong> Maceió (AL), Manaus (AM), Salvador (BA), Fortaleza (CE), Brasília (DF), Goiânia (GO).<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Orto Doc+Aparelho+Manutenção.<br><strong>Contratação:</strong> Individual ou familiar.",
      484937200: "Grupo de estados.<br><strong>Abrangência:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Doc orto+Aparelho.<br><strong>Contratação:</strong> Individual ou familiar.",
      485957200: "Grupo de estados.<br><strong>Abrangência:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Individual ou familiar.",
      485502207: "Grupo de estados.<br><strong>Abrangência:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Orto Doc+Aparelho+Manutenção+Clareamento.<br><strong>Contratação:</strong> Individual ou familiar.",
      485086206: "Grupo de estados.<br><strong>Abrangência:</strong> AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Prótese+Placa oclusal.<br><strong>Contratação:</strong> Individual ou familiar.",
      459559099: "Municipal.<br><strong>Abrangência:</strong> Brasília (DF), Goiânia (GO), Recife (PE) ou Maceió (AL).<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Individual ou familiar.",
      442560030: "Nacional.<br><strong>Abrangência:</strong> Nacional.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Co-participação.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Individual ou familiar.",
      411631993: "Grupo de estados.<br><strong>Abrangência:</strong> AL, BA, DF, GO, MG, PE e TO.<br><strong>Formação de preço:</strong> Pré-estabelecido.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Mínimo ANS.<br><strong>Contratação:</strong> Individual ou familiar.",
      496805231: "Nacional.<br><strong>Nome Comercial:</strong> Odonto Doc NA.<br><strong>Abrangência:</strong> Nacional.<br><strong>Fator moderador:</strong> Não tem.<br><strong>Rol:</strong> Instalação do Aparelho+Documentação.<br><strong>Contratação:</strong> Individual ou Familiar."
    };

    r = planos[n] || '<span style="color:rgba(255,180,80,0.9)">⚠ Código não localizado. Revise-o e tente novamente.</span>';
    document.getElementById("resultado").innerHTML = r;
  }
