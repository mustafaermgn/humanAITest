# CodeTest

Profesyonel bir AI kod tespit uygulaması. Bu uygulama, kod parçacıklarının AI (Yapay Zeka) veya İnsan tarafından yazılıp yazılmadığını tespit etmek için çoklu makine öğrenmesi modelleri ve transfer öğrenme teknikleri kullanır.

## 🚀 Özellikler

- **3 Farklı ML Modeli:** Random Forest, SVM, Logistic Regression
- **20 Özellik Çıkarımı:** Kod analizi için kapsamlı özellik çıkarımı
- **Profesyonel UI/UX:** Material-UI ile modern ve kullanıcı dostu arayüz
- **Analiz Geçmişi:** Tüm analizlerin kaydedilmesi ve görüntülenmesi
- **Görselleştirme:** Grafikler ve progress bar'lar ile sonuçların gösterilmesi
- **RESTful API:** Flask ile geliştirilmiş backend API
- **Model Değerlendirme:** Jupyter notebook ile model performans analizi

## 📋 Gereksinimler

### Backend
- Python 3.8+
- pip

### Frontend
- Node.js 16+
- npm veya yarn

## 🛠️ Kurulum

### 1. Backend Kurulumu

```bash
# Backend klasörüne gidin
cd backend

# Virtual environment oluşturun (önerilir)
python -m venv venv

# Virtual environment'ı aktifleştirin
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt
```

### 2. Frontend Kurulumu

```bash
# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin
npm install
```

## 🚀 Çalıştırma

### Backend'i Başlatma

```bash
# Backend klasöründe
cd backend
python app.py
```

Backend varsayılan olarak `http://localhost:5000` adresinde çalışacaktır.

### Frontend'i Başlatma

Yeni bir terminal penceresinde:

```bash
# Frontend klasöründe
cd frontend
npm start
```

Frontend varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## 📊 Model Eğitimi

Modelleri eğitmek için:

```bash
# Backend çalışırken, yeni bir terminalde:
curl -X POST http://localhost:5000/api/train
```

Veya tarayıcıda API client kullanarak POST isteği gönderin.

**Not:** İlk eğitim uzun sürebilir. Eğitim sırasında Data klasöründeki veriler kullanılacaktır.

## 🧪 Test Çalıştırma

### Backend Testleri

```bash
cd backend
python -m pytest tests/ -v
```

Veya unittest ile:

```bash
cd backend
python -m unittest discover tests
```

### Frontend Testleri

```bash
cd frontend
npm test
```

## 📁 Proje Yapısı

```
CodeTest/
├── backend/
│   ├── app.py                 # Flask ana uygulama
│   ├── train_models.py        # Model eğitim scripti
│   ├── models/
│   │   ├── ml_models.py       # ML modelleri (RF, SVM, LR)
│   │   └── saved_models/      # Eğitilmiş modeller (.pkl)
│   ├── utils/
│   │   ├── data_cleaner.py    # Veri temizleme
│   │   └── feature_extractor.py  # Özellik çıkarımı
│   ├── tests/                 # Test dosyaları
│   └── requirements.txt       # Python bağımlılıkları
├── frontend/
│   ├── src/
│   │   ├── components/        # React component'leri
│   │   ├── App.js
│   │   └── index.js
│   └── package.json           # Node.js bağımlılıkları
├── Data/
│   ├── ai/                    # AI kod örnekleri
│   └── human/                 # İnsan kod örnekleri
├── model_evaluation.ipynb     # Model değerlendirme notebook'u
├── README.md
├── PROJECT_SUMMARY.md
├── Software_Specification.md
├── Task_Board.md
└── STD_Test_Document.md
```

## 🔌 API Endpoints

### GET /api/health
Sistem sağlık kontrolü

### POST /api/analyze
Kod analizi yapar
```json
{
  "code": "def hello(): print('Hello World')"
}
```

### GET /api/history
Analiz geçmişini getirir

### GET /api/history/<id>
Belirli bir analiz detayını getirir

### POST /api/train
Tüm modelleri eğitir (Admin)

## 🎨 Kullanılan Teknolojiler

### Backend
- **Flask:** Web framework
- **scikit-learn:** Machine Learning
- **PyTorch:** Deep Learning
- **Transformers:** Pre-trained models
- **SQLAlchemy:** ORM

### Frontend
- **React:** UI library
- **Material-UI:** Component library
- **Axios:** HTTP client
- **Recharts:** Chart library


## 🏗️ Mimari

Uygulama **N-Katmanlı Mimari** prensiplerine göre tasarlanmıştır:

1. **Sunum Katmanı:** React.js frontend
2. **İş Mantığı Katmanı:** Flask API
3. **Veri Erişim Katmanı:** SQLAlchemy ORM
4. **Model Katmanı:** ML ve TL modelleri

**Design Patterns:**
- Singleton Pattern (Model Managers)
- Factory Pattern (Model initialization)



**Versiyon:** 1.0.0  
**Son Güncelleme:** 2025


