import { Router } from 'express';
import { db, ImageSlot } from '../db/database';
import { requireAuth } from '../middleware/auth';

export const publicImageSlotsRouter = Router();
export const adminImageSlotsRouter = Router();

// Public: get all image slots (for frontend)
publicImageSlotsRouter.get('/', (_req, res) => {
  const slots = db.prepare('SELECT * FROM image_slots ORDER BY page, slot_name').all() as ImageSlot[];
  res.json(slots);
});

// Public: get single slot by name
publicImageSlotsRouter.get('/:slotName', (req, res) => {
  const slot = db.prepare('SELECT * FROM image_slots WHERE slot_name = ?').get(req.params.slotName) as ImageSlot | undefined;
  if (!slot) return res.status(404).json({ error: 'Slot non trovato' });
  res.json(slot);
});

// Admin: list all slots
adminImageSlotsRouter.use(requireAuth);

adminImageSlotsRouter.get('/', (_req, res) => {
  const slots = db.prepare('SELECT * FROM image_slots ORDER BY page, slot_name').all() as ImageSlot[];
  res.json(slots);
});

// Admin: update a slot (set image_url, label, description)
adminImageSlotsRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const { image_url, label, description } = req.body;

  const existing = db.prepare('SELECT * FROM image_slots WHERE id = ?').get(Number(id)) as ImageSlot | undefined;
  if (!existing) return res.status(404).json({ error: 'Slot non trovato' });

  db.prepare(
    'UPDATE image_slots SET image_url = ?, label = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(
    image_url !== undefined ? image_url : existing.image_url,
    label !== undefined ? label : existing.label,
    description !== undefined ? description : existing.description,
    Number(id)
  );

  const updated = db.prepare('SELECT * FROM image_slots WHERE id = ?').get(Number(id)) as ImageSlot;
  res.json(updated);
});
