  const SUPABASE_URL = 'https://gklawesgnmnxanwqyxwi.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbGF3ZXNnbm1ueGFud3F5eHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NDczNjcsImV4cCI6MjEwNzEyMzM2N30.vH0uQFj2egoKhMZMnXIVyXyu_g_upm1PK7n-e0cqa5k';
  const supabaseClientPromise = import('https://esm.sh/@supabase/supabase-js@2').then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  );

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
    const other = document.getElementById(
      src.id === 'toggleModeBtn' ? 'toggleModeBtn2' : 'toggleModeBtn'
    );

    if (other) other.checked = src.checked;

    document.body.classList.toggle('dark-mode', src.checked);

    // Troca a logo central conforme o tema
    const logo = document.getElementById('formLogo');

    if (logo) {
      logo.src = src.checked
        ? logo.dataset.logoDark
        : logo.dataset.logoLight;
    }
  }

  // ─── Copy ───
  function copiarTexto(id) {
    const el = document.getElementById(id);
    const text = el.innerText;
    const btn = document.querySelector('.btn-ghost');

    function mostrarSucesso() {
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Copiado!';
      btn.style.color = 'var(--azul)';
      btn.style.borderColor = 'var(--azul)';
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
      resultadoEl.innerHTML = '<span style="color:var(--vermelho)">⚠ Insira valores válidos.</span>';
      return;
    }
    if (mesesFaltantes > totalMesesContrato) {
      resultadoEl.innerHTML = `<span style="color:var(--vermelho)">⚠ Os meses faltantes não podem exceder ${totalMesesContrato}.</span>`;
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
      resultadoElement.innerHTML = '<span style="color:var(--vermelho)">⚠ Insira valores válidos (dias entre 1 e 31).</span>';
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
  // Os modelos de mensagem são carregados da tabela text_templates no Supabase.
  let texts = Object.create(null);
  let templateLabels = Object.create(null);
  let appSettingsRows = [];

  function addPurposeOption(value, label) {
    const purposeSelect = document.getElementById('purpose');
    if (!purposeSelect || purposeSelect.querySelector(`option[value="${CSS.escape(value)}"]`)) return;
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    purposeSelect.appendChild(option);
  }

  async function loadSavedTemplates() {
    const supabase = await supabaseClientPromise;
    const purposeSelect = document.getElementById('purpose');
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = appSettingsRows.find(row => row.setting_key === 'purpose.placeholder')?.setting_value || 'Carregando finalidades...';
    purposeSelect.replaceChildren(placeholder);

    const { data, error } = await supabase
      .from('text_templates')
      .select('template_key, label, content')
      .order('label', { ascending: true });

    if (error) {
      console.error('Não foi possível carregar os modelos do Supabase:', error);
      placeholder.textContent = 'Não foi possível carregar. Confira a tabela text_templates no Supabase.';
      showAdminMessage('adminSaveMessage', 'Falha ao carregar mensagens do banco de dados.', 'error');
      return;
    }

    texts = Object.create(null);
    templateLabels = Object.create(null);
    for (const template of (data || [])) {
      texts[template.template_key] = template.content;
      templateLabels[template.template_key] = template.label;
      addPurposeOption(template.template_key, template.label);
    }

    if (!data || data.length === 0) {
      placeholder.textContent = 'Nenhuma finalidade cadastrada. Execute o SQL de migração enviado.';
    } else {
      placeholder.textContent = appSettingsRows.find(row => row.setting_key === 'purpose.placeholder')?.setting_value || '— Selecione um tópico —';
    }
    refreshAdminTemplateOptions();
  }

  function applyAppSettings(preserveResults = false) {
    const values = Object.fromEntries(appSettingsRows.map(row => [row.setting_key, row.setting_value]));
    document.querySelectorAll('[data-setting]').forEach(element => {
      if (preserveResults && (element.classList.contains('result-area') || element.id === 'resultado')) return;
      const key = element.dataset.setting;
      if (Object.prototype.hasOwnProperty.call(values, key)) element.textContent = values[key];
    });
    document.querySelectorAll('[data-placeholder-setting]').forEach(element => {
      const key = element.dataset.placeholderSetting;
      if (Object.prototype.hasOwnProperty.call(values, key)) element.placeholder = values[key];
    });
    if (values['app.document_title']) document.title = values['app.document_title'];
  }

  async function loadAppSettings() {
    const supabase = await supabaseClientPromise;
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_key, label, setting_value, multiline')
      .order('label', { ascending: true });

    if (error) {
      console.error('Não foi possível carregar app_settings:', error);
      appSettingsRows = [];
      return;
    }

    appSettingsRows = data || [];
    applyAppSettings();
  }

  async function checkAdminSession() {
    const supabase = await supabaseClientPromise;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error('Could not check admin access', error);
      return false;
    }

    return Boolean(data);
  }

  function showAdminMessage(id, message, type = '') {
    const element = document.getElementById(id);
    element.textContent = message;
    element.className = `admin-message ${type}`;
  }

  function templateLabel(key) {
    return templateLabels[key] || key;
  }

  let selectedTemplateKey = '';

  function refreshAdminTemplateOptions() {
    const select = document.getElementById('adminTemplateSelect');
    if (!select) return;
    const currentValue = selectedTemplateKey;
    select.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '— Selecione uma mensagem —';
    select.appendChild(placeholder);

    Object.keys(texts).sort((a, b) => templateLabel(a).localeCompare(templateLabel(b), 'pt-BR')).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = templateLabel(key);
      select.appendChild(option);
    });
    select.value = currentValue;
  }

  function selectTemplateToEdit(key) {
    selectedTemplateKey = key;
    renderTemplateEditor();
  }

  function renderTemplateEditor() {
    const list = document.getElementById('templateEditorList');
    list.replaceChildren();
    if (!selectedTemplateKey || !Object.prototype.hasOwnProperty.call(texts, selectedTemplateKey)) {
      const empty = document.createElement('p');
      empty.className = 'template-editor-empty';
      empty.textContent = 'Selecione uma mensagem acima para começar a editar.';
      list.appendChild(empty);
      return;
    }

    const group = document.createElement('div');
    group.className = 'template-editor-item';

    const header = document.createElement('div');
    header.className = 'template-editor-header';

    const nameGroup = document.createElement('div');
    nameGroup.className = 'template-name-group';
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', `template-label-${selectedTemplateKey}`);
    nameLabel.textContent = 'Nome da finalidade no gerador';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = `template-label-${selectedTemplateKey}`;
    nameInput.value = templateLabel(selectedTemplateKey);
    nameInput.dataset.templateLabelKey = selectedTemplateKey;
    nameGroup.append(nameLabel, nameInput);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete-template';
    deleteBtn.textContent = 'Excluir mensagem';
    deleteBtn.onclick = () => deleteTemplate(selectedTemplateKey);

    header.append(nameGroup, deleteBtn);

    const textarea = document.createElement('textarea');
    textarea.id = `template-${selectedTemplateKey}`;
    textarea.dataset.templateKey = selectedTemplateKey;
    textarea.rows = 14;
    textarea.value = texts[selectedTemplateKey];

    group.append(header, textarea);
    list.appendChild(group);
  }

  function setAdminView(isAdmin) {
    document.getElementById('adminLoginCard').hidden = isAdmin;
    document.getElementById('adminEditorCard').hidden = !isAdmin;
    if (isAdmin) {
      refreshAdminTemplateOptions();
      renderTemplateEditor();
    }
  }

  async function handleAdminLogin(event) {
    event.preventDefault();
    showAdminMessage('adminAuthMessage', 'Entrando...');

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const supabase = await supabaseClientPromise;
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !(await checkAdminSession())) {
      showAdminMessage('adminAuthMessage', 'Não foi possível entrar com essa conta.', 'error');
      return;
    }

    showAdminMessage('adminAuthMessage', '');
    setAdminView(true);
  }

  async function createAdminAccount() {
    showAdminMessage('adminAuthMessage', 'Criando acesso...');

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const supabase = await supabaseClientPromise;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data.user) {
      showAdminMessage('adminAuthMessage', 'Não foi possível criar o acesso. Confira os dados informados.', 'error');
      return;
    }

    if (!data.session) {
      showAdminMessage('adminAuthMessage', 'A conta foi criada. Verifique seu e-mail para concluir o acesso.', 'success');
      return;
    }

    if (await checkAdminSession()) {
      setAdminView(true);
      showAdminMessage('adminSaveMessage', 'Acesso administrativo criado.', 'success');
    } else {
      showAdminMessage('adminAuthMessage', 'Esta conta não possui acesso administrativo.', 'error');
    }
  }

  async function saveTemplates() {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) {
      setAdminView(false);
      showAdminMessage('adminAuthMessage', 'Entre novamente para editar os textos.', 'error');
      return;
    }

    const textarea = document.querySelector('#templateEditorList textarea');
    const nameInput = document.querySelector('#templateEditorList [data-template-label-key]');
    if (!textarea || !nameInput || !selectedTemplateKey) {
      showAdminMessage('adminSaveMessage', 'Selecione uma mensagem antes de salvar.', 'error');
      return;
    }

    const label = nameInput.value.trim();
    if (!label || !textarea.value.trim()) {
      showAdminMessage('adminSaveMessage', 'Informe o nome da finalidade e o texto da mensagem.', 'error');
      return;
    }

    const row = {
      template_key: selectedTemplateKey,
      label,
      content: textarea.value,
      updated_at: new Date().toISOString()
    };

    const supabase = await supabaseClientPromise;
    const { error } = await supabase.from('text_templates').upsert(row, { onConflict: 'template_key' });
    if (error) {
      console.error('Não foi possível salvar o modelo:', error);
      showAdminMessage('adminSaveMessage', 'Não foi possível salvar as alterações.', 'error');
      return;
    }

    texts[row.template_key] = row.content;
    templateLabels[row.template_key] = row.label;
    const purposeOption = document.querySelector(`#purpose option[value="${CSS.escape(row.template_key)}"]`);
    if (purposeOption) purposeOption.textContent = row.label;
    refreshAdminTemplateOptions();
    renderTemplateEditor();
    showAdminMessage('adminSaveMessage', 'Nome e mensagem salvos no banco de dados.', 'success');
  }

  function slugifyLabel(label) {
    const slug = label.trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    return 'custom_' + (slug || 'modelo') + '_' + Date.now().toString(36);
  }

  function addNewTemplate() {
    const labelInput = document.getElementById('newTemplateLabel');
    const contentInput = document.getElementById('newTemplateContent');
    const label = labelInput.value.trim();
    const content = contentInput.value.trim();

    if (!label || !content) {
      showAdminMessage('adminSaveMessage', 'Preencha o nome e o texto da nova mensagem.', 'error');
      return;
    }

    const key = slugifyLabel(label);
    texts[key] = content;
    templateLabels[key] = label;

    const purposeSelect = document.getElementById('purpose');
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = label;
    purposeSelect.appendChild(opt);

    selectedTemplateKey = key;
    refreshAdminTemplateOptions();
    labelInput.value = '';
    contentInput.value = '';
    renderTemplateEditor();
    showAdminMessage('adminSaveMessage', 'Nova mensagem adicionada. Clique em "Salvar alterações" para confirmar.', 'success');
  }

  async function deleteTemplate(key) {
    const supabase = await supabaseClientPromise;
    const { error } = await supabase
      .from('text_templates')
      .delete()
      .eq('template_key', key);

    if (error) {
      showAdminMessage('adminSaveMessage', 'Não foi possível excluir a mensagem.', 'error');
      return;
    }

    delete texts[key];
    delete templateLabels[key];

    const opt = document.querySelector(`#purpose option[value="${key}"]`);
    if (opt) opt.remove();

    selectedTemplateKey = '';
    refreshAdminTemplateOptions();
    renderTemplateEditor();
    showAdminMessage('adminSaveMessage', 'Mensagem excluída.', 'success');
  }

  async function signOutAdmin() {
    const supabase = await supabaseClientPromise;
    await supabase.auth.signOut();
    setAdminView(false);
    showAdminMessage('adminAuthMessage', 'Você saiu da área administrativa.', 'success');
  }

  async function initializeAdmin() {
    document.getElementById('adminAuthForm').addEventListener('submit', handleAdminLogin);
    await loadAppSettings();
    await loadSavedTemplates();
    await loadPlanDetails();
    const isAdmin = await checkAdminSession();
    setAdminView(isAdmin);
  }

  // ─── Text editor and admin access ───
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
      resultElement.innerHTML = '<span style="color:var(--vermelho)">⚠ Preencha todos os campos obrigatórios.</span>';
      return;
    }
    if (!purpose) {
      resultElement.innerHTML = '<span style="color:var(--vermelho)">⚠ Selecione uma finalidade.</span>';
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(texts, purpose)) {
      resultElement.textContent = 'Esta mensagem não está carregada do banco de dados. Atualize a página ou confira a tabela text_templates.';
      return;
    }
    if (purpose === 'tentativaContato' && !phone) {
      resultElement.innerHTML = '<span style="color:var(--vermelho)">⚠ Informe o telefone cadastrado.</span>';
      return;
    }
    if (purpose === 'solicitaCancelamento') {
      const vigencia = document.querySelector('input[name="vigencia"]:checked');
      const mensalidade = document.querySelector('input[name="mensalidade"]:checked');
      if (!vigencia || !mensalidade) {
        resultElement.innerHTML = '<span style="color:var(--vermelho)">⚠ Selecione as opções de vigência e mensalidades.</span>';
        return;
      }
      if (mensalidade.value === 'nao' && !document.getElementById("mesMensalidade").value.trim()) {
        resultElement.innerHTML = '<span style="color:var(--vermelho)">⚠ Informe o mês da última mensalidade devida.</span>';
        return;
      }
    }
    if (purpose !== 'semCPF' && !/^[0-9]+$/.test(protocol)) {
      resultElement.innerHTML = '<span style="color:var(--vermelho)">⚠ O campo Protocolo deve conter apenas números.</span>';
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
      resultElement.innerHTML = '<span style="color:var(--vermelho)">⚠ Preencha a especialidade, data/hora e as informações da clínica.</span>';
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
  // ─── Abrangências dos planos: dados carregados e salvos no Supabase ───
  let planDetails = Object.create(null);

  async function loadPlanDetails() {
    const supabase = await supabaseClientPromise;
    const { data, error } = await supabase
      .from('plan_details')
      .select('product_code, content')
      .order('product_code', { ascending: true });

    if (error) {
      console.error('Não foi possível carregar as abrangências dos planos:', error);
      planDetails = Object.create(null);
      return;
    }

    planDetails = Object.create(null);
    for (const row of (data || [])) planDetails[row.product_code] = row.content;
  }

  async function consultarPlano() {
    const code = document.getElementById('inputNumber').value.trim();
    const result = document.getElementById('resultado');
    if (!code) {
      result.textContent = 'Informe o código do produto para consultar.';
      return;
    }

    const details = planDetails[code];
    if (!details) {
      result.innerHTML = '<span style="color:var(--vermelho)">⚠ Código não localizado. Revise-o e tente novamente.</span>';
      return;
    }
    result.textContent = details;
  }

  document.addEventListener('DOMContentLoaded', initializeAdmin);

function updateFormLogo(isDark) {
  const logo = document.getElementById('formLogo');
  if (!logo) return;

  logo.src = isDark
    ? logo.dataset.logoDark
    : logo.dataset.logoLight;
}
