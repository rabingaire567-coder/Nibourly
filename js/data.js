'use strict';
/* ============================================================
   Nibourly — Nepal data (canonical). Loaded first.
   Works on file:// and GitHub Pages. Also exported for Node
   tooling to generate the /data/*.json files.
   ============================================================ */

(function (global) {
  const P = {
    koshi:        { id: 1, key: 'koshi',        name: 'Koshi',         nameNp: 'कोशी',            cap: 'Biratnagar',      districts: 14, area: '25,905 km²', pop: '4.97M', lang: 'Nepali, Maithili, Limbu, Rai',   icon: '🏔️', color: '#e23744', facts: 'Home to Mt. Everest, Kanchenjunga, Ilam tea gardens and Koshi Tappu Wildlife Reserve.' },
    madhesh:      { id: 2, key: 'madhesh',      name: 'Madhesh',       nameNp: 'मधेश',            cap: 'Janakpur',        districts: 8,  area: '9,661 km²',  pop: '6.11M', lang: 'Maithili, Bhojpuri, Nepali',      icon: '🌾', color: '#f5a524', facts: 'Fertile Terai plains of Mithila art, Janaki Mandir, sugar mills and border trade.' },
    bagmati:      { id: 3, key: 'bagmati',      name: 'Bagmati',       nameNp: 'बागमती',          cap: 'Hetauda',         districts: 13, area: '20,300 km²', pop: '5.53M', lang: 'Nepali, Newari, Tamang',          icon: '🏛️', color: '#7b1fa2', facts: 'Heart of Nepal — Kathmandu Valley, Pashupatinath, Swayambhunath and Langtang Himal.' },
    gandaki:      { id: 4, key: 'gandaki',      name: 'Gandaki',       nameNp: 'गण्डकी',          cap: 'Pokhara',         districts: 11, area: '21,504 km²', pop: '2.48M', lang: 'Nepali, Gurung, Magar',           icon: '⛰️', color: '#0ea5e9', facts: 'Annapurna & Dhaulagiri ranges, Phewa Lake, Muktinath and the birthplace of Nepal\'s unifier.' },
    lumbini:      { id: 5, key: 'lumbini',      name: 'Lumbini',       nameNp: 'लुम्बिनी',        cap: 'Deukhuri',        districts: 12, area: '22,288 km²', pop: '5.12M', lang: 'Nepali, Tharu, Awadhi',            icon: '☸️', color: '#10b981', facts: 'Sacred birthplace of Gautam Buddha, Tilaurakot, Bardiya National Park and Tharu culture.' },
    karnali:      { id: 6, key: 'karnali',      name: 'Karnali',       nameNp: 'कर्णाली',         cap: 'Birendranagar',   districts: 10, area: '27,984 km²', pop: '1.69M', lang: 'Nepali, Magar, Khas',              icon: '🏞️', color: '#8b5cf6', facts: 'Rara Lake, Shey Phoksundo, Jumla\'s famous apples and the origin of Nepali (Khas) language.' },
    sudurpaschim: { id: 7, key: 'sudurpaschim', name: 'Sudurpashchim', nameNp: 'सुदूरपश्चिम',    cap: 'Godawari',        districts: 9,  area: '19,539 km²', pop: '2.69M', lang: 'Nepali, Doteli, Tharu',            icon: '🌄', color: '#f59e0b', facts: 'Khaptad plateau, Api & Saipal Himal, Ghodaghodi Lake and the wild Far-West.' }
  };

  const districts = [
    { d: 'Taplejung',      p: 'koshi',        z: 'Mechi',      hq: 'Phungling',     k: 'Kanchenjunga, Pathibhara, Tinjure forest' },
    { d: 'Sankhuwasabha',  p: 'koshi',        z: 'Koshi',      hq: 'Khandbari',     k: 'Mt. Makalu, Arun river, Kimathanka border' },
    { d: 'Solukhumbu',     p: 'koshi',        z: 'Sagarmatha', hq: 'Salleri',       k: 'Everest base, Namche Bazaar, Sherpa culture' },
    { d: 'Okhaldhunga',    p: 'koshi',        z: 'Sagarmatha', hq: 'Siddhicharan',  k: 'Halesi Mahadev, Siddhicharan shrine' },
    { d: 'Khotang',        p: 'koshi',        z: 'Sagarmatha', hq: 'Diktel',        k: 'Halesi cave (Tungnath), Diktel bazaar' },
    { d: 'Bhojpur',        p: 'koshi',        z: 'Koshi',      hq: 'Bhojpur',       k: 'Famous Bhojpur khukuri, gold-sand rivers' },
    { d: 'Dhankuta',       p: 'koshi',        z: 'Koshi',      hq: 'Dhankuta',      k: 'Dhankuta hill town, tea gardens' },
    { d: 'Terhathum',      p: 'koshi',        z: 'Mechi',      hq: 'Myanglung',     k: 'Tinjure-Milke-Jaljale rhododendron hills' },
    { d: 'Panchthar',      p: 'koshi',        z: 'Mechi',      hq: 'Phidim',        k: 'Phidim, Kabeli river, orange & tea farms' },
    { d: 'Ilam',           p: 'koshi',        z: 'Mechi',      hq: 'Ilam',          k: 'Tea gardens, Kanyam, Mai Pokhari' },
    { d: 'Jhapa',          p: 'koshi',        z: 'Mechi',      hq: 'Bhadrapur',     k: 'Koshi Tappu, border trade, fertile farms' },
    { d: 'Morang',         p: 'koshi',        z: 'Koshi',      hq: 'Biratnagar',    k: 'Industrial hub Biratnagar, Koshi Barrage' },
    { d: 'Sunsari',        p: 'koshi',        z: 'Koshi',      hq: 'Inaruwa',       k: 'Dharan, Baraha Chhetra, Koshi river' },
    { d: 'Udayapur',       p: 'koshi',        z: 'Sagarmatha', hq: 'Gaighat',       k: 'Udayapur Gadhi, Triyuga, river valleys' },

    { d: 'Saptari',        p: 'madhesh',      z: 'Sagarmatha', hq: 'Rajbiraj',      k: 'Chhinnamasta temple, Rajbiraj town' },
    { d: 'Siraha',         p: 'madhesh',      z: 'Sagarmatha', hq: 'Siraha',        k: 'Lahan bazaar, Dhanushadham access, farms' },
    { d: 'Dhanusha',       p: 'madhesh',      z: 'Janakpur',   hq: 'Janakpur',      k: 'Janaki Mandir, Mithila art & culture' },
    { d: 'Mahottari',      p: 'madhesh',      z: 'Janakpur',   hq: 'Jaleshwar',     k: 'Jaleshwar temple, maize belt, Bhangaha' },
    { d: 'Sarlahi',        p: 'madhesh',      z: 'Janakpur',   hq: 'Malangwa',      k: 'Sugar mills, Karmaiya, green Terai' },
    { d: 'Rautahat',       p: 'madhesh',      z: 'Narayani',   hq: 'Gaur',          k: 'Historic Gaur, Chandrapur, border trade' },
    { d: 'Bara',           p: 'madhesh',      z: 'Narayani',   hq: 'Kalaiya',       k: 'Nijgadh, Simara airport, Pathlaiya' },
    { d: 'Parsa',          p: 'madhesh',      z: 'Narayani',   hq: 'Birgunj',       k: 'Dry port, biggest Nepal–India trade gate' },

    { d: 'Dolakha',        p: 'bagmati',      z: 'Janakpur',   hq: 'Charikot',      k: 'Jiri (Everest gateway), Bhimeshwar temple' },
    { d: 'Sindhupalchok',  p: 'bagmati',      z: 'Bagmati',    hq: 'Chautara',      k: 'Melamchi water project, Panch Pokhari' },
    { d: 'Rasuwa',         p: 'bagmati',      z: 'Bagmati',    hq: 'Dhunche',       k: 'Langtang valley, Gosaikunda lake' },
    { d: 'Dhading',        p: 'bagmati',      z: 'Bagmati',    hq: 'Dhadingbesi',   k: 'Rubi Valley, Manaslu views, Gajuri' },
    { d: 'Nuwakot',        p: 'bagmati',      z: 'Bagmati',    hq: 'Bidur',         k: 'Nuwakot Durbar, Trishuli river rafting' },
    { d: 'Kathmandu',      p: 'bagmati',      z: 'Bagmati',    hq: 'Kathmandu',     k: 'Capital — Pashupatinath, Swayambhunath, Boudha' },
    { d: 'Bhaktapur',      p: 'bagmati',      z: 'Bagmati',    hq: 'Bhaktapur',     k: 'Durbar Square, Nyatapola, Bisket Jatra' },
    { d: 'Lalitpur',       p: 'bagmati',      z: 'Bagmati',    hq: 'Patan',         k: 'Patan Durbar, Krishna Mandir, Newari art' },
    { d: 'Kavrepalanchok', p: 'bagmati',      z: 'Bagmati',    hq: 'Dhulikhel',     k: 'Dhulikhel sunrise, Panauti, Namobuddha' },
    { d: 'Sindhuli',       p: 'bagmati',      z: 'Janakpur',   hq: 'Kamalamai',     k: 'Sindhuli Gadhi fort, Kamalamai valley' },
    { d: 'Ramechhap',      p: 'bagmati',      z: 'Janakpur',   hq: 'Manthali',      k: 'Sunkoshi views, pilgrimage routes' },
    { d: 'Chitwan',        p: 'bagmati',      z: 'Narayani',   hq: 'Bharatpur',     k: 'Chitwan National Park, one-horned rhino' },
    { d: 'Makwanpur',      p: 'bagmati',      z: 'Narayani',   hq: 'Hetauda',       k: 'Hetauda, Chitlang, Indra Sarovar dam' },

    { d: 'Gorkha',         p: 'gandaki',      z: 'Gandaki',    hq: 'Gorkha',        k: 'Gorkha Durbar, Manakamana, Mt. Manaslu' },
    { d: 'Lamjung',        p: 'gandaki',      z: 'Gandaki',    hq: 'Besisahar',     k: 'Annapurna circuit, Marsyangdi river' },
    { d: 'Tanahun',        p: 'gandaki',      z: 'Gandaki',    hq: 'Damauli',       k: 'Bandipur bazaar, Seti river, Tadi' },
    { d: 'Syangja',        p: 'gandaki',      z: 'Gandaki',    hq: 'Putalibazar',   k: 'Historic Waling, Siddhartha highway' },
    { d: 'Kaski',          p: 'gandaki',      z: 'Gandaki',    hq: 'Pokhara',       k: 'Phewa Lake, Sarangkot, Machhapuchhre' },
    { d: 'Manang',         p: 'gandaki',      z: 'Gandaki',    hq: 'Chame',         k: 'Annapurna range, Tilicho Lake, Thorong La' },
    { d: 'Mustang',        p: 'gandaki',      z: 'Dhaulagiri', hq: 'Jomsom',        k: 'Muktinath, Lo Manthang, Kagbeni desert' },
    { d: 'Myagdi',         p: 'gandaki',      z: 'Dhaulagiri', hq: 'Beni',          k: 'Dhaulagiri, Poon Hill, Beni bazaar' },
    { d: 'Parbat',         p: 'gandaki',      z: 'Dhaulagiri', hq: 'Kusma',         k: 'Kusma, Modi river, hill town charm' },
    { d: 'Baglung',        p: 'gandaki',      z: 'Dhaulagiri', hq: 'Baglung',       k: 'Kalika temple, Dhaulagiri viewpoints' },
    { d: 'Nawalpur',       p: 'gandaki',      z: 'Narayani',   hq: 'Kawasoti',      k: 'Kawasoti, Triveni, Gaidakot wetlands' },

    { d: 'Rupandehi',      p: 'lumbini',      z: 'Lumbini',    hq: 'Siddharthanagar', k: 'Lumbini (Buddha\'s birth), Bhairahawa, Tilaurakot' },
    { d: 'Kapilvastu',     p: 'lumbini',      z: 'Lumbini',    hq: 'Taulihawa',     k: 'Kapilvastu ruins, Niglihawa pillars' },
    { d: 'Arghakhanchi',   p: 'lumbini',      z: 'Lumbini',    hq: 'Sandhikharka',  k: 'Argha & Khanchi temples, scenic hills' },
    { d: 'Gulmi',          p: 'lumbini',      z: 'Lumbini',    hq: 'Tamghas',       k: 'Ridi shrine, coffee & citrus hills' },
    { d: 'Palpa',          p: 'lumbini',      z: 'Lumbini',    hq: 'Tansen',        k: 'Tansen bazaar, Rani Mahal, hills' },
    { d: 'Parasi',         p: 'lumbini',      z: 'Lumbini',    hq: 'Ramgram',       k: 'Ramgram Stupa, Triveni Sangam' },
    { d: 'Banke',          p: 'lumbini',      z: 'Bheri',      hq: 'Nepalgunj',     k: 'Nepalgunj trade hub, Banke National Park' },
    { d: 'Bardiya',        p: 'lumbini',      z: 'Bheri',      hq: 'Gulariya',      k: 'Bardiya NP tigers, Tharu culture' },
    { d: 'Dang',           p: 'lumbini',      z: 'Rapti',      hq: 'Ghorahi',       k: 'Dang–Deukhuri valley, Tulsipur' },
    { d: 'Pyuthan',        p: 'lumbini',      z: 'Rapti',      hq: 'Pyuthan',       k: 'Swargadwari temple, hill villages' },
    { d: 'Rolpa',          p: 'lumbini',      z: 'Rapti',      hq: 'Liwang',        k: 'Thawang, remote alpine scenery' },
    { d: 'Eastern Rukum',  p: 'lumbini',      z: 'Rapti',      hq: 'Rukumkot',      k: 'Rukumkot, alpine meadows, Lukum river' },

    { d: 'Western Rukum',  p: 'karnali',      z: 'Rapti',      hq: 'Musikot',       k: 'Musikot, Karnali gorge views' },
    { d: 'Salyan',         p: 'karnali',      z: 'Rapti',      hq: 'Salyan',        k: 'Salyan bazaar, green hill ridges' },
    { d: 'Surkhet',        p: 'karnali',      z: 'Bheri',      hq: 'Birendranagar', k: 'Provincial capital, Kakrebihar ruins' },
    { d: 'Dailekh',        p: 'karnali',      z: 'Bheri',      hq: 'Narayan',       k: 'Padukasthan, Tripura Sundari temple' },
    { d: 'Jajarkot',       p: 'karnali',      z: 'Bheri',      hq: 'Khalanga',      k: 'Jajarkot palace, Juni Chandevi temple' },
    { d: 'Dolpa',          p: 'karnali',      z: 'Karnali',    hq: 'Dunai',         k: 'Shey Phoksundo lake, upper Dolpo' },
    { d: 'Jumla',          p: 'karnali',      z: 'Karnali',    hq: 'Chandannath',   k: 'Sinja valley — origin of Nepali language, apples' },
    { d: 'Kalikot',        p: 'karnali',      z: 'Karnali',    hq: 'Manma',         k: 'Alpine villages, Karnali corridor' },
    { d: 'Mugu',           p: 'karnali',      z: 'Karnali',    hq: 'Gamgadhi',      k: 'Rara Lake — Nepal\'s largest lake' },
    { d: 'Humla',          p: 'karnali',      z: 'Karnali',    hq: 'Simikot',       k: 'Limi valley, Mt. Kailash trekking route' },

    { d: 'Bajura',         p: 'sudurpaschim', z: 'Seti',       hq: 'Martadi',       k: 'Badimalika temple, Khaptad approach' },
    { d: 'Bajhang',        p: 'sudurpaschim', z: 'Seti',       hq: 'Jayaprithvi',   k: 'Saipal Himal, Surma Sarovar lake' },
    { d: 'Achham',         p: 'sudurpaschim', z: 'Seti',       hq: 'Mangalsen',     k: 'Ramsikhar, Masto shrine, hill farms' },
    { d: 'Doti',           p: 'sudurpaschim', z: 'Seti',       hq: 'Dipayal Silgadhi', k: 'Dipayal, Doti Durbar, Khaptad gate' },
    { d: 'Kailali',        p: 'sudurpaschim', z: 'Seti',       hq: 'Dhangadhi',     k: 'Dhangadhi, Ghodaghodi lake, Godawari' },
    { d: 'Kanchanpur',     p: 'sudurpaschim', z: 'Mahakali',   hq: 'Bheemdatta',    k: 'Shuklaphanta NP, Dodhara–Chandani bridge' },
    { d: 'Dadeldhura',     p: 'sudurpaschim', z: 'Mahakali',   hq: 'Amargadhi',     k: 'Amargadhi, Udakamuni shrine' },
    { d: 'Baitadi',        p: 'sudurpaschim', z: 'Mahakali',   hq: 'Dasharathchand', k: 'Hill temples, Ganga–Mahakali confluences' },
    { d: 'Darchula',       p: 'sudurpaschim', z: 'Mahakali',   hq: 'Khalanga',      k: 'Api Himal, Mahakali river, Chaulani' }
  ];

  const festivals = [
    { name: 'Maghe Sankranti', np: 'माघे संक्रान्ति', date: 'Jan 14', month: 'Magh 1', region: 'Nationwide', color: '#f59e0b', desc: 'First day of Magh — til laddoo, ghee & yam feasts; the big Khichdi fair at Gorkha\'s Malik Arjun temple.' },
    { name: 'Sonam Losar', np: 'सोनाम ल्होसार', date: 'Feb 13', month: 'Magh 30', region: 'Tamang communities', color: '#e23744', desc: 'Tamang New Year — dances, momo feasts and family gatherings across the hills.' },
    { name: 'Maha Shivaratri', np: 'महाशिवरात्रि', date: 'Feb 25', month: 'Falgun 14', region: 'Pashupatinath, nationwide', color: '#7b1fa2', desc: 'Night of Lord Shiva — sadhus and devotees flock to Pashupatinath; bonfires of devotion.' },
    { name: 'Gyalpo Losar', np: 'ग्याल्पो ल्होसार', date: 'Feb 27', month: 'Falgun 16', region: 'Sherpa, Gurung, Bhote', color: '#0ea5e9', desc: 'Himalayan Buddhist New Year — prayer flags, khapse cookies, family puja.' },
    { name: 'Fagu Purnima (Holi)', np: 'फागु पूर्णिमा', date: 'Mar 13', month: 'Falgun 29', region: 'Nationwide', color: '#ec4899', desc: 'Festival of colours — lola (bonfire) on the eve, then colours, water balloons and Laxmi Prasad Devkota\'s poem everywhere.' },
    { name: 'Ghode Jatra', np: 'घोडे जात्रा', date: 'Apr 1', month: 'Chaitra 18', region: 'Kathmandu', color: '#8b5cf6', desc: 'Horse parade at Tundikhel — Newari tradition chasing away the demon Tundi.' },
    { name: 'Bisket Jatra', np: 'बिस्केट जात्रा', date: 'Apr 13', month: 'Chaitra 30', region: 'Bhaktapur', color: '#f43f5e', desc: 'Bhaktapur\'s New Year chariot festival — giant lingo poles pulled through the streets.' },
    { name: 'Nepali New Year 2083', np: 'नयाँ वर्ष', date: 'Apr 14', month: 'Baisakh 1', region: 'Nationwide', color: '#10b981', desc: 'Bikram Sambat New Year — a fresh start with parades, sweets and family time.' },
    { name: 'Buddha Jayanti', np: 'बुद्ध जयन्ती', date: 'May 11', month: 'Baisakh 28', region: 'Lumbini, nationwide', color: '#f5a524', desc: 'Birth, enlightenment and mahaparinirvana of Buddha — lamps & prayers at Lumbini.' },
    { name: 'Janai Purnima & Raksha Bandhan', np: 'जनै पूर्णिमा', date: 'Aug 8', month: 'Shrawan 22', region: 'Nationwide', color: '#0d9488', desc: 'Sacred thread (janai) changing for men, rakhi for siblings, and the khar-khadka at Gosaikunda.' },
    { name: 'Krishna Janmashtami', np: 'कृष्ण जन्माष्टमी', date: 'Aug 17', month: 'Bhadra 1', region: 'Patan, nationwide', color: '#2563eb', desc: 'Birth of Krishna — night vigils and the famous Krishna Mandir festival in Patan.' },
    { name: 'Gai Jatra', np: 'गाई जात्रा', date: 'Aug 28', month: 'Bhadra 12', region: 'Kathmandu Valley', color: '#c084fc', desc: 'Cow festival — processions, satire and comedy remembering the departed.' },
    { name: 'Indra Jatra', np: 'इन्द्र जात्रा', date: 'Sep 10', month: 'Bhadra 25', region: 'Kathmandu', color: '#e11d48', desc: 'Indra, god of rain — Kumari Jatra, the Living Goddess rides out, Bhairab masks and dancing.' },
    { name: 'Teej', np: 'तीज', date: 'Sep 13', month: 'Bhadra 27', region: 'Nationwide', color: '#ef4444', desc: 'Women\'s festival — red dresses, fasting for husbands\' long life, singing & dancing to Shiva.' },
    { name: 'Matatirtha Aunsi', np: 'मातातीर्थ औंसी', date: 'Sep 25', month: 'Ashwin 9', region: 'Nationwide', color: '#64748b', desc: 'Mother\'s Day — remember and honour mothers; sweet feast of sagun.' },
    { name: 'Dashain', np: 'दशैं', date: 'Oct 18 (Tika)', month: 'Ashwin–Kartik', region: 'Nationwide', color: '#e23744', desc: 'The greatest festival — 15 days of victory of Durga over evil. Jamara, kites, swings (ping), tika & jamara on Dashami, and family reunions.' },
    { name: 'Tihar', np: 'तिहार', date: 'Nov 2–6', month: 'Kartik 16–20', region: 'Nationwide', color: '#f59e0b', desc: 'Festival of lights — crows, dogs and cows honoured, Laxmi puja with lights & rangoli, and Bhai Tika on the final day.' },
    { name: 'Chhath', np: 'छठ', date: 'Nov 8–11', month: 'Kartik 22–25', region: 'Terai, nationwide', color: '#0ea5e9', desc: 'Worship of the Sun god — fasting women stand in rivers at dawn & dusk offering argha.' }
  ];

  const emergency = [
    { name: 'Nepal Police',      number: '100',       type: 'Emergency',    icon: 'shield',  desc: 'For any crime or safety emergency across Nepal.' },
    { name: 'Fire Brigade',      number: '101',       type: 'Emergency',    icon: 'flame',   desc: 'Report fires, gas leaks and rescue situations.' },
    { name: 'National Ambulance',number: '102',       type: 'Health',       icon: 'plus',    desc: 'Nationwide emergency ambulance service.' },
    { name: 'Traffic Police',    number: '103',       type: 'Safety',       icon: 'car',     desc: 'Traffic accidents, jams and road emergencies.' },
    { name: 'NDRRMA Disaster',   number: '1155',      type: 'Disaster',     icon: 'alert',   desc: 'National Disaster Risk Reduction hotline (floods, quakes, landslides).' },
    { name: 'Tourism Police',    number: '1144',      type: 'Safety',       icon: 'map',     desc: 'For travellers, trekkers and tourists in trouble.' },
    { name: 'Women\'s Helpline', number: '1145',      type: 'Safety',       icon: 'heart',   desc: 'One-stop service for women in distress.' },
    { name: 'Child Helpline',    number: '1098',      type: 'Safety',       icon: 'child',   desc: 'Report child abuse, neglect or missing children.' },
    { name: 'NEA Power Outage',  number: '1650012',   type: 'Utility',      icon: 'bolt',    desc: 'Nepal Electricity Authority outage & fault reporting.' },
    { name: 'KUKL Water (KT)',   number: '16600145006',type: 'Utility',     icon: 'drop',    desc: 'Kathmandu Upatyaka Khanepani — leaks & supply issues.' },
    { name: 'Red Cross Blood',   number: '14200',     type: 'Health',       icon: 'droplet', desc: 'Nepal Red Cross blood requirement & donation info.' },
    { name: 'EMERGENCY 911 (Nepal)', number: '112',  type: 'Emergency',     icon: 'help',    desc: 'GSM emergency number works on all networks in Nepal.' }
  ];

  const hospitals = [
    { name: 'Bir Hospital (NMC)', city: 'Kathmandu', phone: '+977-1-4219321', note: 'Oldest public hospital, accident & general care.' },
    { name: 'Tribhuvan University Teaching Hospital', city: 'Maharajgunj', phone: '+977-1-4412404', note: 'Largest teaching hospital, referrals.' },
    { name: 'Patan Hospital (Lagankhel)', city: 'Lalitpur', phone: '+977-1-5522266', note: 'Trust-run, quality low-cost care.' },
    { name: 'Grande International Hospital', city: 'Kathmandu', phone: '+977-1-5151566', note: 'Multi-speciality private hospital.' },
    { name: 'Norvic International Hospital', city: 'Kathmandu', phone: '+977-1-4222177', note: 'Cardiology & general specialities.' },
    { name: 'B.P. Koirala Institute (BPKIHS)', city: 'Dharan', phone: '+977-25-525555', note: 'Top health sciences institute for eastern Nepal.' },
    { name: 'Gandaki Medical College', city: 'Pokhara', phone: '+977-61-440618', note: 'Major referral hospital for Gandaki region.' },
    { name: 'Bheri Hospital', city: 'Nepalgunj', phone: '+977-81-520100', note: 'Key public hospital of western/central Nepal.' }
  ];

  const solutions = [
    { id: 'waste',   icon: '🗑️', title: 'Waste & Garbage Crisis', cat: 'Environment',
      problem: 'Kathmandu Valley alone produces ~1,200 tons of solid waste daily. Uncollected mounds block drains, spread disease and worsen monsoon floods.',
      facts: ['Valley generates ~1,200 t/day, over half is organic.', 'Sisdol landfill is nearly full and far from the city.', 'Burning plastic releases dioxins that worsen winter smog.'],
      solutions: ['Segregate at home: wet (kitchen), dry (plastic/paper), and hazardous. Hand dry recyclables to raddhiwalas.', 'Compost kitchen waste — a simple two-bucket method cuts household waste by 40–60% in 3 weeks.', 'Check your ward office for official pickup days and transfer points.', 'Report garbage piles here on Nibourly so your municipality can schedule collection.', 'Join a monthly neighbourhood cleanup — plastic collection before monsoon prevents drain block.' ],
      contacts: ['Municipality waste department', 'Your ward office (janapratinidhi)'],
      tip: 'Never burn waste. Use the zero-waste shops and bag-recycling bins that are spreading in the Valley.' },
    { id: 'water',   icon: '💧', title: 'Water Shortage & Leaks', cat: 'Utility',
      problem: 'KUKL supplies water only a few hours a day in many Kathmandu wards; dry-season taps run empty for weeks, while leaks waste millions of litres.',
      facts: ['Valley demand ~430 MLD vs supply ~350 MLD in peak season.', 'Leaks and bursts waste an estimated 30%+ of supplied water.', 'Melamchi water project now adds ~170 MLD when running.'],
      solutions: ['Report bursts/leaks to KUKL (16600145006) with your khane-pani number and exact location.', 'Install a 500–1000L storage tank; fill during supply hours and purify with filters or boiling.', 'Harvest monsoon rainwater — a 1000L tank can cover months of cooking needs.', 'Collect used water (reuse) for flushing, plants and cleaning.', 'Check tanker scheduling through your ward — share tanker timings on Nibourly.'],
      contacts: ['KUKL hotline 16600145006', 'Municipality water branch'],
      tip: 'Test well/bore water during monsoon — sewage contamination peaks in rainy season.' },
    { id: 'power',   icon: '⚡', title: 'Load-Shedding & Power Cuts', cat: 'Utility',
      problem: 'Hydropower in winter dips, and distribution faults cause unannounced cuts. Planned groups still appear in dry season.',
      facts: ['Nepal has ~3,000 MW installed — surplus in monsoon, tight in winter.', 'Distribution faults and transformer overload cause many cuts.', 'NEA app & 1650012 report faults 24/7.'],
      solutions: ['Know your NEA group (see the load-shedding widget) and plan heavy work in off-peak hours.', 'Keep a charged power bank, LED lantern and inverter for essentials.', 'Use the NEA mobile app or call 1650012 to report outages and get status.', 'Unplug electronics during cuts to avoid surge damage on return.', 'Insulate homes and use geyser timers to cut winter bills.'],
      contacts: ['NEA call center 1650012', 'Local distribution centre'],
      tip: 'Report transformer faults quickly — they affect whole toles, and NEA prioritises reported faults.' },
    { id: 'road',    icon: '🛣️', title: 'Potholes & Broken Roads', cat: 'Infrastructure',
      problem: 'Monsoon and overloaded vehicles turn roads into pothole fields, damaging vehicles and causing accidents.',
      facts: ['Valley roads are patched repeatedly but fail within months.', 'Potholes cause ~hundreds of vehicle repairs every monsoon.', 'Ward offices hold road-maintenance budgets each year.'],
      solutions: ['Photograph the pothole with a location and report it here on Nibourly.', 'Tag your ward office and municipality social accounts in reports.', 'Support pothole-patch days — volunteers + municipality material works.', 'Use warning paints/flags on dangerous potholes at night.', 'Take alternate routes during monsoon to avoid flooded underpasses.'],
      contacts: ['Ward office road section', 'Municipality (infrastructure branch)'],
      tip: 'Reports with photos and exact tole names get fixed 3–4x faster.' },
    { id: 'traffic', icon: '🚦', title: 'Traffic & Public Transport', cat: 'Mobility',
      problem: 'Kathmandu\'s narrow streets and rising vehicles cause gridlock; the micro-bus (tempo) fleet struggles with routes and crowding.',
      facts: ['Over 1.4 million vehicles registered in the Valley alone.', 'Peak hours see 30–40 min delays across major junctions.', 'Public buses cover only part of demand, pushing private cars.'],
      solutions: ['Share live traffic & jam reports on Nibourly to help neighbours reroute.', 'Use Sajha/route buses and electric tempos for short trips.', 'Carpool for daily work routes — start a tole carpool group.', 'Pedestrian first: report broken footpaths and missing zebra crossings.', 'Use off-peak hours for deliveries and heavy errands.'],
      contacts: ['Traffic Police 103', 'Metropolitan transport division'],
      tip: 'The quickest 10-minute shortcut is often a walk — combine walking with buses in the core city.' },
    { id: 'pollution', icon: '🌫️', title: 'Air & Noise Pollution', cat: 'Environment',
      problem: 'Winter smog (PM2.5) in Kathmandu regularly exceeds safe levels by 5–10x; dust from roads and brick kilns adds to it.',
      facts: ['Kathmandu winter AQI often crosses 200–400 (hazardous).', 'Road dust, vehicle exhaust and brick kilns are top sources.', 'Poor air worsens asthma, heart and lung diseases.'],
      solutions: ['Wear N95 masks on high-AQI days — check the daily AQI widget.', 'Keep windows closed in the morning smog peak; use air purifiers indoors.', 'Plant trees in your tole and support vertical gardens.', 'Push for green transport: walk, cycle and use electric tempos.', 'Report open waste burning — it is banned in most municipalities.'],
      contacts: ['Ministry of Environment AQI portal', 'Municipality environment section'],
      tip: 'Indoor air is often worse — ventilate after 10am when AQI dips.' },
    { id: 'health',  icon: '🏥', title: 'Health Access & Blood', cat: 'Health',
      problem: 'Long queues at public hospitals, blood shortages in emergencies, and distance to care in rural districts.',
      facts: ['Nepal has ~2 doctors per 10,000 people — urban-skewed.', 'Blood banks face seasonal shortages, especially holidays.', '108-style ambulance access is limited outside cities.'],
      solutions: ['List nearby hospitals, clinics and pharmacies in Services → Health.', 'Use the blood-request board here to coordinate donations fast.', 'Keep a family health file — allergies, blood group, medications.', 'Know your nearest birthing centre and emergency route.', 'Use online OPD booking where available to skip queues.'],
      contacts: ['Nepal Red Cross blood info 14200', 'Local health post (स्वास्थ्य चौकी)'],
      tip: 'Free dial 102 ambulance is national — save it in speed dial.' },
    { id: 'elderly', icon: '👴', title: 'Elderly & Lonely Neighbours', cat: 'Society',
      problem: 'Many elders live alone while young people work abroad or in cities; loneliness and medical neglect rise.',
      facts: ['Remittance-driven migration leaves many households with only elders.', 'Elders often skip meals or care when alone.', 'Community check-ins dramatically improve safety and happiness.'],
      solutions: ['Set up a rotating tole check-in list — one volunteer visits/phones daily.', 'Offer grocery and medicine runs for elders in your ward.', 'Help elders register for senior allowances and health checkups.', 'Teach a neighbour\'s elder to video-call family — one session changes lives.', 'Report neglected or distressed elders to the ward and Red Cross.'],
      contacts: ['Ward office social worker', 'Senior Citizen Card portal'],
      tip: 'A daily 5-minute call costs nothing and prevents most emergencies.' },
    { id: 'safety',  icon: '🛡️', title: 'Safety & Women\'s Safety', cat: 'Society',
      problem: 'Harassment, theft and dark lanes worry residents — especially women — especially after dark.',
      facts: ['Street lighting gaps create unsafe spots across cities.', 'Women\'s helpline 1145 and child helpline 1098 operate 24/7.', 'Community awareness is proven to cut local crime.'],
      solutions: ['Report broken streetlights here — lighting is the #1 safety fix.', 'Use the SOS share feature to notify trusted neighbours instantly.', 'Form neighbourhood watch groups; share incident-free zones.', 'Keep 100, 1145 and 1144 on speed dial.', 'Ask shops on dark stretches to keep their veranda lights on.'],
      contacts: ['Nepal Police 100', 'Women\'s helpline 1145'],
      tip: 'Share your live location with a neighbour when returning late — habit saves lives.' },
    { id: 'quake',   icon: '🏔️', title: 'Earthquake Preparedness', cat: 'Disaster',
      problem: 'Nepal sits on a major fault line; the 2015 earthquake (7.8) killed ~9,000 people. Preparedness saves lives.',
      facts: ['2015 Gorkha quake damaged ~800,000 homes.', 'Kathmandu valley is at high seismic risk for the future.', 'Dropping, covering and holding on prevents most injuries.'],
      solutions: ['Drop, Cover, Hold On — practice it with family twice a year.', 'Fix tall furniture to walls; keep heavy items low.', 'Prepare a go-bag: water, torch, radio, first-aid, documents, snacks.', 'Identify open assembly points near your home and tole.', 'Follow NDRRMA (1155) alerts and building-code retrofits.'],
      contacts: ['NDRRMA hotline 1155', 'Local disaster management committee'],
      tip: 'During a quake never run outside while shaking — get under a sturdy table first.' },
    { id: 'flood',   icon: '🌊', title: 'Floods & Landslides', cat: 'Disaster',
      problem: 'Monsoon floods hit Terai rivers and landslides close hill roads yearly — 2023 was among the deadliest.',
      facts: ['Terai rivers like Koshi, Narayani and Babai breach banks in heavy years.', 'Sisne and other hillsides slide after intense rain.', 'Melamchi-style debris flows destroy water infrastructure.'],
      solutions: ['Track NDRRMA weather alerts and ward early-warning systems.', 'Move valuables and livestock to higher floors when alerts hit.', 'Never cross flooded bridges or roads — a 30cm flow can sweep a car.', 'Prepare a family flood plan and meeting point.', 'Report blocked drains before monsoon to reduce street floods.'],
      contacts: ['NDRRMA 1155', 'Department of Hydrology early warning'],
      tip: 'Flash floods arrive fast — react to the first siren, not the second.' },
    { id: 'digital', icon: '📱', title: 'Digital Divide & Services', cat: 'Society',
      problem: 'Many daily services need appointments, forms and payments online, but elders and rural users struggle with them.',
      facts: ['Internet penetration is high in cities but patchy in mountains.', 'Gov services increasingly move to web portals.', 'Digital literacy workshops close the gap quickly.'],
      solutions: ['Hold tole digital-literacy sessions — one volunteer can teach 20 elders.', 'Share step-by-step guides for Nagarik App, online bill pay, OPD booking.', 'Report dead zones to your ISP and municipality digital desk.', 'Set up community WiFi in ward offices and schools.', 'Create printed one-page how-tos for common online tasks.'],
      contacts: ['Municipality IT section', 'Local service provider'],
      tip: 'Nagarik App and online OPD booking save hours — master them with family.' },
    { id: 'livelihood', icon: '🧰', title: 'Skills & Local Livelihoods', cat: 'Society',
      problem: 'Youth unemployment and skills mismatch push talent abroad; local skills go unused.',
      facts: ['A large share of GDP comes from remittances.', 'There are skill gaps in plumbing, electrical and IT.', 'Local job boards are fragmented.'],
      solutions: ['Post local skills & services on the Nibourly Services board.', 'Mentor a neighbour\'s son/daughter in your trade.', 'Support tole-level buying of local produce and goods.', 'Organise weekend skill-share workshops (cooking, coding, crafts).', 'List openings for local work in Community posts.'],
      contacts: ['Municipality employment centre', 'CTEVT & skill-training partners'],
      tip: 'Small local businesses that cooperate (group buying, shared delivery) grow 2x faster.' },
    { id: 'community', icon: '🎎', title: 'Community & Festivals Bond', cat: 'Society',
      problem: 'Busy lives and city moves weaken the "छिमेकी" (neighbourhood) bonds that once ran Nepali society.',
      facts: ['Festivals like Dashain & Tihar once knit communities together.', 'Urban flats reduce casual neighbour contact.', 'Community events rebuild trust and mutual help.'],
      solutions: ['Organise tole celebrations for Dashain swings, Tihar lights and cleanups.', 'Start a neighbourhood group (Imejong-style cooperatives) for shared needs.', 'Celebrate small: tea evenings, chautari-style benches, street festivals.', 'Volunteer together — food drives and blood camps build bonds.', 'Use Nibourly Events to announce and RSVP to local happenings.'],
      contacts: ['Tole development committee', 'Ward office cultural section'],
      tip: 'A community that knows each other protects each other — that is the Nibourly spirit.' }
  ];

  const serviceCats = [
    { cat: 'Electrician',    icon: '⚡', desc: 'Wiring, lights, inverter repair',   tag: ['home','repair'] },
    { cat: 'Plumber',        icon: '🔧', desc: 'Leaks, tanks, bathroom fittings',   tag: ['home','repair'] },
    { cat: 'Mechanic',       icon: '🔩', desc: 'Bike & car repairs',                tag: ['vehicle'] },
    { cat: 'Doctor / Clinic',icon: '🩺', desc: 'General practice, checkups',        tag: ['health'] },
    { cat: 'Pharmacy',       icon: '💊', desc: 'Medicine & health items',           tag: ['health'] },
    { cat: 'Blood Donor',    icon: '🩸', desc: 'Emergency blood coordination',      tag: ['health'] },
    { cat: 'Tuition',        icon: '📚', desc: 'School & exam coaching',            tag: ['education'] },
    { cat: 'Tailor',         icon: '🧵', desc: 'Dress, kurta & saree tailoring',    tag: ['personal'] },
    { cat: 'Mason',          icon: '🧱', desc: 'House building & plaster',          tag: ['home','repair'] },
    { cat: 'Carpenter',      icon: '🪚', desc: 'Furniture & fixings',               tag: ['home'] },
    { cat: 'Cleaner',        icon: '🧹', desc: 'Home & office cleaning',            tag: ['home'] },
    { cat: 'Food & Homestay',icon: '🍛', desc: 'Dal bhat, momo, tiffin',            tag: ['food'] },
    { cat: 'Grocery / Kirana',icon: '🛒', desc: 'Daily essentials delivery',        tag: ['food'] },
    { cat: 'Travel & Taxi',  icon: '🚕', desc: 'Airport & local rides',             tag: ['mobility'] },
    { cat: 'Legal Help',     icon: '⚖️', desc: 'Notary, documents, advice',        tag: ['gov'] },
    { cat: 'Bank & Finance', icon: '🏦', desc: 'Account help, remittance',          tag: ['gov'] },
    { cat: 'Gov Services',   icon: '🏛️', desc: 'NagariApp, ward paperwork',        tag: ['gov'] }
  ];

  const sampleServices = [
    { cat: 'Electrician', name: 'Sundar Electric Service', area: 'Baneshwor, Kathmandu', phone: '9841-232443', rating: 4.7, verified: true,  note: 'Inverter & wiring, 8am–8pm' },
    { cat: 'Electrician', name: 'Bijuli Sewa',              area: 'New Road, Kathmandu',  phone: '9851-019283', rating: 4.5, verified: false, note: 'House wiring & fan repairs' },
    { cat: 'Plumber',     name: 'Koshi Plumbing',           area: 'Pulchowk, Lalitpur',   phone: '9860-556677', rating: 4.8, verified: true,  note: 'Leak fixing, tank cleaning' },
    { cat: 'Plumber',     name: 'Panighat Plumbing',        area: 'Pokhara-6',            phone: '9846-223344', rating: 4.6, verified: false, note: '24/7 emergency calls' },
    { cat: 'Mechanic',    name: 'Himalaya Motors',          area: 'Biratnagar',           phone: '9842-112233', rating: 4.4, verified: true,  note: 'Bike & scooter service' },
    { cat: 'Doctor / Clinic', name: 'Janaswasthya Clinic',  area: 'Itahari, Sunsari',     phone: '9852-334455', rating: 4.9, verified: true,  note: 'OPD 7am–7pm, pathology' },
    { cat: 'Pharmacy',    name: 'HealthPoint Pharmacy',     area: 'Lagankhel, Lalitpur',  phone: '9841-778899', rating: 4.7, verified: true,  note: '24hr medicine delivery' },
    { cat: 'Blood Donor', name: 'Raktadan Volunteers',      area: 'Kathmandu Valley',     phone: '9801-445566', rating: 5.0, verified: true,  note: 'Free blood coordination' },
    { cat: 'Tuition',     name: 'Namaste Coaching',         area: 'Dharan',               phone: '9812-334455', rating: 4.8, verified: false, note: 'SEE & +2 maths/science' },
    { cat: 'Tailor',      name: 'Chhaya Tailors',           area: 'Asan, Kathmandu',      phone: '9841-556677', rating: 4.6, verified: false, note: 'Kurta & bridal tailoring' },
    { cat: 'Mason',       name: 'Bhim Mason & Team',        area: 'Bhairahawa',           phone: '9857-223344', rating: 4.5, verified: false, note: 'House building, plaster' },
    { cat: 'Carpenter',   name: 'Ahale Furniture',          area: 'Banepa',               phone: '9841-990011', rating: 4.7, verified: false, note: 'Custom furniture' },
    { cat: 'Cleaner',     name: 'Safa Home Cleaning',       area: 'Boudha, Kathmandu',    phone: '9808-112233', rating: 4.4, verified: false, note: 'Deep cleaning packages' },
    { cat: 'Food & Homestay', name: 'Ghar-khana Tiffin',    area: 'Putalisadak',          phone: '9841-334455', rating: 4.8, verified: true,  note: 'Weekly dal-bhat tiffin' },
    { cat: 'Grocery / Kirana', name: 'Sajha Kirana Express',area: 'Kirtipur',             phone: '9841-667788', rating: 4.6, verified: true,  note: 'Home delivery under 30 min' },
    { cat: 'Travel & Taxi', name: 'Pokhara Travels',        area: 'Pokhara Lakeside',     phone: '9846-556677', rating: 4.5, verified: true,  note: 'Airport & city rides' },
    { cat: 'Legal Help',   name: 'Kanoon Consultancy',      area: 'Baluwatar, KTM',       phone: '9851-778899', rating: 4.6, verified: true,  note: 'Notary & document help' },
    { cat: 'Bank & Finance', name: 'RemitSaathi',           area: 'Online',               phone: '9803-445566', rating: 4.7, verified: true,  note: 'Remittance & account setup' },
    { cat: 'Gov Services', name: 'NagarikSewa Help Desk',   area: 'Online',               phone: '9841-223344', rating: 4.8, verified: true,  note: 'NagariApp & certificates help' }
  ];

  const helpCats = [
    'Elderly Care', 'Child Care', 'Ride Share', 'Tool & Equipment', 'Grocery Support',
    'Tutoring', 'Blood Donation', 'Clothes & Donation', 'Pet Care', 'Emergency Aid', 'Other'
  ];

  const issueCats = [
    'Waste & Sanitation', 'Water Supply', 'Electricity & Power', 'Roads & Infrastructure',
    'Traffic & Transport', 'Air Pollution', 'Street Lighting', 'Health & Hygiene',
    'Safety & Security', 'Education', 'Flood & Drainage', 'Other'
  ];

  const loadGroups = {
    Kathmandu: 'A', Lalitpur: 'B', Bhaktapur: 'C', Pokhara: 'D', Biratnagar: 'E',
    Butwal: 'F', Hetauda: 'G', Nepalgunj: 'H', Dharan: 'I', Itahari: 'J', Birgunj: 'K'
  };

  const ticker = [
    '📍 Join your tole cleanup this Saturday in Baneshwor — gloves provided.',
    '⚡ NEA group A scheduled cut 8–10 PM in Kathmandu. Plan ahead.',
    '💧 KUKL tanker water at 6 PM for wards 4–6 in Chabahil.',
    '🩸 Blood needed: B+ at Nepal Red Cross. Contact 14200.',
    '🌧️ Heavy rain alert for Terai — avoid flooded underpasses.',
    '🎉 Dashain Tika falls on 18 Oct this year. Book your flights early!',
    '🏥 Free health camp this weekend at Patan Hospital, 9am.',
    '🚦 Heavy traffic on Ring Road 5–7 PM — use Koteshwor alternative.'
  ];

  const places = [
    { name: 'Pashupatinath Temple',   d: 'Kathmandu',   tag: 'Temple',  why: 'One of the holiest Shiva temples and a UNESCO World Heritage site.' },
    { name: 'Swayambhunath (Monkey Temple)', d: 'Kathmandu', tag: 'Heritage', why: 'Ancient stupa on a hill with 360° valley views and peaceful vibes.' },
    { name: 'Boudhanath Stupa',       d: 'Kathmandu',   tag: 'Heritage', why: 'Largest stupa in Nepal — the heart of Tibetan Buddhism.' },
    { name: 'Kathmandu Durbar Square',d: 'Kathmandu',   tag: 'Heritage', why: 'Historic palaces, Kumari (Living Goddess) and Newari architecture.' },
    { name: 'Patan Durbar Square',    d: 'Lalitpur',    tag: 'Heritage', why: 'Exquisite stone carvings and Krishna Mandir.' },
    { name: 'Bhaktapur Durbar Square',d: 'Bhaktapur',   tag: 'Heritage', why: 'Nyatapola temple, juju dhau (king curd) and pottery squares.' },
    { name: 'Phewa Lake & Sarangkot', d: 'Kaski',       tag: 'Nature',   why: 'Boating on Phewa, sunrise over Annapurna from Sarangkot, paragliding.' },
    { name: 'Annapurna Circuit',      d: 'Gandaki',     tag: 'Trek',     why: 'World-famous trek across Thorong La pass at 5,416m.' },
    { name: 'Muktinath Temple',       d: 'Mustang',     tag: 'Pilgrim',  why: 'Sacred to both Hindus and Buddhists at 3,710m with eternal flame.' },
    { name: 'Lumbini',                d: 'Rupandehi',   tag: 'Pilgrim',  why: 'Birthplace of Gautam Buddha — the garden of the world\'s peace.' },
    { name: 'Chitwan National Park',  d: 'Chitwan',     tag: 'Nature',   why: 'Jungle safaris, one-horned rhinos, crocodiles and Tharu culture.' },
    { name: 'Everest Base Camp',      d: 'Solukhumbu',  tag: 'Trek',     why: 'The ultimate trek to the foot of the world\'s highest peak.' },
    { name: 'Nagarkot',               d: 'Bhaktapur',   tag: 'View',     why: 'Panoramic Himalaya sunrise, 32km east of Kathmandu.' },
    { name: 'Dhulikhel',              d: 'Kavrepalanchok', tag: 'View',  why: 'Quiet hill town with beautiful Himalayan panorama.' },
    { name: 'Gosaikunda',             d: 'Rasuwa',      tag: 'Lake',     why: 'Sacred alpine lake at 4,380m, part of the Janai Purnima pilgrimage.' },
    { name: 'Langtang Valley',        d: 'Rasuwa',      tag: 'Trek',     why: 'Glacier valley known as the "Valley of Glaciers", close to KTM.' },
    { name: 'Manaslu Circuit',        d: 'Gorkha',      tag: 'Trek',     why: 'Remote circuit around the 8th highest peak in the world.' },
    { name: 'Rara Lake',              d: 'Mugu',        tag: 'Lake',     why: 'Nepal\'s largest lake — untouched blue beauty in Karnali.' },
    { name: 'Shey Phoksundo',         d: 'Dolpa',       tag: 'Lake',     why: 'Deep turquoise lake in a remote Buddhist land.' },
    { name: 'Bandipur',               d: 'Tanahun',     tag: 'Town',     why: 'Preserved Newari hill-town with vintage charm.' },
    { name: 'Ilam Tea Gardens',       d: 'Ilam',        tag: 'Nature',   why: 'Rolling green tea estates and Kanyam\'s misty roads.' },
    { name: 'Koshi Tappu',            d: 'Saptari',     tag: 'Nature',   why: 'Wetland bird paradise on the Koshi river.' },
    { name: 'Khaptad',                d: 'Doti / Bajhang', tag: 'Nature', why: 'Sacred plateau of meadows, forests and peace in the far-west.' },
    { name: 'Bardiya National Park',  d: 'Bardiya',     tag: 'Nature',   why: 'Wild tigers, river dolphins and pristine sal forests.' },
    { name: 'Tilaurakot',             d: 'Kapilvastu',  tag: 'Pilgrim',  why: 'Archaeological remains of the young prince Siddhartha\'s palace.' },
    { name: 'Janaki Mandir',          d: 'Dhanusha',    tag: 'Pilgrim',  why: 'Magnificent white palace-temple of goddess Sita.' }
  ];

  const foods = [
    { name: 'Dal Bhat',           desc: 'The national meal — rice, lentil soup and seasonal veg. "Dal bhat power, 24 hour!"', emoji: '🍛' },
    { name: 'Momo',               desc: 'Steamed dumplings with buff/chicken or veg, served with fiery achar.', emoji: '🥟' },
    { name: 'Newari Khaja',       desc: 'The classic Newar platter: chiura, bara, wo, chatamari and yomari.', emoji: '🥘' },
    { name: 'Sel Roti',           desc: 'Sweet ring-shaped rice bread, a must during Dashain and Tihar.', emoji: '🥯' },
    { name: 'Gundruk & Achar',    desc: 'Fermented leafy greens with spicy tomato achar — the soul of hill food.', emoji: '🥬' },
    { name: 'Yomari',             desc: 'Steamed rice-flour dumpling filled with chaku (molasses) — a winter treat.', emoji: '🫓' },
    { name: 'Juju Dhau',          desc: 'Bhaktapur\'s famous "king of yoghurt" served in clay pots.', emoji: '🥣' },
    { name: 'Dhido',              desc: 'Hearty millet/cornmeal mush, the traditional highland staple.', emoji: '🍚' },
    { name: 'Chatamari',          desc: 'Newari "Nepali pizza" — rice-flour crepe topped with egg and meat.', emoji: '🫓' },
    { name: 'Tongba',             desc: 'Warm millet beer sipped through a bamboo straw in the hills.', emoji: '🍶' }
  ];

  const languages = [
    { name: 'Nepali (नेपाली)',   note: 'Official language, written in Devanagari script.', speakers: '~44% as mother tongue' },
    { name: 'Maithili (मैथिली)', note: 'Heart of Madhesh, rich Mithila literature & art.', speakers: '~11%' },
    { name: 'Bhojpuri',          note: 'Widely spoken in the eastern Terai and Madhesh.', speakers: '~6%' },
    { name: 'Newari (नेपालभाषा)',note: 'Language of Kathmandu Valley Newar community.', speakers: '~5%' },
    { name: 'Tamang',            note: 'Spoken across central hill districts.', speakers: '~5%' },
    { name: 'Tharu',             note: 'Language of the Terai\'s indigenous Tharu people.', speakers: '~5%' },
    { name: 'Magar',             note: 'Language of Magar communities in the west.', speakers: '~3%' },
    { name: 'Limbu',             note: 'Kirat language of eastern hills.', speakers: '~1%' },
    { name: 'Rai (Kiranti)',     note: 'Family of languages in Koshi province.', speakers: '~1%' },
    { name: 'Sherpa',            note: 'Himalayan language, with Tibetan script roots.', speakers: '<1%' }
  ];

  const quickFacts = [
    { label: 'Capital',            value: 'Kathmandu' },
    { label: 'Area',               value: '147,516 km²' },
    { label: 'Population',         value: '~30.03 million' },
    { label: 'Currency',           value: 'Nepali Rupee (Rs.)' },
    { label: 'Time Zone',          value: 'UTC +5:45 (unique!)' },
    { label: 'Provinces',          value: '7' },
    { label: 'Districts',          value: '77' },
    { label: 'Local Units',        value: '753' },
    { label: 'Wards',              value: '6,743' },
    { label: 'Languages',          value: '123+ spoken' },
    { label: 'National Flower',    value: 'Rhododendron (Laligurans)' },
    { label: 'National Bird',      value: 'Danphe (Lophophorus)' },
    { label: 'National Animal',    value: 'Cow' },
    { label: 'Highest Point',      value: 'Mt. Everest 8,848m' },
    { label: 'Lowest Point',       value: 'Kechana Kalan 70m (Jhapa)' },
    { label: 'Flag',               value: 'Only non-rectangular flag' }
  ];

  const testimonials = [
    { name: 'Sita Sharma', place: 'Kathmandu', text: 'I reported a broken streetlight on my tole and it was fixed in a week. Nibourly makes the ward listen!' },
    { name: 'Ramesh Gurung', place: 'Pokhara', text: 'The load-shedding widget and AI assistant saved me during winter cuts. My neighbours love the event board.' },
    { name: 'Aarati Thapa', place: 'Biratnagar', text: 'We found blood for an emergency in 2 hours thanks to the community board. This is what "छिमेकी" means.' }
  ];

  const aiSuggestions = [
    'When is Dashain tika this year?',
    'What should I do during load shedding?',
    'List 5 earthquake safety tips.',
    'Where is the nearest blood bank to Kathmandu?',
    'Tell me about the 7 provinces of Nepal.',
    'How do I compost kitchen waste at home?',
    'Best places to visit in Gandaki province.',
    'What are the emergency numbers in Nepal?',
    'How can I help elderly neighbours?',
    'What food is famous in Bhaktapur?'
  ];

  const NBData = {
    version: '1.0.0',
    provinces: P,
    provinceList: Object.values(P),
    districts,
    districtNames: districts.map(x => x.d),
    festivals,
    emergency,
    hospitals,
    solutions,
    serviceCats,
    sampleServices,
    helpCats,
    issueCats,
    loadGroups,
    ticker,
    places,
    foods,
    languages,
    quickFacts,
    testimonials,
    aiSuggestions,
    contactHours: ['Mon–Fri 9am–5pm', 'Weekends 10am–2pm']
  };

  global.NBData = NBData;
  if (typeof module !== 'undefined' && module.exports) { module.exports = NBData; }
})(typeof window !== 'undefined' ? window : this);
