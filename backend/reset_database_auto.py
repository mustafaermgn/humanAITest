"""
Veritabanını Otomatik Olarak Yeniden Oluştur
Onay sormadan direkt çalışır.
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from app import app, db, AnalysisHistory

def reset_database():
    """Veritabanını tamamen sil ve yeniden oluştur"""
    print("=" * 60)
    print("VERİTABANI YENİDEN OLUŞTURULUYOR")
    print("=" * 60)
    
    with app.app_context():
        # Tüm tabloları sil
        print("\nEski tablolar siliniyor...")
        db.drop_all()
        print("✅ Eski tablolar silindi")
        
        # Yeni tabloları oluştur
        print("\nYeni tablolar oluşturuluyor...")
        db.create_all()
        print("✅ Yeni tablolar oluşturuldu")
        
        # Tablo şemasını kontrol et
        print("\n" + "=" * 60)
        print("YENİ TABLO ŞEMASI")
        print("=" * 60)
        print("\nAnalysisHistory tablosu kolonları:")
        for column in AnalysisHistory.__table__.columns:
            print(f"  - {column.name} ({column.type})")
        
        print("\n" + "=" * 60)
        print("✅ Veritabanı başarıyla yeniden oluşturuldu!")
        print("=" * 60)
        print("\nArtık uygulama yeni şemayla çalışabilir.")

if __name__ == '__main__':
    reset_database()

