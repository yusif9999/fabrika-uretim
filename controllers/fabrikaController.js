// controllers/fabrikaController.js
const Fabrika = require('../models/Fabrika');

// @desc    Tüm fabrikaları getir
// @route   GET /api/fabrikalar
exports.getFabrikalar = async (req, res) => {
    try {
        const fabrikalar = await Fabrika.find().sort({ createdAt: -1 });
        res.status(200).json(fabrikalar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Yeni fabrika ekle
// @route   POST /api/fabrikalar
exports.createFabrika = async (req, res) => {
    try {
        if (!req.body.ad) {
            return res.status(400).json({ message: 'Lütfen fabrika adı girin' });
        }
        const yeniFabrika = await Fabrika.create({
            ad: req.body.ad
        });
        res.status(200).json(yeniFabrika);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fabrika sil
// @route   DELETE /api/fabrikalar/:id
exports.deleteFabrika = async (req, res) => {
    try {
        const fabrika = await Fabrika.findById(req.params.id);
        if (!fabrika) {
            return res.status(404).json({ message: 'Fabrika bulunamadı' });
        }
        await fabrika.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};