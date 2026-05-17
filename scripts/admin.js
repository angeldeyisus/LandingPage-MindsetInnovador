const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authSection = document.getElementById('auth-section');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('admin-email');
const passwordInput = document.getElementById('admin-password');
const adminPanel = document.getElementById('admin-panel');
const adminUserLabel = document.getElementById('admin-user');
const logoutBtn = document.getElementById('logout-btn');
const recordsTableBody = document.getElementById('records-table-body');
const adminMessage = document.getElementById('admin-message');

const showMessage = (message, type = 'info') => {
  adminMessage.textContent = message;
  adminMessage.className = `message ${type}`;
};

const renderRecords = (records) => {
  recordsTableBody.innerHTML = '';
  if (!records || records.length === 0) {
    recordsTableBody.innerHTML = '<tr><td colspan="4">No hay registros aún.</td></tr>';
    return;
  }

  records.forEach((record) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.id}</td>
      <td>${record.name || ''}</td>
      <td>${record.email || ''}</td>
      <td>${new Date(record.created_at).toLocaleString('es-ES')}</td>
    `;
    recordsTableBody.appendChild(row);
  });
};

const loadRecords = async () => {
  if (!supabase) {
    showMessage('Supabase no está configurado.', 'error');
    return;
  }

  showMessage('Cargando registros...', 'info');

  const { data, error } = await supabase
    .from('ebook_requests')
    .select('id,name,email,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error cargando registros:', error);
    showMessage('No se pudieron cargar los registros. Revisa la configuración de Supabase.', 'error');
    return;
  }

  renderRecords(data);
  showMessage(`Mostrando ${data.length} registro(s).`, 'success');
};

const updateAuthState = async () => {
  if (!supabase) {
    showMessage('Supabase no está configurado.', 'error');
    return;
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Error obteniendo sesión:', error);
    return;
  }

  if (session && session.user) {
    authSection.style.display = 'none';
    adminPanel.style.display = 'block';
    adminUserLabel.textContent = session.user.email;
    await loadRecords();
  } else {
    authSection.style.display = 'block';
    adminPanel.style.display = 'none';
    adminUserLabel.textContent = '';
  }
};

const signIn = async (email, password) => {
  if (!supabase) {
    showMessage('Supabase no está configurado.', 'error');
    return;
  }

  showMessage('Iniciando sesión...', 'info');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Error de login:', error);
    showMessage(error.message || 'Credenciales incorrectas o problema de conexión.', 'error');
    return;
  }

  if (data.session) {
    showMessage('Sesión iniciada correctamente.', 'success');
    await updateAuthState();
  } else {
    showMessage('No se obtuvo sesión. Revisa tus credenciales.', 'error');
  }
};

const signOut = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
  authSection.style.display = 'block';
  adminPanel.style.display = 'none';
  showMessage('Sesión cerrada.', 'success');
};

if (!supabase) {
  document.addEventListener('DOMContentLoaded', () => {
    showMessage('Supabase no está disponible. Revisa la configuración de scripts.', 'error');
  });
} else {
  document.addEventListener('DOMContentLoaded', async () => {
    await updateAuthState();
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showMessage('Por favor completa tu correo y contraseña.', 'warning');
      return;
    }

    await signIn(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut();
  });
}
