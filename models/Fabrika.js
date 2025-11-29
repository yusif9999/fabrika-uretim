const mongoose = require('mongoose');

const FabrikaSchema = new mongoose.Schema({
    ad: {
        type: String,
        required: [true, 'Lütfen fabrika adı giriniz'],
        unique: true, // Aynı isimde iki fabrika olmasın
        trim: true
    }
}, {
    timestamps: true // Ne zaman oluşturulduğu otomatik kaydedilsin
});

module.exports = mongoose.model('Fabrika', FabrikaSchema);