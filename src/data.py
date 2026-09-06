"""1550 teaching atlas. Political envelopes are editorial approximations, not GIS research data."""
R=[]
S={
'ottoman':('The Met · Süleyman dönemi','https://www.metmuseum.org/essays/the-age-of-suleyman-the-magnificent-r-1520-1566'),
'safavid':('The Met · Safevîler','https://www.metmuseum.org/essays/the-art-of-the-safavids-before-1600'),
'india':('The Met · Babürlüler, 1600 öncesi','https://www.metmuseum.org/essays/the-art-of-the-mughals-before-1600'),
'poland':('UNESCO · Lublin Birliği belgesi','https://www.unesco.org/en/memory-world/act-union-lublin-document'),
'ming':('The Met · Ming Hanedanı','https://www.metmuseum.org/essays/ming-dynasty-1368-1644'),
'japan':('The Met · Muromachi dönemi','https://www.metmuseum.org/essays/muromachi-period-1392-1573'),
'russia':('Britannica · IV. İvan','https://www.britannica.com/biography/Ivan-the-Terrible'),
'europe':('The Met · Tarih kronolojileri','https://www.metmuseum.org/toah/chronology'),
'asia':('The Met · Tarih kronolojileri','https://www.metmuseum.org/toah/chronology')}
def add(key,name,label,color,center,area,capital,text,note,polys,src='europe',priority=2):
 R.append(dict(id=len(R)+1,key=key,name=name,label=label,color=color,center=center,area=area,capital=capital,text=text,note=note,polys=polys,source=S[src],priority=priority))
add('ottoman','Osmanlı İmparatorluğu','OSMANLI İMPARATORLUĞU','#c87856',[32,39],'Avrupa · Batı Asya · Kuzey Afrika','İstanbul',
'Kanuni Sultan Süleyman döneminde Balkanlar, Anadolu, Suriye, Irak ve Mısır aynı imparatorluk çatısı altındaydı. İstanbul, yönetimin ve sanat üretiminin başlıca merkezlerinden biriydi.',
'1550, imparatorluğun en geniş sınırlarına ulaştığı yıl değildir. Kıbrıs ve Trablus bu tarihte Osmanlı toprağı olarak gösterilmez. Bağlı hanlıklar ayrıca işaretlenir.',[
[[15.7,43],[17.2,45.8],[18.6,47.6],[20.1,48],[21.1,47.7],[21.8,45.1],[23.3,44.7],[26.5,44],[29.5,45.1],[30,44.6],[29.8,42],[34,42.7],[40.4,42.5],[43.5,41.1],[44.4,38.3],[43.5,36.5],[45.8,34],[48.4,31.2],[48,29.7],[43.4,30.8],[40,33],[36.5,30.5],[34.7,28.1],[33.7,24],[25,23.4],[24.6,31.8],[31,32.5],[33.7,31.5],[35.5,35],[35.5,36.9],[32,35.5],[28,35.7],[24,36],[20,38],[18,40]],
[[-1.8,35.5],[1,37],[7.9,37.5],[8.4,35.5],[4,34.5],[0,34.5]],
[[35,29.8],[37.6,28.3],[40.8,21.3],[42,18.6],[40.2,18],[38.2,22.3],[35,27]],
[[42.5,17],[45.7,17],[46.5,13],[43.3,12.5]],
[[27.6,36],[29,36],[29,36.9],[27.6,36.9]]],'ottoman',0)
add('safavid','Safevî Devleti','SAFEVÎ DEVLETİ','#a589b4',[53,33],'Batı Asya','İran saray merkezleri',
'I. Tahmasb’ın hüküm sürdüğü Safevîler, İran merkezli bir hanedandı. Şiilik devlet kimliğinin önemli bir parçasıydı. Batıda Osmanlılarla, doğuda Şeybânîlerle rekabet ediyorlardı.',
'Osmanlı–Safevî sınırı çatışmalıydı. Buradaki çizgiler kesin bir antlaşma sınırı değildir.',[
[[44.3,39.9],[47.5,41.5],[50,40.8],[50.6,37.2],[54,37],[57.5,38],[62.5,37.2],[63.5,34.5],[62.2,31],[61.8,26],[57,24.4],[50.5,28],[48,29.7],[48.4,31.2],[45.8,34],[43.5,36.5],[44.4,38.3]]],'safavid',0)
add('france','Fransa Krallığı','FRANSA','#6798b7',[2,47],'Batı Avrupa','Paris',
'Valois hanedanının Fransa’sı, Avrupa siyasetinin başlıca krallıklarından biriydi. Habsburglarla rekabet ve İtalya savaşları dış siyasetinde önemli yer tutuyordu.',
'Alsas, Lorraine, Savoy ve Burgonya çevresi sadeleştirilmiştir. Çizgiler günümüz Fransa sınırları değildir.',[
[[-5.3,48.4],[-1.8,50.9],[1.8,51.1],[3.9,50.1],[5.7,49.3],[5.1,48.5],[5.8,47.4],[5.1,46.3],[6.4,44.1],[7.7,43.7],[6.5,42.8],[3.2,42.6],[0.5,42.7],[-1.7,43.3],[-2.3,46.2]]],priority=0)
add('hre','Kutsal Roma İmparatorluğu','KUTSAL ROMA\nİMPARATORLUĞU','#c6a961',[11,50.5],'Orta Avrupa','Tek bir sabit başkent yok',
'İmparatorluk çok sayıda prenslik, piskoposluk ve serbest şehirden oluşuyordu. V. Karl imparator olsa da bütün topraklar tek merkezden yönetilen bir ulus devlet oluşturmuyordu.',
'Tek renk yalnızca imparatorluk çerçevesini anlatır. İç devlet sınırları ve Habsburgların farklı unvanları bu ölçekte ayrıştırılmaz.',[
[[3.1,51.1],[4.4,53.6],[8.2,54.9],[11.5,54.8],[14.5,54.3],[16,52.5],[16.5,50.7],[18.8,50.3],[18.9,48.8],[16.4,47.9],[16.2,46.4],[14,45.7],[12,46.5],[10,46],[8.6,45.1],[6.2,45.9],[5.8,47.4],[6.4,48.6],[5.7,49.3],[3.9,50.1]]],priority=0)
add('spain','İspanyol Monarşisi','İSPANYOL MONARŞİSİ','#cc914f',[-3.5,39.3],'İberya · Akdeniz','Çok merkezli saray',
'Kastilya ve Aragon taçları aynı hükümdarda birleşmişti. Akdeniz toprakları ve denizaşırı bağlantıları monarşiyi Avrupa siyasetinde güçlü kılıyordu.',
'Yalnızca harita kapsamındaki başlıca Avrupa alanları gösterilir; denizaşırı toprakların tamamı dahil değildir.',[
[[-9.5,43.8],[-1.7,43.3],[0.5,42.7],[3.2,42.6],[4.4,42],[4.5,38.3],[-1,35.6],[-7.3,36.7],[-7.3,38],[-6.8,39],[-7,41.8],[-8.8,42.1]],
[[7.8,38.7],[10,38.7],[10,41.6],[7.8,41.6]],[[12,36.4],[16.4,36.4],[16.4,38.8],[12,38.8]],
[[12.8,41.1],[14.1,42.8],[18.8,41.5],[18.8,38],[15.5,37.5],[13.1,39.5]]],priority=1)
add('portugal','Portekiz Krallığı','PORTEKİZ','#74ad98',[-8.2,39.5],'İberya','Lizbon',
'Portekiz, Atlas ve Hint okyanuslarını bağlayan deniz ağlarıyla öne çıkıyordu. Lizbon bu bağlantıların Avrupa’daki önemli merkeziydi.',
'Denizaşırı liman üsleri ve kolonilerin tamamı gösterilmez.',[[[-9.6,41.9],[-8.8,42.1],[-7,41.8],[-6.8,39],[-7.3,38],[-7.3,36.7],[-9.6,36.5]]])
add('england','İngiltere Krallığı','İNGİLTERE','#bd7c8a',[-1.8,52.6],'Britanya','Londra',
'İngiltere ve İskoçya henüz ayrı krallıklardı. İngiltere’de Reform süreci, kilise ile krallığın ilişkisini yeniden şekillendiriyordu.',
'Britanya’nın tümü İngiltere olarak boyanmaz. İrlanda’daki karmaşık egemenlik ilişkileri ayrıntılandırılmaz.',[[[-6,50],[-5.5,54.7],[-3.3,54.9],[-2,55.8],[0,55.9],[2,52],[1.5,50]]],priority=1)
add('scotland','İskoçya Krallığı','İSKOÇYA','#8e91b9',[-4.1,57.4],'Britanya','Edinburgh',
'İskoçya, İngiltere’den ayrı bir krallıktı. Fransa ile ilişkiler ve İngiltere ile mücadeleler dönem siyasetinin önemli unsurlarıydı.',
'Taçların birleşmesi 1550’de henüz gerçekleşmemişti.',[[[-8.5,55],[-5.5,54.7],[-3.3,54.9],[-2,55.8],[0,55.9],[0,61],[-8.5,61]]],priority=3)
add('poland','Polonya Krallığı','POLONYA','#c5869b',[20,51.5],'Orta · Doğu Avrupa','Kraków',
'Polonya ve Litvanya, ortak hükümdar çevresinde bağlı fakat ayrı siyasi yapılardı. Birliğin 1569 sonrası biçimi henüz oluşmamıştı.',
'Lublin Birliği 1569 tarihlidir. Bu yüzden Polonya ile Litvanya ayrı gösterilir.',[[[16,54.6],[19.5,54.5],[20.5,53.5],[23.4,53.4],[24,51.3],[25.5,50.6],[26,48.2],[22.5,48],[20,49.3],[18.8,50.3],[16.5,50.7],[16,52.5]]],'poland',1)
add('lithuania','Litvanya Büyük Dükalığı','LİTVANYA','#ac789a',[27,54.4],'Doğu Avrupa','Vilnius',
'Litvanya Büyük Dükalığı, Baltık bölgesinden bugünkü Belarus ve Ukrayna’nın bir bölümüne uzanıyordu. Polonya ile ortak hükümdar bağı vardı.',
'Ortak hükümdar, 1550’de iki ülkenin tek ve aynı idari yapı olduğu anlamına gelmez.',[[[20.5,56],[23,57],[27,56.5],[31.7,56],[32.5,53],[34,51.4],[33,48],[29,46.5],[26,48.2],[25.5,50.6],[24,51.3],[23.4,53.4],[20.5,53.5]]],'poland',1)
add('sweden','İsveç Krallığı','İSVEÇ','#7aa6b2',[16,63],'Kuzey Avrupa','Stockholm',
'İsveç Krallığı, Finlandiya’nın önemli bir bölümünü de kapsıyordu. Baltık dünyası, komşu krallıklar için bir rekabet alanıydı.',
'Kuzey ve İskandinavya sınırları şematiktir; günümüz sınırlarıyla birebir aynı değildir.',[[[11.7,56.5],[13,59],[12,61],[15,64],[19,68],[22,69.6],[27,70],[30,66],[31,63],[28.5,61],[29,59.8],[23,58.8],[19,56],[15,56],[13,56.5]]],priority=1)
add('denmark','Danimarka–Norveç','DANİMARKA–NORVEÇ','#bca078',[8,63],'Kuzey Avrupa','Kopenhag',
'Danimarka ile Norveç aynı hükümdarın yönetimindeydi. Kuzey Denizi ve Baltık geçitleri monarşinin stratejik konumunda önemliydi.',
'Uzak kuzey ve adalardaki egemenlik alanları genelleştirilmiştir.',[
[[4,57],[11.7,56.5],[13,59],[12,61],[15,64],[19,68],[22,69.6],[27,70],[31.3,71.8],[20,73],[5,66]],
[[7.5,54.6],[11.7,54.6],[13.2,55.2],[15,55.8],[15,56],[13,56.5],[11.7,56.5],[10,58.1],[7.5,58.1]]])
add('russia','Rus Çarlığı','RUS ÇARLIĞI','#94ab7a',[41,60],'Doğu Avrupa','Moskova',
'IV. İvan, 1547’de çar unvanını aldı. 1550’de devletin ağırlık merkezi Moskova ve Doğu Avrupa’daydı. Sibirya’nın tamamı Rus yönetiminde değildi.',
'Kazan’ın fethi 1552, Astrahan’ın fethi 1556’dır. Bu hanlıklar 1550’de Rusya’ya dahil edilmez.',[[[31.7,56],[33,59],[31,63],[30,66],[35,69],[45,69.5],[55,69],[60.5,65],[58,60],[55,58],[50,58],[46,56],[46,53],[41,51.6],[36,52],[34,51.4],[32.5,53]]],'russia',0)
add('kazan','Kazan Hanlığı','KAZAN','#bba47e',[50.5,55.8],'İdil–Ural','Kazan',
'İdil havzasındaki Kazan Hanlığı, Moskova ile rekabet içindeydi. 1550’de henüz çarlığa katılmamıştı.',
'1552’deki Rus fethi bu haritanın tarihinden sonradır.',[[[46,53],[50,52],[55,54.5],[55,58],[50,58],[46,56]]],'russia')
add('astrakhan','Astrahan Hanlığı','ASTRAHAN','#c7af85',[48,47.1],'Aşağı İdil','Astrahan',
'Astrahan Hanlığı, İdil’in Hazar Denizi’ne ulaştığı bölgede bulunuyordu. Nehir ve bozkır bağlantıları açısından stratejik konumdaydı.',
'1556’daki Rus ilhakı 1550 görünümüne dahil değildir.',[[[45,46],[45.4,49.7],[48.8,51.7],[50.4,49],[50.4,45.5],[48,44.8]]],'russia',3)
add('crimea','Kırım Hanlığı','KIRIM','#ccac78',[34.8,45.5],'Karadeniz’in kuzeyi','Bahçesaray',
'Giray hanedanının yönettiği Kırım Hanlığı, Osmanlılarla bağlılık ilişkisi olan ayrı bir siyasi yapıydı. Karadeniz’in kuzeyinde etkiliydi.',
'Bağlı hanlık, doğrudan Osmanlı eyaletleriyle aynı kategoriye konulmaz. Bozkır etki alanının sınırı yaklaşık çizilir.',[[[29.5,45.1],[29,46.5],[33,48],[37,48],[40.5,47.4],[40.5,45],[35,43.5],[31.5,44.5]]],'ottoman')
add('venice','Venedik Cumhuriyeti','VENEDİK','#71b5b0',[12.2,45.3],'Adriyatik · Doğu Akdeniz','Venedik',
'Venedik bir denizci cumhuriyetti. Adriyatik bağlantılarının yanında Girit ve Kıbrıs gibi Doğu Akdeniz adaları da yönetimi altındaydı.',
'Kıbrıs’ın Osmanlı fethi henüz gerçekleşmemişti. Küçük kıyı mülklerinin tümü gösterilmez.',[
[[9.7,45],[13.8,44.7],[14,46.5],[12,47],[10.5,46.7]],[[23.2,34.6],[26.6,34.6],[26.6,35.9],[23.2,35.9]],[[32,34.3],[34.8,34.3],[34.8,35.9],[32,35.9]]],'europe',3)
add('sibir','Sibir Hanlığı','SİBİR HANLIĞI','#8baea0',[67,59],'Batı Sibirya','İrtiş havzası',
'Batı Sibirya’daki hanlık, Rusların bölgeye daha sonraki yayılmasından önceki siyasi yapılardan biriydi.',
'Bozkır ve orman kuşağındaki sınırlar sabit, modern sınırlar gibi düşünülmemelidir.',[[[58,60],[60.5,65],[68,66],[75,61],[74,55],[65,54],[55,58]]],'asia',1)
add('kazakh','Kazak Hanlığı','KAZAK HANLIĞI','#bba987',[69,47],'Orta Asya bozkırları','Çok merkezli bozkır siyaseti',
'Kazak hanları ve bağlı topluluklar, geniş bozkır alanlarında hareket ediyordu. Otlaklar, göç güzergâhları ve komşu hanlıklarla ilişkiler belirleyiciydi.',
'Renkli alan bir kesin sınır iddiası değildir; göçebe siyasi etki alanı için şematik bir zarftır.',[[[57,45],[61,53],[68,54],[78,52],[81,46],[76,42],[70,41],[65,43]]],'asia',1)
add('bukhara','Şeybânîler / Buhara','ŞEYBÂNÎLER','#82aeaa',[64,39],'Maveraünnehir','Buhara · Semerkant',
'Şeybânî hanedanı, Maveraünnehir’in önemli kentleri üzerinde hüküm sürüyordu. İran, bozkır ve Hint dünyasıyla bağlantılar bu bölgeden geçiyordu.',
'Tek renk, bütün Özbek hanlıklarının aynı yönetim altında olduğu anlamına gelmez.',[[[59,37],[63,36.5],[67,36.7],[70,39],[70,41],[65,43],[60,41.5]]],'safavid')
add('khiva','Harezm Hanlığı','HAREZM','#9eb993',[58,41.6],'Aşağı Ceyhun','Harezm',
'Harezm, Ceyhun’un aşağı kesimindeki kent ve vaha ağlarını kapsıyordu. Bölgenin siyaseti Maveraünnehir ve bozkır güçleriyle ilişkiliydi.',
'Erken dönemi bugünkü Hive kentiyle birebir özdeşleştirmemek gerekir. Sınır, temsili bir bölge işaretidir.',[[[54.5,40],[56.5,44],[60,44.5],[61,42],[59,39]]],'asia',3)
add('yarkand','Yarkent Hanlığı','YARKENT','#91aeb8',[81,40],'Tarım Havzası','Yarkent',
'Tarım Havzası’ndaki vaha kentleri, Çağatay mirasını sürdüren hanlıkların dünyasına aitti. Yarkent ve Kaşgar önemli merkezlerdi.',
'Çöl ve dağ sınırları genelleştirilmiştir; bölgedeki tüm yerel güçleri tek merkezli bir devlet gibi okumamak gerekir.',[[[72,36],[78,35],[89,37],[94,42],[87,45],[81,44],[76,42]]],'asia',1)
add('mongols','Moğol Hanlıkları','MOĞOL HANLIKLARI','#9ba38c',[106,47],'İç Asya','Birden fazla yönetim merkezi',
'Moğol dünyasında farklı hanlar ve siyasi odaklar bulunuyordu. Bozkır ile Ming sınır bölgeleri arasındaki ilişkiler ticaret ve çatışmayı birlikte içeriyordu.',
'Bu alan tek, birleşik bir imparatorluk değil; birden fazla siyasi oluşum için genel bir gösterimdir.',[[[87,45],[92,51],[104,54],[117,52],[123,46],[118,42],[112,41],[105,40],[96,42]]],'asia',1)
add('ming','Ming Çin’i','MİNG ÇİN’İ','#ce7e64',[111,33],'Doğu Asya','Pekin',
'Ming Hanedanı Çin’de hüküm sürüyordu. Başkent Pekin, saray ve merkezi yönetimin odağıydı. Zanaat, kent kültürü ve ticaret ağları gelişkindi.',
'Ming alanı, günümüzdeki Çin Halk Cumhuriyeti sınırları değildir. Tibet, Moğol bozkırları ve Tayvan bu renkli alana otomatik olarak dahil edilmez.',[[[97,24],[102,30],[103,36],[105,38],[112,41],[118,42],[122,40],[124,38],[122,33],[123,29],[119,24],[116,21],[110,19],[106,21],[103,23]]],'ming',0)
add('joseon','Joseon Kore','JOSEON KORE','#83a4bd',[127.5,37.9],'Doğu Asya','Hanyang (Seul)',
'Joseon Hanedanı Kore Yarımadası’nda hüküm sürüyordu. Konfüçyüsçü yönetim ve eğitim gelenekleri, devlet ve toplum hayatında önemliydi.',
'Kuzey sınırları sadeleştirilmiştir. Bugünkü Kuzey–Güney Kore ayrımı bu döneme ait değildir.',[[[124,37],[124.5,40],[128,42.3],[131,42.7],[131,37],[129,33],[125,33]]],'asia',2)
add('japan','Japonya · Sengoku dönemi','JAPONYA · SENGOKU','#c58e9b',[137,36],'Doğu Asya','Çok sayıda daimyō merkezi',
'Japonya, daimyōlar arasındaki mücadelelerle anılan Sengoku dönemindeydi. Haritadaki tek renk, adaların tek bir güçlü merkezi yönetimde olduğu anlamına gelmez.',
'1550’de ülke çapında tamamlanmış bir siyasi birlik yoktu. Hokkaidō bu gösterime dahil edilmez.',[[[128.5,30],[134,31],[141.5,35],[143,41.6],[139,41.6],[134,37],[130,35]]],'japan',1)
add('mughal','Babürlüler · Kabil çevresi','BABÜRLÜLER\nKABİL ÇEVRESİ','#ad98c2',[68,34],'Afganistan çevresi','Kabil',
'Babür’ün halefleri 1550’de Hindistan’ın büyük kısmını yönetmiyordu. Hümâyun ve hanedan üyelerinin mücadelesinin ağırlığı Kabil çevresindeydi.',
'Hümâyun’un Delhi ve Agra’ya dönüşü 1555’tedir. Önceki resimde Kuzey Hindistan’ı 1550’de bütünüyle Babürlere boyamak hatalıydı.',[[[63.5,31],[68,30],[72,33],[72,37],[68,37.7],[63,36]]],'india',1)
add('sur','Sur Devleti','SUR DEVLETİ','#ceaa60',[79,27],'Kuzey Hindistan','Delhi çevresi',
'Kuzey Hindistan’da Babürlerin Hindistan’daki egemenliğinin kesintiye uğradığı Sur dönemi yaşanıyordu. 1550 görünümünde bu alan Babür imparatorluğundan ayrı tutulur.',
'Bu şematik alan, Rajput yönetimleri ve yerel egemenliklerin tüm ayrıntılarını yansıtmaz.',[[[72,33],[75,34],[80,30],[85,28],[91,26],[91,23],[87,21],[82,23],[77,24],[74,28],[71,29]]],'india',0)
add('gujarat','Gucerat Sultanlığı','GUCERAT','#a8b881',[72,22],'Batı Hindistan','Ahmedabad',
'Gucerat, Hint Okyanusu ticaretine açılan zengin bir sultanlıktı. Limanları ve ticaret merkezleri bölgesel önem taşıyordu.',
'Babürlerin Gucerat’ı ele geçirmesi bu görünümün tarihinden sonradır.',[[[68,20],[72.5,19],[75,22],[74,25],[70,25],[68,23]]],'india',3)
add('deccan','Dekkan Sultanlıkları','DEKKAN SULTANLIKLARI','#bc9072',[77,18.8],'Orta · Güney Hindistan','Birden fazla sultanlık',
'Dekkan’da birbirinden ayrı sultanlıklar bulunuyordu. Ortak bir renk, bu siyasi yapıların tek bir devlet olduğu anlamına gelmez.',
'Ahmednagar, Bijapur, Golkonda ve diğer sultanlıkların iç sınırları bu ölçekte ayrılmamıştır.',[[[72.5,16],[76,15.5],[81.5,16],[83,19.5],[82,22.5],[77,23],[74,21]]],'asia',1)
add('vijayanagara','Vijayanagara İmparatorluğu','VİJAYANAGARA','#b9b76f',[77,12.3],'Güney Hindistan','Vijayanagara (Hampi)',
'Güney Hindistan’ın önemli siyasi güçlerinden Vijayanagara, geniş kent ve tapınak kompleksleriyle tanınır. Kuzeyindeki Dekkan sultanlıklarıyla rekabet içindeydi.',
'Bölgedeki yerel yönetimler ve değişken egemenlik ilişkileri sadeleştirilmiştir.',[[[73,8],[77.5,7],[81,10],[81.5,16],[76,15.5],[72.5,16]]],'asia',1)
add('ayutthaya','Ayutthaya Krallığı','AYUTTHAYA','#7fab91',[100.6,15.1],'Güneydoğu Asya','Ayutthaya',
'Ayutthaya, bugünkü Tayland’ın orta kesiminde güçlü bir krallıktı. Nehir ağları ve uluslararası ticaret kent hayatı için önemliydi.',
'Bugünkü Tayland sınırları kullanılmaz. Komşu krallıklarla ilişkiler ve yerel bağlılıklar daha karmaşıktı.',[[[98,10],[101,10],[103,14],[102.5,18],[99,18],[98,15]]],'asia',2)
add('burma','Toungoo çevresi','TOUNGOO','#a5b88f',[96.6,20.5],'Güneydoğu Asya','Aşağı ve Orta Burma',
'Toungoo hanedanının çevresinde şekillenen güç, Burma siyasetinde etkiliydi. 1550 dolaylarında bölge önemli iç mücadeleler ve yeniden yapılanmalar yaşıyordu.',
'Daha sonraki geniş Toungoo İmparatorluğu’nun sınırları geriye taşınmaz.',[[[93,16],[95,24],[98,25],[100,21],[98,18],[98,15],[96,15]]],'asia',2)
add('vietnam','Đại Việt · Mạc–Lê mücadelesi','ĐẠI VIỆT','#87aca0',[105.2,20.5],'Güneydoğu Asya','Rakip hanedan merkezleri',
'Vietnam bölgesinde Mạc ve Lê taraftarları arasında mücadele vardı. Tek renk, birleşik ve tartışmasız bir merkezi yönetim iddiası değildir.',
'Günümüz Vietnam’ının bütün güneyi bu dönemde aynı siyasi yapıya ait değildi.',[[[103,21],[105,23.5],[108.5,22],[109,18],[107,16.8],[105,18]]],'asia',2)
