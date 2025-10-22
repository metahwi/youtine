const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');

/**
 * POST /api/routines
 * Create a new workout routine
 */
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Routine name is required' });
    }

    const newRoutine = new Routine({
      name,
      description: description || '',
      videos: []
    });

    await newRoutine.save();
    res.status(201).json(newRoutine);

  } catch (error) {
    console.error('Error creating routine:', error);
    res.status(500).json({ error: 'Failed to create routine' });
  }
});

/**
 * GET /api/routines
 * Retrieve all routines
 */
router.get('/', async (req, res) => {
  try {
    const routines = await Routine.find().sort({ createdAt: -1 });
    res.status(200).json(routines);
  } catch (error) {
    console.error('Error fetching routines:', error);
    res.status(500).json({ error: 'Failed to fetch routines' });
  }
});

/**
 * GET /api/routines/:id
 * Retrieve a single routine with populated video details
 */
router.get('/:id', async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id).populate('videos');
    
    if (!routine) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    res.status(200).json(routine);
  } catch (error) {
    console.error('Error fetching routine:', error);
    res.status(500).json({ error: 'Failed to fetch routine' });
  }
});

/**
 * PUT /api/routines/:id
 * Update a routine (add, remove, or reorder videos)
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, description, videos } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (videos !== undefined) updateData.videos = videos;

    const updatedRoutine = await Routine.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('videos');

    if (!updatedRoutine) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    res.status(200).json(updatedRoutine);
  } catch (error) {
    console.error('Error updating routine:', error);
    res.status(500).json({ error: 'Failed to update routine' });
  }
});

/**
 * DELETE /api/routines/:id
 * Delete a routine
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedRoutine = await Routine.findByIdAndDelete(req.params.id);
    
    if (!deletedRoutine) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    res.status(200).json({ message: 'Routine deleted successfully' });
  } catch (error) {
    console.error('Error deleting routine:', error);
    res.status(500).json({ error: 'Failed to delete routine' });
  }
});

module.exports = router;

