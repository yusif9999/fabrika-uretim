const Personel = require('../models/Personel');

// Tüm personelleri getir
exports.getPersonel = async (req, res) => {
    try {
        const personel = await Personel.find().sort({ createdAt: -1 });
        res.status(200).json(personel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Yeni personel ekle
exports.createPersonel = async (req, res) => {
    try {
        const yeniPersonel = await Personel.create(req.body);
        res.status(201).json(yeniPersonel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Personel güncelle
exports.updatePersonel = async (req, res) => {
    try {
        const personel = await Personel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(personel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Personel sil
exports.deletePersonel = async (req, res) => {
    try {
        await Personel.findByIdAndDelete(req.params.id);
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};