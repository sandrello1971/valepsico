import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, Article, ArticleInput, resolveImageUrl } from '../lib/api';
import { slugify } from '../lib/slug';
import RichTextEditor from '../components/RichTextEditor';
import { Upload, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const CATEGORIES = [
  'Benessere',
  'Relazioni',
  'Crescita Personale',
  'Mindfulness',
  'Ansia',
  'Coppia',
];

const PUBLIC_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

interface State {
  title: string;
  slug: string;
  slugEdited: boolean;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  status: 'draft' | 'published';
  featured: boolean;
  read_time: number;
  meta_title: string;
  meta_description: string;
}

const INITIAL: State = {
  title: '',
  slug: '',
  slugEdited: false,
  excerpt: '',
  content: '',
  cover_image: null,
  category: 'Benessere',
  status: 'draft',
  featured: false,
  read_time: 5,
  meta_title: '',
  meta_description: '',
};

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [state, setState] = useState<State>(INITIAL);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seoOpen, setSeoOpen] = useState(true);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Carica articolo in edit
  useEffect(() => {
    if (!isEdit || !id) return;
    api
      .getArticle(Number(id))
      .then((a: Article) => {
        setState({
          title: a.title,
          slug: a.slug,
          slugEdited: true,
          excerpt: a.excerpt || '',
          content: a.content,
          cover_image: a.cover_image,
          category: a.category,
          status: a.status,
          featured: Boolean(a.featured),
          read_time: a.read_time,
          meta_title: a.meta_title || '',
          meta_description: a.meta_description || '',
        });
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function update<K extends keyof State>(key: K, value: State[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setState((s) => ({
      ...s,
      title,
      slug: s.slugEdited ? s.slug : slugify(title),
    }));
  }

  function handleSlugChange(e: ChangeEvent<HTMLInputElement>) {
    setState((s) => ({ ...s, slug: slugify(e.target.value), slugEdited: true }));
  }

  async function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError(null);
    try {
      const res = await api.upload(file);
      update('cover_image', res.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSave(publish: boolean) {
    setError(null);

    if (!state.title.trim()) {
      setError('Il titolo è obbligatorio');
      return;
    }
    if (!state.content.trim()) {
      setError('Il contenuto è obbligatorio');
      return;
    }

    const payload: ArticleInput = {
      title: state.title,
      slug: state.slug,
      excerpt: state.excerpt,
      content: state.content,
      cover_image: state.cover_image,
      category: state.category,
      status: publish ? 'published' : state.status,
      featured: state.featured,
      read_time: state.read_time,
      meta_title: state.meta_title || undefined,
      meta_description: state.meta_description || undefined,
    };

    setSaving(true);
    try {
      if (isEdit && id) {
        await api.updateArticle(Number(id), payload);
      } else {
        const created = await api.createArticle(payload);
        navigate(`/articoli/${created.id}/modifica`, { replace: true });
      }
      if (publish) {
        update('status', 'published');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function handlePreview() {
    if (!state.slug) {
      alert('Inserisci uno slug per fare l\'anteprima');
      return;
    }
    // In sviluppo apriamo sulla root del frontend; in produzione sulla stessa origin del sito
    const base = PUBLIC_BASE_URL || window.location.origin.replace('5174', '8080');
    window.open(`${base}/blog/${state.slug}?preview=true`, '_blank');
  }

  if (loading) {
    return <div className="text-gray-500">Caricamento articolo…</div>;
  }

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        handleSave(false);
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            {isEdit ? 'Modifica articolo' : 'Nuovo articolo'}
          </h1>
          <p className="text-gray-500 mt-1">
            {state.status === 'published' ? 'Pubblicato' : 'Bozza'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/articoli')}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Torna alla lista
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6">
        {/* LEFT: content */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              value={state.title}
              onChange={handleTitleChange}
              placeholder="Titolo dell'articolo"
              className="w-full text-3xl font-serif font-bold px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Slug */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <label className="block text-xs text-gray-500 mb-1">URL</label>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 whitespace-nowrap">/blog/</span>
              <input
                type="text"
                value={state.slug}
                onChange={handleSlugChange}
                placeholder="slug-articolo"
                className="flex-1 text-gray-900 border-none focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Rich text editor */}
          <RichTextEditor
            value={state.content}
            onChange={(html) => update('content', html)}
          />
        </div>

        {/* RIGHT: metadata */}
        <aside className="space-y-4">
          <Section title="Immagine di copertina">
            {state.cover_image ? (
              <div className="relative">
                <img
                  src={resolveImageUrl(state.cover_image)}
                  alt="Copertina"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => update('cover_image', null)}
                  className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow hover:bg-white"
                  title="Rimuovi"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand">
                <Upload className="mx-auto text-gray-400 mb-1" size={24} />
                <span className="text-sm text-gray-600">
                  {uploadingCover ? 'Caricamento…' : 'Carica copertina'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                />
              </label>
            )}
          </Section>

          <Section title="Categoria">
            <select
              value={state.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Section>

          <Section title="Opzioni">
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">In evidenza</span>
                <input
                  type="checkbox"
                  checked={state.featured}
                  onChange={(e) => update('featured', e.target.checked)}
                  className="w-4 h-4 accent-brand"
                />
              </label>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Tempo di lettura (minuti)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={state.read_time}
                  onChange={(e) => update('read_time', Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Stato</label>
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="status"
                      checked={state.status === 'draft'}
                      onChange={() => update('status', 'draft')}
                    />
                    Bozza
                  </label>
                  <label className="flex-1 flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="status"
                      checked={state.status === 'published'}
                      onChange={() => update('status', 'published')}
                    />
                    Pubblicato
                  </label>
                </div>
              </div>
            </div>
          </Section>

          <Collapsible
            title="SEO"
            open={seoOpen}
            onToggle={() => setSeoOpen((v) => !v)}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Meta title
                </label>
                <input
                  type="text"
                  value={state.meta_title}
                  onChange={(e) => update('meta_title', e.target.value)}
                  placeholder={state.title || 'Default: titolo'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Meta description ({state.meta_description.length}/160)
                </label>
                <textarea
                  value={state.meta_description}
                  onChange={(e) =>
                    update('meta_description', e.target.value.slice(0, 160))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Estratto (excerpt)
                </label>
                <textarea
                  value={state.excerpt}
                  onChange={(e) => update('excerpt', e.target.value)}
                  rows={3}
                  placeholder="Breve riassunto mostrato nelle card"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          </Collapsible>

          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 sticky top-4">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? 'Salvataggio…' : 'Salva bozza'}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full px-4 py-2 text-sm bg-brand text-white rounded-lg hover:bg-brand/90 disabled:opacity-50"
            >
              {saving ? 'Pubblicazione…' : 'Pubblica'}
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2"
            >
              <ExternalLink size={14} />
              Anteprima
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Collapsible({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4"
      >
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
