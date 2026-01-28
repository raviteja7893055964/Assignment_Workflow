const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Assignment = require('../models/Assignment');

router.get('/', auth, async (req, res) => {
  try {
    const { role, id } = req.user;
    const { page = 1, limit = 20, status } = req.query;
    const q = {};

    if (role === 'student') {
      q.status = 'Published';
    } else {
      q.createdBy = id;
      if (status) q.status = status;
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));
    const assignments = await Assignment.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.max(1, parseInt(limit)));

    const total = await Assignment.countDocuments(q);
    res.json({ data: assignments, page: parseInt(page), limit: parseInt(limit), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, role('teacher'), async (req, res) => {
  try {
    const { title, description = '', dueDate } = req.body;
    if (!title || !dueDate) return res.status(400).json({ message: 'Title and dueDate are required' });
    const due = new Date(dueDate);
    if (isNaN(due)) return res.status(400).json({ message: 'Invalid dueDate' });

    const a = new Assignment({ title, description, dueDate: due, createdBy: req.user.id });
    await a.save();
    res.status(201).json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, role('teacher'), async (req, res) => {
  try {
    const a = await Assignment.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Assignment not found' });
    if (a.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    if (a.status !== 'Draft') return res.status(400).json({ message: 'Only Draft assignments can be edited' });

    const { title, description, dueDate } = req.body;
    if (title) a.title = title;
    if (description !== undefined) a.description = description;
    if (dueDate) {
      const due = new Date(dueDate);
      if (isNaN(due)) return res.status(400).json({ message: 'Invalid dueDate' });
      a.dueDate = due;
    }
    await a.save();
    res.json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, role('teacher'), async (req, res) => {
  try {
    const a = await Assignment.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Assignment not found' });
    if (a.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    if (a.status !== 'Draft') return res.status(400).json({ message: 'Only Draft assignments can be deleted' });
    await a.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/status', auth, role('teacher'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Draft','Published','Completed'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const a = await Assignment.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Assignment not found' });
    if (a.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    if (a.status === status) return res.json(a);

    if (a.status === 'Draft' && status === 'Published') {
      a.status = 'Published';
    } else if (a.status === 'Published' && status === 'Completed') {
      a.status = 'Completed';
    } else {
      return res.status(400).json({ message: `Invalid transition from ${a.status} to ${status}` });
    }

    await a.save();
    res.json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
