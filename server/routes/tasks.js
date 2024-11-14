import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get task statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Task.countDocuments({ owner: req.user._id });
    const completed = await Task.countDocuments({ owner: req.user._id, status: 'completed' });
    const pending = await Task.countDocuments({ owner: req.user._id, status: 'in-progress' });
    const overdue = await Task.countDocuments({
      owner: req.user._id,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    res.json({ total, completed, pending, overdue });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id })
      .populate('assignees', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;