import { useState, useEffect } from 'react';
import { api, resolveImageUrl } from '../lib/api';

interface ImageSlot {
  id: number;
  slot_name: string;
  label: string;
  description: string | null;
  page: string;
  image_url: string | null;
  updated_at: string;
}

export default function ImageSlots() {
  const [slots, setSlots] = useState<ImageSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    try {
      const data = await api.listImageSlots();
      setSlots(data);
    } catch (err) {
      console.error('Errore caricamento slot:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(slotId: number, file: File) {
    setSaving(slotId);
    try {
      const { url } = await api.upload(file);
      const updated = await api.updateImageSlot(slotId, { image_url: url });
      setSlots(prev => prev.map(s => s.id === slotId ? updated : s));
    } catch (err) {
      console.error('Errore upload:', err);
    } finally {
      setSaving(null);
    }
  }

  async function handleRemoveImage(slotId: number) {
    setSaving(slotId);
    try {
      const updated = await api.updateImageSlot(slotId, { image_url: null });
      setSlots(prev => prev.map(s => s.id === slotId ? updated : s));
    } catch (err) {
      console.error('Errore rimozione:', err);
    } finally {
      setSaving(null);
    }
  }

  // Group by page
  const grouped = slots.reduce<Record<string, ImageSlot[]>>((acc, slot) => {
    if (!acc[slot.page]) acc[slot.page] = [];
    acc[slot.page].push(slot);
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Caricamento...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Immagini del sito</h1>
        <p className="text-gray-500 mt-1">
          Gestisci le immagini delle diverse sezioni del sito.
        </p>
      </div>

      {Object.entries(grouped).map(([page, pageSlots]) => (
        <div key={page} className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            {page}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageSlots.map(slot => (
              <div
                key={slot.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Preview */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {slot.image_url ? (
                    <img
                      src={resolveImageUrl(slot.image_url)}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Nessuna immagine</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{slot.label}</h3>
                  <p className="text-xs text-gray-400 mb-1">{slot.slot_name}</p>
                  {slot.description && (
                    <p className="text-sm text-gray-500 mb-3">{slot.description}</p>
                  )}

                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(slot.id, file);
                          e.target.value = '';
                        }}
                      />
                      <span className="block w-full text-center text-sm px-3 py-2 bg-brand text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                        {saving === slot.id ? 'Caricamento...' : 'Carica immagine'}
                      </span>
                    </label>
                    {slot.image_url && (
                      <button
                        onClick={() => handleRemoveImage(slot.id)}
                        disabled={saving === slot.id}
                        className="text-sm px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Rimuovi
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
