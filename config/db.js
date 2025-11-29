const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Eğer .env dosyasında adres yoksa yerel adresi kullan
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fabrika_yonetim';
        
        const conn = await mongoose.connect(uri);
        
        console.log(`MongoDB Bağlandı: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Hata: ${error.message}`);
        process.exit(1);
    }
};

// Bu satır ÇOK ÖNEMLİ, fonksiyonu dışarı açıyoruz:
module.exports = connectDB;