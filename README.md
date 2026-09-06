# 1550 — Etkileşimli Avrupa ve Asya Atlası

## Başlat

`dist/index.html` dosyasını bilgisayarında bir WebGL 2 destekli tarayıcıda aç.
Kurulum, Node.js, API anahtarı ve internet bağlantısı gerekmez. Açıklama, doku,
arazi geometrisi ve uygulama kodu tek HTML dosyasında bulunur. Kaynak bağlantıları
ayrı olarak internet kullanır.

Telefonda bir dosya/mesaj önizlemesi HTML içindeki JavaScript'i çalıştırmayabilir.
Telefon tarayıcısından bir web adresiyle erişmek için `dist/index.html` dosyasını
statik bir web sunucusuna koymak gerekir. Bu teslim paketinin yayımlanmış bir URL'si
yoktur. Uygulama içinde bir barındırma hizmetine veya kullanıcı hesabına bağlantı
kurulmaz.

## Kontroller

- Sol tuş + sürükle: döndür ve eğ; tekerlek veya +/−: yakınlaştır.
- Sağ tuş + sürükle veya Shift + sürükle: haritayı kaydır.
- Renkli bölgenin üzerine gel: kısa açıklama. Tıkla: ayrıntı paneli.
- Telefonda tek parmak: döndür; iki parmak: yakınlaştır ve kaydır.
- Bir devlet adına dokun: açıklamayı aç. Devletler menüsünde isimle ara.
- Sinematik tur: kamera yedi bölge arasında otomatik dolaşır. Tekrar basarak durdur.
- Katmanlar: siyasi renkler, bölge adları, enlem/boylam çizgileri, deniz animasyonu,
  kabartı yüksekliği. Genel / Avrupa / Asya: hazır kamera konumları.
- Yön tuşları: kaydır. Home: başlangıç. Boşluk: tur. Esc: paneli kapat/turu durdur.

## Haritanın sınırları

Bu, 1550 dolaylarını keşfetmeye yönelik bir eğitim/görselleştirme uygulamasıdır.
34 siyasi yapı veya bölge grubu içerir; bütün devletlerin ve iç sınırların
akademik olarak doğrulanmış bir dökümü değildir.

Siyasi bölgeler elle hazırlanmış yaklaşık alanlardır. Bağlı hanlık, çok merkezli
monarşi ve yerel yönetimler birbirinden farklıdır. Tek bir renk mutlaka tek
merkezden yönetilen devlet anlamına gelmez. Renksiz alanlar boş veya sahipsiz
olarak yorumlanmamalıdır.

Coğrafi taban modern GSHHG kıyıları ve NASA Blue Marble dokusudur. Dağ sıraları
konumlarına göre temsilen modellenmiştir: ölçülmüş bir sayısal yükseklik modeli
kullanılmaz. Harita mesafe, alan veya rakım ölçmek için kullanılmamalıdır.
İncelenen dönem bağlamı kaynakları uygulamanın “Sınırlar ve kaynaklar” bölümündedir;
bu kaynaklar elle çizilmiş sınırların her koordinatını doğrulamaz.

## Kaynak kod

- `src/app.js`: WebGL 2 çizimi, kamera, gerçek arazi seçimi, dokunma, tur ve UI.
- `src/style.css`: masaüstü/telefon düzeni ve arayüz stilleri.
- `src/index.template.html`: HTML şablonu.
- `src/data.py`: bölge açıklamaları ve yaklaşık siyasi çokgenlerin ana kaynağı.
- `src/regions-source.json`: bu verinin okunabilir, üretilmiş kopyası.
- `assets/`: gömülecek coğrafi dokular, yükseklik alanı ve açıklamalar.
- `src/build.py`: kaynaklardan tek dosyalık HTML üretir; Python standart kitaplığı yeterlidir.
- `src/build_assets.py`: dokuları ve açıklama verisini yeniden üretir; ilave Python
  paketleri gerektirir. Kullanılmış sürümler `requirements-assets.txt` içindedir.

Arayüzde bir değişiklikten sonra, proje klasöründe:

```sh
python src/build.py
```

Çıktı `dist/index.html` olur. Tarih verisini veya arazi modelini değiştirdikten sonra:

```sh
python -m pip install -r requirements-assets.txt
python src/build_assets.py
python src/build.py
```

Web yayını için yalnızca `dist/index.html` yeterlidir. Dosyayı yayın klasörünün
`index.html` dosyası olarak kullan. Arka uç, veritabanı ve erişim anahtarı yoktur.

## Test durumu

Chromium'da masaüstü ve 390 × 844 telefon boyutunda WebGL başlatma, gerçek arazi
üzerinde fare ile açıklama/seçim, yakınlaştırma, kamera döndürme, arama, siyasi/fiziki
katman, kabartı ayarı, tur başlatma/durdurma ve sonraki tur durağı test edildi.
Chromium dokunmatik emülasyonunda gerçek iki parmak hareketi ile yakınlaştırma ve
çevrimdışı yükleme de test edildi. JavaScript sayfa hatası veya WebGL hata kodu
saptanmadı. Yerel iPhone/Safari ve bütün ekran kartları üzerinde test yapılmadı.
