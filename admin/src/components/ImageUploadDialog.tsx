import { useState } from 'react';
import { api, resolveImageUrl } from '../lib/api';
import { X, Upload } from 'lucide-react';

type Alignment = 'left' | 'center' | 'right' | 'full';

interface Props {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, alignment: Alignment, alt: string) => void;
}

export default function ImageUploadDialog({ open, onClose, onInsert }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [alt, setAlt] = useState('');
  const [alignment, setAlignment] = useState<Alignment>('full');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFile(null);
    setPreview('');
    setAlt('');
    setAlignment('full');
    setError(null);
    setUploading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleFile(f: File | null) {
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview('');
    }
  }

  async function handleInsert() {
    if (!file) {
      setError('Seleziona un\'immagine');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const res = await api.upload(file);
      onInsert(resolveImageUrl(res.url), alignment, alt);
      handleClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-serif text-lg font-semibold">Inserisci immagine</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* File input */}
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand transition-colors">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-40 mx-auto rounded"
                />
              ) : (
                <>
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600">
                    Clicca per selezionare un&apos;immagine
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>
          </label>

          {/* Alt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Testo alternativo (alt)
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Descrivi l'immagine per l'accessibilità"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Allineamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allineamento
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['left', 'center', 'right', 'full'] as Alignment[]).map((a) => (
                <label
                  key={a}
                  className={`border rounded-lg p-2 text-center text-xs cursor-pointer transition-colors ${
                    alignment === a
                      ? 'border-brand bg-brand/10 text-brand font-medium'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="alignment"
                    value={a}
                    checked={alignment === a}
                    onChange={() => setAlignment(a)}
                    className="sr-only"
                  />
                  {a === 'left'
                    ? 'Sinistra'
                    : a === 'center'
                      ? 'Centro'
                      : a === 'right'
                        ? 'Destra'
                        : 'Intera'}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={!file || uploading}
            className="px-4 py-2 text-sm bg-brand text-white rounded-lg hover:bg-brand/90 disabled:opacity-50"
          >
            {uploading ? 'Caricamento…' : 'Inserisci'}
          </button>
        </div>
      </div>
    </div>
  );
}
