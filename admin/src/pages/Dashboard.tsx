import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, Article } from '../lib/api';
import { Plus, FileText } from 'lucide-react';

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listArticles()
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const published = articles.filter((a) => a.status === 'published').length;
  const drafts = articles.filter((a) => a.status === 'draft').length;
  const recent = articles.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Panoramica del blog</p>
        </div>
        <Link
          to="/articoli/nuovo"
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90"
        >
          <Plus size={18} />
          Nuovo articolo
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Pubblicati" value={published} color="text-accent" />
        <StatCard label="Bozze" value={drafts} color="text-amber-600" />
        <StatCard label="Totali" value={articles.length} color="text-brand" />
      </div>

      {/* Recent articles */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Ultimi articoli</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Caricamento…</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="mx-auto mb-2 text-gray-300" size={32} />
            Nessun articolo ancora. Creane uno!
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recent.map((a) => (
              <li key={a.id}>
                <Link
                  to={`/articoli/${a.id}/modifica`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-gray-900">{a.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {a.category} · {new Date(a.updated_at).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'draft' | 'published' }) {
  if (status === 'published') {
    return (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
        Pubblicato
      </span>
    );
  }
  return (
    <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded">
      Bozza
    </span>
  );
}
