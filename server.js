const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const personelRoutes = require('./routes/personelRoutes');

// Route dosyalarını çağır
const authRoutes = require('./routes/authRoutes');
const fabrikaRoutes = require('./routes/fabrikaRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// --- API ROTALARI ---
app.use('/api/auth', authRoutes); // Auth ile ilgili her şey /api/auth altına gider
app.use('/api/auth', authRoutes);
app.use('/api/fabrikalar', fabrikaRoutes); // <--- YENİ EKLENEN SATIR
app.use('/api/personel', personelRoutes);

// --- FRONTEND (STATİK) ---
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor!`);
});