class EbookBackend {
  constructor({ supabaseUrl, supabaseAnonKey }) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseAnonKey;
    this.client = null;
  }

  init() {
    if (!window.supabase) {
      throw new Error('Supabase JS no está disponible. Asegura la carga del script de Supabase antes de ebookBackend.js');
    }

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error('Configura SUPABASE_URL y SUPABASE_ANON_KEY en ebookBackend.js');
    }

    this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
  }

  isReady() {
    return !!this.client;
  }

  async saveEbookRequest({ name, email }) {
    if (!this.client) {
      throw new Error('EbookBackend no está inicializado. Llama a init() antes de guardar datos.');
    }

    return await this.client.from('ebook_requests').insert([{ name, email }]);
  }
}

window.EbookBackend = EbookBackend;
