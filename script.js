const SUPABASE_URL = 'https://gklawesgnmnxanwqyxwi.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbGF3ZXNnbm1ueGFud3F5eHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NDczNjcsImV4cCI6MjEwNzEyMzM2N30.vH0uQFj2egoKhMZMnXIVyXyu_g_upm1PK7n-e0cqa5k';
  const supabaseClientPromise = import('https://esm.sh/@supabase/supabase-js@2').then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  );

  // ─── Helpers ───
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

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
  function copiarTexto(id, btn) {
    const el = document.getElementById(id);
    const text = el.innerText;
    btn = btn || el.closest('.card').querySelector('.btn-ghost');

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
          <div class="calc-card-value">${formatBRL(valorMensalidade)}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Meses restantes</div>
          <div class="calc-card-value">${mesesFaltantes}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Total de mensalidades</div>
          <div class="calc-card-value">${formatBRL(totalRestante)}</div>
        </div>
        <div class="calc-card highlight">
          <div class="calc-card-label">Multa a pagar (20%)</div>
          <div class="calc-card-value">${formatBRL(multa)}</div>
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
          <div class="calc-card-value">${formatBRL(valorTotal)}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Valor por dia</div>
          <div class="calc-card-value">${formatBRL(valorPorDia)}</div>
        </div>
        <div class="calc-card">
          <div class="calc-card-label">Dias</div>
          <div class="calc-card-value">${dias}</div>
        </div>
        <div class="calc-card highlight">
          <div class="calc-card-label">Valor pró-rata</div>
          <div class="calc-card-value">${formatBRL(valorFinal)}</div>
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

  // ─── Textos (vêm somente do banco: tabela text_templates) ───
  let texts = {};
  const templateLabels = {};

  // ─── Textos da interface (tabela app_settings) ───
  let appSettings = {}; // chave -> { label, value, multiline }

  function settingValue(key, fallback) {
    return appSettings[key] ? appSettings[key].value : fallback;
  }

  function applyAppSettings() {
    if (appSettings['app.document_title']) document.title = appSettings['app.document_title'].value;

    document.querySelectorAll('[data-setting]').forEach(el => {
      const setting = appSettings[el.dataset.setting];
      if (!setting) return;
      if (el.dataset.fallback !== undefined) {
        // Mensagem inicial de resultado: só troca se ainda não foi substituída por um resultado
        if (el.textContent.trim() !== el.dataset.fallback) return;
        el.dataset.fallback = setting.value;
      }
      el.textContent = setting.value;
    });

    document.querySelectorAll('[data-setting-placeholder]').forEach(el => {
      const setting = appSettings[el.dataset.settingPlaceholder];
      if (setting) el.setAttribute('placeholder', setting.value);
    });

    if (Object.keys(texts).length) populatePurposeSelect();
  }

  async function loadAppSettings() {
    document.querySelectorAll('[data-setting]').forEach(el => {
      if (el.dataset.setting.endsWith('.result.initial')) el.dataset.fallback = el.textContent.trim();
    });

    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      console.error('Supabase indisponível', e);
      return;
    }
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_key, label, setting_value, multiline');
    if (error) {
      console.error('Could not load app settings', error);
      return;
    }

    appSettings = {};
    data.forEach(row => {
      appSettings[row.setting_key] = { label: row.label, value: row.setting_value, multiline: row.multiline };
    });
    applyAppSettings();
    renderAppSettingsEditor();
  }

  function renderAppSettingsEditor() {
    const list = document.getElementById('appSettingsList');
    if (!list) return;
    list.replaceChildren();
    Object.entries(appSettings).forEach(([key, setting]) => {
      const group = document.createElement('div');
      group.className = 'form-group';

      const label = document.createElement('label');
      label.setAttribute('for', `setting-${key}`);
      label.textContent = setting.label;

      const field = document.createElement(setting.multiline ? 'textarea' : 'input');
      if (setting.multiline) field.rows = 6; else field.type = 'text';
      field.id = `setting-${key}`;
      field.dataset.settingKey = key;
      field.value = setting.value;

      group.append(label, field);
      list.appendChild(group);
    });
  }

  async function saveAppSettings() {
    if (!(await checkAdminSession())) {
      setAdminView(false);
      showAdminMessage('adminAuthMessage', 'Entre novamente para editar os textos.', 'error');
      return;
    }

    const rows = [];
    document.querySelectorAll('#appSettingsList [data-setting-key]').forEach(field => {
      const key = field.dataset.settingKey;
      if (field.value.trim() === '') return; // nunca salva campo vazio
      if (field.value !== appSettings[key].value) {
        rows.push({
          setting_key: key,
          label: appSettings[key].label,
          setting_value: field.value,
          multiline: appSettings[key].multiline
        });
      }
    });

    if (!rows.length) {
      showAdminMessage('adminSaveMessage', 'Nenhuma alteração para salvar.', '');
      return;
    }

    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      showAdminMessage('adminSaveMessage', 'Sem conexão com o servidor. Tente novamente.', 'error');
      return;
    }
    const { error } = await supabase.from('app_settings').upsert(rows, { onConflict: 'setting_key' });
    if (error) {
      console.error('Could not save app settings', error);
      showAdminMessage('adminSaveMessage', 'Não foi possível salvar os textos da interface.', 'error');
      return;
    }

    rows.forEach(r => { appSettings[r.setting_key].value = r.setting_value; });
    applyAppSettings();
    showAdminMessage('adminSaveMessage', `${rows.length} texto(s) da interface salvo(s).`, 'success');
  }

  function populatePurposeSelect() {
    const select = document.getElementById('purpose');
    if (!select) return;
    const current = select.value;
    select.replaceChildren();

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = settingValue('purpose.placeholder', '— Selecione um tópico —');
    select.appendChild(placeholder);

    Object.keys(texts)
      .sort((a, b) => templateLabel(a).localeCompare(templateLabel(b), 'pt-BR'))
      .forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = templateLabel(key);
        select.appendChild(opt);
      });

    if (current && texts[current] !== undefined) select.value = current;
  }

  async function loadSavedTemplates() {
    const select = document.getElementById('purpose');
    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      console.error('Supabase indisponível', e);
      showTemplatesError(select);
      return;
    }

    const { data, error } = await supabase
      .from('text_templates')
      .select('template_key, label, content');

    if (error) {
      console.error('Could not load saved templates', error);
      showTemplatesError(select);
      return;
    }

    texts = {};
    Object.keys(templateLabels).forEach(k => delete templateLabels[k]);
    data.forEach(template => {
      texts[template.template_key] = template.content;
      templateLabels[template.template_key] = template.label;
    });

    populatePurposeSelect();
    refreshAdminTemplateOptions();
    if (selectedTemplateKey && texts[selectedTemplateKey] === undefined) selectedTemplateKey = '';
    renderTemplateEditor();
  }

  function showTemplatesError(select) {
    if (select) select.options[0].textContent = '— Não foi possível carregar os textos —';
    const result = document.getElementById('generatedText');
    if (result) result.innerHTML = '<span style="color:var(--vermelho)">⚠ Não foi possível carregar os textos do banco de dados. Recarregue a página.</span>';
  }

  async function checkAdminSession() {
    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      console.error('Supabase indisponível', e);
      return false;
    }
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

    Object.keys(texts).forEach(key => {
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

    const label = document.createElement('label');
    label.setAttribute('for', `template-${selectedTemplateKey}`);
    label.textContent = templateLabel(selectedTemplateKey);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete-template';
    deleteBtn.textContent = 'Excluir mensagem';
    deleteBtn.onclick = () => deleteTemplate(selectedTemplateKey);

    header.append(label, deleteBtn);

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
    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      showAdminMessage('adminAuthMessage', 'Sem conexão com o servidor. Tente novamente.', 'error');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !(await checkAdminSession())) {
      if (!error) await supabase.auth.signOut();
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
    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      showAdminMessage('adminAuthMessage', 'Sem conexão com o servidor. Tente novamente.', 'error');
      return;
    }
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
    if (!textarea || !selectedTemplateKey) {
      showAdminMessage('adminSaveMessage', 'Selecione uma mensagem antes de salvar.', 'error');
      return;
    }

    const row = {
      template_key: selectedTemplateKey,
      label: templateLabel(selectedTemplateKey),
      content: textarea.value
    };

    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      showAdminMessage('adminSaveMessage', 'Sem conexão com o servidor. Tente novamente.', 'error');
      return;
    }
    const { error } = await supabase.from('text_templates').upsert(row, { onConflict: 'template_key' });

    if (error) {
      console.error('Could not save templates', error);
      showAdminMessage('adminSaveMessage', 'Não foi possível salvar as alterações.', 'error');
      return;
    }

    texts[row.template_key] = row.content;
    showAdminMessage('adminSaveMessage', 'Mensagem salva com sucesso.', 'success');
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
    populatePurposeSelect();

    selectedTemplateKey = key;
    refreshAdminTemplateOptions();
    labelInput.value = '';
    contentInput.value = '';
    renderTemplateEditor();
    showAdminMessage('adminSaveMessage', 'Nova mensagem adicionada. Clique em "Salvar mensagem selecionada" para confirmar.', 'success');
  }

  async function deleteTemplate(key) {
    if (!confirm(`Excluir a mensagem "${templateLabel(key)}"? Ela deixará de aparecer no gerador.`)) return;

    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      showAdminMessage('adminSaveMessage', 'Sem conexão com o servidor. Tente novamente.', 'error');
      return;
    }
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
    populatePurposeSelect();
    togglePhoneField();

    selectedTemplateKey = '';
    refreshAdminTemplateOptions();
    renderTemplateEditor();
    showAdminMessage('adminSaveMessage', 'Mensagem excluída.', 'success');
  }

  async function signOutAdmin() {
    try {
      const supabase = await supabaseClientPromise;
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Falha ao sair', e);
    }
    setAdminView(false);
    showAdminMessage('adminAuthMessage', 'Você saiu da área administrativa.', 'success');
  }

  function initializeAdmin() {
    document.getElementById('adminAuthForm').addEventListener('submit', handleAdminLogin);
    loadAppSettings().catch(err => console.error('Falha ao carregar textos da interface', err));
    loadSavedTemplates().catch(err => console.error('Falha ao carregar modelos', err));
    checkAdminSession().then(setAdminView).catch(err => console.error(err));
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
    if (texts[purpose] === undefined) {
      resultElement.innerHTML = '<span style="color:var(--vermelho)">⚠ Texto não encontrado. Recarregue a página.</span>';
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

    const values = {
      name,
      gender: genderPrefix,
      genderAdj,
      genderPart,
      greeting,
      protocol,
      phone,
      agendEspecialidade,
      agendDataHora,
      agendClinica
    };

    if (purpose === 'solicitaCancelamento') {
      const vigencia = document.querySelector('input[name="vigencia"]:checked').value;
      const mensalidade = document.querySelector('input[name="mensalidade"]:checked').value;
      const mesMensalidade = document.getElementById("mesMensalidade").value.trim();

      values.multa = vigencia === 'sim'
        ? 'não haverá cobrança de multa contratual.'
        : 'haverá cobrança de multa contratual.';

      values.mensalidade = mensalidade === 'sim'
        ? 'Reforçamos que o seu contrato possui mensalidades em aberto, portanto orientamos que entre em contato com a nossa central de atendimento, caso seja do seu interesse.'
        : `Reforçamos que o seu contrato não possui mensalidades em aberto, sendo a última mensalidade devida referente ao mês ${mesMensalidade}.`;
    }

    // Uma única passada: valores digitados nunca são reinterpretados como marcadores
    // e caracteres como "$&" ou "$$" não quebram a substituição.
    let text = texts[purpose].replace(/\{(\w+)\}/g, (match, key) =>
      Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
    );

    // Escapa HTML (nome, clínica etc.) antes de converter quebras de linha
    text = escapeHtml(text);

    text = text.replace(/\n/g, '<br>');
    resultElement.innerHTML = text;
  }
  // ─── Planos ───
  function renderPlanDetails(content) {
    // O conteúdo vem do banco no formato "Item. | Chave: valor. | Chave: valor."
    return content.split(' | ').map((part, i) => {
      const text = part.trim();
      const colon = text.indexOf(':');
      if (i > 0 && colon > 0) {
        return `<strong>${escapeHtml(text.slice(0, colon + 1))}</strong>${escapeHtml(text.slice(colon + 1))}`;
      }
      return escapeHtml(text);
    }).join('<br>');
  }

  async function consultarPlano() {
    const code = document.getElementById("inputNumber").value.trim();
    const out = document.getElementById("resultado");
    const notFound = '<span style="color:var(--vermelho)">⚠ Código não localizado. Revise-o e tente novamente.</span>';

    if (!/^[0-9]+$/.test(code)) {
      out.innerHTML = notFound;
      return;
    }

    out.textContent = 'Consultando…';
    let supabase;
    try {
      supabase = await supabaseClientPromise;
    } catch (e) {
      out.innerHTML = '<span style="color:var(--vermelho)">⚠ Não foi possível consultar o banco de dados. Tente novamente.</span>';
      return;
    }

    const { data, error } = await supabase
      .from('plan_details')
      .select('content')
      .eq('product_code', code)
      .maybeSingle();

    if (error) {
      console.error('Could not load plan details', error);
      out.innerHTML = '<span style="color:var(--vermelho)">⚠ Não foi possível consultar o banco de dados. Tente novamente.</span>';
      return;
    }

    out.innerHTML = data ? renderPlanDetails(data.content) : notFound;
  }

  document.addEventListener('DOMContentLoaded', initializeAdmin);
