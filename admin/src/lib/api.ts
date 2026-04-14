const API_URL = import.meta.env.VITE_API_URL || '';

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  status: 'draft' | 'published';
  featured: boolean;
  read_time: number;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  cover_image?: string | null;
  category?: string;
  status?: 'draft' | 'published';
  featured?: boolean;
  read_time?: number;
  meta_title?: string;
  meta_description?: string;
}

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    if (!path.includes('/auth/')) {
      window.location.href = '/gestione-contenuti-vra2024/login';
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Errore ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login(email: string, password: string) {
    return request<{ token: string; user: { id: number; email: string } }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },
  me() {
    return request<{ user: { id: number; email: string } }>('/api/auth/me');
  },

  // Articles
  listArticles() {
    return request<Article[]>('/api/admin/articles');
  },
  getArticle(id: number) {
    return request<Article>(`/api/admin/articles/${id}`);
  },
  createArticle(data: ArticleInput) {
    return request<Article>('/api/admin/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateArticle(id: number, data: ArticleInput) {
    return request<Article>(`/api/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteArticle(id: number) {
    return request<{ success: boolean }>(`/api/admin/articles/${id}`, {
      method: 'DELETE',
    });
  },
  publishArticle(id: number) {
    return request<Article>(`/api/admin/articles/${id}/publish`, {
      method: 'PATCH',
    });
  },
  unpublishArticle(id: number) {
    return request<Article>(`/api/admin/articles/${id}/unpublish`, {
      method: 'PATCH',
    });
  },

  // Image Slots
  listImageSlots() {
    return request<Array<{
      id: number;
      slot_name: string;
      label: string;
      description: string | null;
      page: string;
      image_url: string | null;
      updated_at: string;
    }>>('/api/admin/image-slots');
  },
  updateImageSlot(id: number, data: { image_url?: string | null; label?: string; description?: string }) {
    return request<{
      id: number;
      slot_name: string;
      label: string;
      description: string | null;
      page: string;
      image_url: string | null;
      updated_at: string;
    }>(`/api/admin/image-slots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Upload
  async upload(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const token = getToken();
    const res = await fetch(`${API_URL}/api/admin/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Errore durante upload');
    }
    return res.json();
  },
};

/**
 * Risolve l'URL assoluto di un'immagine caricata sul backend.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_URL}${url}`;
}
