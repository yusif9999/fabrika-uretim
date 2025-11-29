// controllers/authController.js
const Personel = require('../models/Personel');
const jwt = require('jsonwebtoken');

// Token oluşturma yardımcısı
const generateToken = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Oturum 30 gün açık kalsın
    });
};

// @desc    Yönetici İlk Kurulum (Setup)
// @route   POST /api/auth/setup
exports.setupAdmin = async (req, res) => {
    try {
        const { kullaniciAdi, sifre } = req.body;

        // Daha önce yönetici var mı kontrol et
        const adminExists = await Personel.findOne({ rol: 'admin' });
        if (adminExists) {
            return res.status(400).json({ message: 'Sistemde zaten bir yönetici mevcut.' });
        }

        // Yeni yönetici oluştur (Şifre modelde otomatik hash'lenecek)
        const admin = await Personel.create({
            ad: 'Yönetici',
            kullaniciAdi,
            sifre,
            rol: 'admin',
            durum: 'Aktif'
        });

        if (admin) {
            res.status(201).json({
                _id: admin.id,
                ad: admin.ad,
                rol: admin.rol,
                token: generateToken(admin.id, admin.rol)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Giriş Yap (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    try {
        const { kullaniciAdi, sifre } = req.body;

        // Kullanıcıyı bul
        const user = await Personel.findOne({ kullaniciAdi });

        // Kullanıcı varsa VE şifre eşleşiyorsa
        if (user && (await user.sifreKontrol(sifre))) {
            if (user.durum !== 'Aktif') {
                return res.status(401).json({ message: 'Hesabınız aktif değil.' });
            }

            res.json({
                _id: user.id,
                ad: user.ad,
                rol: user.rol,
                token: generateToken(user.id, user.rol)
            });
        } else {
            res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};