import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, Article } from '../lib/api';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

type Filter = 'all' | 'published' | 'draft';

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setLoading(true);
    api
      .listArticles()
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  async function handleDelete(a: Article) {
    if (!window.confirm(`Eliminare "${a.title}"? Questa azione è irreversibile.`)) return;
    try {
      await api.deleteArticle(a.id);
      setArticles((prev) => prev.filter((x) => x.id !== a.id));
    } catch (e) {
      alert((e as Error).message);
    }
  }

  async function handleTogglePublish(a: Article) {
    try {
      const updated =
        a.status === 'published'
          ? await api.unpublishArticle(a.id)
          : await api.publishArticle(a.id);
      setArticles((prev) => prev.map((x) => (x.id === a.id ? updated : x)));
    } catch (e) {
      alert((e as Error).message);
    }
  }

  const filtered = articles.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Articoli</h1>
          <p className="text-gray-500 mt-1">Gestisci tutti i post del blog</p>
        </div>
        <Link
          to="/articoli/nuovo"
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90"
        >
          <Plus size={18} />
          Nuovo articolo
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>
          Tutti ({articles.length})
        </FilterBtn>
        <FilterBtn active={filter === 'published'} onClick={() => setFilter('published')}>
          Pubblicati ({articles.filter((a) => a.status === 'published').length})
        </FilterBtn>
        <FilterBtn active={filter === 'draft'} onClick={() => setFilter('draft')}>
          Bozze ({articles.filter((a) => a.status === 'draft').length})
        </FilterBtn>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Caricamento…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nessun articolo</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left p-3">Titolo</th>
                <th className="text-left p-3">Categoria</th>
                <th className="text-left p-3">Stato</th>
                <th className="text-left p-3">Pubblicato</th>
                <th className="text-right p-3">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium text-gray-900">{a.title}</div>
                    <div className="text-xs text-gray-500">/{a.slug}</div>
                  </td>
                  <td className="p-3 text-sm text-gray-700">{a.category}</td>
                  <td className="p-3">
                    {a.status === 'published' ? (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                        Pubblicato
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded">
                        Bozza
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {a.published_at
                      ? new Date(a.published_at).toLocaleDateString('it-IT')
                      : '—'}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/articoli/${a.id}/modifica`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        title="Modifica"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(a)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        title={a.status === 'published' ? 'Metti in bozza' : 'Pubblica'}
                      >
                        {a.status === 'published' ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(a)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Elimina"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
        active
          ? 'bg-brand text-white border-brand'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}
