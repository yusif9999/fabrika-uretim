const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PersonelSchema = new mongoose.Schema({
    ad: { type: String, required: true },
    kullaniciAdi: { type: String, unique: true, sparse: true },
    sifre: { type: String },
    rol: { type: String, enum: ['admin', 'isci'], default: 'isci' },
    durum: { type: String, default: 'Aktif' },
    // Diğer alanlar opsiyonel olarak eklenebilir
    netMaas: { type: Number, default: 0 },
    brutMaas: { type: Number, default: 0 },
    maasTipi: { type: String, default: 'Aylık' },
    sgkDurumu: { type: String, default: 'Yok' },
    sgkTutar: { type: Number, default: 0 },
    attendance: { type: Map, of: new mongoose.Schema({
        status: { type: String },
        hours: { type: Number }
    }, { _id: false }) }
}, { timestamps: true });

// Şifre karşılaştırma
PersonelSchema.methods.sifreKontrol = async function(girilenSifre) {
    return await bcrypt.compare(girilenSifre, this.sifre);
};

// Şifre hashleme
PersonelSchema.pre('save', async function(next) {
    if (!this.isModified('sifre')) return next();
    const salt = await bcrypt.genSalt(10);
    this.sifre = await bcrypt.hash(this.sifre, salt);
    next();
});

module.exports = mongoose.model('Personel', PersonelSchema);