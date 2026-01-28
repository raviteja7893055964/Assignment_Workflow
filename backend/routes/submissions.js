const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

router.post('/', auth, role('student'), async (req, res) => {
  try {
    const { assignmentId, answer } = req.body;
    if (!assignmentId || !answer) return res.status(400).json({ message: 'assignmentId and answer required' });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (assignment.status !== 'Published') return res.status(400).json({ message: 'Assignment not open for submissions' });

    if (new Date() > new Date(assignment.dueDate)) return res.status(400).json({ message: 'Assignment due date passed' });

    const submission = new Submission({
      assignmentId,
      studentId: req.user.id,
      answer
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You have already submitted for this assignment' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:assignmentId', auth, role('teacher'), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (assignment.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const subs = await Submission.find({ assignmentId }).populate('studentId', 'name email').sort({ submittedAt: -1 });
    res.json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/review', auth, role('teacher'), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('assignmentId');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    if (submission.assignmentId.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    submission.reviewed = true;
    await submission.save();
    res.json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
