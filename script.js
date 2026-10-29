const SUPABASE_URL = 'https://excnllnuwmmksasowbox.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_f0nSx5N1WKnMA9IIey7TjQ_BXttEM1y';

const supabaseClientPromise = SUPABASE_URL.startsWith('COLE_AQUI')
  ? Promise.reject(new Error('Supabase não configurado'))
  : import('https://esm.sh/@supabase/supabase-js@2')
      .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY));

supabaseClientPromise.catch(e => console.error(e));

const $ = id => document.getElementById(id);
const warn = m => `<span style="color:var(--vermelho)">⚠ ${m}</span>`;

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

  const section = document.getElementById(sectionId);
  if (section) section.classList.add('active');
  if (el) el.classList.add('active');

  closeSidebar();
}

// ─── Sidebar mobile ───
function toggleSidebar() {
  const sidebar = $('sidebar');
  const overlay = $('overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

function closeSidebar() {
  const sidebar = $('sidebar');
  const overlay = $('overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

// ─── Theme ───
function syncAndToggle(src) {
  const other = document.getElementById(
    src.id === 'toggleModeBtn' ? 'toggleModeBtn2' : 'toggleModeBtn'
  );

  if (other) other.checked = src.checked;

  document.body.classList.toggle('dark-mode', src.checked);
  try {
    localStorage.setItem('theme', src.checked ? 'dark' : 'light');
  } catch (e) {}

  // Troca a logo central conforme o tema
  const logo = document.getElementById('formLogo');
  if (logo) {
    logo.src = src.checked ? logo.dataset.logoDark : logo.dataset.logoLight;
  }
}

// ─── Copy ───
function copiarTexto(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;

  const text = el.innerText;
  btn = btn || el.closest('.card')?.querySelector('.btn-ghost');

  function mostrarSucesso() {
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Copiado!';
    btn.style.color = 'var(--azul)';
    btn.style.borderColor = 'var(--azul)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 1800);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(mostrarSucesso)
      .catch(() => copiarFallback(text, mostrarSucesso));
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
  } catch (e) {
    console.error('Não foi possível copiar o texto.', e);
  }

  document.body.removeChild(ta);
}

// ─── Multa ───
function calcularMulta() {
  const valorMensalidade = parseFloat($('valorMensalidade').value);
  const mesesFaltantes = parseInt($('mesesFaltantes').value, 10);
  const resultadoEl = $('multaResultado');
  const totalMesesContrato = 13;

  if (
    isNaN(valorMensalidade) || valorMensalidade <= 0 ||
    isNaN(mesesFaltantes) || mesesFaltantes < 0
  ) {
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
  const valorTotal = parseFloat($('valorTotalProduto').value);
  const dias = parseInt($('quantidadeDias').value, 10);
  const resultadoElement = $('resultadoProporcional');

  if (
    isNaN(valorTotal) || valorTotal <= 0 ||
    isNaN(dias) || dias <= 0 || dias > 31
  ) {
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
  return h < 12 ? 'bom dia' : h < 18 ? 'boa tarde' : 'boa noite';
}

function capitalizarNome(nome) {
  const prep = ['de', 'da', 'do', 'das', 'dos', 'e'];
  return nome.trim().toLowerCase().split(/\s+/).map((w, i) => {
    if (i !== 0 && prep.includes(w)) return w;
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

// ─── Campos exigidos por cada mensagem (detectados pelos {marcadores} do texto) ───
const FIELD_KEYS = {
  name: ['name'],
  gender: ['gender', 'genderAdj', 'genderPart'],
  protocol: ['protocol'],
  phone: ['phone'],
  multa: ['multa'],
  mensalidade: ['mensalidade'],
  especialidade: ['especialidade', 'agendEspecialidade'],
  datahora: ['dataHora', 'agendDataHora'],
  clinica: ['clinica', 'agendClinica']
};

function needs(content) {
  const used = new Set((String(content || '').match(/\{(\w+)\}/g) || []).map(k => k.slice(1, -1)));
  const result = {};

  Object.entries(FIELD_KEYS).forEach(([field, keys]) => {
    result[field] = keys.some(key => used.has(key));
  });

  return result;
}

// A tabela text_templates possui id, label e content.
let templates = []; // { id, label, content }

const currentTemplate = () =>
  templates.find(t => String(t.id) === String($('purpose')?.value || ''));

function onPurposeChange() {
  const t = currentTemplate();
  const n = t ? needs(t.content) : {};

  ['name', 'protocol', 'gender', 'phone', 'multa', 'mensalidade', 'especialidade', 'datahora', 'clinica']
    .forEach(f => {
      const el = $('g-' + f);
      if (el) el.hidden = !n[f];
    });

  syncMes();
}

function syncMes() {
  const m = document.querySelector('input[name="mensalidade"]:checked');
  const mes = $('g-mes');
  const mens = $('g-mensalidade');

  if (mes && mens) {
    mes.hidden = mens.hidden || !m || m.value !== 'nao';
  }
}

function generateText() {
  const out = $('generatedText');
  if (!out) return;

  const t = currentTemplate();
  out.classList.remove('is-empty');

  if (!t) {
    out.innerHTML = warn('Selecione uma finalidade.');
    return;
  }

  const n = needs(t.content);
  const values = { greeting: getGreeting() };
  const missing = [];
  const radio = name => document.querySelector(`input[name="${name}"]:checked`);
  const val = id => ($(id)?.value || '').trim();

  if (n.name) {
    const x = val('name');
    if (!x) missing.push('nome');
    values.name = capitalizarNome(x);
  }

  if (n.protocol) {
    const x = val('protocol');
    if (!/^[0-9]+$/.test(x)) missing.push('protocolo (somente números)');
    values.protocol = x;
  }

  if (n.gender) {
    const g = radio('gender');
    if (!g) missing.push('sexo');

    const set = {
      masculino: ['Prezado', 'tranquilo', 'comunicado'],
      feminino: ['Prezada', 'tranquila', 'comunicada']
    }[g && g.value] || ['Prezado(a)', 'tranquilo(a)', 'comunicado(a)'];

    [values.gender, values.genderAdj, values.genderPart] = set;
  }

  if (n.phone) {
    values.phone = val('phoneContact');
    if (!values.phone) missing.push('telefone');
  }

  // Especialidade, data/hora e clínica são campos independentes.
  if (n.especialidade) {
    values.especialidade = values.agendEspecialidade = val('agendEspecialidade');
    if (!values.especialidade) missing.push('especialidade');
  }

  if (n.datahora) {
    values.dataHora = values.agendDataHora = val('agendDataHora');
    if (!values.dataHora) missing.push('data e hora');
  }

  if (n.clinica) {
    values.clinica = values.agendClinica = val('agendClinica');
    if (!values.clinica) missing.push('clínica');
  }

  if (n.multa) {
    const g = radio('vigencia');
    if (!g) missing.push('vigência');

    values.multa = g && g.value === 'sim'
      ? 'não haverá cobrança de multa contratual.'
      : 'haverá cobrança de multa contratual.';
  }

  if (n.mensalidade) {
    const g = radio('mensalidade');
    const mes = val('mesMensalidade');

    if (!g) {
      missing.push('mensalidades em aberto');
    } else if (g.value === 'nao' && !mes) {
      missing.push('mês da última mensalidade');
    }

    values.mensalidade = g && g.value === 'sim'
      ? 'Reforçamos que o seu contrato possui mensalidades em aberto, portanto orientamos que entre em contato com a nossa central de atendimento, caso seja do seu interesse.'
      : `Reforçamos que o seu contrato não possui mensalidades em aberto, sendo a última mensalidade devida referente ao mês ${mes}.`;
  }

  if (missing.length) {
    out.innerHTML = warn('Preencha: ' + missing.join(', ') + '.');
    return;
  }

  // Uma única passada: o texto digitado nunca é reinterpretado como marcador.
  const text = t.content.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
  );

  out.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');
}

// ─── Abrangências (consulta) ───
function renderPlanDetails(content) {
  if (content == null || String(content).trim() === '') {
    return warn('Não há detalhes cadastrados para este código.');
  }

  return String(content)
    .split(/ \| |\n/)
    .filter(part => part.trim())
    .map((part, i) => {
      const text = part.trim();
      const colon = text.indexOf(':');

      return i > 0 && colon > 0
        ? `<strong>${escapeHtml(text.slice(0, colon + 1))}</strong>${escapeHtml(text.slice(colon + 1))}`
        : escapeHtml(text);
    })
    .join('<br>');
}

async function consultarPlano() {
  const code = ($('inputNumber')?.value || '').trim();
  const out = $('resultado');

  if (!out) return;

  const notFound = warn('Código não localizado. Revise-o e tente novamente.');

  if (!/^[0-9]+$/.test(code)) {
    out.innerHTML = notFound;
    return;
  }

  out.textContent = 'Consultando…';

  try {
    const supabase = await supabaseClientPromise;
    const { data, error } = await supabase
      .from('plan_details')
      .select('content')
      .eq('product_code', code)
      .maybeSingle();

    if (error) throw error;

    out.innerHTML = data ? renderPlanDetails(data.content) : notFound;
  } catch (e) {
    console.error('Erro ao consultar abrangência:', e);
    out.innerHTML = warn('Não foi possível consultar o banco de dados. Tente novamente.');
  }
}

// ─── Mensagens: carregar ───
async function loadTemplates(selectId = '') {
  const sel = $('purpose');
  if (!sel) return;

  const keep = String(sel.value || '');

  try {
    const supabase = await supabaseClientPromise;
    const { data, error } = await supabase
      .from('text_templates')
      .select('id, label, content')
      .order('label', { ascending: true });

    if (error) throw error;

    templates = (data || []).map(row => ({
      id: String(row.id),
      label: row.label,
      content: row.content
    }));
  } catch (e) {
    console.error('Erro ao carregar mensagens:', e);
    sel.innerHTML = '<option value="">— Não foi possível carregar —</option>';

    const generatedText = $('generatedText');
    if (generatedText) {
      generatedText.innerHTML = warn(
        'Não foi possível carregar as mensagens: ' +
        escapeHtml(String((e && e.message) || e))
      );
    }
    return;
  }

  const opts = templates.map(t =>
    `<option value="${escapeHtml(t.id)}">${escapeHtml(t.label)}</option>`
  ).join('');

  sel.innerHTML =
    `<option value="">${templates.length
      ? '— Selecione uma finalidade —'
      : '— Nenhuma mensagem cadastrada —'}</option>` + opts;

  const selectedPurpose = templates.some(t => t.id === keep) ? keep : '';
  sel.value = selectedPurpose;

  const tplSelect = $('tplSelect');
  if (tplSelect) {
    tplSelect.innerHTML = '<option value="">+ Nova mensagem</option>' + opts;
  }

  const idToSelect = String(selectId || selectedPurpose);
  selectTemplate(idToSelect);
  onPurposeChange();
}

// ─── Administração ───
function msg(text, type = '', id = 'adminSaveMessage') {
  const element = $(id);
  if (!element) return;
  element.textContent = text;
  element.className = 'admin-message ' + type;
}

function setAdminView(on) {
  const loginCard = $('adminLoginCard');
  const editorCard = $('adminEditorCard');

  if (loginCard) loginCard.hidden = on;
  if (editorCard) editorCard.hidden = !on;

  if (on) loadPlans();
}

async function isAdmin() {
  try {
    const supabase = await supabaseClientPromise;
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return false;

    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar administrador:', error);
      return false;
    }

    return Boolean(data);
  } catch (e) {
    console.error('Erro ao verificar administrador:', e);
    return false;
  }
}

async function requireAdmin() {
  if (await isAdmin()) return true;

  setAdminView(false);
  msg('Entre novamente para continuar.', 'error', 'adminAuthMessage');
  return false;
}

async function handleAdminLogin(ev) {
  ev.preventDefault();
  msg('Entrando...', '', 'adminAuthMessage');

  try {
    const supabase = await supabaseClientPromise;
    const { error } = await supabase.auth.signInWithPassword({
      email: $('adminEmail').value.trim(),
      password: $('adminPassword').value
    });

    if (error || !(await isAdmin())) {
      if (!error) await supabase.auth.signOut();
      msg('Não foi possível entrar com essa conta.', 'error', 'adminAuthMessage');
      return;
    }

    msg('', '', 'adminAuthMessage');
    setAdminView(true);
  } catch (e) {
    console.error('Erro no login administrativo:', e);
    msg('Sem conexão com o servidor. Tente novamente.', 'error', 'adminAuthMessage');
  }
}

async function signOutAdmin() {
  try {
    await (await supabaseClientPromise).auth.signOut();
  } catch (e) {
    console.error('Erro ao sair da conta administrativa:', e);
  }

  setAdminView(false);
  msg('Você saiu da área administrativa.', 'success', 'adminAuthMessage');
}

function selectTemplate(id) {
  const normalizedId = String(id || '');
  const t = templates.find(x => x.id === normalizedId);

  const tplSelect = $('tplSelect');
  const tplLabel = $('tplLabel');
  const tplContent = $('tplContent');
  const tplDelete = $('tplDelete');

  if (tplSelect) tplSelect.value = t ? normalizedId : '';
  if (tplLabel) tplLabel.value = t ? t.label : '';
  if (tplContent) tplContent.value = t ? t.content : '';
  if (tplDelete) tplDelete.hidden = !t;
}

function insertField(k) {
  const el = $('tplContent');
  if (!el) return;

  el.setRangeText('{' + k + '}', el.selectionStart, el.selectionEnd, 'end');
  el.focus();
}

async function saveTemplate() {
  if (!(await requireAdmin())) return;

  const label = $('tplLabel').value.trim();
  const content = $('tplContent').value.trim();
  const id = String($('tplSelect').value || '');

  if (!label || !content) {
    msg('Preencha o nome e o texto da mensagem.', 'error');
    return;
  }

  try {
    const supabase = await supabaseClientPromise;
    let result;

    if (id) {
      // Atualiza o modelo existente usando a coluna id.
      result = await supabase
        .from('text_templates')
        .update({
          label,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    } else {
      // O banco gera o id automaticamente para um novo modelo.
      result = await supabase
        .from('text_templates')
        .insert({ label, content });
    }

    if (result.error) throw result.error;

    await loadTemplates(id);
    msg('Mensagem salva.', 'success');
  } catch (e) {
    console.error('Erro ao salvar mensagem:', e);
    msg('Não foi possível salvar a mensagem.', 'error');
  }
}

async function deleteTemplate() {
  const id = String($('tplSelect')?.value || '');
  const t = templates.find(x => x.id === id);

  if (
    !t ||
    !(await requireAdmin()) ||
    !confirm(`Excluir a mensagem "${t.label}"? Ela deixará de aparecer no gerador.`)
  ) {
    return;
  }

  try {
    const { error } = await (await supabaseClientPromise)
      .from('text_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await loadTemplates('');
    msg('Mensagem excluída.', 'success');
  } catch (e) {
    console.error('Erro ao excluir mensagem:', e);
    msg('Não foi possível excluir a mensagem.', 'error');
  }
}

// ─── Administração de abrangências ───
async function loadPlans(selectCode = '') {
  try {
    const { data, error } = await (await supabaseClientPromise)
      .from('plan_details')
      .select('product_code')
      .order('product_code');

    if (error) throw error;

    $('planSelect').innerHTML =
      '<option value="">+ Novo código</option>' +
      (data || []).map(row =>
        `<option value="${escapeHtml(row.product_code)}">${escapeHtml(row.product_code)}</option>`
      ).join('');
  } catch (e) {
    console.error('Erro ao carregar códigos de planos:', e);
  }

  await selectPlan(selectCode);
}

async function selectPlan(code) {
  const planSelect = $('planSelect');
  const planCode = $('planCode');
  const planContent = $('planContent');
  const planDelete = $('planDelete');

  if (!planSelect || !planCode || !planContent || !planDelete) return;

  planSelect.value = code;
  planCode.value = code;
  planContent.value = '';
  planDelete.hidden = !code;

  if (!code) return;

  try {
    const { data, error } = await (await supabaseClientPromise)
      .from('plan_details')
      .select('content')
      .eq('product_code', code)
      .maybeSingle();

    if (error) throw error;
    if (data) planContent.value = data.content || '';
  } catch (e) {
    console.error('Erro ao carregar detalhes do plano:', e);
  }
}

async function savePlan() {
  if (!(await requireAdmin())) return;

  const code = $('planCode').value.trim();
  const content = $('planContent').value.trim();

  if (!/^[0-9]+$/.test(code) || !content) {
    msg('Informe o código (somente números) e os detalhes da cobertura.', 'error');
    return;
  }

  try {
    const { error } = await (await supabaseClientPromise)
      .from('plan_details')
      .upsert(
        {
          product_code: code,
          content,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'product_code' }
      );

    if (error) throw error;

    await loadPlans(code);
    msg('Abrangência salva.', 'success');
  } catch (e) {
    console.error('Erro ao salvar abrangência:', e);
    msg('Não foi possível salvar a abrangência.', 'error');
  }
}

async function deletePlan() {
  const code = $('planSelect').value;

  if (
    !code ||
    !(await requireAdmin()) ||
    !confirm(`Excluir o código ${code}? Ele deixará de aparecer na consulta.`)
  ) {
    return;
  }

  try {
    const { error } = await (await supabaseClientPromise)
      .from('plan_details')
      .delete()
      .eq('product_code', code);

    if (error) throw error;

    await loadPlans('');
    msg('Abrangência excluída.', 'success');
  } catch (e) {
    console.error('Erro ao excluir abrangência:', e);
    msg('Não foi possível excluir a abrangência.', 'error');
  }
}

// ─── Inicialização ───
document.addEventListener('DOMContentLoaded', () => {
  const required = [
    'purpose', 'g-name', 'g-protocol', 'g-gender', 'g-phone', 'g-multa',
    'g-mensalidade', 'g-mes', 'g-especialidade', 'g-datahora', 'g-clinica',
    'generatedText', 'tplSelect', 'planSelect', 'adminAuthForm'
  ];

  const missing = required.filter(id => !$(id));

  if (missing.length) {
    console.error(
      'index.html e script.js são de versões diferentes. Faltam no HTML:',
      missing.join(', ')
    );

    const box = $('generatedText');
    if (box) {
      box.innerHTML = warn(
        'O index.html está desatualizado em relação ao script.js (faltam: ' +
        missing.join(', ') +
        '). Envie os dois arquivos juntos e atualize com Ctrl+F5.'
      );
    }
    return;
  }

  let saved = null;
  try {
    saved = localStorage.getItem('theme');
  } catch (e) {}

  const dark = saved
    ? saved === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

  const toggle = $('toggleModeBtn');
  if (toggle && dark) {
    toggle.checked = true;
    syncAndToggle(toggle);
  }

  const toggle2 = $('toggleModeBtn2');
  if (toggle2) {
    toggle2.addEventListener('change', () => syncAndToggle(toggle2));
  }
  if (toggle) {
    toggle.addEventListener('change', () => syncAndToggle(toggle));
  }

  $('adminAuthForm').addEventListener('submit', handleAdminLogin);

  document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(item =>
        item.classList.toggle('active', item === button)
      );

      ['tabMsg', 'tabPlan'].forEach(id => {
        const tab = $(id);
        if (tab) tab.hidden = id !== button.dataset.tab;
      });
    });
  });

  document.querySelectorAll('input[name="mensalidade"]').forEach(radio => {
    radio.addEventListener('change', syncMes);
  });

  const enterActions = [
    ['inputNumber', consultarPlano],
    ['name', generateText],
    ['protocol', generateText],
    ['mesMensalidade', generateText],
    ['valorMensalidade', calcularMulta],
    ['mesesFaltantes', calcularMulta],
    ['valorTotalProduto', calcularProporcional],
    ['quantidadeDias', calcularProporcional]
  ];

  enterActions.forEach(([id, fn]) => {
    const element = $(id);
    if (element) {
      element.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          fn();
        }
      });
    }
  });

  if ($('purpose')) $('purpose').addEventListener('change', onPurposeChange);
  if ($('tplSelect')) $('tplSelect').addEventListener('change', () => selectTemplate($('tplSelect').value));
  if ($('planSelect')) $('planSelect').addEventListener('change', () => selectPlan($('planSelect').value));

  loadTemplates();
  isAdmin().then(setAdminView);
});
