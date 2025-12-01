"""
Veritabanını Yeniden Oluştur
Eski şemayı siler ve yeni şemayla yeniden oluşturur.
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
    import sys
    # Eğer --force argümanı verilmişse onay sorma
    if '--force' in sys.argv:
        reset_database()
    else:
        response = input("\n⚠️  UYARI: Tüm veriler silinecek! Devam etmek istiyor musunuz? (e/h): ")
        if response.lower() in ['e', 'evet', 'y', 'yes']:
            reset_database()
        else:
            print("\nİşlem iptal edildi.")

