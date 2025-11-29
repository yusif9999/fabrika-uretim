// JAVASCRIPT KODLARI BAŞLANGIÇ (v5.9 - Net/Brüt Otomasyonu + Vardiya İyileştirmeleri)

const main = {}; 

document.addEventListener('DOMContentLoaded', () => {

    // Firebase yapılandırması ve Firestore bağlantısı
    // Bu uygulama çoklu cihaz üzerinden ortak veriler kullanabilmek için Firebase kullanır.
    // Lütfen aşağıdaki firebaseConfig nesnesindeki değerleri kendi Firebase projenize göre doldurun.
    const firebaseConfig = {
        // apiKey: "YOUR_API_KEY",
        // authDomain: "YOUR_AUTH_DOMAIN",
        // projectId: "YOUR_PROJECT_ID",
        // storageBucket: "YOUR_STORAGE_BUCKET",
        // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        // appId: "YOUR_APP_ID"
    };
    // Firebase tanımlıysa başlat
    let db = null;
    try {
        if (typeof firebase !== 'undefined' && firebase?.initializeApp) {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
        }
    } catch (e) {
        console.warn('Firebase init hatası:', e);
    }

    // --- BÖLÜM 1: UYGULAMA OBJESİ (NAMESPACE) ---
    const app = {
        currentUser: null,
        dom: {
            setupContainer: document.getElementById('setup-container'),
            setupForm: document.getElementById('setup-form'),
            setupError: document.getElementById('setup-error'),
            loginChoiceContainer: document.getElementById('login-choice-container'),
            btnAdminLoginChoice: document.getElementById('btn-admin-login-choice'),
            btnPersonelLoginChoice: document.getElementById('btn-personel-login-choice'),
            adminLoginContainer: document.getElementById('admin-login-container'),
            adminLoginForm: document.getElementById('admin-login-form'),
            adminLoginError: document.getElementById('admin-login-error'),
            // Admin login inputs
            adminUsernameInput: document.getElementById('admin-username'),
            adminPasswordInput: document.getElementById('admin-password'),
            personelLoginContainer: document.getElementById('personel-login-container'),
            personelLoginForm: document.getElementById('personel-login-form'),
            personelLoginError: document.getElementById('personel-login-error'),
            appContainer: document.getElementById('app-container'),
            logoutBtn: document.getElementById('logout-btn'),
            navLinks: document.querySelectorAll('#sidebar nav a'), 
            navItems: document.querySelectorAll('#sidebar nav li'), 
            pages: document.querySelectorAll('.page'),
            pageTitle: document.getElementById('page-title'),
            kullaniciBilgisi: document.getElementById('kullanici-bilgisi'), 
            fabrikaForm: document.getElementById('fabrika-form'),
            uretimEkleForm: document.getElementById('uretim-ekle-form'), 
            giderForm: document.getElementById('gider-form'),
            modalContainer: document.getElementById('modal-container'),
            modalContent: document.getElementById('modal-content-dynamic'),
            modalTitle: document.getElementById('modal-title'),
            modalBody: document.getElementById('modal-body-dynamic'),
            modalCloseBtn: document.querySelector('.modal-close-btn'),
            fabrikaHesapTabloContainer: document.getElementById('fabrika-hesap-tablo-container'),
            giderTabloContainer: document.getElementById('gider-tablo-container'),
            genelCsvIndirBtn: document.getElementById('genel-csv-indir'),
            giderCsvIndirBtn: document.getElementById('gider-csv-indir'),
            uretimFabrikaSelect: document.getElementById('uretim-fabrika'),
            uretimTarihInput: document.getElementById('uretim-tarih'),
            uretimAdetInput: document.getElementById('uretim-adet'),
            uretimBirimFiyatInput: document.getElementById('uretim-birim-fiyat'),
            uretimToplamTutarInput: document.getElementById('uretim-toplam-tutar'),
            listeyeEkleBtn: document.getElementById('listeye-ekle-btn'),
            kayitListesiContainer: document.getElementById('kayit-listesi-container'),
            kayitListesiGenelToplam: document.getElementById('kayit-listesi-genel-toplam'),
            listeyiTemizleBtn: document.getElementById('listeyi-temizle-btn'),
            tumunuKaydetBtn: document.getElementById('tumunu-kaydet-btn'),
            sonUretimlerContainer: document.getElementById('son-uretimler-container'),
            fabrikaSilForm: document.getElementById('fabrika-sil-form'),
            fabrikaSilSelect: document.getElementById('fabrika-sil-select'),
            sifreDegistirForm: document.getElementById('sifre-degistir-form'),
            sifreDegistirSonuc: document.getElementById('sifre-degistir-sonuc'),
            sidebarVardiyaDurumu: document.getElementById('sidebar-vardiya-durumu'),
            aktifVardiyaContainer: document.getElementById('aktif-vardiya-container'),
            aktifVardiyaDetaylari: document.getElementById('aktif-vardiya-detaylari'),
            vardiyaKapatBtn: document.getElementById('vardiya-kapat-btn'),
            yeniVardiyaFormContainer: document.getElementById('yeni-vardiya-form-container'),
            yeniVardiyaForm: document.getElementById('yeni-vardiya-form'),
            vardiyaGecmisiContainer: document.getElementById('vardiya-gecmisi-container'),
            vardiyaPersonelSelect: document.getElementById('vardiya-personel-select'),
            vardiyaDevretModalBtn: document.getElementById('vardiya-devret-modal-btn'),
            // Yeni: personel yönet butonu
            vardiyaPersonelYonetBtn: document.getElementById('vardiya-personel-yonet-btn'),
            // Personel Form DOM (GÜNCELLENDİ: Net ve Brüt Maaş Alanları)
            personelIslemForm: document.getElementById('personel-islem-form'),
            personelIslemSelect: document.getElementById('personel-islem-select'),
            personelFormSubmitBtn: document.getElementById('personel-form-submit-btn'),
            personelSgkDurumu: document.getElementById('personel-sgk-durumu'),
            personelSgkTutarGroup: document.getElementById('personel-sgk-tutar-group'),
            personelNetMaasInput: document.getElementById('personel-net-maas'),
            personelBrutMaasInput: document.getElementById('personel-brut-maas'),
            personelListesiContainer: document.getElementById('personel-listesi-container'),
            personelPozisyonSelect: document.getElementById('personel-pozisyon-select'),
            pozisyonEkleForm: document.getElementById('pozisyon-ekle-form'),
            pozisyonListesiContainer: document.getElementById('pozisyon-listesi-container'),
            // Yeni: Personel Durumu sayfası
            personelDurumuContainer: document.getElementById('personel-durumu-container'),
            personelDurumuSummaryContainer: document.getElementById('personel-durumu-summary-container'),
            // Haftalık izin planlama
            izinPersonelSelect: document.getElementById('izin-personel-select'),
            izinTarihInput: document.getElementById('izin-tarih'),
            izinPlanForm: document.getElementById('izin-plan-form'),
            // Personel Durumu nav is handled via navLinks
        },
        data: {},
        temp: {
            uretimListesi: []
        },
        charts: {
            nakitAkis: null,
        },
        helpers: {
            formatCurrency: (value) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value),
            formatDateTime: (isoString) => { if (!isoString) return '-'; return new Date(isoString).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); },
            formatTime: (isoString) => { if (!isoString) return '-'; return new Date(isoString).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit' }); },
            formatDate: (isoString) => { if (!isoString) return '-'; if (isoString.length === 10) { return new Date(isoString + 'T00:00:00').toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }); } return new Date(isoString).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }); },
            getTodayISO: () => new Date().toISOString().split('T')[0],
            hash: async (string) => { const utf8 = new TextEncoder().encode(string); const hashBuffer = await crypto.subtle.digest('SHA-256', utf8); const hashArray = Array.from(new Uint8Array(hashBuffer)); return hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); },
            calculateDuration: (startISO, endISO) => { if (!startISO || !endISO) return 'N/A'; const start = new Date(startISO); const end = new Date(endISO); let diffMs = end - start; if (diffMs < 0) diffMs = 0; const hours = Math.floor(diffMs / 3600000); const minutes = Math.floor((diffMs % 3600000) / 60000); return `${hours} saat ${minutes} dk`; },
            // Hesaplanan süreyi ondalık saat olarak döndürür
            calculateHoursDecimal: (startISO, endISO) => {
                if (!startISO || !endISO) return 0;
                let diffMs = new Date(endISO) - new Date(startISO);
                if (diffMs < 0) diffMs = 0;
                const hours = diffMs / 3600000;
                return parseFloat(hours.toFixed(2));
            },
            // Saat ondalığını okunabilir formata çevirir (örn. 5.5 -> "5sa 30dk")
            formatHoursDecimal: (hoursDecimal) => {
                if (!hoursDecimal || hoursDecimal <= 0) return '';
                const hours = Math.floor(hoursDecimal);
                const minutes = Math.round((hoursDecimal - hours) * 60);
                let str = '';
                if (hours > 0) str += `${hours}sa`;
                if (minutes > 0) str += `${str ? ' ' : ''}${minutes}dk`;
                return str;
            },
            // YENİ: Netten Brüt Hesaplama Fonksiyonu (Tahmini Katsayı ile)
            calculateGrossSalary: (netSalary) => {
                if (!netSalary || netSalary <= 0) return 0;
                const gross = netSalary / 0.7149;
                return parseFloat(gross.toFixed(2));
            }
        }
    };

    // --- BÖLÜM 2: VERİ YÖNETİMİ ---
    const dataManager = {
    // Verileri API'den yükle
    load: async () => {
        app.data = { fabrikalar: [], uretimler: [], giderler: [], odemeler: [], vardiyalar: [], personel: [], pozisyonlar: [] };
        
        if (!localStorage.getItem('userToken')) return;

        try {
            // 1. Fabrikaları Çek
            const resFabrika = await fetch('/api/fabrikalar');
            if (resFabrika.ok) {
                const fabrikalar = await resFabrika.json();
                app.data.fabrikalar = fabrikalar.map(f => ({ ...f, id: f._id }));
            }

            // 2. Personelleri Çek (BURASI EKSİKTİ)
            const resPersonel = await fetch('/api/personel');
            if (resPersonel.ok) {
                const personelList = await resPersonel.json();
                // MongoDB _id'sini bizim sistemdeki id'ye çeviriyoruz
                app.data.personel = personelList.map(p => ({ ...p, id: p._id }));
            }

            // Ekranı güncelle
            if (app.currentUser) {
                renderer.updateAll();
            }

        } catch (err) {
            console.error('Veri yükleme hatası:', err);
        }
    },

    // Tekil Kayıt (Artık toplu save yok, her işlem kendi API'sine gidecek)
    save: () => {
        // Bu fonksiyon artık boş kalabilir veya konsola uyarı basabilir.
        // Çünkü artık "Tümünü Kaydet" mantığı yok, "Ekle" butonuna basınca direkt API'ye gideceğiz.
        console.log('API modunda toplu kayıt devre dışı.');
    }
};

    // --- BÖLÜM 3: HESAPLAMA MOTORU ---
    const calculator = {
        fabrikaBakiyesi: (fabrikaId) => { const toplamUretim = app.data.uretimler.filter(u => u.fabrikaId === fabrikaId).reduce((sum, u) => sum + (u.adet * u.birimFiyat), 0); const toplamOdenen = app.data.odemeler.filter(o => o.fabrikaId === fabrikaId).reduce((sum, o) => sum + o.tutar, 0); return { toplamUretim, toplamOdenen, kalanBorc: toplamUretim - toplamOdenen }; },
        genelDurum: () => { const toplamUretimDegeri = app.data.uretimler.reduce((sum, u) => sum + (u.adet * u.birimFiyat), 0); const toplamGiderler = app.data.giderler.reduce((sum, g) => sum + g.tutar, 0); const toplamTahsilat = app.data.odemeler.reduce((sum, o) => sum + o.tutar, 0); const netKar = toplamTahsilat - toplamGiderler; const kalanAlacak = toplamUretimDegeri - toplamTahsilat; return { toplamUretimDegeri, toplamGiderler, toplamTahsilat, netKar, kalanAlacak }; }
    };

    // --- BÖLÜM 4: ARAYÜZ GÜNCELLEME (RENDER) ---
    const renderer = {
        updateAll: () => {
            renderer.fabrikaSelect(); 
            renderer.giderTablosu();
            renderer.fabrikaHesapOzetleri();
            renderer.dashboard();
            renderer.raporlarOzeti(); 
            renderer.uretimEkleListesi();
            renderer.sonUretimler();
            renderer.fabrikaSilSelect();
            renderer.pozisyonListesi();
            renderer.personelPozisyonSelect();
            renderer.personelListesi();
            renderer.vardiyaPersonelSelect();
            renderer.updateVardiyaDurumu(); 
            renderer.personelIslemSelect();
            renderer.personelDurumu();
            // Haftalık izin planlama için personel listesini güncelle
            renderer.populateIzinPersonelSelect();
        },
        updateForRole: () => {
            const role = app.currentUser.role;
            const ad = app.currentUser.ad;
            app.dom.kullaniciBilgisi.innerHTML = `Giriş Yapan: <span>${ad}</span> (${role === 'admin' ? 'Yönetici' : 'Personel'})`;
            app.dom.navItems.forEach(li => {
                const roller = li.dataset.role.split(' ');
                if (roller.includes(role)) { li.style.display = 'block'; } 
                else { li.style.display = 'none'; }
            });
            if (role === 'isci') { actions.navigate(null, 'vardiya-yonetimi'); } 
            else { actions.navigate(null, 'dashboard'); }
        },
        updateVardiyaDurumu: () => {
            const activeShift = app.data.vardiyalar.find(v => v.durum === 'Aktif');
            if (activeShift) {
                // Sadece aktif çalışanları al (bitisZamani olmayanlar)
                const aktifCalisanlar = activeShift.calisanlar.filter(c => !c.bitisZamani);
                // Sorumlu personeli belirle (shift.responsibleId varsa onu kullan, yoksa ilk kişiyi al)
                let responsibleId = activeShift.responsibleId;
                if (responsibleId === undefined || responsibleId === null) {
                    responsibleId = aktifCalisanlar.length > 0 ? aktifCalisanlar[0].personelId : null;
                }
                // Yan paneldeki isim listesi (tüm aktif çalışanların isimleri)
                const isimYazisi = aktifCalisanlar.map(c => c.isciAdi).join(', ');
                app.dom.sidebarVardiyaDurumu.innerHTML = `<span class="durum durum-acik">VARDİYA AÇIK</span><span class="isim">${isimYazisi || '-'}</span>`;
                // Detayları göster: sorumlu en üstte, diğerleri altta
                let detayHtml = '';
                // Sorumlu personel
                const sorumlu = aktifCalisanlar.find(c => c.personelId === responsibleId);
                if (sorumlu) {
                    detayHtml += `<div style="margin-bottom:8px;"><strong>${sorumlu.isciAdi} (Vardiya Sorumlusu)</strong> (Başlangıç: ${app.helpers.formatTime(sorumlu.devralmaZamani)})</div>`;
                }
                // Diğer çalışanlar
                aktifCalisanlar.forEach(c => {
                    if (c.personelId === responsibleId) return;
                    detayHtml += `<div style="margin-bottom:8px;">
                        <strong>${c.isciAdi}</strong> (Başlangıç: ${app.helpers.formatTime(c.devralmaZamani)}) 
                        <button class="btn-sm-danger calisan-cikart-btn" data-personel-id="${c.personelId}">Çıkış</button>
                    </div>`;
                });
                if (aktifCalisanlar.length > 0) {
                    app.dom.aktifVardiyaDetaylari.innerHTML = detayHtml;
                } else {
                    app.dom.aktifVardiyaDetaylari.innerHTML = '<p>Şu anda aktif çalışan bulunmuyor.</p>';
                }
                app.dom.aktifVardiyaContainer.style.display = 'block';
                app.dom.yeniVardiyaFormContainer.style.display = 'none';
            } else {
                app.dom.sidebarVardiyaDurumu.innerHTML = `<span class="durum durum-kapali">VARDİYA KAPALI</span><span class="isim">-</span>`;
                app.dom.aktifVardiyaContainer.style.display = 'none';
                app.dom.yeniVardiyaFormContainer.style.display = 'block';
            }
            renderer.vardiyaGecmisi();
        },
        vardiyaGecmisi: () => {
            app.dom.vardiyaGecmisiContainer.innerHTML = '';
            const tamamlananlar = app.data.vardiyalar.filter(v => v.durum === 'Tamamlandı').sort((a, b) => new Date(b.baslamaZamani) - new Date(a.baslamaZamani));
            if (tamamlananlar.length === 0) { app.dom.vardiyaGecmisiContainer.innerHTML = '<p class="no-data-message">Henüz tamamlanmış bir vardiya kaydı yok.</p>'; return; }
            const table = document.createElement('table');
            table.innerHTML = '<thead><tr><th>Çalışan(lar) (Zaman Damgaları ve Süreler)</th><th>İlk Başlangıç</th><th>Son Bitiş</th><th>Toplam Süre</th><th>İşlemler</th></tr></thead><tbody></tbody>';
            const tbody = table.querySelector('tbody');
            const silmeButonuHtml = app.currentUser && app.currentUser.role === 'admin' 
                ? `<button class="btn-sm-danger vardiya-sil-btn" data-id="{id}">Sil</button>`
                : `<i>Yetki Yok</i>`; 
            tamamlananlar.forEach(vardiya => {
                const calisanDetaylari = [];
                vardiya.calisanlar.forEach(calisan => {
                    const startTimeISO = calisan.devralmaZamani;
                    const endTimeISO = calisan.bitisZamani || vardiya.bitisZamani;
                    const startTime = app.helpers.formatTime(startTimeISO);
                    const endTime = app.helpers.formatTime(endTimeISO);
                    const sure = app.helpers.calculateDuration(startTimeISO, endTimeISO);
                    calisanDetaylari.push(`${calisan.isciAdi} (${startTime} - ${endTime}) [${sure}]`);
                });
                const calisanZinciri = calisanDetaylari.join(' &rarr; ');
                const toplamSure = app.helpers.calculateDuration(vardiya.baslamaZamani, vardiya.bitisZamani);
                tbody.insertRow().innerHTML = `
                    <td>${calisanZinciri}</td>
                    <td>${app.helpers.formatDateTime(vardiya.baslamaZamani)}</td>
                    <td>${app.helpers.formatDateTime(vardiya.bitisZamani)}</td>
                    <td>${toplamSure}</td>
                    <td>${silmeButonuHtml.replace('{id}', vardiya.id)}</td>
                `;
            });
            app.dom.vardiyaGecmisiContainer.appendChild(table);
        },
        personelListesi: () => {
            app.dom.personelListesiContainer.innerHTML = '';
            const personeller = app.data.personel.sort((a, b) => a.ad.localeCompare(b.ad));
            if (personeller.length === 0) { app.dom.personelListesiContainer.innerHTML = '<p class="no-data-message">Kayıtlı personel bulunmuyor.</p>'; return; }
            const table = document.createElement('table');
            table.innerHTML = '<thead><tr><th>Durum</th><th>İsim Soyisim</th><th>Pozisyon</th><th>Panel Girişi</th><th>Maaş (Net/Brüt)</th><th>İşlemler</th></tr></thead><tbody></tbody>';
            const tbody = table.querySelector('tbody');
            personeller.forEach(personel => {
                const pozisyon = app.data.pozisyonlar.find(p => p.id === personel.pozisyonId);
                const pozisyonAdi = pozisyon ? pozisyon.ad : '<span style="color:red;">Silinmiş</span>';
                const net = personel.netMaas ? app.helpers.formatCurrency(personel.netMaas) : '0 ₺';
                const brut = personel.brutMaas ? app.helpers.formatCurrency(personel.brutMaas) : '0 ₺';
                const maasBilgisi = `<strong>Net: ${net}</strong><br><span style="font-size:12px; color:#7f8c8d;">Brüt: ${brut}</span><br><span style="font-size:11px;">(${personel.maasTipi})</span>`;
                const panelGiris = personel.kullaniciAdi ? `Var (${personel.kullaniciAdi})` : 'Yok';
                let durumRenk = '';
                if (personel.durum === 'Aktif') durumRenk = 'var(--success-color)';
                if (personel.durum === 'İzinde') durumRenk = 'var(--secondary-color)';
                if (personel.durum === 'Ayrıldı') durumRenk = 'var(--danger-color)';
                let sgkBadge = '';
                if (personel.sgkDurumu === 'Var') {
                    sgkBadge = '<span class="sgk-badge">SGK</span>';
                }
                tbody.insertRow().innerHTML = `
                    <td style="color: ${durumRenk}; font-weight: 600;">${personel.durum}</td>
                    <td>${personel.ad} ${sgkBadge}</td>
                    <td>${pozisyonAdi}</td>
                    <td style="font-style: italic;">${panelGiris}</td>
                    <td>${maasBilgisi}</td>
                    <td style="width: 180px;">
                        <button class="btn-sm-success personel-odeme-btn" data-id="${personel.id}" data-name="${personel.ad}">Ödeme Yap</button>
                        <button class="btn-sm-danger personel-sil-btn" data-id="${personel.id}">Sil</button>
                    </td>
                `;
            });
            app.dom.personelListesiContainer.appendChild(table);
        },
        personelIslemSelect: () => {
            const select = app.dom.personelIslemSelect;
            const mevcutDeger = select.value;
            select.innerHTML = '<option value="new" selected>-- Yeni Personel Oluştur --</option>';
            const personeller = app.data.personel.sort((a, b) => a.ad.localeCompare(b.ad));
            personeller.forEach(p => {
                select.add(new Option(p.ad, p.id));
            });
            select.value = mevcutDeger;
        },
        pozisyonListesi: () => {
            app.dom.pozisyonListesiContainer.innerHTML = '';
            const pozisyonlar = app.data.pozisyonlar.sort((a, b) => a.ad.localeCompare(b.ad));
            if (pozisyonlar.length === 0) { app.dom.pozisyonListesiContainer.innerHTML = '<p class="no-data-message">Tanımlanmış pozisyon yok.</p>'; return; }
            const table = document.createElement('table');
            table.innerHTML = '<thead><tr><th>Pozisyon Adı</th><th>Kullanan Personel Sayısı</th><th>İşlemler</th></tr></thead><tbody></tbody>';
            const tbody = table.querySelector('tbody');
            pozisyonlar.forEach(pozisyon => {
                const kullanimSayisi = app.data.personel.filter(p => p.pozisyonId === pozisyon.id).length;
                tbody.insertRow().innerHTML = `
                    <td>${pozisyon.ad}</td>
                    <td>${kullanimSayisi} kişi</td>
                    <td><button class="btn-sm-danger pozisyon-sil-btn" data-id="${pozisyon.id}" data-kullanim="${kullanimSayisi}">Sil</button></td>
                `;
            });
            app.dom.pozisyonListesiContainer.appendChild(table);
        },
        personelPozisyonSelect: (selectElement = app.dom.personelPozisyonSelect, selectedId = null) => {
            selectElement.innerHTML = '<option value="" disabled>Pozisyon Seçin...</option>';
            const pozisyonlar = app.data.pozisyonlar.sort((a, b) => a.ad.localeCompare(b.ad));
            if(pozisyonlar.length === 0) { selectElement.innerHTML = '<option value="" disabled>Lütfen önce Ayarlar\'dan pozisyon ekleyin.</option>'; }
            pozisyonlar.forEach(p => {
                const option = new Option(p.ad, p.id);
                if (selectedId && p.id === selectedId) { option.selected = true; }
                selectElement.add(option);
            });
            if (!selectedId) { selectElement.value = ""; }
        },
        vardiyaPersonelSelect: () => {
            const select = app.dom.vardiyaPersonelSelect;
            select.innerHTML = '<option value="" disabled>Personel Seçin...</option>';
            const aktifPersoneller = app.data.personel.filter(p => p.durum === 'Aktif').sort((a, b) => a.ad.localeCompare(b.ad));
            if (app.currentUser && app.currentUser.role === 'isci') {
                // İşçi ise, sadece kendini seçebilir (tek seçim). Ancak multiple select desteklendiğinden tek seçim olmaması gerekir; yine de kısıtlayalım.
                const isci = aktifPersoneller.find(p => p.id === app.currentUser.id);
                if (isci) { select.innerHTML = `<option value="${isci.id}" selected>${isci.ad}</option>`; } 
                else { select.innerHTML = '<option value="" disabled>Aktif personel olarak kayıtlı değilsiniz.</option>'; }
            } else { 
                 if(aktifPersoneller.length === 0) { select.innerHTML = '<option value="" disabled>Sistemde "Aktif" personel bulunmuyor.</option>'; }
                 aktifPersoneller.forEach(p => { select.add(new Option(p.ad, p.id)); });
            }
        },
        fabrikaSelect: () => { const selectUretim = app.dom.uretimFabrikaSelect; selectUretim.innerHTML = '<option value="" disabled selected>Bir fabrika seçin...</option>'; app.data.fabrikalar.forEach(f => selectUretim.add(new Option(f.ad, f.id))); },
        fabrikaSilSelect: () => { const selectSil = app.dom.fabrikaSilSelect; selectSil.innerHTML = '<option value="" disabled selected>...Bir fabrika seçin...</option>'; app.data.fabrikalar.forEach(f => selectSil.add(new Option(f.ad, f.id))); },
        giderTablosu: () => {
            app.dom.giderTabloContainer.innerHTML = '';
            if (app.data.giderler.length === 0) { app.dom.giderTabloContainer.innerHTML = '<p class="no-data-message">Henüz gider kaydı bulunmuyor.</p>'; return; }
            const table = document.createElement('table'); table.innerHTML = '<thead><tr><th>Tip</th><th>Tarih</th><th>Başlık</th><th>Açıklama</th><th>Tutar</th><th>İşlemler</th></tr></thead><tbody></tbody>';
            const tbody = table.querySelector('tbody');
            app.data.giderler.sort((a,b) => new Date(b.tarih) - new Date(a.tarih)).forEach(gider => {
                const row = tbody.insertRow(); const giderTipiMetni = gider.tip === 'fabrika' ? 'Fabrika Gideri' : 'Diğer Gider';
                row.innerHTML = `<td>${giderTipiMetni}</td><td>${new Date(gider.tarih).toLocaleDateString('tr-TR')}</td><td>${gider.aciklama}</td><td style="white-space: pre-wrap; max-width: 300px; word-wrap: break-word;">${gider.detay || '-'}</td><td>${app.helpers.formatCurrency(gider.tutar)}</td><td><button class="btn btn-danger gider-sil-btn" data-id="${gider.id}">Sil</button></td>`;
            });
            app.dom.giderTabloContainer.appendChild(table);
        },
        fabrikaHesapOzetleri: () => {
            app.dom.fabrikaHesapTabloContainer.innerHTML = '';
            if (app.data.fabrikalar.length === 0) { app.dom.fabrikaHesapTabloContainer.innerHTML = '<p class="no-data-message">Lütfen önce bir fabrika ekleyin.</p>'; return; }
            const table = document.createElement('table'); table.innerHTML = '<thead><tr><th>Fabrika Adı</th><th>Toplam Üretim</th><th>Toplam Ödenen</th><th>Kalan Borç</th><th>İşlemler</th></tr></thead><tbody></tbody>';
            const tbody = table.querySelector('tbody');
            app.data.fabrikalar.forEach(fabrika => {
                const bakiye = calculator.fabrikaBakiyesi(fabrika.id);
                tbody.insertRow().innerHTML = `<td>${fabrika.ad}</td><td>${app.helpers.formatCurrency(bakiye.toplamUretim)}</td><td>${app.helpers.formatCurrency(bakiye.toplamOdenen)}</td><td style="font-weight:bold; color: ${bakiye.kalanBorc > 0 ? 'var(--danger-color)' : 'var(--success-color)'}">${app.helpers.formatCurrency(bakiye.kalanBorc)}</td><td><button class="btn btn-success odeme-al-btn" data-id="${fabrika.id}" data-name="${fabrika.ad}">Ödeme</button> <button class="btn btn-secondary fabrika-csv-btn" data-id="${fabrika.id}" data-name="${fabrika.ad}">Rapor</button> <button class="btn btn-warning reset-hesap-btn" data-id="${fabrika.id}" data-name="${fabrika.ad}">Hesabı Sıfırla</button></td>`;
            });
            app.dom.fabrikaHesapTabloContainer.appendChild(table);
        },
        updateCardValues: (elements, durum) => { elements.gelir.textContent = app.helpers.formatCurrency(durum.toplamUretimDegeri); elements.gider.textContent = app.helpers.formatCurrency(durum.toplamGiderler); elements.alacak.textContent = app.helpers.formatCurrency(durum.kalanAlacak); elements.kar.textContent = app.helpers.formatCurrency(durum.netKar); elements.kar.className = 'value'; if (durum.netKar > 0) elements.kar.classList.add('profit'); if (durum.netKar < 0) elements.kar.classList.add('loss'); },
        dashboard: () => { const durum = calculator.genelDurum(); const elements = { gelir: document.getElementById('dashboard-gelir'), gider: document.getElementById('dashboard-gider'), kar: document.getElementById('dashboard-kar'), alacak: document.getElementById('dashboard-alacak') }; renderer.updateCardValues(elements, durum); renderer.nakitAkisChart(); },
        raporlarOzeti: () => { const durum = calculator.genelDurum(); const elements = { gelir: document.getElementById('rapor-gelir'), gider: document.getElementById('rapor-gider'), kar: document.getElementById('rapor-kar'), alacak: document.getElementById('rapor-alacak') }; renderer.updateCardValues(elements, durum); },
        nakitAkisChart: () => { const ctx = document.getElementById('nakitAkisChart').getContext('2d'); const etiketler = [], tahsilatlar = [], giderler = [], simdi = new Date(); for (let i = 5; i >= 0; i--) { const tarih = new Date(simdi.getFullYear(), simdi.getMonth() - i, 1); etiketler.push(tarih.toLocaleString('tr-TR', { month: 'long' })); const ayFiltre = item => { const it = new Date(item.tarih); return it.getFullYear() === tarih.getFullYear() && it.getMonth() === tarih.getMonth(); }; tahsilatlar.push(app.data.odemeler.filter(ayFiltre).reduce((sum, o) => sum + o.tutar, 0)); giderler.push(app.data.giderler.filter(ayFiltre).reduce((sum, g) => sum + g.tutar, 0)); } if (app.charts.nakitAkis) app.charts.nakitAkis.destroy(); app.charts.nakitAkis = new Chart(ctx, { type: 'bar', data: { labels: etiketler, datasets: [{ label: 'Tahsilatlar', data: tahsilatlar, backgroundColor: 'var(--success-color)' }, { label: 'Giderler', data: giderler, backgroundColor: 'var(--danger-color)' }] }, options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { callback: value => app.helpers.formatCurrency(value) } } } } }); },
        uretimEkleListesi: () => {
            app.dom.kayitListesiContainer.innerHTML = '';
            const list = app.temp.uretimListesi;
            if (list.length === 0) { app.dom.kayitListesiContainer.innerHTML = '<p class="no-data-message">Kaydedilecek bir kalem bulunmuyor.</p>'; app.dom.kayitListesiGenelToplam.textContent = 'Genel Toplam: 0,00 ₺'; return; }
            const table = document.createElement('table'); table.id = "kayit-listesi-tablosu"; table.innerHTML = '<thead><tr><th>Fabrika</th><th>Tarih</th><th>Açıklama</th><th>Adet</th><th>Birim Fiyat</th><th>Toplam Tutar</th><th>İşlem</th></tr></thead><tbody></tbody>';
            const tbody = table.querySelector('tbody');
            let genelToplam = 0;
            list.forEach((item, index) => {
                const fabrika = app.data.fabrikalar.find(f => f.id === item.fabrikaId); const toplam = item.adet * item.birimFiyat; genelToplam += toplam;
                const row = tbody.insertRow();
                row.innerHTML = `<td>${fabrika ? fabrika.ad : 'Bilinmeyen'}</td><td>${new Date(item.tarih).toLocaleDateString('tr-TR')}</td><td>${item.aciklama}</td><td>${item.adet}</td><td>${app.helpers.formatCurrency(item.birimFiyat)}</td><td>${app.helpers.formatCurrency(toplam)}</td><td><button class="btn-sm-danger temp-sil-btn" data-index="${index}">Listeden Sil</button></td>`;
            });
            app.dom.kayitListesiContainer.appendChild(table); app.dom.kayitListesiGenelToplam.textContent = `Genel Toplam: ${app.helpers.formatCurrency(genelToplam)}`;
        },
        sonUretimler: () => {
            app.dom.sonUretimlerContainer.innerHTML = '';
            const sonBes = [...app.data.uretimler].sort((a,b) => b.id - a.id).slice(0, 5);
            if (sonBes.length === 0) { app.dom.sonUretimlerContainer.innerHTML = '<p class="no-data-message">Henüz kaydedilmiş bir üretim bulunmuyor.</p>'; return; }
            const table = document.createElement('table'); table.innerHTML = '<thead><tr><th>Fabrika</th><th>Tarih</th><th>Açıklama</th><th>Toplam Tutar</th><th>İşlem</th></tr></thead><tbody></tbody>';
            const tbody = table.querySelector('tbody');
            const silmeButonuHtml = app.currentUser && app.currentUser.role === 'admin' 
                ? `<button class="btn-sm-danger uretim-sil-btn" data-id="{id}">Sil</button>` : ``;
            sonBes.forEach(item => {
                const fabrika = app.data.fabrikalar.find(f => f.id === item.fabrikaId); const toplam = item.adet * item.birimFiyat;
                tbody.insertRow().innerHTML = `<td>${fabrika ? fabrika.ad : 'Bilinmeyen'}</td><td>${new Date(item.tarih).toLocaleDateString('tr-TR')}</td><td>${item.aciklama} (${item.adet} adet)</td><td>${app.helpers.formatCurrency(toplam)}</td><td>${silmeButonuHtml.replace('{id}', item.id)}</td>`;
            });
            app.dom.sonUretimlerContainer.appendChild(table);
        },
        // Yeni: Personel Durumu tablosu
        personelDurumu: () => {
            const container = app.dom.personelDurumuContainer;
            if (!container) return;
            container.innerHTML = '';
            const personeller = app.data.personel.sort((a,b) => a.ad.localeCompare(b.ad));
            if (personeller.length === 0) {
                container.innerHTML = '<p class="no-data-message">Henüz personel kaydı yok.</p>';
                return;
            }
            // Tüm günleri en eski kayıt tarihinden bugüne kadar listele.
            const today = new Date();
            let days = [];
            let earliestDate = null;
            // Personellerin katılım kayıtlarından en eski tarihi bul.
            // Iterate through each person to find earliest attendance date
            personeller.forEach(p => {
                if (p.attendance) {
                    Object.keys(p.attendance).forEach(dateKey => {
                        const d = new Date(dateKey);
                        if (!isNaN(d)) {
                            if (!earliestDate || d < earliestDate) {
                                earliestDate = new Date(d);
                            }
                        }
                    });
                }
            });
            let startDate;
            if (earliestDate) {
                // En eski kayıt tarihinden başlayarak bugüne kadar tüm günleri göster
                startDate = new Date(earliestDate);
            } else {
                // Hiç kayıt yoksa, son 30 günü göster
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 29);
            }
            // Takvim aralığını belirle: bugün dahil olmak üzere
            // kullanıcının planlama yapabilmesi için gelecekteki 30 günü de ekleyelim
            const endDate = new Date(today);
            endDate.setDate(today.getDate() + 30);
            // startDate ile endDate arasındaki tüm günlerin listesini oluştur
            const current = new Date(startDate);
            while (current <= endDate) {
                days.push(current.toISOString().split('T')[0]);
                current.setDate(current.getDate() + 1);
            }
            // tablo oluştur
            const table = document.createElement('table');
            table.className = 'attendance-table';
            let theadHtml = '<thead><tr><th>Personel</th>';
            days.forEach(d => {
                const dt = new Date(d);
                const label = (`${dt.getDate().toString().padStart(2,'0')}.${(dt.getMonth()+1).toString().padStart(2,'0')}`);
                theadHtml += `<th>${label}</th>`;
            });
            theadHtml += '</tr></thead>';
            let tbodyHtml = '<tbody>';
            personeller.forEach(p => {
                tbodyHtml += `<tr><td style="white-space: nowrap; text-align:left;">${p.ad}</td>`;
                days.forEach(d => {
                    let cellHtml = '';
                    const entry = p.attendance ? p.attendance[d] : undefined;
                    if (entry) {
                        // Haftalık planlı izinler: turuncu renk
                        if (entry.status === 'weekly') {
                            cellHtml = '<span class="attendance-weekly">İzin</span>';
                        } else if (entry.status === 'izin') {
                            // Manuel olarak işaretlenen veya devamsızlık günü: kırmızı
                            cellHtml = '<span class="attendance-absent">İzin</span>';
                        } else if (entry.status === 'present') {
                            // Çalışılan günler
                            if (entry.hours !== null && entry.hours !== undefined) {
                                const durStr = app.helpers.formatHoursDecimal(entry.hours);
                                cellHtml = `<span class="attendance-present">✔ ${durStr}</span>`;
                            } else {
                                cellHtml = '<span class="attendance-present">✔</span>';
                            }
                        } else if (entry.status === 'absent') {
                            // Absent statüsü (şimdilik kullanılmıyor)
                            cellHtml = '<span class="attendance-absent">×</span>';
                        } else {
                            cellHtml = '<span class="attendance-absent">×</span>';
                        }
                    } else {
                        // Kayıt yok: default olarak devamsız (×)
                        cellHtml = '<span class="attendance-absent">×</span>';
                    }
                    // veri attributeleri ekle: personelId ve tarih
                    tbodyHtml += `<td data-person-id="${p.id}" data-date="${d}">${cellHtml}</td>`;
                });
                tbodyHtml += '</tr>';
            });
            tbodyHtml += '</tbody>';
            table.innerHTML = theadHtml + tbodyHtml;
            container.appendChild(table);
            // Admin yetkisi varsa, izin/absent işaretlemek için hücre tıklama olayını ekle
            if (app.currentUser && app.currentUser.role === 'admin') {
                const tbodyEl = table.querySelector('tbody');
                tbodyEl.addEventListener('click', (e) => {
                    const td = e.target.closest('td');
                    if (!td) return;
                    const pid = parseInt(td.dataset.personId);
                    const dateKey = td.dataset.date;
                    // Personel adı hücreleri veya geçersiz veri için işlem yapmayalım
                    if (!pid || !dateKey) return;
                    const person = app.data.personel.find(per => per.id === pid);
                    if (!person) return;
                    const entry = person.attendance ? person.attendance[dateKey] : undefined;
                    // Çalışılan veya planlı izin (weekly) günleri değiştirme
                    if (entry && (entry.status === 'present' || entry.status === 'weekly')) {
                        return;
                    }
                    if (entry && entry.status === 'izin') {
                        // İzin (kırmızı) > sil (devamsız)
                        delete person.attendance[dateKey];
                    } else {
                        // Devamsız (veya hiç kayıt yok) > izin (kırmızı)
                        if (!person.attendance) person.attendance = {};
                        person.attendance[dateKey] = { status: 'izin', hours: null };
                    }
                    dataManager.save();
                    renderer.personelDurumu();
                });
            }

            // --- Aylık Çalışma ve İzin Günleri Özetlerini Hesapla ve Göster ---
            const summaryContainer = app.dom.personelDurumuSummaryContainer;
            if (summaryContainer) {
                // İçeriği temizle
                summaryContainer.innerHTML = '';
                const wrapper = document.createElement('div');
                wrapper.className = 'attendance-summary';
                // Aylara göre toplam gün sayısını hesapla (gösterilen günler)
                const monthDayCount = {};
                // Yalnızca bugüne kadar olan günleri sayarak aylık çalışma/izin oranlarını hesaplarken gelecek günleri payda olarak kullanma
                days.forEach(dateStr => {
                    const dt = new Date(dateStr);
                    // Sadece bugün veya daha önceki tarihleri hesaba kat
                    if (dt <= today) {
                        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
                        if (!monthDayCount[key]) monthDayCount[key] = 0;
                        monthDayCount[key] += 1;
                    }
                });
                const monthNames = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
                // Çalışma özeti başlığı
                const summaryTitle = document.createElement('h3');
                summaryTitle.textContent = 'Aylık Çalışma Günleri Özeti';
                wrapper.appendChild(summaryTitle);
                const summaryList = document.createElement('ul');
                // 'personeller' isimli değişkeni kullanarak aylık çalışma günleri özetini oluşturalım
                personeller.forEach(p => {
                    // Her ay için çalışılan gün sayısını hesapla
                    const monthWorked = {};
                    days.forEach(dateStr => {
                        const dt = new Date(dateStr);
                        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
                        const entry = p.attendance ? p.attendance[dateStr] : undefined;
                        if (!monthWorked[key]) monthWorked[key] = 0;
                        if (entry && entry.status === 'present') monthWorked[key] += 1;
                    });
                    const parts = [];
                    Object.keys(monthWorked).forEach(key => {
                        const [year, month] = key.split('-');
                        const name = monthNames[parseInt(month) - 1];
                        const worked = monthWorked[key];
                        // Her ayın gerçek gün sayısını hesapla (örn. Şubat 28/29, Mart 31)
                        const totalDays = new Date(parseInt(year), parseInt(month), 0).getDate();
                        parts.push(`${name}: ${worked}/${totalDays} gün`);
                    });
                    const li = document.createElement('li');
                    li.textContent = `${p.ad}: ${parts.join(', ')}`;
                    summaryList.appendChild(li);
                });
                wrapper.appendChild(summaryList);
                // İzin özeti başlığı
                const izinTitle = document.createElement('h3');
                izinTitle.textContent = 'Aylık İzin Günleri Özeti';
                wrapper.appendChild(izinTitle);
                const izinList = document.createElement('ul');
                // Aylık izin günleri özetini oluştururken de aynı personeller listesini kullan
                personeller.forEach(p => {
                    const monthWeekly = {};
                    const monthIzin = {};
                    days.forEach(dateStr => {
                        const dt = new Date(dateStr);
                        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
                        const entry = p.attendance ? p.attendance[dateStr] : undefined;
                        if (!monthWeekly[key]) monthWeekly[key] = 0;
                        if (!monthIzin[key]) monthIzin[key] = 0;
                        if (entry) {
                            if (entry.status === 'weekly') monthWeekly[key] += 1;
                            else if (entry.status === 'izin') monthIzin[key] += 1;
                        }
                    });
                    const parts2 = [];
                    const keys = Object.keys(monthDayCount);
                    keys.forEach(key => {
                        const [year, month] = key.split('-');
                        const name = monthNames[parseInt(month) - 1];
                        const weekly = monthWeekly[key] || 0;
                        const izin = monthIzin[key] || 0;
                        const total = weekly + izin;
                        // Her ayın gerçek gün sayısını hesapla (örn. Şubat 28/29, Mart 31)
                        const totalDaysIzin = new Date(parseInt(year), parseInt(month), 0).getDate();
                        parts2.push(`${name}: ${total}/${totalDaysIzin} gün (planlı ${weekly}, devamsızlık ${izin})`);
                    });
                    const li2 = document.createElement('li');
                    li2.textContent = `${p.ad}: ${parts2.join(', ')}`;
                    izinList.appendChild(li2);
                });
                wrapper.appendChild(izinList);
                summaryContainer.appendChild(wrapper);
            }
            // Son olarak, varsa haftalık izin planlama formunu güncelle
            if (renderer.populateIzinPersonelSelect) {
                renderer.populateIzinPersonelSelect();
            }
        },

        /**
         * Haftalık izin planlama formundaki personel select'ini doldurur.
         * Sadece aktif durumdaki personeller listelenir.
         */
        populateIzinPersonelSelect: () => {
            const select = app.dom.izinPersonelSelect;
            if (!select) return;
            // Mevcut seçenekleri temizle ve doldur
            const aktifPersoneller = app.data.personel.filter(p => p.durum === 'Aktif').sort((a, b) => a.ad.localeCompare(b.ad));
            if (aktifPersoneller.length === 0) {
                select.innerHTML = '<option value="" disabled selected>Aktif personel yok</option>';
                return;
            }
            // Varsayılan seçeneği ve aktif personelleri ekle
            const options = [];
            options.push('<option value="" disabled selected>Personel Seçin...</option>');
            aktifPersoneller.forEach(p => {
                options.push(`<option value="${p.id}">${p.ad}</option>`);
            });
            select.innerHTML = options.join('');
        }
    };

    // --- BÖLÜM 5: AKSİYONLAR VE İŞ MANTIĞI ---
    const actions = {
        // YENİ SETUP (BACKEND İLE)
    setup: async (e) => {
        e.preventDefault();
        const username = document.getElementById('setup-username').value;
        const pass = document.getElementById('setup-pass').value;
        const passConfirm = document.getElementById('setup-pass-onay').value;

        if(pass !== passConfirm) { alert("Şifreler eşleşmiyor"); return; }

        try {
            const res = await fetch('/api/auth/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kullaniciAdi: username, sifre: pass })
            });
            
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);

            // Token kaydet
            app.currentUser = data; 
            localStorage.setItem('userToken', data.token);
            
            alert('Yönetici oluşturuldu!');

            // EKRANI DEĞİŞTİR (BURASI EKSİKTİ)
            app.dom.setupContainer.style.display = 'none';
            app.dom.appContainer.style.display = 'flex';
            
            main.runAfterLogin();

        } catch (err) {
            document.getElementById('setup-error').textContent = err.message;
        }
    },

    // YENİ LOGIN (BACKEND İLE)
    adminLogin: async (e) => {
        e.preventDefault();
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kullaniciAdi: username, sifre: password })
            });

            const data = await res.json();

            if(!res.ok) throw new Error(data.message);

            if(data.rol !== 'admin') throw new Error('Yönetici yetkiniz yok.');

            app.currentUser = data;
            localStorage.setItem('userToken', data.token);
            
            app.dom.adminLoginContainer.style.display = 'none';
            app.dom.appContainer.style.display = 'flex';
            main.runAfterLogin();

        } catch (err) {
            document.getElementById('admin-login-error').textContent = err.message;
        }
    },

        personelLogin: async (e) => {
            e.preventDefault(); 
            const username = app.dom.personelLoginForm.querySelector('#personel-username').value.trim();
            const password = app.dom.personelLoginForm.querySelector('#personel-password').value;
            const loginError = app.dom.personelLoginError;
            loginError.textContent = '';
            const inputHash = await app.helpers.hash(password);
            const personel = app.data.personel.find(p => p.kullaniciAdi.toLowerCase() === username.toLowerCase());
            if (personel && personel.sifre === inputHash) {
                if(personel.durum !== 'Aktif') { loginError.textContent = 'Hesabınız aktif değil. Yönetici ile görüşün.'; return; }
                app.currentUser = { id: personel.id, ad: personel.ad, role: 'isci' };
                app.dom.personelLoginContainer.style.display = 'none';
                app.dom.appContainer.style.display = 'flex';
                main.runAfterLogin();
                return;
            }
            loginError.textContent = 'Kullanıcı adı veya şifre hatalı!';
        },
        changePassword: async (e) => { e.preventDefault(); const form = app.dom.sifreDegistirForm; const currentPass = form.querySelector('#mevcut-sifre').value; const newPass = form.querySelector('#yeni-sifre').value; const confirmPass = form.querySelector('#yeni-sifre-onay').value; const resultMsg = app.dom.sifreDegistirSonuc; resultMsg.textContent = ''; resultMsg.style.color = 'var(--danger-color)'; const storedHash = dataManager.loadAuthHash(); const currentHash = await app.helpers.hash(currentPass); if (currentHash !== storedHash) { resultMsg.textContent = 'Mevcut Yönetici şifreniz hatalı!'; return; } if (newPass.length < 4) { resultMsg.textContent = 'Yeni şifre en az 4 karakter olmalıdır.'; return; } if (newPass !== confirmPass) { resultMsg.textContent = 'Yeni şifreler eşleşmiyor!'; return; } const newHash = await app.helpers.hash(newPass); dataManager.saveAuthHash(newHash); resultMsg.style.color = 'var(--success-color)'; resultMsg.textContent = 'Yönetici şifreniz başarıyla güncellendi!'; form.reset(); },
        logout: () => { if(confirm("Çıkış yapmak istediğinizden emin misiniz?")) { app.currentUser = null; window.location.reload(); } },
        navigate: (e, forcePageId = null) => {
            if (e) e.preventDefault();
            const pageId = forcePageId || e.currentTarget.dataset.page;
            if (app.currentUser.role === 'isci') { const allowedPages = ['vardiya-yonetimi', 'uretim-ekle']; if (!allowedPages.includes(pageId)) { return; } }
            app.dom.navLinks.forEach(l => l.classList.remove('active'));
            app.dom.pages.forEach(p => p.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
            const activePage = document.getElementById(pageId);
            if(activeLink) { activeLink.classList.add('active'); app.dom.pageTitle.textContent = activeLink.textContent.trim(); }
            if(activePage) { activePage.classList.add('active'); }
            // Özel sayfa güncellemeleri
            if (pageId === 'personel-durumu') {
                renderer.personelDurumu();
            }
        },
        // Yeni: vardiya başlangıcı çoklu personel destekler
        startShift: (e) => {
            e.preventDefault();
            const select = app.dom.vardiyaPersonelSelect;
            const selectedOptions = Array.from(select.selectedOptions).filter(opt => opt.value);
            if (selectedOptions.length === 0) { alert('Vardiyayı başlatmak için lütfen bir veya daha fazla personel seçin.'); return; }
            // Eğer işçi rolünde ise, sadece kendisini seçebilir
            if(app.currentUser.role === 'isci' && selectedOptions.some(opt => parseInt(opt.value) !== app.currentUser.id)) { alert('İşçi olarak sadece kendi adınıza vardiya başlatabilirsiniz.'); return; }
            const activeShift = app.data.vardiyalar.find(v => v.durum === 'Aktif');
            if (activeShift) { alert('Zaten aktif bir vardiya bulunmaktadır. Önce onu kapatmalı veya devretmelisiniz.'); return; }
            const nowISO = new Date().toISOString();
            const calisanlar = selectedOptions.map(opt => {
                const pid = parseInt(opt.value);
                return { isciAdi: opt.text, personelId: pid, devralmaZamani: nowISO, hoursRecorded: false };
            });
            // İlk seçilen kişi vardiya sorumlusu olur
            const responsibleId = parseInt(selectedOptions[0].value);
            // Vardiya oluştur
            const newShift = {
                id: Date.now(),
                baslamaZamani: nowISO,
                bitisZamani: null,
                durum: 'Aktif',
                calisanlar: calisanlar,
                responsibleId: responsibleId
            };
            app.data.vardiyalar.push(newShift);
            // Attendance kaydet
            const today = app.helpers.getTodayISO();
            calisanlar.forEach(c => {
                const person = app.data.personel.find(p => p.id === c.personelId);
                if (person) {
                    if (!person.attendance[today]) {
                        person.attendance[today] = { status: 'present', hours: null };
                    } else {
                        person.attendance[today].status = 'present';
                    }
                }
            });
            dataManager.save();
            renderer.updateAll();
            app.dom.yeniVardiyaForm.reset();
        },
        endShift: () => {
            const activeShift = app.data.vardiyalar.find(v => v.durum === 'Aktif');
            if (!activeShift) { alert('Kapatılacak aktif bir vardiya bulunamadı.'); return; }
            const onay = confirm('Aktif vardiyayı tamamen sonlandırmak istediğinizden emin misiniz?');
            if (!onay) return;
            const nowISO = new Date().toISOString();
            // bitisZamani tüm aktif çalışanlar için ekle
            activeShift.calisanlar.forEach(c => {
                if (!c.bitisZamani) {
                    c.bitisZamani = nowISO;
                }
            });
            // Çalışanların çalışma saatlerini hesapla ve kaydet
            activeShift.calisanlar.forEach(c => {
                if (!c.hoursRecorded) {
                    const person = app.data.personel.find(p => p.id === c.personelId);
                    if (person) {
                        const startISO = c.devralmaZamani;
                        const endISO = c.bitisZamani;
                        const hoursDec = app.helpers.calculateHoursDecimal(startISO, endISO);
                        const dateKey = app.helpers.getTodayISO();
                        if (!person.attendance[dateKey]) {
                            person.attendance[dateKey] = { status: 'present', hours: hoursDec };
                        } else {
                            const entry = person.attendance[dateKey];
                            entry.status = 'present';
                            if (entry.hours === null || entry.hours === undefined) entry.hours = 0;
                            entry.hours = parseFloat((entry.hours + hoursDec).toFixed(2));
                        }
                    }
                    c.hoursRecorded = true;
                }
            });
            activeShift.bitisZamani = nowISO;
            activeShift.durum = 'Tamamlandı';
            dataManager.save();
            renderer.updateAll();
        },
        transferShift: () => {
            const activeShift = app.data.vardiyalar.find(v => v.durum === 'Aktif');
            if (!activeShift) { alert('Devredilecek aktif bir vardiya bulunamadı.'); return; }
            // Mevcut sorumlu personeli bul
            let responsibleId = activeShift.responsibleId;
            // Eğer sorumlu belirtilmemişse ilk aktif çalışanı sorumlu olarak kabul et
            const aktifCalisanlar = activeShift.calisanlar.filter(c => !c.bitisZamani);
            if (responsibleId === undefined || responsibleId === null) {
                responsibleId = aktifCalisanlar.length > 0 ? aktifCalisanlar[0].personelId : null;
            }
            const currentResponsible = app.data.personel.find(p => p.id === responsibleId);
            if (!currentResponsible) { alert('Aktif vardiya sorumlusu bulunamadı.'); return; }
            // İşçi rolünde sadece kendi vardiyasını devredebilir
            if (app.currentUser.role === 'isci' && currentResponsible.id !== app.currentUser.id) { alert('Sadece kendi aktif vardiyanızı devredebilirsiniz.'); return; }
            // Devredilecek kişi listesi: Aktif olan ve mevcut sorumlu olmayan personeller
            const devirListesi = app.data.personel.filter(p => p.durum === 'Aktif' && p.id !== currentResponsible.id).sort((a, b) => a.ad.localeCompare(b.ad));
            let optionsHtml = '<option value="" disabled selected>Devredilecek personeli seçin...</option>';
            if (devirListesi.length === 0) {
                optionsHtml = '<option value="" disabled>Devredilecek başka "Aktif" personel bulunmuyor.</option>';
            } else {
                devirListesi.forEach(p => {
                    optionsHtml += `<option value="${p.id}">${p.ad}</option>`;
                });
            }
            const formHtml = `
                <p style="margin-bottom: 20px;">Mevcut vardiya sorumlusu: <strong>${currentResponsible.ad}</strong><br>Vardiyayı kime devretmek istiyorsunuz?</p>
                <form id="vardiya-devir-form">
                    <div class="input-group"><label for="vardiya-devir-select">Yeni Personel</label><select id="vardiya-devir-select" required>${optionsHtml}</select></div>
                    <button type="submit" class="btn btn-success btn-full">Vardiyayı Devret</button>
                </form>
            `;
            actions.openModal('Vardiya Devret', formHtml);
            document.getElementById('vardiya-devir-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const selectEl = document.getElementById('vardiya-devir-select');
                const selectedOption = selectEl.options[selectEl.selectedIndex];
                if (!selectedOption || selectedOption.value === "") { alert('Lütfen bir personel seçin.'); return; }
                const yeniPersonelId = parseInt(selectedOption.value);
                const yeniIsciAdi = selectedOption.text;
                if (confirm(`'${currentResponsible.ad}' vardiyasını '${yeniIsciAdi}' adlı çalışana devretmek üzeresiniz. Onaylıyor musunuz?`)) {
                    // Yeni sorumlu olarak ata
                    activeShift.responsibleId = yeniPersonelId;
                    // Seçilen kişi aktif değilse, aktif vardiyaya ekle
                    const alreadyActive = aktifCalisanlar.some(c => c.personelId === yeniPersonelId && !c.bitisZamani);
                    if (!alreadyActive) {
                        actions.addWorkerToActiveShift(yeniPersonelId);
                    }
                    // Attendance kaydı addWorkerToActiveShift fonksiyonunda yapılıyor
                    dataManager.save();
                    actions.closeModal();
                    renderer.updateAll();
                    alert('Vardiya başarıyla devredildi.');
                }
            });
        },
        // Yeni: aktif vardiyaya personel ekleme/çıkarma yöneticisi
        manageShiftPersonnel: () => {
            const activeShift = app.data.vardiyalar.find(v => v.durum === 'Aktif');
            if (!activeShift) { alert('Şu anda aktif vardiya bulunmuyor.'); return; }
            const activeIds = activeShift.calisanlar.filter(c => !c.bitisZamani).map(c => c.personelId);
            const aktifPersoneller = app.data.personel.filter(p => p.durum === 'Aktif').sort((a,b) => a.ad.localeCompare(b.ad));
            let formHtml = '<form id="shift-personnel-form">';
            formHtml += '<p style="margin-bottom:10px;">İşaretli personeller şu anda vardiyada olacaktır.</p>';
            aktifPersoneller.forEach(p => {
                const checked = activeIds.includes(p.id) ? 'checked' : '';
                formHtml += `<div class="checkbox-container"><input type="checkbox" id="chk_${p.id}" value="${p.id}" ${checked}><label for="chk_${p.id}">${p.ad}</label></div>`;
            });
            formHtml += '<button type="submit" class="btn btn-success btn-full">Kaydet</button></form>';
            actions.openModal('Vardiya Personel Yönetimi', formHtml, true);
            document.getElementById('shift-personnel-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const checkedIds = Array.from(e.target.querySelectorAll('input[type="checkbox"]:checked')).map(inp => parseInt(inp.value));
                // Eklenecek olanlar = checked but not active
                const toAdd = checkedIds.filter(id => !activeIds.includes(id));
                // Çıkarılacak olanlar = active but not checked
                const toRemove = activeIds.filter(id => !checkedIds.includes(id));
                toAdd.forEach(pid => {
                    actions.addWorkerToActiveShift(pid);
                });
                toRemove.forEach(pid => {
                    actions.removeWorkerFromActiveShift(pid);
                });
                // Sorumlu personel değişikliği: eğer sorumlu artık aktif değilse, ilk aktif kişiyi sorumlu yap
                const activeShift = app.data.vardiyalar.find(v => v.durum === 'Aktif');
                if (activeShift) {
                    const activeIdsNow = activeShift.calisanlar.filter(c => !c.bitisZamani).map(c => c.personelId);
                    if (activeIdsNow.length > 0) {
                        if (!activeIdsNow.includes(activeShift.responsibleId)) {
                            activeShift.responsibleId = activeIdsNow[0];
                        }
                    } else {
                        activeShift.responsibleId = null;
                    }
                }
                dataManager.save();
                actions.closeModal();
                renderer.updateAll();
                alert('Vardiya personel listesi güncellendi.');
            });
        },
        addWorkerToActiveShift: (personelId) => {
            const activeShift = app.data.vardiyalar.find(v => v.durum === 'Aktif');
            if (!activeShift) return;
            if (activeShift.calisanlar.some(c => !c.bitisZamani && c.personelId === personelId)) return; // already active
            const person = app.data.personel.find(p => p.id === personelId);
            if (!person) return;
            activeShift.calisanlar.push({ isciAdi: person.ad, personelId: personelId, devralmaZamani: new Date().toISOString(), hoursRecorded: false });
            // Attendance kaydet: bu gün için mevcut değeri güncelle
            const today = app.helpers.getTodayISO();
            if (!person.attendance[today]) {
                person.attendance[today] = { status: 'present', hours: null };
            } else {
                // eğer izin veya absent ise present olarak güncelle ancak hours koru
                const entry = person.attendance[today];
                entry.status = 'present';
            }
        },
        removeWorkerFromActiveShift: (personelId) => {
            const activeShift = app.data.vardiyalar.find(v => v.durum === 'Aktif');
            if (!activeShift) return;
            const calisan = activeShift.calisanlar.find(c => !c.bitisZamani && c.personelId === personelId);
            if (!calisan) return;
            // Çıkış zamanını işaretle
            const nowISO = new Date().toISOString();
            calisan.bitisZamani = nowISO;
            // Eğer saat kaydı henüz yapılmadıysa, çalışılan süreyi hesapla ve attendance kaydet
            if (!calisan.hoursRecorded) {
                const person = app.data.personel.find(p => p.id === personelId);
                if (person) {
                    const startISO = calisan.devralmaZamani;
                    const hoursDec = app.helpers.calculateHoursDecimal(startISO, nowISO);
                    const dateKey = app.helpers.getTodayISO();
                    if (!person.attendance[dateKey]) {
                        person.attendance[dateKey] = { status: 'present', hours: hoursDec };
                    } else {
                        const entry = person.attendance[dateKey];
                        entry.status = 'present';
                        if (entry.hours === null || entry.hours === undefined) entry.hours = 0;
                        entry.hours = parseFloat((entry.hours + hoursDec).toFixed(2));
                    }
                }
                calisan.hoursRecorded = true;
            }
            // Eğer çıkartılan kişi sorumlu ise yeni sorumlu ataması yap
            if (activeShift.responsibleId === personelId) {
                // Mevcut aktif personelleri listele (bu kişiyi çıkardıktan sonra)
                const kalanAktifler = activeShift.calisanlar.filter(c => !c.bitisZamani).map(c => c.personelId);
                if (kalanAktifler.length > 0) {
                    activeShift.responsibleId = kalanAktifler[0];
                } else {
                    activeShift.responsibleId = null;
                }
            }
        },
        handlePersonelFormLoad: (e) => {
            const selectedId = e.target.value;
            const form = app.dom.personelIslemForm;
            const submitBtn = app.dom.personelFormSubmitBtn;
            const sifreInput = form.querySelector('#personel-sifre');
            const sgkSelect = app.dom.personelSgkDurumu; 
            const sgkTutarGroup = app.dom.personelSgkTutarGroup; 
            const sgkTutarInput = form.querySelector('#personel-sgk-tutar');
            const netMaasInput = app.dom.personelNetMaasInput; 
            const brutMaasInput = app.dom.personelBrutMaasInput; 
            
            if (selectedId === 'new') {
                form.reset();
                form.querySelector('#personel-ise-alim-tarihi').value = app.helpers.getTodayISO();
                form.querySelector('#personel-islem-select').value = 'new';
                submitBtn.textContent = 'Personeli Kaydet';
                submitBtn.classList.add('btn-success');
                submitBtn.classList.remove('btn-warning');
                sifreInput.placeholder = 'Yeni şifre (en az 4 karakter)';
                sgkSelect.value = 'Yok'; 
                sgkTutarGroup.style.display = 'none';
            } else {
                const personelId = parseInt(selectedId);
                const personel = app.data.personel.find(p => p.id === personelId);
                if (!personel) {
                    alert('Personel bulunamadı. Form sıfırlanıyor.');
                    actions.handlePersonelFormLoad({ target: { value: 'new' } });
                    return;
                }
                form.querySelector('#personel-ad-soyad').value = personel.ad;
                form.querySelector('#personel-telefon').value = personel.telefon || '';
                form.querySelector('#personel-ise-alim-tarihi').value = personel.iseAlimTarihi || '';
                form.querySelector('#personel-pozisyon-select').value = personel.pozisyonId;
                
                netMaasInput.value = personel.netMaas || '';
                brutMaasInput.value = personel.brutMaas || '';
                
                form.querySelector('#personel-maas-tipi').value = personel.maasTipi;
                form.querySelector('#personel-durum').value = personel.durum;
                form.querySelector('#personel-kullanici-adi').value = personel.kullaniciAdi || '';
                
                sgkSelect.value = personel.sgkDurumu || 'Yok';
                sgkTutarInput.value = personel.sgkTutar || '';
                if (personel.sgkDurumu === 'Var') {
                    sgkTutarGroup.style.display = 'block';
                } else {
                    sgkTutarGroup.style.display = 'none';
                }

                sifreInput.value = ''; 
                sifreInput.placeholder = personel.sifre ? 'Yeni şifre (Değiştirmek için)' : 'Yeni şifre (en az 4 karakter)';
                submitBtn.textContent = 'Değişiklikleri Kaydet';
                submitBtn.classList.remove('btn-success');
                submitBtn.classList.add('btn-warning');
            }
        },
        handlePersonelFormSubmit: async (e) => {
            e.preventDefault();
            const selectedId = app.dom.personelIslemSelect.value;
            if (selectedId === 'new') { await actions.saveNewWorker(e.target); } 
            else { await actions.saveUpdatedWorker(e.target, parseInt(selectedId)); }
        },
        saveNewWorker: async (form) => {
            const adSoyad = form.querySelector('#personel-ad-soyad').value.trim();
            const pozisyonId = parseInt(form.querySelector('#personel-pozisyon-select').value);
            if (!adSoyad || isNaN(pozisyonId)) { alert('İsim Soyisim ve Pozisyon alanları zorunludur.'); return; }
            const kullaniciAdi = form.querySelector('#personel-kullanici-adi').value.trim();
            const sifre = form.querySelector('#personel-sifre').value;
            const sgkDurumu = form.querySelector('#personel-sgk-durumu').value;
            const sgkTutar = parseFloat(form.querySelector('#personel-sgk-tutar').value) || 0;
            // Maaşları Al (Manuel)
            const netMaas = parseFloat(app.dom.personelNetMaasInput.value) || 0;
            const brutMaas = parseFloat(app.dom.personelBrutMaasInput.value) || 0;

            let sifreHash = '';
            if (kullaniciAdi) {
                if (kullaniciAdi.toLowerCase() === 'admin' || app.data.personel.some(p => p.kullaniciAdi.toLowerCase() === kullaniciAdi.toLowerCase())) {
                    alert('Bu kullanıcı adı zaten kullanılıyor. Lütfen başka bir kullanıcı adı seçin.');
                    return;
                }
                if(sifre.length < 4) { alert('Kullanıcı adı girdiyseniz, şifre en az 4 karakter olmalıdır.'); return; }
                sifreHash = await app.helpers.hash(sifre);
            } else if (sifre) {
                alert('Şifre belirlemek için önce bir kullanıcı adı girmelisiniz.');
                return;
            }
            const newWorker = {
                id: Date.now(),
                ad: adSoyad,
                telefon: form.querySelector('#personel-telefon').value.trim(),
                iseAlimTarihi: form.querySelector('#personel-ise-alim-tarihi').value,
                pozisyonId: pozisyonId,
                netMaas: netMaas, 
                brutMaas: brutMaas, 
                maasTipi: form.querySelector('#personel-maas-tipi').value,
                durum: form.querySelector('#personel-durum').value,
                kullaniciAdi: kullaniciAdi,
                sifre: sifreHash,
                sgkDurumu: sgkDurumu,
                sgkTutar: sgkTutar,
                attendance: {} // Yeni: katılım kaydı
            };
            app.data.personel.push(newWorker);
            dataManager.save();
            alert('Personel başarıyla kaydedildi.');
            renderer.personelListesi(); 
            renderer.pozisyonListesi(); 
            renderer.vardiyaPersonelSelect();
            renderer.personelIslemSelect(); 
            actions.handlePersonelFormLoad({ target: { value: 'new' } }); 
        },
        saveUpdatedWorker: async (form, personelId) => {
            const personelIndex = app.data.personel.findIndex(p => p.id === personelId);
            if (personelIndex === -1) { alert('Personel bulunamadı. Değişiklikler kaydedilemedi.'); return; }
            const adSoyad = form.querySelector('#personel-ad-soyad').value.trim();
            const pozisyonId = parseInt(form.querySelector('#personel-pozisyon-select').value);
            const sgkDurumu = form.querySelector('#personel-sgk-durumu').value;
            const sgkTutar = parseFloat(form.querySelector('#personel-sgk-tutar').value) || 0;
            // Maaşları Al (Manuel)
            const netMaas = parseFloat(app.dom.personelNetMaasInput.value) || 0;
            const brutMaas = parseFloat(app.dom.personelBrutMaasInput.value) || 0;

            if (!adSoyad || isNaN(pozisyonId)) { alert('İsim Soyisim ve Pozisyon alanları zorunludur.'); return; }
            const eskiAd = app.data.personel[personelIndex].ad;
            if (eskiAd !== adSoyad) { if (!confirm(`Personelin adını '${eskiAd}' -> '${adSoyad}' olarak değiştirmek üzeresiniz?\n(Geçmiş vardiya kayıtları etkilenmez.)`)) { return; } }
            const kullaniciAdi = form.querySelector('#personel-kullanici-adi').value.trim();
            const yeniSifre = form.querySelector('#personel-sifre').value;
            let sifreHash = app.data.personel[personelIndex].sifre;
            if (kullaniciAdi) {
                if (kullaniciAdi.toLowerCase() === 'admin' || app.data.personel.some(p => p.id !== personelId && p.kullaniciAdi.toLowerCase() === kullaniciAdi.toLowerCase())) {
                    alert('Bu kullanıcı adı zaten başka bir personel tarafından kullanılıyor.');
                    return;
                }
                if (yeniSifre) {
                    if(yeniSifre.length < 4) { alert('Yeni şifre en az 4 karakter olmalıdır.'); return; }
                    sifreHash = await app.helpers.hash(yeniSifre);
                } else if (!sifreHash) { 
                    alert('Kullanıcı adı belirlediyseniz, mutlaka bir şifre de girmelisiniz.');
                    return;
                }
            } else {
                if (yeniSifre) { alert('Şifre belirlemek için önce bir kullanıcı adı girmelisiniz.'); return; }
                sifreHash = '';
            }
            app.data.personel[personelIndex] = {
                ...app.data.personel[personelIndex],
                ad: adSoyad,
                telefon: form.querySelector('#personel-telefon').value.trim(),
                iseAlimTarihi: form.querySelector('#personel-ise-alim-tarihi').value,
                pozisyonId: pozisyonId,
                netMaas: netMaas, 
                brutMaas: brutMaas, 
                maasTipi: form.querySelector('#personel-maas-tipi').value,
                durum: form.querySelector('#personel-durum').value,
                kullaniciAdi: kullaniciAdi,
                sifre: sifreHash,
                sgkDurumu: sgkDurumu,
                sgkTutar: sgkTutar
            };
            dataManager.save();
            alert('Personel bilgileri başarıyla güncellendi.');
            renderer.personelListesi();
            renderer.vardiyaPersonelSelect();
            renderer.personelIslemSelect(); 
            actions.handlePersonelFormLoad({ target: { value: 'new' } }); 
        },
        deleteWorker: (workerId) => {
            workerId = parseInt(workerId);
            const worker = app.data.personel.find(i => i.id === workerId);
            if (!worker) { alert('Silinecek personel bulunamadı.'); return; }
            let vardiyaUyarisi = "";
            const isUsedInShift = app.data.vardiyalar.some(v => v.calisanlar.some(c => c.personelId === workerId || c.isciAdi === worker.ad));
            if(isUsedInShift) { vardiyaUyarisi = "\n\n(Bu personel, geçmiş vardiya kayıtlarında kullanılmış.)"; }
            const selectValue = app.dom.personelIslemSelect.value;
            if (parseInt(selectValue) === workerId) { alert(`'${worker.ad}' şu anda işlem formunda seçili. Lütfen formu sıfırlayıp (Yeni Personel seçip) tekrar deneyin.`); return; }
            if (confirm(`'${worker.ad}' adlı personeli silmek istediğinizden emin misiniz? (Panel giriş bilgileri de silinecektir)${vardiyaUyarisi}`)) {
                app.data.personel = app.data.personel.filter(i => i.id !== workerId);
                dataManager.save();
                renderer.updateAll(); 
                alert('Personel silindi.');
            }
        },
        openPersonelOdemeModal: (personelId, personelAdi) => {
            const personel = app.data.personel.find(p => p.id === personelId);
            let sgkInfoHtml = '';
            
            if (personel && personel.sgkDurumu === 'Var') {
                const sgkTutar = personel.sgkTutar > 0 ? personel.sgkTutar : 0;
                sgkInfoHtml = `
                    <div class="checkbox-container" style="margin-top: 15px;">
                        <input type="checkbox" id="personel-sgk-ekle-check" checked>
                        <label for="personel-sgk-ekle-check">
                            SGK Primi Gideri Ekle (${app.helpers.formatCurrency(sgkTutar)})
                        </label>
                    </div>
                    <p style="font-size: 12px; color: #7f8c8d; margin-top: -10px; margin-bottom: 15px;">İşaretlenirse, maaş ödemesine ek olarak bu tutar 'Resmi Gider' olarak ayrıca kaydedilir.</p>
                    <input type="hidden" id="personel-sgk-tutar-hidden" value="${sgkTutar}">
                `;
            }

            // Maaş bilgisi önerisi
            const netMaas = personel.netMaas || 0;
            const oneriText = netMaas > 0 ? `(Maaş: ${app.helpers.formatCurrency(netMaas)})` : '';

            const formHtml = `
                <form id="personel-odeme-form">
                    <input type="hidden" id="personel-odeme-id" value="${personelId}"><input type="hidden" id="personel-odeme-ad" value="${personelAdi}">
                    <div class="input-group"><label for="personel-odeme-tipi">Ödeme Tipi</label><select id="personel-odeme-tipi" required><option value="Maaş Ödemesi">Maaş Ödemesi</option><option value="Avans Ödemesi">Avans Ödemesi</option><option value="Prim Ödemesi">Prim Ödemesi</option></select></div>
                    <div class="input-group"><label for="personel-odeme-tutar">Tutar (₺) ${oneriText}</label><input type="number" step="0.01" id="personel-odeme-tutar" value="${netMaas > 0 ? netMaas : ''}" required></div>
                    <!-- Fazla İzin Kesintisi düğmesi ve alanı -->
                    <div class="input-group" id="kesinti-toggle-group" style="display:none; margin-bottom:10px;">
                        <button type="button" id="toggle-kesinti-btn" class="btn btn-sm-warning">Fazla İzin Kesintisi Ekle</button>
                    </div>
                    <div class="input-group" id="personel-kesinti-group" style="display:none;">
                        <label for="personel-odeme-kesinti">Fazla İzin Kesintisi (₺)</label>
                        <input type="number" step="0.01" id="personel-odeme-kesinti" placeholder="Opsiyonel">
                    </div>
                    <div class="input-group"><label for="personel-odeme-tarih">Ödeme Tarihi</label><input type="date" id="personel-odeme-tarih" value="${app.helpers.getTodayISO()}" required></div>
                    <div class="input-group"><label for="personel-odeme-aciklama">Kısa Açıklama (Opsiyonel)</label><input type="text" id="personel-odeme-aciklama" placeholder="Örn: Bayram avansı"></div>
                    ${sgkInfoHtml}
                    <button type="submit" class="btn btn-success btn-full">Ödemeyi Kaydet</button>
                </form>
            `;
            actions.openModal(`${personelAdi} için Ödeme`, formHtml);
            // Ödeme tipi değiştiğinde kesinti alanını göster/gizle
            const formEl = document.getElementById('personel-odeme-form');
            if (formEl) {
                const odemeSelect = formEl.querySelector('#personel-odeme-tipi');
                const kesintiToggleGroup = formEl.querySelector('#kesinti-toggle-group');
                const kesintiGroup = formEl.querySelector('#personel-kesinti-group');
                const toggleBtn = formEl.querySelector('#toggle-kesinti-btn');
                if (odemeSelect && kesintiToggleGroup && kesintiGroup && toggleBtn) {
                    // Ödeme tipine göre kesinti butonunun görünümü
                    const updateKesintiVisibility = () => {
                        if (odemeSelect.value === 'Maaş Ödemesi') {
                            kesintiToggleGroup.style.display = 'block';
                        } else {
                            kesintiToggleGroup.style.display = 'none';
                            kesintiGroup.style.display = 'none';
                            // buton metnini sıfırla
                            toggleBtn.textContent = 'Fazla İzin Kesintisi Ekle';
                            // inputu temizle
                            const inp = kesintiGroup.querySelector('input');
                            if (inp) inp.value = '';
                        }
                    };
                    // İlk görünüm
                    updateKesintiVisibility();
                    odemeSelect.addEventListener('change', updateKesintiVisibility);
                    // Düğme ile kesinti giriş alanını göster/gizle
                    toggleBtn.addEventListener('click', () => {
                        if (kesintiGroup.style.display === 'none' || kesintiGroup.style.display === '') {
                            kesintiGroup.style.display = 'block';
                            toggleBtn.textContent = 'Kesinti Gizle';
                        } else {
                            kesintiGroup.style.display = 'none';
                            toggleBtn.textContent = 'Fazla İzin Kesintisi Ekle';
                            const inp = kesintiGroup.querySelector('input');
                            if (inp) inp.value = '';
                        }
                    });
                }
                formEl.addEventListener('submit', actions.handlePersonelOdeme);
            }
        },
        handlePersonelOdeme: (e) => {
            e.preventDefault();
            const form = e.target;
            const personelId = parseInt(form.querySelector('#personel-odeme-id').value);
            const personel = app.data.personel.find(p => p.id === personelId);
            
            const personelAdi = form.querySelector('#personel-odeme-ad').value;
            const odemeTipi = form.querySelector('#personel-odeme-tipi').value;
            // Çalışana ödenen NET tutar (kullanıcının girdiği tutar)
            let netOdemeTutar = parseFloat(form.querySelector('#personel-odeme-tutar').value);
            const tarih = form.querySelector('#personel-odeme-tarih').value;
            const aciklama = form.querySelector('#personel-odeme-aciklama').value.trim();
            
            const sgkCheckbox = form.querySelector('#personel-sgk-ekle-check');
            let sgkMesaj = "";
            // Varsayılan: Avans/Prim tutarı
            let giderKaydiTutar = netOdemeTutar;
            // Açıklama içerisinde kesinti bilgisini sonradan ekleyeceğiz
            let giderKaydiAciklama = `${personelAdi} isimli personele yapılan ${odemeTipi} (Net Ödeme). ${aciklama ? `(Not: ${aciklama})` : ''}`;
            // Fazla izin kesintisi (opsiyonel)
            let kesinti = 0;
            const kesintiInputEl = form.querySelector('#personel-odeme-kesinti');
            if (kesintiInputEl && kesintiInputEl.value) {
                const val = parseFloat(kesintiInputEl.value);
                if (!isNaN(val) && val > 0) {
                    kesinti = val;
                }
            }

            if (isNaN(netOdemeTutar) || netOdemeTutar <= 0) { alert('Lütfen geçerli bir tutar girin.'); return; }
            // Kesinti, net ödeme tutarından büyük olamaz
            if (kesinti > 0 && kesinti > netOdemeTutar) {
                alert('Kesinti tutarı net ödeme tutarından büyük olamaz.');
                return;
            }
            
            // 1. Gider Kaydını Net Maaş yerine Brüt Maaş üzerinden yap
            if (odemeTipi === 'Maaş Ödemesi' && personel && personel.brutMaas > 0) {
                // Kesinti varsa, brüt maaştan da düşelim (basit oran)
                let brutGider = personel.brutMaas;
                if (kesinti > 0) {
                    brutGider = brutGider - kesinti;
                    if (brutGider < 0) brutGider = 0;
                }
                giderKaydiTutar = brutGider; // Gider olarak BRÜT MAAŞ - kesinti
                // Net ödeme tutarından kesinti düş
                const netOdenen = netOdemeTutar - kesinti;
                // Gider açıklaması: çalışma ve kesinti bilgileri
                giderKaydiAciklama = `${personelAdi} için Aylık Maaş Gideri (Brüt Tutar). Çalışana Net Ödenen: ${app.helpers.formatCurrency(netOdenen)}.`;
                if (kesinti > 0) {
                    giderKaydiAciklama += ` Fazla izin kesintisi: ${app.helpers.formatCurrency(kesinti)}.`;
                }
                if (aciklama) {
                    giderKaydiAciklama += ` Not: ${aciklama}.`;
                }
                // Net ödeme tutarını güncelleyin
                netOdemeTutar = netOdenen;
            }

            // Gider Kaydını Oluştur (Net/Brüt duruma göre)
            const newExpense = { 
                id: Date.now(), 
                tip: 'diger', 
                aciklama: odemeTipi === 'Maaş Ödemesi' ? 'Personel Maaş Gideri (Brüt)' : odemeTipi, // Raporlarda ayırt etmesi kolay olsun
                detay: giderKaydiAciklama, 
                tutar: giderKaydiTutar, 
                tarih: tarih 
            };
            app.data.giderler.push(newExpense);

            // 2. SGK Primi Giderini Kaydet (SADECE Maaş Ödemesi ve Onaylı ise)
            if (odemeTipi === 'Maaş Ödemesi' && sgkCheckbox && sgkCheckbox.checked) {
                const sgkTutar = parseFloat(form.querySelector('#personel-sgk-tutar-hidden').value);
                if (sgkTutar > 0) {
                     const sgkExpense = { 
                         id: Date.now() + 1, // Benzersizlik için +1
                         tip: 'diger', 
                         aciklama: 'Resmi İşveren Maliyeti (SGK/Vergi)', 
                         detay: `${personelAdi} için ${tarih} tarihli işveren maliyeti (SGK ve Diğer Resmi Kesintiler).`, 
                         tutar: sgkTutar, 
                         tarih: tarih 
                     };
                     app.data.giderler.push(sgkExpense);
                     sgkMesaj = `\n\nAyrıca ${app.helpers.formatCurrency(sgkTutar)} tutarında resmi maliyet (SGK/Vergi) giderlere eklendi.`;
                }
            }

            dataManager.save();
            actions.closeModal();
            renderer.updateAll();
            let finalMessage = `${personelAdi} için ${app.helpers.formatCurrency(netOdemeTutar)} net ödemesi kaydedildi.`;
            if (kesinti > 0) {
                finalMessage += ` Kesinti uygulandı: ${app.helpers.formatCurrency(kesinti)}.`;
            }
            finalMessage += ` Giderlere ${app.helpers.formatCurrency(giderKaydiTutar)} yansıtıldı.${sgkMesaj}`;
            alert(finalMessage);
        },
        addPosition: (e) => {
            e.preventDefault();
            const form = app.dom.pozisyonEkleForm;
            const ad = form.querySelector('#pozisyon-adi').value.trim();
            if (!ad) { alert('Pozisyon adı boş olamaz.'); return; }
            if (app.data.pozisyonlar.some(p => p.ad.toLowerCase() === ad.toLowerCase())) { alert('Bu pozisyon adı zaten kayıtlı.'); return; }
            app.data.pozisyonlar.push({ id: Date.now(), ad: ad });
            dataManager.save();
            renderer.pozisyonListesi(); 
            renderer.personelPozisyonSelect(app.dom.personelPozisyonSelect);
            form.reset();
            alert('Pozisyon eklendi.');
        },
        deletePosition: (pozisyonId, kullanimSayisi) => {
            pozisyonId = parseInt(pozisyonId);
            kullanimSayisi = parseInt(kullanimSayisi);
            const pozisyon = app.data.pozisyonlar.find(p => p.id === pozisyonId);
            if (!pozisyon) { alert('Silinecek pozisyon bulunamadı.'); return; }
            if (kullanimSayisi > 0) { alert(`'${pozisyon.ad}' pozisyonu şu anda ${kullanimSayisi} personel tarafından kullanıldığı için silinemez.\nÖnce bu personellerin pozisyonlarını değiştirin.`); return; }
            if (confirm(`'${pozisyon.ad}' pozisyonunu silmek istediğinizden emin misiniz?`)) {
                app.data.pozisyonlar = app.data.pozisyonlar.filter(p => p.id !== pozisyonId);
                dataManager.save();
                renderer.pozisyonListesi();
                renderer.personelPozisyonSelect(app.dom.personelPozisyonSelect);
                alert('Pozisyon silindi.');
            }
        },
        // YENİ FABRİKA EKLEME (API İLE)
    addFactory: async (e) => {
        e.preventDefault();
        const name = app.dom.fabrikaForm.querySelector('#fabrika-adi').value.trim();
        
        if (name) {
            try {
                const res = await fetch('/api/fabrikalar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ad: name })
                });

                if (res.ok) {
                    // Listeyi veritabanından yeniden çek
                    await dataManager.load();
                    app.dom.fabrikaForm.reset();
                    renderer.updateAll();
                    alert('Fabrika başarıyla veritabanına eklendi!');
                } else {
                    const errorData = await res.json();
                    alert('Hata: ' + (errorData.message || 'Fabrika eklenemedi'));
                }
            } catch (err) {
                console.error(err);
                alert('Sunucu hatası oluştu.');
            }
        }
    },
        updateUretimToplam: () => { const adet = parseFloat(app.dom.uretimAdetInput.value) || 0; const birimFiyat = parseFloat(app.dom.uretimBirimFiyatInput.value) || 0; app.dom.uretimToplamTutarInput.value = app.helpers.formatCurrency(adet * birimFiyat); },
        addUretimToList: (e) => { e.preventDefault(); const form = app.dom.uretimEkleForm; const uretim = { fabrikaId: parseInt(form.querySelector('#uretim-fabrika').value), tarih: form.querySelector('#uretim-tarih').value, aciklama: form.querySelector('#uretim-aciklama').value.trim(), adet: parseInt(form.querySelector('#uretim-adet').value), birimFiyat: parseFloat(form.querySelector('#uretim-birim-fiyat').value) }; if (!uretim.fabrikaId || !uretim.tarih || !uretim.aciklama || isNaN(uretim.adet) || uretim.adet <= 0 || isNaN(uretim.birimFiyat) || uretim.birimFiyat <= 0) { alert('Lütfen tüm alanları (Açıklama, Adet, Fiyat) doğru ve eksiksiz doldurun.'); return; } app.temp.uretimListesi.push(uretim); renderer.uretimEkleListesi(); form.querySelector('#uretim-aciklama').value = ''; form.querySelector('#uretim-adet').value = ''; form.querySelector('#uretim-birim-fiyat').value = ''; form.querySelector('#uretim-toplam-tutar').value = ''; form.querySelector('#uretim-aciklama').focus(); },
        removeUretimFromList: (index) => { app.temp.uretimListesi.splice(index, 1); renderer.uretimEkleListesi(); },
        clearUretimListesi: () => { if (app.temp.uretimListesi.length > 0 && confirm('Kaydedilmemiş tüm kalemler silinecek. Emin misiniz?')) { app.temp.uretimListesi = []; renderer.uretimEkleListesi(); } },
        saveUretimListesi: () => { const list = app.temp.uretimListesi; if (list.length === 0) { alert('Kaydedilecek bir kalem bulunmuyor.'); return; } if (confirm(`${list.length} adet üretim kalemini kaydetmek istediğinizden emin misiniz?`)) { list.forEach((item, index) => app.data.uretimler.push({ ...item, id: Date.now() + index })); dataManager.save(); app.temp.uretimListesi = []; alert(`${list.length} adet üretim kaydı başarıyla eklendi.`); renderer.updateAll(); } },
        deleteProduction: (uretimId) => { uretimId = parseInt(uretimId); const uretim = app.data.uretimler.find(u => u.id === uretimId); if (!uretim) return; const fabrikaAdi = app.data.fabrikalar.find(f => f.id === uretim.fabrikaId)?.ad || 'Bilinmeyen Fabrika'; const onay = confirm(`Aşağıdaki üretim kaydını kalıcı olarak silmek istediğinizden emin misiniz?\n\nFabrika: ${fabrikaAdi}\nTarih: ${uretim.tarih}\nAçıklama: ${uretim.aciklama}\nTutar: ${app.helpers.formatCurrency(uretim.adet * uretim.birimFiyat)}`); if (onay) { app.data.uretimler = app.data.uretimler.filter(u => u.id !== uretimId); dataManager.save(); renderer.updateAll(); alert('Üretim kaydı silindi.'); } },
        addExpense: (e) => { e.preventDefault(); const form = app.dom.giderForm; const gider = { id: Date.now(), tip: form.querySelector('#gider-tip').value, aciklama: form.querySelector('#gider-aciklama').value.trim(), detay: form.querySelector('#gider-detay').value.trim(), tutar: parseFloat(form.querySelector('#gider-tutar').value), tarih: form.querySelector('#gider-tarih').value }; if (!gider.tip || !gider.aciklama || isNaN(gider.tutar) || !gider.tarih) { alert('Lütfen Tip, Başlık, Tutar ve Tarih alanlarını doğru doldurun.'); return; } app.data.giderler.push(gider); dataManager.save(); form.reset(); form.querySelector('#gider-tarih').value = app.helpers.getTodayISO(); alert('Gider kaydedildi!'); renderer.updateAll(); },
        addPayment: (e) => { e.preventDefault(); const form = e.target; const odeme = { id: Date.now(), fabrikaId: parseInt(form.querySelector('#odeme-fabrika-id').value), tutar: parseFloat(form.querySelector('#odeme-tutari').value), tarih: form.querySelector('#odeme-tarihi').value }; if (isNaN(odeme.tutar) || !odeme.tarih) { alert('Lütfen tüm alanları doğru doldurun.'); return; } app.data.odemeler.push(odeme); dataManager.save(); actions.closeModal(); alert('Ödeme kaydedildi!'); renderer.updateAll(); },
        handleFabrikaSilSubmit: (e) => { e.preventDefault(); const fabrikaId = parseInt(app.dom.fabrikaSilSelect.value); if (isNaN(fabrikaId)) { alert('Lütfen silmek için bir fabrika seçin.'); return; } const fabrika = app.data.fabrikalar.find(f => f.id === fabrikaId); if (!fabrika) return; const onayMetni = prompt(`'${fabrika.ad}' fabrikasını kalıcı olarak silmek üzeresiniz. Bu işlem geri alınamaz ve tüm kayıtları yok edecektir.\n\nOnaylamak için fabrikanın adını ('${fabrika.ad}') aşağıdaki kutuya tam olarak yazın.`); if (onayMetni === fabrika.ad) { actions.deleteFactory(fabrikaId, fabrika.ad); } else if (onayMetni !== null) { alert('Onay metni eşleşmedi. Silme işlemi iptal edildi.'); } else { alert('Silme işlemi iptal edildi.'); } },
        deleteFactory: (fabrikaId, fabrikaAdi) => { app.data.fabrikalar = app.data.fabrikalar.filter(f => f.id !== fabrikaId); app.data.uretimler = app.data.uretimler.filter(u => u.fabrikaId !== fabrikaId); app.data.odemeler = app.data.odemeler.filter(o => o.fabrikaId !== fabrikaId); dataManager.save(); renderer.updateAll(); alert(`'${fabrikaAdi}' fabrikası ve ilgili tüm kayıtlar başarıyla silindi.`); app.dom.fabrikaSilForm.reset(); },
        resetFactory: (fabrikaId, fabrikaAdi) => { fabrikaId = parseInt(fabrikaId); const onay = confirm(`'${fabrikaAdi}' fabrikasının hesabını sıfırlamak istediğinizden emin misiniz?\n\nBu işlem fabrikayı SİLMEZ, ancak o fabrikaya ait TÜM üretim ve ödeme kayıtlarını kalıcı olarak siler.\n\nBu işlem geri alınamaz.`); if (onay) { app.data.uretimler = app.data.uretimler.filter(u => u.fabrikaId !== fabrikaId); app.data.odemeler = app.data.odemeler.filter(o => o.fabrikaId !== fabrikaId); dataManager.save(); renderer.updateAll(); alert(`'${fabrikaAdi}' fabrikasının hesabı başarıyla sıfırlandı.`); } },
        openModal: (title, bodyHtml, isLarge = false) => { app.dom.modalTitle.textContent = title; app.dom.modalBody.innerHTML = bodyHtml; if (isLarge) { app.dom.modalContent.classList.add('modal-lg'); } else { app.dom.modalContent.classList.remove('modal-lg'); } app.dom.modalContainer.classList.add('show'); },
        closeModal: () => { app.dom.modalContainer.classList.remove('show'); app.dom.modalTitle.textContent = ''; app.dom.modalBody.innerHTML = ''; app.dom.modalContent.classList.remove('modal-lg'); },
        openOdemeModal: (fabrikaId, fabrikaAdi) => {
            const formHtml = `
                <form id="odeme-form">
                    <input type="hidden" id="odeme-fabrika-id" value="${fabrikaId}">
                    <div class="input-group"><label for="odeme-tutari">Alınan Ödeme Tutarı (₺)</label><input type="number" step="0.01" id="odeme-tutari" required></div>
                    <div class="input-group"><label for="odeme-tarihi">Ödeme Tarihi</label><input type="date" id="odeme-tarihi" value="${app.helpers.getTodayISO()}" required></div>
                    <button type="submit" class="btn btn-success btn-full">Ödemeyi Kaydet</button>
                </form>
            `;
            actions.openModal(`${fabrikaAdi} için Ödeme Al`, formHtml);
            document.getElementById('odeme-form').addEventListener('submit', actions.addPayment);
        },
        deleteExpense: (giderId) => { giderId = parseInt(giderId); const gider = app.data.giderler.find(g => g.id === giderId); if (!gider) return; const onay = confirm(`Aşağıdaki gider kaydını silmek istediğinizden emin misiniz?\n\nTarih: ${new Date(gider.tarih).toLocaleDateString('tr-TR')}\nBaşlık: ${gider.aciklama}\nTutar: ${app.helpers.formatCurrency(gider.tutar)}`); if (onay) { app.data.giderler = app.data.giderler.filter(g => g.id !== giderId); dataManager.save(); renderer.updateAll(); alert('Gider kaydı başarıyla silindi.'); } }
        ,

        /**
         * Haftalık izin planı formunun submit handler'ı.
         * Seçilen personel ve tarih için izin kaydı oluşturur.
         */
        addManualLeave: (e) => {
            e.preventDefault();
            const selectEl = app.dom.izinPersonelSelect;
            const dateEl = app.dom.izinTarihInput;
            const personId = parseInt(selectEl.value);
            const date = dateEl.value;
            if (!date || isNaN(personId)) {
                alert('Lütfen bir personel ve izin tarihi seçin.');
                return;
            }
            const person = app.data.personel.find(p => p.id === personId);
            if (!person) {
                alert('Personel bulunamadı.');
                return;
            }
            if (!person.attendance) {
                person.attendance = {};
            }
            // Planlı haftalık izinler için status 'weekly' kullanılır
            person.attendance[date] = { status: 'weekly', hours: null };
            // Kaydet ve arayüzü hemen güncelle
            dataManager.save();
            renderer.updateAll();
            // Kullanıcı bilgilendirmesi
            try {
                alert(`${person.ad} için ${app.helpers.formatDate(date)} tarihli planlı izin kaydedildi.`);
            } catch (err) {
                // Bazı ortamlarda alert engellenebilir; bu durumda hatayı yoksay
                console.log(`${person.ad} için planlı izin oluşturuldu: ${date}`);
            }
            // Formu sıfırla
            app.dom.izinPlanForm.reset();
        }
    };

    // --- BÖLÜM 6: CSV YÖNETİCİSİ ---
    const csvManager = {
        download: (content, fileName) => { const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = fileName; link.click(); URL.revokeObjectURL(link.href); },
        downloadGenel: () => { let csv = 'Tip,Tarih,Açıklama/Fabrika,Tutar (₺)\n'; const tumIslemler = [ ...app.data.uretimler.map(u => ({ tarih: u.tarih, tip: 'Üretim (Alacak)', aciklama: `${app.data.fabrikalar.find(f => f.id === u.fabrikaId)?.ad || '?' } - ${u.aciklama} (${u.adet} adet)`, tutar: u.adet * u.birimFiyat })), ...app.data.odemeler.map(o => ({ tarih: o.tarih, tip: 'Tahsilat (Nakit Girişi)', aciklama: `${app.data.fabrikalar.find(f => f.id === o.fabrikaId)?.ad || '?' } Ödemesi`, tutar: o.tutar })), ...app.data.giderler.map(g => ({ tarih: g.tarih, tip: 'Gider (Nakit Çıkışı)', aciklama: `${g.aciklama}${g.detay ? ` (${g.detay})` : ''}`, tutar: -g.tutar })) ]; tumIslemler.sort((a, b) => new Date(a.tarih) - new Date(b.tarih)); tumIslemler.forEach(islem => { const tutarString = islem.tutar.toFixed(2); const cleanAciklama = `"${islem.aciklama.replace(/"/g, '""')}"`; csv += `${islem.tip},${islem.tarih},${cleanAciklama},${tutarString}\n`; }); const durum = calculator.genelDurum(); const toplamFinansalDeger = durum.netKar + durum.kalanAlacak; csv += '\n--- GENEL FİNANSAL ÖZET ---\n'; csv += 'Açıklama,,,Tutar (₺)\n'; csv += `1. Toplam Üretim Değeri (Genel Alacak),,,${durum.toplamUretimDegeri.toFixed(2)}\n `; csv += `2. Toplam Tahsilat (Nakit Girişi),,,${durum.toplamTahsilat.toFixed(2)}\n`; csv += `3. Toplam Giderler (Nakit Çıkışı),,,-${durum.toplamGiderler.toFixed(2)}\n`; csv += `NET KÂR (Nakit Bakiye: Tahsilat - Gider),,,${durum.netKar.toFixed(2)}\n`; csv += `KALAN TOPLAM ALACAK (Bakiye: Üretim - Tahsilat),,,${durum.kalanAlacak.toFixed(2)}\n`; csv += `BAKİYE : ${toplamFinansalDeger.toFixed(2)} ₺\n`; csv += `\n*** RAPOR SONU ***\n`; csvManager.download(csv, `genel_rapor_${app.helpers.getTodayISO()}.csv`); },
        downloadFabrika: (fabrikaId, fabrikaAdi) => { let csv = `Fabrika Hesap Dökümü: ${fabrikaAdi}\n`; const bakiye = calculator.fabrikaBakiyesi(fabrikaId); csv += '\n--- ÜRETİLER ---\n'; csv += 'Tarih,Açıklama,Adet,Birim Fiyat (₺),Toplam Tutar (₺)\n'; app.data.uretimler.filter(u => u.fabrikaId === fabrikaId).forEach(u => { const cleanAciklama = `"${u.aciklama.replace(/"/g, '""')}"`; csv += `${u.tarih},${cleanAciklama},${u.adet},${u.birimFiyat.toFixed(2)},${(u.adet * u.birimFiyat).toFixed(2)}\n`; }); csv += `\nToplam Üretim Değeri:,,,,"${app.helpers.formatCurrency(bakiye.toplamUretim)}"\n`; csv += '\n--- ÖDEMELER ---\n'; csv += 'Tarih,Ödenen Tutar (₺)\n'; app.data.odemeler.filter(o => o.fabrikaId === fabrikaId).forEach(o => { csv += `${o.tarih},${o.tutar.toFixed(2)}\n`; }); csv += `\nToplam Ödenen:,"${app.helpers.formatCurrency(bakiye.toplamOdenen)}"\n`; csv += `\n--- BAKİYE ---\n`; csv += `Kalan Borç (Tahsil Edilecek):,"${app.helpers.formatCurrency(bakiye.kalanBorc)}"\n`; csvManager.download(csv, `rapor_${fabrikaAdi.replace(/ /g, '_')}_${app.helpers.getTodayISO()}.csv`); },
        downloadGiderler: () => { let csv = 'Tip,Tarih,Başlık,Açıklama,Tutar (₺)\n'; let toplamFabrika = 0; let toplamDiger = 0; const siraliGiderler = [...app.data.giderler].sort((a, b) => new Date(a.tarih) - new Date(b.tarih)); siraliGiderler.forEach(g => { const tip = g.tip === 'fabrika' ? 'Fabrika Gideri' : 'Diğer Gider'; const tutar = g.tutar; const baslik = `"${g.aciklama.replace(/"/g, '""')}"`; const detay = `"${(g.detay || '-').replace(/"/g, '""')}"`; csv += `${tip},${g.tarih},${baslik},${detay},${tutar.toFixed(2)}\n`; if (g.tip === 'fabrika') { toplamFabrika += tutar; } else { toplamDiger += tutar; } }); const toplamGider = toplamFabrika + toplamDiger; csv += '\n--- GİDER ÖZETİ ---\n'; csv += 'Açıklama,,,,Tutar (₺)\n'; csv += `Toplam Fabrika Giderleri,,,,${toplamFabrika.toFixed(2)}\n`; csv += `Toplam Diğer Giderler,,,,${toplamDiger.toFixed(2)}\n`; csv += `GENEL TOPLAM GİDER,,,,${toplamGider.toFixed(2)}\n`; csv += `\n*** RAPOR SONU ***\n`; csvManager.download(csv, `gider_raporu_${app.helpers.getTodayISO()}.csv`); }
    };
    
    // --- BÖLÜM 7: UYGULAMA BAŞLATMA ---
    main.hideAllAuth = () => {
        app.dom.setupContainer.style.display = 'none';
        app.dom.loginChoiceContainer.style.display = 'none';
        app.dom.adminLoginContainer.style.display = 'none';
        app.dom.personelLoginContainer.style.display = 'none';
    };
    main.showLoginChoice = () => {
        main.hideAllAuth();
        app.dom.loginChoiceContainer.style.display = 'block';
    };
    main.runAfterLogin = () => {
        main.attachEventListeners();
        app.dom.uretimTarihInput.value = app.helpers.getTodayISO();
        app.dom.giderForm.querySelector('#gider-tarih').value = app.helpers.getTodayISO();
        app.dom.personelIslemForm.querySelector('#personel-ise-alim-tarihi').value = app.helpers.getTodayISO();
        
        // SGK Input Toggle
        app.dom.personelSgkDurumu.addEventListener('change', (e) => {
            if(e.target.value === 'Var') {
                app.dom.personelSgkTutarGroup.style.display = 'block';
            } else {
                app.dom.personelSgkTutarGroup.style.display = 'none';
            }
        });

        renderer.updateForRole(); 
        renderer.updateAll(); 
    };
    main.attachEventListeners = () => {
        app.dom.logoutBtn.addEventListener('click', actions.logout);
        app.dom.navLinks.forEach(link => link.addEventListener('click', actions.navigate));
        app.dom.fabrikaForm.addEventListener('submit', actions.addFactory);
        app.dom.listeyeEkleBtn.addEventListener('click', actions.addUretimToList);
        app.dom.giderForm.addEventListener('submit', actions.addExpense);
        app.dom.modalCloseBtn.addEventListener('click', actions.closeModal);
        app.dom.uretimAdetInput.addEventListener('input', actions.updateUretimToplam);
        app.dom.uretimBirimFiyatInput.addEventListener('input', actions.updateUretimToplam);
        app.dom.tumunuKaydetBtn.addEventListener('click', actions.saveUretimListesi);
        app.dom.listeyiTemizleBtn.addEventListener('click', actions.clearUretimListesi);
        app.dom.fabrikaSilForm.addEventListener('submit', actions.handleFabrikaSilSubmit);
        app.dom.sifreDegistirForm.addEventListener('submit', actions.changePassword);
        app.dom.yeniVardiyaForm.addEventListener('submit', actions.startShift);
        app.dom.vardiyaKapatBtn.addEventListener('click', actions.endShift);
        app.dom.vardiyaDevretModalBtn.addEventListener('click', actions.transferShift);
        // Yeni: vardiya personel yönetimi
        app.dom.vardiyaPersonelYonetBtn.addEventListener('click', actions.manageShiftPersonnel);
        app.dom.pozisyonEkleForm.addEventListener('submit', actions.addPosition);
        app.dom.personelIslemForm.addEventListener('submit', actions.handlePersonelFormSubmit);
        app.dom.personelIslemSelect.addEventListener('change', actions.handlePersonelFormLoad);
        app.dom.personelListesiContainer.addEventListener('click', (e) => { 
            const silBtn = e.target.closest('button.personel-sil-btn');
            const odemeBtn = e.target.closest('button.personel-odeme-btn'); 
            if (silBtn) { actions.deleteWorker(parseInt(silBtn.dataset.id)); }
            if (odemeBtn) { actions.openPersonelOdemeModal(parseInt(odemeBtn.dataset.id), odemeBtn.dataset.name); }
        });

        app.dom.pozisyonListesiContainer.addEventListener('click', (e) => { const target = e.target.closest('button.pozisyon-sil-btn'); if (target) { actions.deletePosition(target.dataset.id, target.dataset.kullanim); } });
        app.dom.vardiyaGecmisiContainer.addEventListener('click', (e) => { const target = e.target.closest('button.vardiya-sil-btn'); if (target) { actions.deleteShift(parseInt(target.dataset.id)); } });
        app.dom.kayitListesiContainer.addEventListener('click', (e) => { const target = e.target.closest('button.temp-sil-btn'); if (target) { actions.removeUretimFromList(parseInt(target.dataset.index)); } });
        app.dom.fabrikaHesapTabloContainer.addEventListener('click', (e) => { const target = e.target.closest('button'); if (!target) return; const id = target.dataset.id; const name = target.dataset.name; if (target.classList.contains('odeme-al-btn')) actions.openOdemeModal(id, name); if (target.classList.contains('fabrika-csv-btn')) csvManager.downloadFabrika(parseInt(id), name); if (target.classList.contains('reset-hesap-btn')) actions.resetFactory(id, name); });
        app.dom.sonUretimlerContainer.addEventListener('click', (e) => { const target = e.target.closest('button.uretim-sil-btn'); if(target) { actions.deleteProduction(target.dataset.id); } });
        app.dom.giderTabloContainer.addEventListener('click', (e) => { const target = e.target.closest('button.gider-sil-btn'); if (target) { actions.deleteExpense(target.dataset.id); } });
        app.dom.genelCsvIndirBtn.addEventListener('click', csvManager.downloadGenel);
        app.dom.giderCsvIndirBtn.addEventListener('click', csvManager.downloadGiderler);
        // Yeni: aktif vardiyada çalışan çıkarma butonları dinle
        app.dom.aktifVardiyaDetaylari.addEventListener('click', (e) => {
            const btn = e.target.closest('button.calisan-cikart-btn');
            if (btn) {
                const pid = parseInt(btn.dataset.personelId);
                if (!isNaN(pid)) {
                    actions.removeWorkerFromActiveShift(pid);
                    dataManager.save();
                    renderer.updateAll();
                }
            }
        });

        // Haftalık izin planlama formu için dinleyici
        if (app.dom.izinPlanForm) {
            app.dom.izinPlanForm.addEventListener('submit', actions.addManualLeave);
        }
    };
    // Uygulama başlangıcında verileri yüklemek için ana boot fonksiyonu
    main.boot = async () => {
        // Sunucudan veya localStorage'dan veriyi yükle
        await dataManager.load();
        main.hideAllAuth();
        // Yöneticilerin olup olmadığını kontrol et. Eğer yoksa kurulum ekranını göster.
        let adminExists = false;
        try {
            adminExists = app.data.personel.some(p => {
                const pos = app.data.pozisyonlar.find(pos => pos.id === p.pozisyonId);
                return pos && pos.ad && pos.ad.toLowerCase() === 'yönetici';
            });
        } catch (e) {
            adminExists = false;
        }
        if (!adminExists) {
            // İlk kez kullanılıyor, yönetici oluşturma ekranını göster
            app.dom.setupContainer.style.display = 'block';
            if (app.dom.setupForm) {
                app.dom.setupForm.addEventListener('submit', actions.setup);
            }
        } else {
            // En az bir yönetici var, giriş seçeneklerini göster
            app.dom.loginChoiceContainer.style.display = 'block';
            app.dom.btnAdminLoginChoice.addEventListener('click', () => {
                main.hideAllAuth();
                app.dom.adminLoginContainer.style.display = 'block';
            });
            app.dom.btnPersonelLoginChoice.addEventListener('click', () => {
                main.hideAllAuth();
                app.dom.personelLoginContainer.style.display = 'block';
            });
            if (app.dom.adminLoginForm) {
                app.dom.adminLoginForm.addEventListener('submit', actions.adminLogin);
            }
            if (app.dom.personelLoginForm) {
                app.dom.personelLoginForm.addEventListener('submit', actions.personelLogin);
            }
        }
    };
    
    // UYGULAMAYI BAŞLAT
    // public/js/script.js dosyasının en altındaki main.boot fonksiyonunu bununla değiştir:

    main.boot = async () => {
        // 1. Verileri Yükle
        await dataManager.load();
        
        // Tüm ekranları gizle
        main.hideAllAuth();

        // 2. Yönetici Var mı Kontrol Et (DÜZELTİLEN KISIM)
        // Artık 'Pozisyon Adı'na değil, direkt veritabanındaki 'rol' bilgisine bakıyoruz.
        let adminExists = false;
        if (app.data.personel && app.data.personel.length > 0) {
            adminExists = app.data.personel.some(p => p.rol === 'admin');
        }

        // 3. Duruma Göre Ekranı Aç
        if (!adminExists) {
            // Hiç yönetici yoksa -> KURULUM EKRANI
            console.log("Sistemde yönetici yok, kurulum ekranı açılıyor...");
            app.dom.setupContainer.style.display = 'block';
            
            // Event listener ekle (Eğer daha önce eklenmediyse)
            if (app.dom.setupForm) {
                // Önce eski dinleyicileri temizlemek için klonla (opsiyonel ama güvenli)
                const newForm = app.dom.setupForm.cloneNode(true);
                app.dom.setupForm.parentNode.replaceChild(newForm, app.dom.setupForm);
                app.dom.setupForm = newForm;
                
                app.dom.setupForm.addEventListener('submit', actions.setup);
            }
        } else {
            // Yönetici varsa -> GİRİŞ SEÇENEKLERİ
            console.log("Yönetici bulundu, giriş ekranı açılıyor...");
            app.dom.loginChoiceContainer.style.display = 'block';
            
            // Butonları aktifleştir
            app.dom.btnAdminLoginChoice.onclick = () => {
                main.hideAllAuth();
                app.dom.adminLoginContainer.style.display = 'block';
            };
            app.dom.btnPersonelLoginChoice.onclick = () => {
                main.hideAllAuth();
                app.dom.personelLoginContainer.style.display = 'block';
            };

            // Login formlarını dinle
            if (app.dom.adminLoginForm) {
                app.dom.adminLoginForm.onsubmit = actions.adminLogin;
            }
            if (app.dom.personelLoginForm) {
                app.dom.personelLoginForm.onsubmit = actions.personelLogin;
            }
        }
    };

});
// JAVASCRIPT KODLARI BİTİŞ