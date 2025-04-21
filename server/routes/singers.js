import express from 'express';
import Singer from '../models/Singer.js';

const router = express.Router();

// GET: get all singers
router.get('/', async (req, res) => {
  const queue = await Singer.find().sort({ createdAt: 1 });
  res.json(queue);
});

// POST: add a new singer
router.post('/', async (req, res) => {
  const newSinger = new Singer(req.body);
  await newSinger.save();

  const fullQueue = await Singer.find().sort({ createdAt: 1 });
  req.io.emit('queueUpdate', fullQueue);
  console.log('Emitted queueUpdate with', fullQueue.length, 'items');

  res.status(201).json(newSinger);
});


// PUT: update a singer
router.put('/:id', async (req, res) => {
  const updated = await Singer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);

  const fullQueue = await Singer.find().sort({ createdAt: 1 });
  req.io.emit('queueUpdate', fullQueue);
});

// PATCH: update status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;

  const updated = await Singer.findByIdAndUpdate(req.params.id, { status }, { new: true });

  // Broadcast updated queue
  const fullQueue = await Singer.find().sort({ createdAt: 1 });
  req.io.emit('queueUpdate', fullQueue);

  res.json(updated);
});

// DELETE: remove a singer
router.delete('/:id', async (req, res) => {
  await Singer.findByIdAndDelete(req.params.id);

  // Broadcast updated queue
  const fullQueue = await Singer.find().sort({ createdAt: 1 });
  req.io.emit('queueUpdate', fullQueue);

  res.json({ success: true });
});

// DELETE ALL: reset queue
router.delete('/', async (req, res) => {
  await Singer.deleteMany({});

  // Send empty queue update
  req.io.emit('queueUpdate', []);

  res.json({ success: true });
});

export default router;
