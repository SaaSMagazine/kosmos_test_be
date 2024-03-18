const express = require('express');
const Task = require('../models/task_model');
const verifyToken = require('../middleware/auth_middleware');
const Op = require('sequelize').Op

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { creatorId: req.user.id },
          { assigneeId: req.user.id }
        ]
      },
      include: ['creator', 'assignee']
    });

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});


router.post('/', verifyToken, async (req, res) => {
  try {
    const newTask = await Task.create({
      ...req.body,
      creatorId: req.user.id
    });

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

router.put('/:taskId', verifyToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.taskId,
        creatorId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }

    const updatedTask = await task.update(req.body);

    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

router.delete('/:taskId', verifyToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.taskId,
        creatorId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }

    await task.destroy();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

module.exports = router;
