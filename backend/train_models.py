"""
Model Training Script
Veri temizleme ve model eğitimi için script
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from models.ml_models import MLModelManager
from utils.data_cleaner import DataCleaner
import json

def clean_and_prepare_data():
    """Veri temizleme işlemini yap"""
    print("=" * 60)
    print("VERİ TEMİZLEME İŞLEMİ")
    print("=" * 60)
    
    cleaner = DataCleaner()
    
    # Data klasörlerini bul
    base_dir = os.path.dirname(os.path.dirname(__file__))
    ai_dir = os.path.join(base_dir, 'Data', 'ai')
    human_dir = os.path.join(base_dir, 'Data', 'human')
    
    ai_count = 0
    human_count = 0
    ai_valid = 0
    human_valid = 0
    
    print(f"\nAI verileri kontrol ediliyor: {ai_dir}")
    if os.path.exists(ai_dir):
        for filename in os.listdir(ai_dir):
            if filename.endswith('.json'):
                ai_count += 1
                try:
                    with open(os.path.join(ai_dir, filename), 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        if 'code' in data:
                            code = data['code']
                            if cleaner.validate_code(code):
                                cleaned = cleaner.clean_code(code)
                                if cleaned and len(cleaned) > 10:
                                    ai_valid += 1
                except Exception as e:
                    continue
    
    print(f"\nHuman verileri kontrol ediliyor: {human_dir}")
    if os.path.exists(human_dir):
        for filename in os.listdir(human_dir):
            if filename.endswith('.json'):
                human_count += 1
                try:
                    with open(os.path.join(human_dir, filename), 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        if 'code' in data:
                            code = data['code']
                            if cleaner.validate_code(code):
                                cleaned = cleaner.clean_code(code)
                                if cleaned and len(cleaned) > 10:
                                    human_valid += 1
                except Exception as e:
                    continue
    
    print("\n" + "=" * 60)
    print("VERİ TEMİZLEME SONUÇLARI")
    print("=" * 60)
    print(f"Toplam AI dosyası: {ai_count}")
    print(f"Geçerli AI verisi: {ai_valid}")
    print(f"Toplam Human dosyası: {human_count}")
    print(f"Geçerli Human verisi: {human_valid}")
    print(f"Toplam geçerli veri: {ai_valid + human_valid}")
    print("=" * 60)
    
    return ai_valid, human_valid

def train_ml_models():
    """ML modellerini eğit"""
    print("\n" + "=" * 60)
    print("ML MODELLERİNİN EĞİTİMİ")
    print("=" * 60)
    
    try:
        ml_manager = MLModelManager()
        print("\nML modelleri eğitiliyor...")
        ml_manager.train_models()
        print("\n✅ ML modelleri eğitimi tamamlandı!")
        return True
    except Exception as e:
        print(f"\n❌ ML model eğitimi hatası: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Ana fonksiyon"""
    print("\n" + "=" * 60)
    print("AI CODE DETECTION - MODEL EĞİTİM SCRIPT")
    print("=" * 60)
    
    # 1. Veri temizleme
    ai_valid, human_valid = clean_and_prepare_data()
    
    if ai_valid == 0 or human_valid == 0:
        print("\n❌ Yeterli veri bulunamadı! Eğitim yapılamaz.")
        print("Lütfen Data/ai ve Data/human klasörlerinde geçerli JSON dosyaları olduğundan emin olun.")
        return
    
    # 2. ML modellerini eğit
    ml_success = train_ml_models()
    
    # Özet
    print("\n" + "=" * 60)
    print("EĞİTİM ÖZETİ")
    print("=" * 60)
    print(f"ML Modelleri: {'✅ Başarılı' if ml_success else '❌ Başarısız'}")
    print("=" * 60)
    print("\n✅ Eğitim işlemi tamamlandı!")
    print("Artık uygulamayı kullanabilirsiniz: python app.py")

if __name__ == '__main__':
    main()

