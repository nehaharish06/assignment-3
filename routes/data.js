const express = require('express');
const router = express.Router();
const Data = require('../models/Data');

// CRUD Operations
router.get('/', async (req, res) => {
    const data = await Data.find();
    res.json(data);
});

router.post('/', async (req, res) => {
    const newData = new Data(req.body);
    await newData.save();
    res.json(newData);
});

router.put('/:id', async (req, res) => {
    const updatedData = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedData);
});

router.delete('/:id', async (req, res) => {
    await Data.findByIdAndDelete(req.params.id);
    res.json({ message: 'Data deleted' });
});

module.exports = router;
