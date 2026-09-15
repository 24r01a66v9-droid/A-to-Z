function PaymentMethodScanner({ onScan, onClose }) {
  return <PaymentScanner onScan={onScan} onClose={onClose} />;
}

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, BarChart3, Check, ChevronDown, CircleDollarSign, CloudRain, Clock3,
  Camera, Leaf, MapPin, Menu, MessageCircle, Minus, PackageCheck, Phone, Plus, Radar, Search, Send, ShoppingBasket,
  Axe, Clock, KeyRound, LockKeyhole, LogIn, LogOut, Mail, Mic, MicOff, Route, ShieldCheck, Sprout, Star, Store, TrendingDown, Truck, UserRound, X, Zap
} from 'lucide-react';
import { createRoot } from 'react-dom/client';
import QRCode from 'qrcode';
import './styles.css';

const seedProduce = [
  { id: 1, name: 'Organic Vine Tomatoes', category: 'Vegetables', farmPrice: 22, middlemanPrice: 45, unit: 'kg', quantity: 146, farmer: 'Ramesh Patel', farm: 'Green Valley Organic Farm', location: 'Pune District, Maharashtra', organic: true, harvest: 'Harvested today', color: 'tomato', description: 'Sun-ripened tomatoes picked fresh at dawn, with zero synthetic pesticides.' },
  { id: 2, name: 'Farm Fresh Potatoes', category: 'Vegetables', farmPrice: 18, middlemanPrice: 32, unit: 'kg', quantity: 397, farmer: 'Gurpreet Singh', farm: 'Golden Fields Agro', location: 'Jalandhar, Punjab', organic: false, harvest: '2 days ago', color: 'potato', description: 'Firm, soil-dusted tubers direct from harvest. Perfect for boiling and roasting.' },
  { id: 3, name: 'Natural Alphonso Mangoes', category: 'Fruits', farmPrice: 450, middlemanPrice: 850, unit: 'dozen', quantity: 45, farmer: 'Subhash Sawant', farm: 'Konkan Heritage Orchards', location: 'Ratnagiri, Maharashtra', organic: true, harvest: 'Freshly picked', color: 'mango', description: 'Hand-plucked Devgad Alphonsos, naturally straw-ripened with intense sweetness.' },
  { id: 4, name: 'Crisp Shimla Apples', category: 'Fruits', farmPrice: 90, middlemanPrice: 160, unit: 'kg', quantity: 200, farmer: 'Tara Chand Verma', farm: 'Himalayan Breeze Orchard', location: 'Kotgarh, Himachal Pradesh', organic: true, harvest: '3 days ago', color: 'apple', description: 'High-altitude mountain apples with a crisp bite and sweet-tart crunch.' },
  { id: 5, name: 'Sharbati Golden Wheat', category: 'Grains', farmPrice: 38, middlemanPrice: 65, unit: 'kg', quantity: 1000, farmer: 'Balram Chouhan', farm: 'Narmada Soil Agro', location: 'Sehore, Madhya Pradesh', organic: true, harvest: 'Recent harvest', color: 'wheat', description: 'Unpolished, protein-rich grain that yields soft, sweet rotis.' },
  { id: 6, name: 'Organic Toor Dal', category: 'Pulses', farmPrice: 120, middlemanPrice: 195, unit: 'kg', quantity: 350, farmer: 'Anasuya Devi', farm: 'Gramodaya Women Farmers Co-op', location: 'Gulbarga, Karnataka', organic: true, harvest: 'Sun-dried last week', color: 'dal', description: 'Unpolished native yellow lentils with an authentic earthy aroma.' },
  { id: 7, name: 'Pure Wild Forest Honey', category: 'Honey', farmPrice: 340, middlemanPrice: 580, unit: 'kg', quantity: 60, farmer: 'Bhimrao Korva', farm: 'Satpura Tribal Bio-Reserve', location: 'Hoshangabad, Madhya Pradesh', organic: true, harvest: 'Raw and unfiltered', color: 'honey', description: 'Raw multi-flora forest honey collected by local beekeepers.' },
  { id: 8, name: 'Fresh A2 Gir Cow Milk', category: 'Dairy', farmPrice: 60, middlemanPrice: 90, unit: 'litre', quantity: 80, farmer: 'Devendra Joshi', farm: 'Gokul Desi Gaushala', location: 'Anand, Gujarat', organic: true, harvest: 'Fresh morning batch', color: 'milk', description: 'Pure grass-fed indigenous Gir cow milk, rich in natural nutrients.' },
  { id: 9, name: 'Fresh Marigold Flowers', category: 'Flowers', farmPrice: 80, middlemanPrice: 140, unit: 'kg', quantity: 120, farmer: 'Lakshmi Reddy', farm: 'Sunrise Flower Farm', location: 'Karnal, Haryana', organic: true, harvest: 'Picked this morning', color: 'flower', description: 'Bright marigolds for hotels, caterers, temples, and celebrations.' }
];

const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Honey', 'Flowers'];
const farmInputs = [
  { name: 'Neem Shield Bio-pesticide', type: 'Bio-pesticide', price: 499, discount: '15% farmer offer', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=85' },
  { name: 'Organic Soil Booster', type: 'Fertilizer', price: 699, discount: '12% farmer offer', image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=85' },
  { name: 'Drip Irrigation Starter Kit', type: 'Irrigation', price: 1299, discount: '8% direct grower offer', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=85' },
  { name: 'Native Vegetable Seed Pack', type: 'Seeds', price: 249, discount: '10% seed saver offer', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=85' },
  { name: 'Coir Mulch Cover', type: 'Soil care', price: 349, discount: '12% farmer offer', image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=800&q=85' },
  { name: 'Harvest Protection Gloves', type: 'Farm gear', price: 179, discount: '5% direct grower offer', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85' }
];
const catalogTranslations = {
  hi: {
    produce: { 1: ['जैविक बेल टमाटर', 'सब्ज़ियां', 'आज तोड़े गए', 'सुबह ताजे तोड़े गए धूप में पके टमाटर, बिना सिंथेटिक कीटनाशकों के।'], 2: ['खेत के ताजे आलू', 'सब्ज़ियां', '2 दिन पहले', 'खेत से सीधे आए मजबूत आलू, उबालने और भूनने के लिए अच्छे।'], 3: ['प्राकृतिक अल्फांसो आम', 'फल', 'अभी तोड़े गए', 'हाथ से तोड़े गए देवगढ़ अल्फांसो, प्राकृतिक रूप से पकाए गए।'], 4: ['कुरकुरे शिमला सेब', 'फल', '3 दिन पहले', 'ऊंचाई वाले बागों के मीठे और खट्टे कुरकुरे सेब।'], 5: ['शरबती सुनहरा गेहूं', 'अनाज', 'नई फसल', 'बिना पॉलिश किया प्रोटीन से भरपूर गेहूं, मुलायम रोटियों के लिए।'], 6: ['जैविक तूर दाल', 'दालें', 'पिछले सप्ताह धूप में सुखाई गई', 'बिना पॉलिश की देशी पीली दाल, मिट्टी जैसी सुगंध के साथ।'], 7: ['शुद्ध जंगली वन शहद', 'शहद', 'कच्चा और बिना छना', 'स्थानीय मधुमक्खी पालकों द्वारा इकट्ठा किया गया कच्चा वन शहद।'], 8: ['ताजा A2 गिर गाय का दूध', 'डेयरी', 'आज सुबह का बैच', 'घास पर पली देशी गिर गाय का शुद्ध दूध।'] },
    inputs: { 1: ['नीम शील्ड जैव-कीटनाशक', 'जैव-कीटनाशक'], 2: ['जैविक मिट्टी बूस्टर', 'उर्वरक'], 3: ['ड्रिप सिंचाई स्टार्टर किट', 'सिंचाई'], 4: ['देशी सब्ज़ी बीज पैक', 'बीज'], 5: ['नारियल रेशा मल्च कवर', 'मिट्टी देखभाल'], 6: ['फसल सुरक्षा दस्ताने', 'कृषि उपकरण'] }
  },
  te: {
    produce: { 1: ['సేంద్రీయ తీగ టమాటాలు', 'కూరగాయలు', 'ఈరోజు కోసినవి', 'సింథటిక్ పురుగుమందులు లేని, ఉదయం తాజాగా కోసిన టమాటాలు.'], 2: ['తాజా పొలం బంగాళాదుంపలు', 'కూరగాయలు', '2 రోజుల క్రితం', 'పొలం నుంచి నేరుగా వచ్చిన బంగాళాదుంపలు, ఉడికించడానికి మరియు కాల్చడానికి అనుకూలం.'], 3: ['సహజ అల్ఫాన్సో మామిడిపండ్లు', 'పండ్లు', 'తాజాగా కోసినవి', 'చేతితో కోసిన దేవగడ్ అల్ఫాన్సోలు, సహజంగా పండినవి.'], 4: ['కరకరలాడే సిమ్లా ఆపిల్స్', 'పండ్లు', '3 రోజుల క్రితం', 'ఎత్తైన తోటల నుంచి వచ్చిన తీపి-పులుపు కరకరలాడే ఆపిల్స్.'], 5: ['శర్బతి బంగారు గోధుమ', 'ధాన్యాలు', 'ఇటీవలి పంట', 'పాలిష్ చేయని, ప్రోటీన్ అధికంగా ఉన్న మృదువైన రొట్టెల గోధుమ.'], 6: ['సేంద్రీయ కందిపప్పు', 'పప్పులు', 'గత వారం ఎండబెట్టినది', 'పాలిష్ చేయని దేశీ పసుపు పప్పు, సహజ సువాసనతో.'], 7: ['స్వచ్ఛమైన అడవి తేనె', 'తేనె', 'ముడి మరియు వడకట్టనిది', 'స్థానిక తేనెటీగల పెంపకందారులు సేకరించిన ముడి అడవి తేనె.'], 8: ['తాజా A2 గిర్ ఆవు పాలు', 'పాల ఉత్పత్తులు', 'ఈ ఉదయం బ్యాచ్', 'గడ్డి తిన్న దేశీ గిర్ ఆవు నుంచి స్వచ్ఛమైన పాలు.'] },
    inputs: { 1: ['వేప షీల్డ్ బయో-పెస్టిసైడ్', 'బయో-పెస్టిసైడ్'], 2: ['సేంద్రీయ మట్టి బూస్టర్', 'ఎరువు'], 3: ['డ్రిప్ ఇరిగేషన్ స్టార్టర్ కిట్', 'నీటిపారుదల'], 4: ['దేశీ కూరగాయల విత్తన ప్యాక్', 'విత్తనాలు'], 5: ['కొబ్బరి పీచు మల్చ్ కవర్', 'మట్టి సంరక్షణ'], 6: ['పంట రక్షణ గ్లౌజులు', 'వ్యవసాయ పరికరాలు'] }
  },
  ta: {
    produce: { 1: ['இயற்கை கொடி தக்காளி', 'காய்கறிகள்', 'இன்று அறுவடை', 'செயற்கை பூச்சிக்கொல்லிகள் இல்லாமல் இன்று காலை பறிக்கப்பட்ட தக்காளி.'], 2: ['பண்ணை புதிய உருளைக்கிழங்கு', 'காய்கறிகள்', '2 நாட்களுக்கு முன்', 'பண்ணையில் இருந்து நேரடியாக வந்த உருளைக்கிழங்கு.'], 3: ['இயற்கை அல்போன்சோ மாம்பழம்', 'பழங்கள்', 'புதிதாக பறித்தது', 'கையால் பறிக்கப்பட்ட தேவ்கட் அல்போன்சோ மாம்பழங்கள்.'], 4: ['மொறுமொறு சிம்லா ஆப்பிள்', 'பழங்கள்', '3 நாட்களுக்கு முன்', 'மலைத் தோட்டங்களில் விளைந்த இனிப்பு-புளிப்பு ஆப்பிள்கள்.'], 5: ['ஷர்பதி தங்க கோதுமை', 'தானியங்கள்', 'சமீபத்திய அறுவடை', 'பாலிஷ் செய்யாத, புரதம் நிறைந்த கோதுமை.'], 6: ['இயற்கை துவரம் பருப்பு', 'பருப்பு வகைகள்', 'கடந்த வாரம் உலர்த்தியது', 'பாலிஷ் செய்யாத நாட்டுப் பருப்பு.'], 7: ['தூய காட்டு தேன்', 'தேன்', 'வடிகட்டாத இயற்கை தேன்', 'உள்ளூர் தேனீ வளர்ப்பாளர்கள் சேகரித்த காட்டு தேன்.'], 8: ['புதிய A2 கிர் பசும்பால்', 'பால் பொருட்கள்', 'இன்றைய காலை தொகுப்பு', 'புல் மேய்ந்த கிர் பசுவின் தூய பால்.'] },
    inputs: { 1: ['வேம்பு உயிர் பூச்சிக்கொல்லி', 'உயிர் பூச்சிக்கொல்லி'], 2: ['இயற்கை மண் ஊக்கி', 'உரம்'], 3: ['சொட்டு நீர்ப்பாசன தொடக்க கிட்', 'நீர்ப்பாசனம்'], 4: ['நாட்டு காய்கறி விதை தொகுப்பு', 'விதைகள்'], 5: ['தேங்காய் நார் மூடி', 'மண் பராமரிப்பு'], 6: ['அறுவடை பாதுகாப்பு கையுறைகள்', 'பண்ணை உபகரணம்'] }
  },
  kn: {
    produce: { 1: ['ಸಾವಯವ ಬಳ್ಳಿ ಟೊಮ್ಯಾಟೊ', 'ತರಕಾರಿಗಳು', 'ಇಂದು ಕೊಯ್ಲು', 'ಸಂಶ್ಲೇಷಿತ ಕೀಟನಾಶಕಗಳಿಲ್ಲದೆ ಬೆಳಿಗ್ಗೆ ಕೊಯ್ದ ತಾಜಾ ಟೊಮ್ಯಾಟೊ.'], 2: ['ತಾಜಾ ಹೊಲದ ಆಲೂಗಡ್ಡೆ', 'ತರಕಾರಿಗಳು', '2 ದಿನಗಳ ಹಿಂದೆ', 'ಹೊಲದಿಂದ ನೇರವಾಗಿ ಬಂದ ಆಲೂಗಡ್ಡೆ.'], 3: ['ನೈಸರ್ಗಿಕ ಅಲ್ಫಾನ್ಸೋ ಮಾವು', 'ಹಣ್ಣುಗಳು', 'ತಾಜಾ ಕೊಯ್ಲು', 'ಕೈಯಿಂದ ಕೊಯ್ದ ದೇವಗಢ ಅಲ್ಫಾನ್ಸೋ ಮಾವು.'], 4: ['ಗರಿಗರಿಯಾದ ಶಿಮ್ಲಾ ಸೇಬು', 'ಹಣ್ಣುಗಳು', '3 ದಿನಗಳ ಹಿಂದೆ', 'ಬೆಟ್ಟದ ತೋಟಗಳ ಸಿಹಿ-ಹುಳಿ ಸೇಬು.'], 5: ['ಶರ್ಬತಿ ಚಿನ್ನದ ಗೋಧಿ', 'ಧಾನ್ಯಗಳು', 'ಇತ್ತೀಚಿನ ಕೊಯ್ಲು', 'ಪಾಲಿಶ್ ಮಾಡದ, ಪ್ರೋಟೀನ್ ಸಮೃದ್ಧ ಗೋಧಿ.'], 6: ['ಸಾವಯವ ತೊಗರಿಬೇಳೆ', 'ಬೇಳೆಗಳು', 'ಕಳೆದ ವಾರ ಒಣಗಿಸಿದ', 'ಪಾಲಿಶ್ ಮಾಡದ ದೇಶೀ ಹಳದಿ ಬೇಳೆ.'], 7: ['ಶುದ್ಧ ಕಾಡು ಜೇನು', 'ಜೇನು', 'ಕಚ್ಚಾ ಮತ್ತು ಶೋಧಿಸದ', 'ಸ್ಥಳೀಯ ಜೇನು ಸಾಕಾಣಿಕೆದಾರರು ಸಂಗ್ರಹಿಸಿದ ಕಾಡು ಜೇನು.'], 8: ['ತಾಜಾ A2 ಗಿರ್ ಹಸುವಿನ ಹಾಲು', 'ಹಾಲಿನ ಉತ್ಪನ್ನಗಳು', 'ಇಂದಿನ ಬೆಳಗಿನ ಬ್ಯಾಚ್', 'ಹುಲ್ಲು ತಿಂದ ಗಿರ್ ಹಸುವಿನ ಶುದ್ಧ ಹಾಲು.'] },
    inputs: { 1: ['ಬೇವಿನ ಜೈವಿಕ ಕೀಟನಾಶಕ', 'ಜೈವಿಕ ಕೀಟನಾಶಕ'], 2: ['ಸಾವಯವ ಮಣ್ಣು ಬೂಸ್ಟರ್', 'ರಸಗೊಬ್ಬರ'], 3: ['ಡ್ರಿಪ್ ನೀರಾವರಿ ಸ್ಟಾರ್ಟರ್ ಕಿಟ್', 'ನೀರಾವರಿ'], 4: ['ಸ್ಥಳೀಯ ತರಕಾರಿ ಬೀಜ ಪ್ಯಾಕ್', 'ಬೀಜಗಳು'], 5: ['ತೆಂಗಿನ ನಾರು ಮಲ್ಚ್ ಕವರ್', 'ಮಣ್ಣಿನ ಆರೈಕೆ'], 6: ['ಕೊಯ್ಲು ರಕ್ಷಣಾ ಕೈಗವಸುಗಳು', 'ಕೃಷಿ ಉಪಕರಣ'] }
  },
  ml: {
    produce: { 1: ['ജൈവ വള്ളി തക്കാളി', 'പച്ചക്കറികൾ', 'ഇന്ന് വിളവെടുത്തത്', 'കൃത്രിമ കീടനാശിനികളില്ലാതെ ഇന്ന് രാവിലെ പറിച്ച തക്കാളി.'], 2: ['പുതിയ കൃഷിയിട ഉരുളക്കിഴങ്ങ്', 'പച്ചക്കറികൾ', '2 ദിവസം മുമ്പ്', 'കൃഷിയിടത്തിൽ നിന്ന് നേരിട്ട് എത്തിച്ച ഉരുളക്കിഴങ്ങ്.'], 3: ['സ്വാഭാവിക അൽഫോൻസോ മാമ്പഴം', 'പഴങ്ങൾ', 'പുതുതായി പറിച്ചത്', 'കൈകൊണ്ട് പറിച്ച ദേവ്ഗഡ് അൽഫോൻസോ മാമ്പഴം.'], 4: ['കറുമുറുക്കുള്ള ഷിംല ആപ്പിൾ', 'പഴങ്ങൾ', '3 ദിവസം മുമ്പ്', 'മലനിരകളിലെ തോട്ടങ്ങളിൽ നിന്നുള്ള മധുരമുള്ള ആപ്പിൾ.'], 5: ['ശർബതി സ്വർണ്ണ ഗോതമ്പ്', 'ധാന്യങ്ങൾ', 'പുതിയ വിള', 'പോളിഷ് ചെയ്യാത്ത പ്രോട്ടീൻ സമ്പന്നമായ ഗോതമ്പ്.'], 6: ['ജൈവ തുവരപ്പരിപ്പ്', 'പരിപ്പുകൾ', 'കഴിഞ്ഞ ആഴ്ച ഉണക്കിയത്', 'പോളിഷ് ചെയ്യാത്ത നാടൻ മഞ്ഞപ്പരിപ്പ്.'], 7: ['ശുദ്ധമായ കാട്ടുതേൻ', 'തേൻ', 'അസംസ്കൃതവും അരിച്ചിട്ടില്ലാത്തതും', 'പ്രാദേശിക തേനീച്ച വളർത്തുന്നവർ ശേഖരിച്ച കാട്ടുതേൻ.'], 8: ['പുതിയ A2 ഗിർ പശുവിൻ പാൽ', 'പാൽ ഉൽപ്പന്നങ്ങൾ', 'ഇന്നത്തെ രാവിലെ ബാച്ച്', 'പുല്ലുതിന്ന ഗിർ പശുവിന്റെ ശുദ്ധമായ പാൽ.'] },
    inputs: { 1: ['വേപ്പ് ജൈവ കീടനാശിനി', 'ജൈവ കീടനാശിനി'], 2: ['ജൈവ മണ്ണ് ബൂസ്റ്റർ', 'വളം'], 3: ['ഡ്രിപ്പ് ജലസേചന സ്റ്റാർട്ടർ കിറ്റ്', 'ജലസേചനം'], 4: ['നാടൻ പച്ചക്കറി വിത്ത് പാക്ക്', 'വിത്തുകൾ'], 5: ['തേങ്ങാനാര് മൾച്ച് കവർ', 'മണ്ണ് പരിചരണം'], 6: ['വിള സംരക്ഷണ കയ്യുറകൾ', 'കാർഷിക ഉപകരണങ്ങൾ'] }
  }
};
const householdLabels = { en: 'Household', hi: 'घरेलू', te: 'గృహ వినియోగం', ta: 'வீட்டு பயன்பாடு', kn: 'ಮನೆಯ ಬಳಕೆ', ml: 'ഗാർഹികം' };
const farmerHubLabels = {
  en: { kicker: 'YOUR FARM, YOUR TERMS', title: 'Farmer', accent: 'hub', intro: 'Manage your harvest, reach buyers, and source what your farm needs.', add: 'Add a listing', active: 'ACTIVE LISTINGS', revenue: 'DIRECT REVENUE', received: 'ORDERS RECEIVED', reach: 'YOUR REACH', buyers: 'buyers', harvest: 'YOUR HARVEST', listings: 'Active listings', crops: 'crops', available: 'available', incoming: 'INCOMING', recent: 'Recent orders', empty: 'No orders yet' },
  hi: { kicker: 'आपका खेत, आपकी शर्तें', title: 'किसान', accent: 'केंद्र', intro: 'अपनी फसल संभालें, खरीदारों तक पहुंचें और खेत की जरूरतों की खरीद करें।', add: 'लिस्टिंग जोड़ें', active: 'सक्रिय लिस्टिंग', revenue: 'सीधी आय', received: 'प्राप्त ऑर्डर', reach: 'आपकी पहुंच', buyers: 'खरीदार', harvest: 'आपकी फसल', listings: 'सक्रिय लिस्टिंग', crops: 'फसलें', available: 'उपलब्ध', incoming: 'आने वाले', recent: 'हाल के ऑर्डर', empty: 'अभी कोई ऑर्डर नहीं' },
  te: { kicker: 'మీ పొలం, మీ నిబంధనలు', title: 'రైతు', accent: 'కేంద్రం', intro: 'మీ పంటను నిర్వహించండి, కొనుగోలుదారులను చేరుకోండి మరియు పొలానికి కావాల్సినవి పొందండి.', add: 'లిస్టింగ్ జోడించండి', active: 'చురుకైన లిస్టింగ్‌లు', revenue: 'నేరుగా ఆదాయం', received: 'అందిన ఆర్డర్లు', reach: 'మీ పరిధి', buyers: 'కొనుగోలుదారులు', harvest: 'మీ పంట', listings: 'చురుకైన లిస్టింగ్‌లు', crops: 'పంటలు', available: 'అందుబాటులో ఉంది', incoming: 'వస్తున్నవి', recent: 'ఇటీవలి ఆర్డర్లు', empty: 'ఇంకా ఆర్డర్లు లేవు' },
  ta: { kicker: 'உங்கள் பண்ணை, உங்கள் விதிகள்', title: 'விவசாயி', accent: 'மையம்', intro: 'உங்கள் அறுவடையை நிர்வகித்து, வாங்குபவர்களை அடைந்து, பண்ணைக்குத் தேவையானவற்றைப் பெறுங்கள்.', add: 'பட்டியல் சேர்க்கவும்', active: 'செயலில் உள்ள பட்டியல்கள்', revenue: 'நேரடி வருவாய்', received: 'பெறப்பட்ட ஆர்டர்கள்', reach: 'உங்கள் அணுகல்', buyers: 'வாங்குபவர்கள்', harvest: 'உங்கள் அறுவடை', listings: 'செயலில் உள்ள பட்டியல்கள்', crops: 'பயிர்கள்', available: 'கிடைக்கும்', incoming: 'வருபவை', recent: 'சமீபத்திய ஆர்டர்கள்', empty: 'ஆர்டர்கள் எதுவும் இல்லை' },
  kn: { kicker: 'ನಿಮ್ಮ ಜಮೀನು, ನಿಮ್ಮ ನಿಯಮಗಳು', title: 'ರೈತ', accent: 'ಕೇಂದ್ರ', intro: 'ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ನಿರ್ವಹಿಸಿ, ಖರೀದಿದಾರರನ್ನು ತಲುಪಿ ಮತ್ತು ಜಮೀನಿಗೆ ಬೇಕಾದುದನ್ನು ಪಡೆಯಿರಿ.', add: 'ಪಟ್ಟಿ ಸೇರಿಸಿ', active: 'ಸಕ್ರಿಯ ಪಟ್ಟಿಗಳು', revenue: 'ನೇರ ಆದಾಯ', received: 'ಸ್ವೀಕರಿಸಿದ ಆರ್ಡರ್‌ಗಳು', reach: 'ನಿಮ್ಮ ವ್ಯಾಪ್ತಿ', buyers: 'ಖರೀದಿದಾರರು', harvest: 'ನಿಮ್ಮ ಕೊಯ್ಲು', listings: 'ಸಕ್ರಿಯ ಪಟ್ಟಿಗಳು', crops: 'ಬೆಳೆಗಳು', available: 'ಲಭ್ಯವಿದೆ', incoming: 'ಬರುತ್ತಿರುವವು', recent: 'ಇತ್ತೀಚಿನ ಆರ್ಡರ್‌ಗಳು', empty: 'ಇನ್ನೂ ಆರ್ಡರ್‌ಗಳಿಲ್ಲ' },
  ml: { kicker: 'നിങ്ങളുടെ കൃഷിയിടം, നിങ്ങളുടെ നിബന്ധനകൾ', title: 'കർഷക', accent: 'കേന്ദ്രം', intro: 'നിങ്ങളുടെ വിള നിയന്ത്രിച്ച്, വാങ്ങുന്നവരിലെത്തി, കൃഷിയിടത്തിന് ആവശ്യമായവ നേടൂ.', add: 'ലിസ്റ്റിംഗ് ചേർക്കൂ', active: 'സജീവ ലിസ്റ്റിംഗുകൾ', revenue: 'നേരിട്ടുള്ള വരുമാനം', received: 'ലഭിച്ച ഓർഡറുകൾ', reach: 'നിങ്ങളുടെ എത്തിച്ചേരൽ', buyers: 'വാങ്ങുന്നവർ', harvest: 'നിങ്ങളുടെ വിള', listings: 'സജീവ ലിസ്റ്റിംഗുകൾ', crops: 'വിളകൾ', available: 'ലഭ്യമാണ്', incoming: 'വരുന്നവ', recent: 'സമീപകാല ഓർഡറുകൾ', empty: 'ഓർഡറുകളൊന്നുമില്ല' }
};
const localizedUnits = { hi: { kg: 'किलो', dozen: 'दर्जन', litre: 'लीटर' }, te: { kg: 'కిలో', dozen: 'డజను', litre: 'లీటర్' }, ta: { kg: 'கிலோ', dozen: 'டஜன்', litre: 'லிட்டர்' }, kn: { kg: 'ಕೆಜಿ', dozen: 'ಡಜನ್', litre: 'ಲೀಟರ್' }, ml: { kg: 'കിലോ', dozen: 'ഡസൻ', litre: 'ലിറ്റർ' } };
const produceMetaTranslations = {
  hi: { 3: { farmer: 'सुभाष सावंत', farm: 'कोंकण हेरिटेज ऑर्चर्ड्स', location: 'रत्नागिरी, महाराष्ट्र' } },
  te: { 3: { farmer: 'సుభాష్ సావంత్', farm: 'కొంకణ్ హెరిటేజ్ ఆర్చర్డ్స్', location: 'రత్నగిరి, మహారాష్ట్ర' } },
  ta: { 3: { farmer: 'சுபாஷ் சாவந்த்', farm: 'கொங்கண் ஹெரிடேஜ் ஆர்ச்சர்ட்ஸ்', location: 'ரத்னகிரி, மகாராஷ்டிரா' } },
  kn: { 3: { farmer: 'ಸುಭಾಷ್ ಸಾವಂತ್', farm: 'ಕೊಂಕಣ್ ಹೆರಿಟೇಜ್ ಆರ್ಚರ್ಡ್ಸ್', location: 'ರತ್ನಗಿರಿ, ಮಹಾರಾಷ್ಟ್ರ' } },
  ml: { 3: { farmer: 'സുഭാഷ് സാവന്ത്', farm: 'കൊങ്കൺ ഹെറിറ്റേജ് ഓർച്ചാർഡ്സ്', location: 'രത്നഗിരി, മഹാരാഷ്ട്ര' } }
};
function localizeProduce(item, language) { const translated = catalogTranslations[language]?.produce?.[item.id]; const metadata = produceMetaTranslations[language]?.[item.id]; return translated ? { ...item, name: translated[0], category: translated[1], harvest: translated[2], description: translated[3], ...metadata, unitLabel: localizedUnits[language]?.[item.unit] || item.unit } : item; }
function localizeInput(input, index, language) { const translated = catalogTranslations[language]?.inputs?.[index + 1]; return translated ? { ...input, name: translated[0], type: translated[1] } : input; }
const buyerTypes = ['Household', 'Caterer', 'Supermarket', 'Hotel'];
const deliveryPartners = ['Anil Kumar', 'Meena Logistics', 'GreenRoute Partner'];
const partnerOffers = { 'Anil Kumar': '10% fuel bonus', 'Meena Logistics': 'Free first stop', 'GreenRoute Partner': '15% route offer' };
const partnerLocations = { 'Anil Kumar': { lat: 17.385, lng: 78.4867 }, 'Meena Logistics': { lat: 17.42, lng: 78.45 }, 'GreenRoute Partner': { lat: 17.31, lng: 78.52 } };
const deliveryChargePerKm = 20;
const produceImages = {
  1: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85',
  2: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=85',
  3: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=85',
  4: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85',
  5: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85',
  6: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=85',
  7: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85',
  8: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=85'
};
const money = (value) => `₹${value.toLocaleString('en-IN')}`;
const UPI_ID = import.meta.env.VITE_UPI_ID || 'farmersatoz@upi';
const paymentAppLink = (method, amount) => method === 'PhonePe' ? `phonepe://pay?pa=${UPI_ID}&pn=Farmers%20A%20to%20Z&am=${amount}&cu=INR` : method === 'Google Pay' ? `tez://upi/pay?pa=${UPI_ID}&pn=Farmers%20A%20to%20Z&am=${amount}&cu=INR` : '';
const openPaymentApp = (method, amount) => { const link = paymentAppLink(method, amount); if (!link) return; const anchor = document.createElement('a'); anchor.href = link; anchor.target = '_self'; anchor.rel = 'noopener'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); };
const whatsappLink = (phone, message = '') => `https://wa.me/${phone.replace(/\D/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
const speechRecognition = () => window.SpeechRecognition || window.webkitSpeechRecognition;
const distanceBetween = (from, to) => { if (!from || !to) return Number.POSITIVE_INFINITY; const radians = (value) => value * Math.PI / 180; const latDelta = radians(to.lat - from.lat); const lngDelta = radians(to.lng - from.lng); const area = Math.sin(latDelta / 2) ** 2 + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(lngDelta / 2) ** 2; return 6371 * 2 * Math.atan2(Math.sqrt(area), Math.sqrt(1 - area)); };
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const LanguageContext = createContext(null);
const translations = {
  en: { marketplace: 'Marketplace', radar: 'Demand Radar', calculator: 'Zero cut', orders: 'Orders', farmer: 'Farmer hub', consumer: 'Consumer', farmerRole: 'Farmer', login: 'Log in', directSource: 'DIRECT FROM THE SOURCE', goodFood: 'Good food.', fairlyPriced: 'Fairly priced.', explore: 'Explore the harvest', weeklyHarvest: 'THE WEEKLY HARVEST', findStaple: 'Find your next staple', searchProduce: 'Search produce, farms, or places', radarKicker: 'AI-POWERED MARKET SIGNALS', demandRadar: 'Demand radar', demandIntro: 'See where demand is rising before you plant, price, or move your harvest.', liveSignals: 'LIVE SIGNALS', searchDemand: 'Search a produce to see demand...', aiSearch: 'AI SEARCH', telanganaNetwork: 'TELANGANA NETWORK', demandAcross: 'Demand across the state', aiReadout: 'AI READOUT', growNext: 'What to grow next', noSignal: 'No matching demand signal yet', tryTracked: 'Try one of the tracked crops to see a live market recommendation.', low: 'Low', medium: 'Medium', high: 'High' },
  hi: { marketplace: 'बाज़ार', radar: 'मांग रडार', calculator: 'बिचौलिया मुक्त', orders: 'ऑर्डर', farmer: 'किसान केंद्र', consumer: 'ग्राहक', farmerRole: 'किसान', login: 'लॉग इन', directSource: 'सीधे खेत से', goodFood: 'अच्छा खाना।', fairlyPriced: 'उचित कीमत पर।', explore: 'फसल देखें', weeklyHarvest: 'साप्ताहिक फसल', findStaple: 'अपनी अगली फसल खोजें', searchProduce: 'फसल, खेत या जगह खोजें', radarKicker: 'एआई बाज़ार संकेत', demandRadar: 'मांग रडार', demandIntro: 'बोने, कीमत तय करने या फसल भेजने से पहले बढ़ती मांग देखें।', liveSignals: 'लाइव संकेत', searchDemand: 'मांग देखने के लिए फसल खोजें...', aiSearch: 'एआई खोज', telanganaNetwork: 'तेलंगाना नेटवर्क', demandAcross: 'राज्य में मांग', aiReadout: 'एआई जानकारी', growNext: 'अगली फसल क्या उगाएं', noSignal: 'कोई मिलती मांग नहीं मिली', tryTracked: 'लाइव सुझाव के लिए सूचीबद्ध फसल खोजें।', low: 'कम', medium: 'मध्यम', high: 'अधिक' },
  te: { marketplace: 'మార్కెట్', radar: 'డిమాండ్ రాడార్', calculator: 'మధ్యవర్తులు లేరు', orders: 'ఆర్డర్లు', farmer: 'రైతు కేంద్రం', consumer: 'వినియోగదారు', farmerRole: 'రైతు', login: 'లాగిన్', directSource: 'పొలం నుంచే నేరుగా', goodFood: 'మంచి ఆహారం.', fairlyPriced: 'న్యాయమైన ధరలో.', explore: 'పంటను చూడండి', weeklyHarvest: 'ఈ వారం పంట', findStaple: 'మీకు కావాల్సిన పంటను కనుగొనండి', searchProduce: 'పంట, పొలం లేదా ప్రాంతాన్ని వెతకండి', radarKicker: 'ఏఐ మార్కెట్ సంకేతాలు', demandRadar: 'డిమాండ్ రాడార్', demandIntro: 'విత్తే ముందు, ధర నిర్ణయించే ముందు లేదా పంటను పంపే ముందు పెరుగుతున్న డిమాండ్‌ను చూడండి.', liveSignals: 'లైవ్ సంకేతాలు', searchDemand: 'డిమాండ్ చూడటానికి పంటను వెతకండి...', aiSearch: 'ఏఐ శోధన', telanganaNetwork: 'తెలంగాణ నెట్‌వర్క్', demandAcross: 'రాష్ట్రవ్యాప్తంగా డిమాండ్', aiReadout: 'ఏఐ సమాచారం', growNext: 'తర్వాత ఏ పంట పండించాలి', noSignal: 'సరిపోలే డిమాండ్ సంకేతం లేదు', tryTracked: 'లైవ్ సూచన కోసం అందుబాటులో ఉన్న పంటను వెతకండి.', low: 'తక్కువ', medium: 'మధ్యస్థం', high: 'ఎక్కువ' }
};
Object.assign(translations, {
  ta: { marketplace: 'சந்தை', radar: 'தேவை ரேடார்', calculator: 'இடைத்தரகர் இல்லை', orders: 'ஆர்டர்கள்', farmer: 'விவசாய மையம்', consumer: 'வாடிக்கையாளர்', farmerRole: 'விவசாயி', login: 'உள்நுழை', directSource: 'வயலில் இருந்து நேரடியாக', goodFood: 'நல்ல உணவு.', fairlyPriced: 'நியாயமான விலையில்.', explore: 'அறுவடையை காண்க', weeklyHarvest: 'வாராந்திர அறுவடை', findStaple: 'உங்கள் அடுத்த விளைபொருளை கண்டறியுங்கள்', searchProduce: 'விளைபொருள், பண்ணை அல்லது இடத்தை தேடுங்கள்', radarKicker: 'AI சந்தை சிக்னல்கள்', demandRadar: 'தேவை ரேடார்', demandIntro: 'விதைப்பதற்கு முன், விலை நிர்ணயிப்பதற்கு முன் அல்லது அறுவடையை அனுப்புவதற்கு முன் அதிகரிக்கும் தேவையை காணுங்கள்.', liveSignals: 'நேரடி சிக்னல்கள்', searchDemand: 'தேவையை காண விளைபொருளை தேடுங்கள்...', aiSearch: 'AI தேடல்', demandAcross: 'மாநிலம் முழுவதும் தேவை', aiReadout: 'AI தகவல்', growNext: 'அடுத்து என்ன பயிரிடலாம்', noSignal: 'பொருந்தும் தேவை சிக்னல் இல்லை', tryTracked: 'நேரடி பரிந்துரைக்கு பட்டியலில் உள்ள பயிரை தேடுங்கள்.', low: 'குறைவு', medium: 'நடுத்தரம்', high: 'அதிகம்' },
  kn: { marketplace: 'ಮಾರುಕಟ್ಟೆ', radar: 'ಬೇಡಿಕೆ ರೇಡಾರ್', calculator: 'ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲ', orders: 'ಆರ್ಡರ್‌ಗಳು', farmer: 'ರೈತ ಕೇಂದ್ರ', consumer: 'ಗ್ರಾಹಕ', farmerRole: 'ರೈತ', login: 'ಲಾಗಿನ್', directSource: 'ಜಮೀನಿನಿಂದ ನೇರವಾಗಿ', goodFood: 'ಉತ್ತಮ ಆಹಾರ.', fairlyPriced: 'ನ್ಯಾಯವಾದ ಬೆಲೆಯಲ್ಲಿ.', explore: 'ಬೆಳೆ ನೋಡಿ', weeklyHarvest: 'ವಾರದ ಕೊಯ್ಲು', findStaple: 'ನಿಮ್ಮ ಮುಂದಿನ ಬೆಳೆಯನ್ನು ಹುಡುಕಿ', searchProduce: 'ಬೆಳೆ, ಜಮೀನು ಅಥವಾ ಸ್ಥಳ ಹುಡುಕಿ', radarKicker: 'AI ಮಾರುಕಟ್ಟೆ ಸೂಚನೆಗಳು', demandRadar: 'ಬೇಡಿಕೆ ರೇಡಾರ್', demandIntro: 'ಬಿತ್ತನೆ, ಬೆಲೆ ನಿಗದಿ ಅಥವಾ ಬೆಳೆ ಸಾಗಣೆಗೆ ಮೊದಲು ಹೆಚ್ಚುತ್ತಿರುವ ಬೇಡಿಕೆಯನ್ನು ನೋಡಿ.', liveSignals: 'ನೇರ ಸೂಚನೆಗಳು', searchDemand: 'ಬೇಡಿಕೆ ನೋಡಲು ಬೆಳೆಯನ್ನು ಹುಡುಕಿ...', aiSearch: 'AI ಹುಡುಕಾಟ', demandAcross: 'ರಾಜ್ಯಾದ್ಯಂತ ಬೇಡಿಕೆ', aiReadout: 'AI ಮಾಹಿತಿ', growNext: 'ಮುಂದೆ ಏನು ಬೆಳೆಯಬೇಕು', noSignal: 'ಹೊಂದುವ ಬೇಡಿಕೆ ಸೂಚನೆ ಇಲ್ಲ', tryTracked: 'ನೇರ ಶಿಫಾರಸಿಗಾಗಿ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಬೆಳೆಯನ್ನು ಹುಡುಕಿ.', low: 'ಕಡಿಮೆ', medium: 'ಮಧ್ಯಮ', high: 'ಹೆಚ್ಚು' },
  ml: { marketplace: 'വിപണി', radar: 'ഡിമാൻഡ് റഡാർ', calculator: 'ഇടനിലക്കാരില്ല', orders: 'ഓർഡറുകൾ', farmer: 'കർഷക കേന്ദ്രം', consumer: 'ഉപഭോക്താവ്', farmerRole: 'കർഷകൻ', login: 'ലോഗിൻ', directSource: 'കൃഷിയിടത്തിൽ നിന്ന് നേരിട്ട്', goodFood: 'നല്ല ഭക്ഷണം.', fairlyPriced: 'ന്യായമായ വിലയിൽ.', explore: 'വിള കാണുക', weeklyHarvest: 'ആഴ്ചയിലെ വിള', findStaple: 'നിങ്ങളുടെ അടുത്ത വിള കണ്ടെത്തുക', searchProduce: 'വിള, കൃഷിയിടം അല്ലെങ്കിൽ സ്ഥലം തിരയുക', radarKicker: 'AI വിപണി സൂചനകൾ', demandRadar: 'ഡിമാൻഡ് റഡാർ', demandIntro: 'നടുന്നതിന് മുമ്പും വില നിശ്ചയിക്കുന്നതിന് മുമ്പും വിള അയയ്ക്കുന്നതിന് മുമ്പും ഉയരുന്ന ആവശ്യം കാണുക.', liveSignals: 'തത്സമയ സൂചനകൾ', searchDemand: 'ഡിമാൻഡ് കാണാൻ വിള തിരയുക...', aiSearch: 'AI തിരയൽ', demandAcross: 'സംസ്ഥാനത്തുടനീളമുള്ള ഡിമാൻഡ്', aiReadout: 'AI വിവരം', growNext: 'അടുത്തതായി എന്ത് വളർത്തണം', noSignal: 'പൊരുത്തപ്പെടുന്ന ഡിമാൻഡ് സൂചനയില്ല', tryTracked: 'തത്സമയ ശുപാർശയ്ക്കായി പട്ടികയിലെ വിള തിരയുക.', low: 'കുറവ്', medium: 'ഇടത്തരം', high: 'കൂടുതൽ' }
});
const retailConnectTranslations = {
  en: { nav: 'Retail Connect', kicker: 'FARM TO RETAIL, DIRECT', title: 'Build better', titleAccent: 'farm connections.', intro: 'Retailers can discover reliable growers, discuss supply, and buy closer to the source.', status: 'OPEN TO RETAILERS', directory: 'GROWER DIRECTORY', ready: 'Farmers ready to supply', active: 'active growers', message: 'Message', conversation: 'DIRECT CONVERSATION', start: 'Start a supply conversation', ask: 'Ask about quantity, delivery, or a recurring order...', send: 'Send supply request', sent: 'Message sent to', select: 'Select a farmer to discuss supply, pricing, and delivery directly.', available: 'available', call: 'Call' },
  hi: { nav: 'खुदरा संपर्क', kicker: 'खेत से खुदरा तक, सीधे', title: 'बेहतर', titleAccent: 'किसान संपर्क बनाएं।', intro: 'खुदरा विक्रेता भरोसेमंद किसानों को खोज सकते हैं, आपूर्ति पर चर्चा कर सकते हैं और स्रोत के करीब खरीद सकते हैं।', status: 'खुदरा विक्रेताओं के लिए खुला', directory: 'किसान निर्देशिका', ready: 'आपूर्ति के लिए तैयार किसान', active: 'सक्रिय किसान', message: 'संदेश', conversation: 'सीधी बातचीत', start: 'आपूर्ति पर बातचीत शुरू करें', ask: 'मात्रा, डिलीवरी या नियमित ऑर्डर के बारे में पूछें...', send: 'आपूर्ति अनुरोध भेजें', sent: 'संदेश भेजा गया:', select: 'आपूर्ति, कीमत और डिलीवरी पर सीधे चर्चा करने के लिए किसान चुनें।', available: 'उपलब्ध', call: 'कॉल करें' },
  te: { nav: 'రిటైల్ కనెక్ట్', kicker: 'పొలం నుంచి రిటైల్‌కు, నేరుగా', title: 'మెరుగైన', titleAccent: 'రైతు అనుబంధాలు నిర్మించండి.', intro: 'రిటైలర్లు నమ్మకమైన రైతులను కనుగొని, సరఫరాపై చర్చించి, మూలానికి దగ్గరగా కొనుగోలు చేయవచ్చు.', status: 'రిటైలర్లకు అందుబాటులో ఉంది', directory: 'రైతుల డైరెక్టరీ', ready: 'సరఫరాకు సిద్ధంగా ఉన్న రైతులు', active: 'చురుకైన రైతులు', message: 'సందేశం', conversation: 'నేరుగా సంభాషణ', start: 'సరఫరా గురించి సంభాషణ ప్రారంభించండి', ask: 'పరిమాణం, డెలివరీ లేదా పునరావృత ఆర్డర్ గురించి అడగండి...', send: 'సరఫరా అభ్యర్థన పంపండి', sent: 'సందేశం పంపబడింది:', select: 'సరఫరా, ధరలు మరియు డెలివరీ గురించి నేరుగా చర్చించడానికి రైతును ఎంచుకోండి.', available: 'అందుబాటులో ఉంది', call: 'కాల్ చేయండి' },
  ta: { nav: 'சில்லறை இணைப்பு', kicker: 'பண்ணையிலிருந்து சில்லறைக்கு, நேரடியாக', title: 'சிறந்த', titleAccent: 'பண்ணைத் தொடர்புகளை உருவாக்குங்கள்.', intro: 'சில்லறை விற்பனையாளர்கள் நம்பகமான விவசாயிகளைக் கண்டறிந்து, விநியோகம் குறித்து பேசி, மூலத்திற்கு அருகில் வாங்கலாம்.', status: 'சில்லறை விற்பனையாளர்களுக்கு திறந்துள்ளது', directory: 'விவசாயிகள் அடைவு', ready: 'விநியோகத்திற்குத் தயாரான விவசாயிகள்', active: 'செயலில் உள்ள விவசாயிகள்', message: 'செய்தி', conversation: 'நேரடி உரையாடல்', start: 'விநியோகம் குறித்து உரையாடலைத் தொடங்குங்கள்', ask: 'அளவு, விநியோகம் அல்லது தொடர் ஆர்டர் பற்றி கேளுங்கள்...', send: 'விநியோகக் கோரிக்கையை அனுப்புங்கள்', sent: 'செய்தி அனுப்பப்பட்டது:', select: 'விநியோகம், விலை மற்றும் விநியோகம் குறித்து நேரடியாகப் பேச ஒரு விவசாயியைத் தேர்ந்தெடுக்கவும்.', available: 'கிடைக்கும்', call: 'அழைக்கவும்' },
  kn: { nav: 'ಚಿಲ್ಲರೆ ಸಂಪರ್ಕ', kicker: 'ಜಮೀನಿನಿಂದ ಚಿಲ್ಲರೆಗೆ, ನೇರವಾಗಿ', title: 'ಉತ್ತಮ', titleAccent: 'ರೈತ ಸಂಪರ್ಕಗಳನ್ನು ನಿರ್ಮಿಸಿ.', intro: 'ಚಿಲ್ಲರೆ ವ್ಯಾಪಾರಿಗಳು ವಿಶ್ವಾಸಾರ್ಹ ರೈತರನ್ನು ಕಂಡುಹಿಡಿದು, ಪೂರೈಕೆಯ ಕುರಿತು ಚರ್ಚಿಸಿ, ಮೂಲದ ಹತ್ತಿರದಿಂದ ಖರೀದಿಸಬಹುದು.', status: 'ಚಿಲ್ಲರೆ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಮುಕ್ತವಾಗಿದೆ', directory: 'ರೈತರ ಡೈರೆಕ್ಟರಿ', ready: 'ಪೂರೈಕೆಗೆ ಸಿದ್ಧರಾಗಿರುವ ರೈತರು', active: 'ಸಕ್ರಿಯ ರೈತರು', message: 'ಸಂದೇಶ', conversation: 'ನೇರ ಸಂಭಾಷಣೆ', start: 'ಪೂರೈಕೆಯ ಕುರಿತು ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಿ', ask: 'ಪ್ರಮಾಣ, ವಿತರಣೆ ಅಥವಾ ಮರುಕಳಿಸುವ ಆರ್ಡರ್ ಬಗ್ಗೆ ಕೇಳಿ...', send: 'ಪೂರೈಕೆ ವಿನಂತಿ ಕಳುಹಿಸಿ', sent: 'ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ:', select: 'ಪೂರೈಕೆ, ಬೆಲೆ ಮತ್ತು ವಿತರಣೆಯ ಕುರಿತು ನೇರವಾಗಿ ಚರ್ಚಿಸಲು ರೈತರನ್ನು ಆಯ್ಕೆಮಾಡಿ.', available: 'ಲಭ್ಯವಿದೆ', call: 'ಕರೆ ಮಾಡಿ' },
  ml: { nav: 'റീട്ടെയിൽ കണക്ട്', kicker: 'കൃഷിയിടത്തിൽ നിന്ന് റീട്ടെയിലിലേക്ക്, നേരിട്ട്', title: 'മികച്ച', titleAccent: 'കർഷക ബന്ധങ്ങൾ സൃഷ്ടിക്കൂ.', intro: 'റീട്ടെയിൽ വ്യാപാരികൾക്ക് വിശ്വസനീയരായ കർഷകരെ കണ്ടെത്തി, വിതരണത്തെക്കുറിച്ച് സംസാരിച്ച്, ഉറവിടത്തോട് അടുത്ത് വാങ്ങാം.', status: 'റീട്ടെയിൽ വ്യാപാരികൾക്കായി തുറന്നിരിക്കുന്നു', directory: 'കർഷക ഡയറക്ടറി', ready: 'വിതരണത്തിന് തയ്യാറായ കർഷകർ', active: 'സജീവ കർഷകർ', message: 'സന്ദേശം', conversation: 'നേരിട്ടുള്ള സംഭാഷണം', start: 'വിതരണ സംഭാഷണം ആരംഭിക്കൂ', ask: 'അളവ്, ഡെലിവറി അല്ലെങ്കിൽ ആവർത്തിച്ചുള്ള ഓർഡർ ചോദിക്കൂ...', send: 'വിതരണ അഭ്യർത്ഥന അയയ്ക്കൂ', sent: 'സന്ദേശം അയച്ചു:', select: 'വിതരണം, വില, ഡെലിവറി എന്നിവയെക്കുറിച്ച് നേരിട്ട് സംസാരിക്കാൻ ഒരു കർഷകനെ തിരഞ്ഞെടുക്കൂ.', available: 'ലഭ്യമാണ്', call: 'വിളിക്കൂ' }
};
function LanguageProvider({ children }) { const [language, setLanguage] = useState(() => load('farmdirect-language', 'en')); const changeLanguage = (value) => { setLanguage(value); localStorage.setItem('farmdirect-language', value); }; const t = (key) => translations[language]?.[key] || translations.en[key] || key; return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>{children}</LanguageContext.Provider>; }
function useLanguage() { return useContext(LanguageContext); }

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [produce, setProduce] = useState(() => load('farmdirect-produce', seedProduce));
  const [orders, setOrders] = useState(() => load('farmdirect-orders', []));
  const [tab, setTab] = useState('market');
  const [role, setRole] = useState(() => { const storedRole = load('farmdirect-role', load('farmdirect-user', null)?.role || 'consumer'); return storedRole === 'admin' ? 'consumer' : storedRole; });
  const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [buyerType, setBuyerType] = useState('Household');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [voiceListingName, setVoiceListingName] = useState('');
  const [currentUser, setCurrentUser] = useState(() => { const storedUser = load('farmdirect-user', null); return storedUser?.role === 'admin' ? null : storedUser; });
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [cart, setCart] = useState([]);
  useEffect(() => localStorage.setItem('farmdirect-produce', JSON.stringify(produce)), [produce]);
  useEffect(() => localStorage.setItem('farmdirect-orders', JSON.stringify(orders)), [orders]);
  useEffect(() => {
    const handleDeliveryUpdate = (event) => updateDeliveryOrder(event.detail.id, event.detail.changes);
    window.addEventListener('farmdirect-delivery-update', handleDeliveryUpdate);
    return () => window.removeEventListener('farmdirect-delivery-update', handleDeliveryUpdate);
  });
  useEffect(() => {
    if (tab !== 'farmer') return;
    const text = farmerHubLabels[language] || farmerHubLabels.en;
    const setText = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value; };
    setText('.farmer-header .eyebrow', text.kicker);
    setText('.farmer-header h1', `${text.title} ${text.accent}`);
    setText('.farmer-header p', text.intro);
    setText('.farmer-header .primary-button', text.add);
    document.querySelectorAll('.dashboard-stats small').forEach((element, index) => { element.textContent = [text.active, text.revenue, text.received, text.reach][index] || element.textContent; });
    const reach = document.querySelector('.dashboard-stats > div:nth-child(4) strong');
    if (reach) reach.textContent = `${new Set(orders.map((order) => order.buyer)).size || 0} ${text.buyers}`;
    const panels = document.querySelectorAll('.hub-grid .hub-panel');
    if (panels[0]) { setText('.hub-grid .hub-panel:nth-child(1) .eyebrow', text.harvest); setText('.hub-grid .hub-panel:nth-child(1) h2', text.listings); setText('.hub-grid .hub-panel:nth-child(1) .panel-heading > span', `${produce.length} ${text.crops}`); }
    if (panels[1]) { setText('.hub-grid .hub-panel:nth-child(2) .eyebrow', text.incoming); setText('.hub-grid .hub-panel:nth-child(2) h2', text.recent); }
    const empty = document.querySelector('.hub-panel.incoming .mini-empty');
    if (empty) empty.lastChild.textContent = ` ${text.empty}`;
    document.querySelectorAll('.listing-row').forEach((row, index) => { const item = localizeProduce(produce[index], language); const name = row.querySelector('strong'); const details = row.querySelector('span'); if (name) name.textContent = item.name; if (details) details.textContent = `${item.quantity} ${item.unitLabel || item.unit} ${text.available} · ${money(item.farmPrice)}/${item.unitLabel || item.unit}`; });
  }, [language, tab, produce, orders]);
  const filtered = useMemo(() => produce.filter((item) => {
       const haystack = `${item.name} ${item.farmer} ${item.location} ${item.category}`.toLowerCase();
    return (category === 'All' || item.category === category) && haystack.includes(query.toLowerCase());
       }), [produce, query, category]);
  const placeOrder = (item, quantity, buyer, address, distanceKm, deliveryWindow, paymentMethod, buyerType) => {
    const placedAt = new Date();
    const deliveryCharge = distanceKm * deliveryChargePerKm;
    const order = { id: Date.now(), itemId: item.id, name: item.name, photo: item.photo || produceImages[item.id] || '', farm: item.farm, farmer: item.farmer, quantity, unit: item.unit, weightKg: item.unit === 'kg' ? quantity : quantity * 5, total: item.farmPrice * quantity + deliveryCharge, productTotal: item.farmPrice * quantity, deliveryCharge, distanceKm, middlemanTotal: item.middlemanPrice * quantity, savings: (item.middlemanPrice - item.farmPrice) * quantity, buyer, buyerType, address, deliveryWindow, paymentMethod, pickup: { lat: 17.385, lng: 78.4867 }, dropoff: { lat: 17.41, lng: 78.47 }, placedAt: placedAt.toISOString(), date: placedAt.toLocaleDateString('en-IN'), estimatedDelivery: deliveryWindow === '30 minutes' ? new Date(placedAt.getTime() + 30 * 60000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : deliveryWindow, status: 'Awaiting assignment', partner: '' };
    setOrders((current) => [order, ...current]);
    void confirmDelivery(order);
    setProduce((current) => current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity - quantity } : entry));
    setSelected(null); setTab('orders');
    if (paymentMethod !== 'Cash on Delivery') setTimeout(() => openPaymentApp(paymentMethod, item.farmPrice * quantity + deliveryCharge), 150);
  };
  const checkoutCart = (items, buyer, address, distanceKm, deliveryWindow, paymentMethod, buyerType) => {
    const placedAt = new Date();
    const deliveryCharge = distanceKm * deliveryChargePerKm;
    const paymentAmount = items.reduce((sum, item) => sum + (item.farmPrice || item.price || 0) * (item.cartQuantity || 1), 0) + deliveryCharge;
    const newOrders = items.map((item, index) => {
      const unitPrice = item.farmPrice || item.price || 0;
      const marketPrice = item.middlemanPrice || unitPrice;
      const quantity = item.cartQuantity || 1;
      return { id: Date.now() + index, itemId: item.id, name: item.name, photo: item.photo || produceImages[item.id] || '', farm: item.farm || 'FarmDirect Inputs', farmer: item.farmer || 'FarmDirect Network', quantity, unit: item.unit || 'item', weightKg: item.unit === 'kg' ? quantity : quantity * 5, total: unitPrice * quantity + deliveryCharge, productTotal: unitPrice * quantity, deliveryCharge, distanceKm, middlemanTotal: marketPrice * quantity, savings: Math.max(0, marketPrice - unitPrice) * quantity, buyer, buyerType, address, deliveryWindow, paymentMethod, pickup: { lat: 17.385, lng: 78.4867 }, dropoff: { lat: 17.41, lng: 78.47 }, placedAt: placedAt.toISOString(), date: placedAt.toLocaleDateString('en-IN'), estimatedDelivery: deliveryWindow, status: 'Awaiting assignment', partner: '' };
    });
    setOrders((current) => [...newOrders, ...current]);
    setCart([]);
    setTab('orders');
    if (paymentMethod !== 'Cash on Delivery') setTimeout(() => openPaymentApp(paymentMethod, paymentAmount), 150);
  };
  const addListing = (listing) => { setProduce((current) => [{ ...listing, id: Date.now(), color: 'leaf' }, ...current]); setShowAdd(false); setTab('farmer'); };
  const updateDeliveryOrder = (id, changes) => setOrders((current) => current.map((order) => order.id === id ? { ...order, ...changes } : order));
  const confirmDelivery = async (order) => { try { const response = await fetch(`${import.meta.env.VITE_DELIVERY_API_URL || 'http://localhost:8787'}/api/orders/${order.id}/confirm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }); if (!response.ok) return; const result = await response.json(); setOrders((current) => current.map((entry) => entry.id === order.id ? { ...entry, assignmentId: result.assignment.id, deliveryStatus: result.assignment.status, vehicleRecommendation: result.assignment.vehicleRecommendation } : entry)); } catch { return; } };
  const handleAuth = (user) => { const nextRole = user.role === 'delivery' ? 'delivery' : user.role === 'farmer' ? 'farmer' : 'consumer'; setCurrentUser({ ...user, role: nextRole }); setRole(nextRole); localStorage.setItem('farmdirect-user', JSON.stringify({ ...user, role: nextRole })); localStorage.setItem('farmdirect-role', nextRole); setShowAuth(false); setTab(nextRole === 'delivery' ? 'operations' : nextRole === 'farmer' ? 'farmer' : 'market'); };
  const handleLogout = () => { setCurrentUser(null); localStorage.removeItem('farmdirect-user'); localStorage.removeItem('farmdirect-role'); setRole('consumer'); setTab('market'); };
  const requireLogin = (action) => { if (!currentUser) { setAuthMode('login'); setShowAuth(true); return; } action(); };
  const addToCart = (item) => setCart((current) => [...current, { ...item, cartId: `${item.id}-${Date.now()}`, cartQuantity: 1 }]);
  const handleProduceSelect = (item) => requireLogin(() => setSelected({ ...item, buyerType }));
  const handleRoleChange = () => { if (role === 'admin' || role === 'delivery') return; const nextRole = role === 'consumer' ? 'farmer' : 'consumer'; setRole(nextRole); localStorage.setItem('farmdirect-role', nextRole); setTab(nextRole === 'farmer' ? 'farmer' : 'market'); };
  const navItems = role === 'delivery'
    ? [['operations', 'Delivery dashboard', Truck]]
    : role === 'farmer'
    ? [['farmer', t('farmer'), Sprout], ['add-listing', 'Add produce', Plus], ['inputs', 'Farm inputs', Store], ['radar', t('radar'), Radar], ['orders', t('orders'), Truck], ['reviews', 'Reviews', Star]]
    : [['market', householdLabels[language] || householdLabels.en, Store], ['radar', t('radar'), Radar], ['connect', retailConnectTranslations[language].nav, MessageCircle], ['orders', t('orders'), Truck], ['reviews', 'Reviews', Star]];
  return <div className="app-shell">
    <header className="topbar"><div className="brand" onClick={() => setTab(role === 'delivery' ? 'operations' : role === 'farmer' ? 'farmer' : 'market')}><div className="brand-mark farmer-logo" aria-label="Indian farmer logo"><span role="img" aria-label="Indian farmer">👨🏾‍🌾</span></div><span>Farmers <span>A to Z</span></span></div><nav className="desktop-nav">{navItems.map(([key, label, Icon]) => <button className={tab === key ? 'active' : ''} key={key} onClick={() => key === 'add-listing' ? setShowAdd(true) : setTab(key)}><Icon size={17} />{label}{key === 'orders' && orders.length > 0 && <b className="nav-count">{orders.length}</b>}</button>)}</nav><div className="top-actions"><label className="language-switcher"><span> भाषा / భాష</span><select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Choose language"><option value="en">English</option><option value="hi">हिन्दी</option><option value="te">తెలుగు</option><option value="ta">தமிழ்</option><option value="kn">ಕನ್ನಡ</option><option value="ml">മലയാളം</option></select></label><button className="cart-button" onClick={() => requireLogin(() => setTab('cart'))} title="Open cart"><ShoppingBasket size={16} /><span>Cart</span>{cart.length > 0 && <b>{cart.length}</b>}</button><button className={`role-switch ${role}-mode`} onClick={handleRoleChange} aria-label={`Switch to ${role === 'consumer' ? 'farmer' : 'consumer'} mode`}><UserRound size={15} /><span>{role === 'consumer' ? 'Consumer mode' : role === 'farmer' ? 'Farmer mode' : 'Delivery partner'}</span><ChevronDown size={14} /></button>{currentUser ? <button className="account-button" onClick={handleLogout} title="Log out"><LogOut size={15} /> {currentUser.name}</button> : <button className="account-button" onClick={() => { setAuthMode('login'); setShowAuth(true); }}><LogIn size={15} /> {t('login')}</button>}<button className="mobile-menu"><Menu size={20} /></button></div></header>
    <main>{tab === 'market' && <Marketplace produce={filtered} query={query} setQuery={setQuery} category={category} setCategory={setCategory} buyerType={buyerType} setBuyerType={setBuyerType} onSelect={handleProduceSelect} onAddToCart={(item) => requireLogin(() => addToCart(item))} />}{tab === 'inputs' && <AgriculturalInputs onBuyInput={(item) => requireLogin(() => addToCart(item))} />}{tab === 'connect' && <RetailConnect />}{tab === 'radar' && <DemandRadar />}{tab === 'calculator' && <Calculator />}{tab === 'orders' && <Orders orders={orders} />}{tab === 'cart' && <Cart items={cart} onCheckout={checkoutCart} />}{tab === 'operations' && <OperationsDashboard orders={orders} onAssign={(id, partner) => setOrders((current) => current.map((order) => order.id === id ? { ...order, partner, status: 'Assigned to delivery partner' } : order))} />}{tab === 'reviews' && <Reviews />} {tab === 'farmer' && <><FarmerHub produce={produce} orders={orders} onAdd={() => setShowAdd(true)} onVoiceAdd={(name) => { setShowAdd(true); setVoiceListingName(name); }} onDelete={(id) => setProduce((current) => current.filter((item) => item.id !== id))} /><FarmerSuggestions produce={produce} /></>}</main>
    <div className="mobile-nav">{navItems.map(([key, label, Icon]) => <button className={tab === key ? 'active' : ''} aria-label={label} key={key} onClick={() => key === 'add-listing' ? setShowAdd(true) : setTab(key)}><Icon size={19} /><span>{label}</span></button>)}</div>
    {selected && <OrderModal item={selected} onClose={() => setSelected(null)} onPlace={placeOrder} />}{showAdd && <AddListing initialName={voiceListingName} onClose={() => { setShowAdd(false); setVoiceListingName(''); }} onAdd={addListing} />}{showAuth && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={() => setShowAuth(false)} onAuthenticated={handleAuth} />}
  </div>;
}

function Marketplace({ produce, query, setQuery, category, setCategory, buyerType, setBuyerType, onSelect, onAddToCart }) {
  const { language, t } = useLanguage();
  const localizedProduce = produce.map((item) => localizeProduce(item, language));
  return <section className="market-page page-enter"><div className="hero-band"><div className="hero-copy"><div className="eyebrow"><span></span> {t('directSource')}</div><h1>{t('goodFood')}<br /><em>{t('fairlyPriced')}</em></h1><p>Meet the farmers behind your food. Buy fresh produce at farm-gate prices, with every rupee accounted for.</p><button className="primary-button" onClick={() => document.querySelector('.listing-section')?.scrollIntoView({ behavior: 'smooth' })}>{t('explore')} <ArrowRight size={17} /></button></div><div className="hero-art"><div className="sun"></div><div className="field field-one"></div><div className="field field-two"></div><span className="hero-label">THIS WEEK'S<br /><strong>FRESH PICK</strong></span><span className="hero-stamp">0%<small>MIDDLEMEN</small></span></div></div><div className="trust-row"><div><Check size={16} /> Prices set by farmers</div><div><Leaf size={16} /> Freshness you can trace</div><div><CircleDollarSign size={16} /> Average savings 38%</div></div><div className="listing-section"><div className="section-heading"><div><div className="eyebrow muted">{t('weeklyHarvest')}</div><h2>{t('findStaple')}</h2></div><span className="result-count">{produce.length} listings near you</span></div><div className="buyer-switch"><span>Buying for</span>{buyerTypes.map((type) => <button key={type} className={buyerType === type ? 'selected' : ''} onClick={() => setBuyerType(type)}>{type}</button>)}</div><div className="toolbar"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchProduce')} /></label><div className="category-row">{categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="produce-grid">{localizedProduce.map((item) => <ProduceCard key={item.id} item={item} onSelect={onSelect} onAddToCart={onAddToCart} />)}</div>{produce.length === 0 && <div className="empty-state">No harvests match that search. Try another crop or place.</div>}</div></section>;
  return <section className="market-page page-enter"><div className="hero-band"><div className="hero-copy"><div className="eyebrow"><span></span> {t('directSource')}</div><h1>{t('goodFood')}<br /><em>{t('fairlyPriced')}</em></h1><p>Meet the farmers behind your food. Buy fresh produce at farm-gate prices, with every rupee accounted for.</p><button className="primary-button" onClick={() => document.querySelector('.listing-section')?.scrollIntoView({ behavior: 'smooth' })}>{t('explore')} <ArrowRight size={17} /></button></div><div className="hero-art"><div className="sun"></div><div className="field field-one"></div><div className="field field-two"></div><span className="hero-label">THIS WEEK'S<br /><strong>FRESH PICK</strong></span><span className="hero-stamp">0%<small>MIDDLEMEN</small></span></div></div><div className="trust-row"><div><Check size={16} /> Prices set by farmers</div><div><Leaf size={16} /> Freshness you can trace</div><div><CircleDollarSign size={16} /> Average savings 38%</div></div><div className="listing-section"><div className="section-heading"><div><div className="eyebrow muted">{t('weeklyHarvest')}</div><h2>{t('findStaple')}</h2></div><span className="result-count">{produce.length} listings near you</span></div><div className="buyer-switch"><span>Buying for</span>{buyerTypes.map((type) => <button key={type} className={buyerType === type ? 'selected' : ''} onClick={() => setBuyerType(type)}>{type}</button>)}</div><div className="toolbar"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchProduce')} /><VoiceInputButton onTranscript={(text) => setQuery((current) => `${current} ${text}`.trim())} /></label><div className="category-row">{categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="produce-grid">{localizedProduce.map((item) => <ProduceCard key={item.id} item={item} onSelect={onSelect} onAddToCart={onAddToCart} />)}</div>{produce.length === 0 && <div className="empty-state">No harvests match that search. Try another crop or place.</div>}</div></section>;
}

function VoiceInputButton({ onTranscript, language = 'en-IN' }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const supported = Boolean(speechRecognition());
  const toggle = () => {
    if (!supported) return;
    if (listening) { recognitionRef.current?.stop(); return; }
    const Recognition = speechRecognition();
    const recognition = new Recognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.onresult = (event) => onTranscript(event.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };
  return <button type="button" className={`voice-button ${listening ? 'listening' : ''}`} onClick={toggle} disabled={!supported} title={supported ? (listening ? 'Stop listening' : 'Speak') : 'Voice input is not supported in this browser'} aria-label={supported ? (listening ? 'Stop listening' : 'Speak') : 'Voice input unavailable'}>{listening ? <MicOff size={16} /> : <Mic size={16} />}</button>;
}

function ProduceCard({ item, onSelect, onAddToCart }) { const savings = Math.round(((item.middlemanPrice - item.farmPrice) / item.middlemanPrice) * 100); const image = item.photo || produceImages[item.id]; return <article className="produce-card"><div className={`produce-image ${item.color}`} onClick={() => onSelect(item)}>{image ? <img className="produce-photo" src={image} alt={item.name} /> : <div className="produce-illustration"><span></span><span></span><span></span></div>}<span className="category-label">{item.category}</span>{item.organic && <span className="organic-label"><Leaf size={12} /> ORGANIC</span>}</div><div className="produce-body"><div className="produce-title"><div><h3>{item.name}</h3><p>{item.farm}</p></div><span className="savings-pill">-{savings}%</span></div><div className="location"><MapPin size={13} /> {item.location}</div><div className="price-line"><div><strong>{money(item.farmPrice)}</strong><span> / {item.unitLabel || item.unit}</span><del>{money(item.middlemanPrice)}</del></div><button className="buy-button" disabled={item.quantity <= 0} onClick={() => onAddToCart(item)}>{item.quantity > 0 ? 'Add to cart' : 'Sold out'} <ShoppingBasket size={15} /></button></div></div></article>; }

function RetailConnect() {
  const { language } = useLanguage();
  const text = retailConnectTranslations[language] || retailConnectTranslations.en;
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [message, setMessage] = useState('');
  const [sentFarmer, setSentFarmer] = useState('');
  const farmers = seedProduce.slice(0, 4);
  const sendMessage = (event) => { event.preventDefault(); if (!message.trim() || !selectedFarmer) return; setSentFarmer(selectedFarmer.farmer); setMessage(''); };
  const selectedPhone = selectedFarmer ? (selectedFarmer.id === 1 ? '+919876543210' : '+919812345678') : '';
  return <section className="connect-page page-enter">
    <div className="connect-heading"><div><div className="eyebrow"><span></span> {text.kicker}</div><h1>{text.title} <em>{text.titleAccent}</em></h1><p>{text.intro}</p></div><div className="connect-status"><span></span> {text.status}</div></div>
    <div className="connect-grid"><div className="farmer-directory"><div className="directory-top"><div><span className="panel-kicker">{text.directory}</span><h2>{text.ready}</h2></div><span>{farmers.length} {text.active}</span></div>{farmers.map((farmer) => <article className={`farmer-card ${selectedFarmer?.id === farmer.id ? 'selected' : ''}`} key={farmer.id}><div className={`farmer-avatar ${farmer.color}`}><Sprout size={23} /></div><div className="farmer-card-main"><div><h3>{farmer.farmer}</h3><p>{farmer.farm}</p></div><span className="farmer-location"><MapPin size={12} /> {farmer.location.split(',')[0]}</span><div className="supply-line"><strong>{farmer.name}</strong><span>{farmer.quantity} {farmer.unit} {text.available}</span></div></div><div className="farmer-card-actions"><button className="connect-button" onClick={() => setSelectedFarmer(farmer)}><MessageCircle size={15} /> {text.message}</button><a className="phone-button" href={`tel:${farmer.id === 1 ? '+919876543210' : '+919812345678'}`} title={`${text.call} ${farmer.farmer}`}><Phone size={15} /></a></div></article>)}</div><aside className="compose-panel"><div className="panel-kicker">{text.conversation}</div><h2>{selectedFarmer ? `${text.message} ${selectedFarmer.farmer}` : text.start}</h2>{selectedFarmer ? <><div className="compose-recipient"><div className={`farmer-avatar small ${selectedFarmer.color}`}><Sprout size={18} /></div><div><strong>{selectedFarmer.farm}</strong><span>{selectedFarmer.name} · {selectedFarmer.quantity} {selectedFarmer.unit} {text.available}</span></div></div><form onSubmit={sendMessage}><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={text.ask} rows="5" /><button className="primary-button full-button" type="submit" disabled={!message.trim()}><Send size={16} /> {text.send}</button></form>{sentFarmer === selectedFarmer.farmer && <p className="sent-confirmation"><Check size={15} /> {text.sent} {selectedFarmer.farmer}</p>}</> : <div className="compose-empty"><MessageCircle size={32} /><p>{text.select}</p></div>}</aside></div>
  </section>;
}

function DemandRadar() {
  const { t } = useLanguage();
  const [cropQuery, setCropQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [farmArea, setFarmArea] = useState('Hyderabad');
  const [weather, setWeather] = useState('Sunny');
  const [waterMethod, setWaterMethod] = useState('Drip irrigation');
  const [supportTopic, setSupportTopic] = useState('rain damage');
  const [supportSent, setSupportSent] = useState(false);
  const areaProfiles = {
    Hyderabad: { soil: 'Red loam', note: 'Watch moisture loss in exposed fields.' },
    Warangal: { soil: 'Red sandy loam', note: 'Protect topsoil after heavy rain.' },
    Nizamabad: { soil: 'Black cotton soil', note: 'Allow the soil surface to dry between watering.' },
    Karimnagar: { soil: 'Alluvial loam', note: 'Use drainage channels during wet spells.' }
  };
  const cities = [
    { name: 'Delhi NCR', state: 'Delhi', crop: 'Tomato demand', produce: ['tomato', 'potato', 'apple'], change: '+21%', level: 'high', position: { top: '18%', left: '49%' } },
    { name: 'Mumbai', state: 'Maharashtra', crop: 'Onion demand', produce: ['onion', 'mango', 'honey'], change: '+18%', level: 'high', position: { top: '63%', left: '28%' } },
    { name: 'Bengaluru', state: 'Karnataka', crop: 'Tur dal demand', produce: ['tur dal', 'dal', 'milk'], change: '+12%', level: 'medium', position: { top: '75%', left: '50%' } },
    { name: 'Kolkata', state: 'West Bengal', crop: 'Chilli demand', produce: ['chilli', 'wheat', 'grain'], change: '+9%', level: 'medium', position: { top: '39%', left: '80%' } },
    { name: 'Hyderabad', state: 'Telangana', crop: 'Cotton demand', produce: ['cotton', 'chilli', 'tur dal'], change: '+16%', level: 'high', position: { top: '61%', left: '48%' } },
    { name: 'Chennai', state: 'Tamil Nadu', crop: 'Coconut demand', produce: ['coconut', 'rice', 'banana'], change: '+14%', level: 'medium', position: { top: '82%', left: '60%' } },
    { name: 'Jaipur', state: 'Rajasthan', crop: 'Mustard demand', produce: ['mustard', 'wheat', 'bajra'], change: '+11%', level: 'medium', position: { top: '32%', left: '35%' } },
    { name: 'Lucknow', state: 'Uttar Pradesh', crop: 'Potato demand', produce: ['potato', 'sugarcane', 'wheat'], change: '+13%', level: 'high', position: { top: '30%', left: '56%' } },
    { name: 'Bhopal', state: 'Madhya Pradesh', crop: 'Soybean demand', produce: ['soybean', 'wheat', 'gram'], change: '+10%', level: 'medium', position: { top: '49%', left: '43%' } },
    { name: 'Kochi', state: 'Kerala', crop: 'Spice demand', produce: ['pepper', 'cardamom', 'coconut'], change: '+8%', level: 'low', position: { top: '88%', left: '43%' } }
  ];
  const normalizedQuery = searchedQuery.trim().toLowerCase();
  const queryTerms = normalizedQuery.split(/\s+/).filter((term) => term.length > 2).map((term) => term.replace(/s$/, ''));
  const matchesCity = (city) => !normalizedQuery || [...city.produce, city.name, city.state, city.crop].some((item) => queryTerms.some((term) => item.toLowerCase().includes(term) || term.includes(item.toLowerCase())));
  const matchingCity = cities.find(matchesCity) || cities[0];
  const hasMatch = !normalizedQuery || Boolean(cities.find(matchesCity));
  const searchedProduce = normalizedQuery || matchingCity.produce;
  const selectedArea = areaProfiles[farmArea];
  const rainProfiles = {
    Hyderabad: { probability: 68, amount: '12-18 mm', window: '4 PM - 8 PM', risk: 'Moderate' },
    Warangal: { probability: 76, amount: '18-24 mm', window: '3 PM - 7 PM', risk: 'High' },
    Nizamabad: { probability: 54, amount: '8-14 mm', window: '5 PM - 9 PM', risk: 'Watch' },
    Karimnagar: { probability: 61, amount: '10-16 mm', window: '4 PM - 8 PM', risk: 'Moderate' }
  };
  const rainProfile = rainProfiles[farmArea];
  const rainProbability = weather === 'Rainy' ? Math.max(rainProfile.probability, 82) : weather === 'Heatwave' ? Math.max(8, rainProfile.probability - 35) : weather === 'Cloudy' ? Math.min(84, rainProfile.probability + 8) : rainProfile.probability;
  const harvestAdvice = weather === 'Rainy' ? 'Harvest in the next dry morning and keep produce off wet soil.' : weather === 'Heatwave' ? 'Harvest at dawn, then move the crop into shade within 30 minutes.' : weather === 'Cloudy' ? 'Harvest when leaves are dry and leave extra airflow around packed produce.' : 'Harvest early morning or after sunset to protect freshness.';
  const waterAdvice = waterMethod === 'Drip irrigation' ? 'Run short, frequent cycles and check moisture 5 cm below the surface.' : waterMethod === 'Sprinkler' ? 'Water before 9 AM and avoid wetting leaves overnight.' : waterMethod === 'Flood irrigation' ? 'Reduce standing water and switch to smaller measured furrows where possible.' : 'Use stored rainwater for the next cycle and keep a reserve for dry days.';
  return <section className="radar-page page-enter">
    <div className="radar-heading"><div><div className="eyebrow"><span></span> {t('radarKicker')}</div><h1>{t('demandRadar')}</h1><p>{t('demandIntro')}</p></div><div className="radar-status"><span></span> {t('liveSignals')} <small>Updated 12 min ago</small></div></div>
    <form className="radar-search" onSubmit={(event) => { event.preventDefault(); setSearchedQuery(cropQuery); }}><Search size={18} /><input value={cropQuery} onChange={(event) => setCropQuery(event.target.value)} placeholder="Search crops or states, e.g. Telangana cotton" /><button className="ai-search-button" type="submit"><Radar size={13} /> {t('aiSearch')}</button></form>
    <div className="radar-layout">
      <div className="radar-map-panel">
        <div className="radar-panel-top"><div><span className="panel-kicker">INDIA NETWORK</span><h2>{t('demandAcross')}</h2></div><div className="radar-legend"><span><i className="low"></i> {t('low')}</span><span><i className="medium"></i> {t('medium')}</span><span><i className="high"></i> {t('high')}</span></div></div>
        <div className="radar-map india-map" aria-label="India demand map showing Delhi NCR, Mumbai, Bengaluru, and Kolkata">
          <div className="map-grid"></div><div className="state-shape india-shape"><span></span></div><div className="state-label">INDIA</div>
          {cities.map((city) => <div className={`map-pin ${city.level}`} key={city.name} style={city.position}><span></span><b>{city.name}</b></div>)}
          <div className="map-callout"><span>{hasMatch ? 'DEMAND SIGNAL' : 'NO SIGNAL YET'}</span><strong>{hasMatch ? searchedProduce : cropQuery}</strong><b>{hasMatch ? `${matchingCity.change} in ${matchingCity.name}` : 'Try tomato, onion, tur dal, or chilli'}</b><ArrowRight size={15} /></div>
        </div>
      </div>
      <aside className="radar-insights"><div className="insight-header"><div><span className="panel-kicker">{t('aiReadout')}</span><h2>{t('growNext')}</h2></div><Radar size={20} /></div><div className={`radar-callout ${hasMatch ? '' : 'no-signal'}`}><div className="signal-icon"><TrendingDown size={18} /></div><div><strong>{hasMatch ? `Move ${searchedProduce} toward ${matchingCity.name}` : t('noSignal')}</strong><p>{hasMatch ? `${matchingCity.state} demand is outpacing nearby supply this week.` : t('tryTracked')}</p></div><b>{hasMatch ? matchingCity.change : '?'}</b></div><div className="city-list">{cities.map((city) => <div className={`city-row ${city.name === matchingCity.name && hasMatch ? 'selected' : ''}`} key={city.name}><span className={`city-dot ${city.level}`}></span><div><strong>{city.name}</strong><small>{city.state} · {city.crop}</small></div><b>{city.change}</b><ArrowRight size={14} /></div>)}</div><div className="radar-footer"><MapPin size={15} /> {cities.length} state markets tracked <span>•</span> {cities.length * 7} signals analyzed</div></aside>
    </div>
    <div className="radar-tools">
      <article className="rain-predictor">
        <div className="tool-card-heading"><div><span className="panel-kicker">FIELD WEATHER</span><h2>Rain predictor</h2></div><CloudRain size={22} /></div>
        <div className="rain-controls">
          <label><span>Farm area</span><select value={farmArea} onChange={(event) => setFarmArea(event.target.value)}>{Object.keys(areaProfiles).map((area) => <option key={area}>{area}</option>)}</select></label>
          <label><span>Today feels</span><select value={weather} onChange={(event) => setWeather(event.target.value)}><option>Sunny</option><option>Cloudy</option><option>Rainy</option><option>Heatwave</option></select></label>
        </div>
        <div className="rain-score"><div><small>RAIN CHANCE TODAY</small><strong>{rainProbability}%</strong></div><div className="rain-meter"><span style={{ width: `${rainProbability}%` }}></span></div><b>{rainProfile.risk} risk</b></div>
        <div className="rain-details"><span><b>Expected</b>{rainProfile.amount}</span><span><b>Likely window</b>{rainProfile.window}</span><span><b>Soil</b>{selectedArea.soil}</span></div>
        <p className="tool-advice"><strong>Plan:</strong> {harvestAdvice} {waterAdvice}</p>
      </article>
      <article className="support-panel">
        <div className="tool-card-heading"><div><span className="panel-kicker">FARMER CARE DESK</span><h2>Need a hand?</h2></div><MessageCircle size={22} /></div>
        <p>Talk to a real FarmDirect support partner about weather damage, orders, or delivery.</p>
        <label className="support-topic"><span>What can we help with?</span><select value={supportTopic} onChange={(event) => { setSupportTopic(event.target.value); setSupportSent(false); }}><option value="rain damage">Rain damage</option><option value="an order">An order</option><option value="selling produce">Selling produce</option></select></label>
        <div className="support-actions"><a className="whatsapp-cta" href={whatsappLink('+919876543210', `Hello, I need help with ${supportTopic}. I am farming in ${farmArea}.`)} target="_blank" rel="noreferrer" aria-label="Message farmer support on WhatsApp"><MessageCircle size={15} /> WhatsApp</a><a className="support-icon-link" href="tel:+919876543210" title="Call farmer support" aria-label="Call farmer support"><Phone size={16} /></a><a className="support-icon-link" href="mailto:support@farmersatoz.in?subject=FarmDirect%20support" title="Email farmer support" aria-label="Email farmer support"><Mail size={16} /></a></div>
        <button className="support-confirm" type="button" onClick={() => setSupportSent(true)}>{supportSent ? 'Support request noted' : 'I need a callback'}</button>
      </article>
    </div>
  </section>;
}

function Calculator() { const [quantity, setQuantity] = useState(12); const farmPrice = 22 * quantity; const marketPrice = 45 * quantity; const saved = marketPrice - farmPrice; return <section className="tool-page page-enter"><div className="tool-intro"><div className="eyebrow"><span></span> SEE THE DIFFERENCE</div><h1>What does the middleman<br /><em>really cost you?</em></h1><p>Move the dial. Watch the extra layers disappear from your basket and your bill.</p></div><div className="calculator-layout"><div className="calculator-panel"><div className="panel-top"><span>CALCULATE YOUR SAVINGS</span><TrendingDown size={18} /></div><div className="quantity-display"><small>BUYING</small><strong>{quantity}<i> kg</i></strong><span>of vine tomatoes</span></div><input className="range" type="range" min="1" max="100" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /><div className="range-labels"><span>1 kg</span><span>100 kg</span></div><div className="price-compare"><div><span>Typical retail price</span><strong className="struck">{money(marketPrice)}</strong><small>includes 51% of middleman layers</small></div><div className="arrow-separator"><ArrowRight size={18} /></div><div className="fair-price"><span>Farmers A to Z price</span><strong>{money(farmPrice)}</strong><small>paid straight to the farm</small></div></div><div className="saved-total"><div><Zap size={18} /><span>You keep</span></div><strong>{money(saved)}</strong><small>in your pocket</small></div></div><div className="flow-panel"><div className="eyebrow muted">WHERE YOUR MONEY GOES</div><h2>One clean connection.</h2><p>With Farmers A to Z, your money travels a shorter, clearer distance.</p><div className="money-flow"><div className="flow-node farmer-node"><div><Sprout size={24} /></div><span>Farmer</span><strong>{money(farmPrice)}</strong></div><div className="flow-line direct"><span>100% of farm price</span></div><div className="flow-node buyer-node"><div><ShoppingBasket size={24} /></div><span>Your basket</span><strong>{money(farmPrice)}</strong></div><div className="flow-line middle"><span>retail route</span></div><div className="flow-node market-node"><div><Store size={24} /></div><span>Middlemen</span><strong>{money(saved)}</strong></div></div></div></div></section>; }

function Orders({ orders }) { const total = orders.reduce((sum, order) => sum + order.total, 0); const saved = orders.reduce((sum, order) => sum + order.savings, 0); return <section className="content-page page-enter"><div className="page-header"><div><div className="eyebrow"><span></span> YOUR FARM CONNECTIONS</div><h1>Orders & <em>savings</em></h1><p>Every order is a direct line to the people who grow your food.</p></div><div className="stat-cluster"><div><small>TOTAL SPENT</small><strong>{money(total)}</strong></div><div><small>YOU'VE SAVED</small><strong className="green-text">{money(saved)}</strong></div></div></div>{orders.length === 0 ? <div className="empty-orders"><PackageCheck size={44} /><h2>Your basket is waiting</h2><p>Orders you place from the marketplace will appear here.</p></div> : <div className="orders-list">{orders.map((order) => <article className="order-row" key={order.id}>{order.photo ? <img className="order-item-image" src={order.photo} alt={order.name} /> : <div className="order-icon"><Truck size={21} /></div>}<div className="order-main"><div><h3>{order.name}</h3><p>{order.farm} · {order.date}</p><div className="order-details"><span><b>Buying for:</b> {order.buyerType || 'Household'}</span><span><b>Quantity:</b> {order.quantity} {order.unit}</span><span><b>Buyer:</b> {order.buyer || 'Not provided'}</span><span><b>Farmer:</b> {order.farmer || 'FarmDirect Network'}</span><span><b>Deliver to:</b> {order.address || 'Address pending'}</span><span><b>Delivery:</b> {order.deliveryWindow || 'Flexible timing'}</span><span><b>Farmer receives:</b> {money(order.productTotal || Math.max(0, order.total - (order.deliveryCharge || 0)))}</span><span><b>Delivery partner earns:</b> {money(order.deliveryCharge || 0)}</span></div><small className="payment-label">Payment: {order.paymentMethod || 'Cash on Delivery'}</small></div><span className="status"><span></span>{order.status}</span></div><div className="order-amount"><strong>{money(order.total)}</strong><span>Saved {money(order.savings)}</span></div><ChevronDown size={18} /></article>)}</div>}</section>; }

function FarmerHub({ produce, orders, onAdd, onDelete }) { const revenue = orders.reduce((sum, order) => sum + order.total, 0); return <section className="content-page page-enter"><div className="page-header farmer-header"><div><div className="eyebrow"><span></span> YOUR FARM, YOUR TERMS</div><h1>Farmer <em>hub</em></h1><p>Manage your harvest, reach buyers, and source what your farm needs.</p></div><button className="primary-button" onClick={onAdd}><Plus size={17} /> Add a listing</button></div><div className="dashboard-stats"><div><Sprout size={19} /><small>ACTIVE LISTINGS</small><strong>{produce.length}</strong></div><div><CircleDollarSign size={19} /><small>DIRECT REVENUE</small><strong>{money(revenue)}</strong></div><div><PackageCheck size={19} /><small>ORDERS RECEIVED</small><strong>{orders.length}</strong></div><div><BarChart3 size={19} /><small>YOUR REACH</small><strong>{new Set(orders.map((order) => order.buyer)).size || 0} buyers</strong></div></div><div className="hub-grid"><div className="hub-panel"><div className="panel-heading"><div><div className="eyebrow muted">YOUR HARVEST</div><h2>Active listings</h2></div><span>{produce.length} crops</span></div>{produce.map((item) => <div className="listing-row" key={item.id}><div className={`mini-produce ${item.color}`}></div><div><strong>{item.name}</strong><span>{item.quantity} {item.unit} available · {money(item.farmPrice)}/{item.unit}</span></div><button className="icon-button" title="Delete listing" onClick={() => onDelete(item.id)}><X size={16} /></button></div>)}</div><div className="hub-panel incoming"><div className="panel-heading"><div><div className="eyebrow muted">INCOMING</div><h2>Recent orders</h2></div></div>{orders.length === 0 ? <div className="mini-empty"><Clock3 size={20} /> No orders yet</div> : orders.slice(0, 4).map((order) => <div className="incoming-row" key={order.id}><div><strong>{order.name}</strong><span>{order.quantity} {order.unit} · {order.buyer}</span></div><b>{money(order.total)}</b></div>)}</div></div></section>; }

function PaymentScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let stream;
    let frame;
    let active = true;
    const start = async () => {
      if (!('BarcodeDetector' in window)) { setError('QR scanning is not supported in this browser. Use the payment app button instead.'); return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const scan = async () => {
          if (!active) return;
          try {
            const codes = await detector.detect(videoRef.current);
            const value = codes[0]?.rawValue || '';
            if (/^(upi|phonepe|tez):\/\//i.test(value)) { onScan(value); return; }
          } catch { setError('Keep the payment QR code inside the camera frame.'); }
          frame = requestAnimationFrame(scan);
        };
        scan();
      } catch { setError('Camera access is required to scan a payment QR code.'); }
    };
    start();
    return () => { active = false; if (frame) cancelAnimationFrame(frame); stream?.getTracks().forEach((track) => track.stop()); };
  }, [onScan]);
  return <div className="scanner-backdrop"><div className="payment-scanner"><div className="scanner-heading"><div><span className="panel-kicker">PAYMENT SCANNER</span><h2>Scan a UPI QR code</h2></div><button className="close-button" onClick={onClose} aria-label="Close scanner"><X size={18} /></button></div><video ref={videoRef} className="scanner-video" muted playsInline /><div className="scanner-frame"></div><p>{error || 'Point your camera at the PhonePe or Google Pay QR code.'}</p><button className="secondary-button" onClick={onClose}>Cancel</button></div></div>;
}

function UpiQrModal({ method, amount, onClose, onOpenApp, onScan }) {
  const [qrSource, setQrSource] = useState('');
  useEffect(() => {
    const payload = `upi://pay?pa=${UPI_ID}&pn=Farmers%20A%20to%20Z&am=${amount.toFixed(2)}&cu=INR`;
    QRCode.toDataURL(payload, { width: 280, margin: 2, color: { dark: '#123f3b', light: '#fffdf7' } }).then(setQrSource).catch(() => setQrSource(''));
  }, [amount]);
  return <div className="upi-modal-backdrop"><div className="upi-modal"><button className="close-button" onClick={onClose} aria-label="Close payment QR"><X size={18} /></button><div className="upi-modal-kicker">{method.toUpperCase()} PAYMENT</div><h2>Scan to pay securely</h2><p className="upi-amount">{money(amount)}</p><div className="upi-qr-wrap">{qrSource ? <img src={qrSource} alt={`UPI QR code for ${money(amount)}`} /> : <span>Generating QR...</span>}</div><p className="upi-instructions">Open {method} on your phone, scan this QR code, and confirm the payment. The QR is linked to Farmers A to Z.</p><div className="upi-modal-actions"><button className="secondary-button" onClick={onScan}><Camera size={15} /> Scan another QR</button><button className="primary-button" onClick={onOpenApp}>Open {method} <ArrowRight size={15} /></button></div></div></div>;
}

function AgriculturalInputs({ onBuyInput }) { const { language } = useLanguage(); const localizedInputs = farmInputs.map((input, index) => localizeInput(input, index, language)); return <section className="content-page page-enter"><div className="page-header"><div><div className="eyebrow"><span></span> FARM SUPPLY MARKET</div><h1>Agricultural <em>inputs</em></h1><p>Source practical seeds, soil care, crop protection, irrigation, and farm gear directly for your next growing cycle.</p></div></div><div className="input-shop"><div className="panel-heading"><div><div className="eyebrow muted">GROW WHAT IS NEXT</div><h2>Stock up for less</h2></div><span>{localizedInputs.length} supplies available</span></div><div className="input-grid">{localizedInputs.map((input) => <article className="input-card" key={input.name}><img className="input-photo" src={input.image} alt={input.name} /><div className="input-card-content"><span className="input-type">{input.type}</span><h3>{input.name}</h3><strong>{money(input.price)}</strong><small>{input.discount}</small><button className="buy-input" onClick={() => onBuyInput({ ...input, category: 'Farm input', unit: 'item', quantity: 1, farm: 'FarmDirect Inputs', middlemanPrice: input.price })}>Add to cart <ShoppingBasket size={14} /></button></div></article>)}</div></div></section>; }

function Cart({ items, onCheckout }) { const [cartItems, setCartItems] = useState(() => items.map((item) => ({ ...item, cartQuantity: item.cartQuantity || 1 }))); const [showCheckout, setShowCheckout] = useState(false); const [buyer, setBuyer] = useState(''); const [address, setAddress] = useState(''); const [distanceKm, setDistanceKm] = useState(5); const [deliveryWindow, setDeliveryWindow] = useState('30 minutes'); const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery'); const [buyerType, setBuyerType] = useState(items[0]?.buyerType || 'Household'); const total = cartItems.reduce((sum, item) => sum + (item.price || item.farmPrice || 0) * item.cartQuantity, 0); const deliveryCharge = distanceKm * deliveryChargePerKm; const updateQuantity = (cartId, quantity) => setCartItems((current) => current.map((item) => item.cartId === cartId ? { ...item, cartQuantity: Math.max(1, Math.min(item.quantity || quantity, quantity)) } : item)); const removeItem = (cartId) => setCartItems((current) => current.filter((item) => item.cartId !== cartId)); return <section className="content-page page-enter"><div className="page-header"><div><div className="eyebrow"><span></span> YOUR SHOPPING BAG</div><h1>Cart & <em>checkout</em></h1><p>Review produce and farm supplies before placing your order.</p></div></div>{cartItems.length === 0 ? <div className="empty-orders"><ShoppingBasket size={44} /><h2>Your cart is empty</h2><p>Add produce or farm inputs to see them here.</p></div> : <div className="cart-list">{cartItems.map((item) => <div className="cart-row" key={item.cartId}><div className="cart-item-details">{(item.photo || produceImages[item.id]) && <img className="cart-item-image" src={item.photo || produceImages[item.id]} alt={item.name} />}<div><strong>{item.name}</strong><span>{item.category} · {item.discount || 'Direct farm price'}</span></div></div><div className="cart-item-actions"><div className="cart-quantity" aria-label={`Quantity for ${item.name}`}><button type="button" aria-label={`Decrease ${item.name} quantity`} disabled={item.cartQuantity <= 1} onClick={() => updateQuantity(item.cartId, item.cartQuantity - 1)}><Minus size={14} /></button><strong>{item.cartQuantity}</strong><button type="button" aria-label={`Increase ${item.name} quantity`} disabled={item.cartQuantity >= (item.quantity || item.cartQuantity)} onClick={() => updateQuantity(item.cartId, item.cartQuantity + 1)}><Plus size={14} /></button></div><b>{money((item.price || item.farmPrice) * item.cartQuantity)}</b><button type="button" className="cart-remove" aria-label={`Remove ${item.name} from cart`} onClick={() => removeItem(item.cartId)}><X size={15} /></button></div></div>)}<div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>{showCheckout && <div className="cart-checkout-fields"><label className="field"><span>Your name</span><input required value={buyer} onChange={(event) => setBuyer(event.target.value)} placeholder="e.g. Priya Sharma" /></label><label className="field"><span>Delivery address</span><input required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Where should we bring it?" /></label><div className="delivery-fields"><label className="field"><span>Distance (km)</span><input type="number" min="1" value={distanceKm} onChange={(event) => setDistanceKm(Math.max(1, Number(event.target.value) || 1))} /></label><label className="field"><span>Delivery timing</span><select value={deliveryWindow} onChange={(event) => setDeliveryWindow(event.target.value)}><option>30 minutes</option><option>Today evening</option><option>Tomorrow morning</option><option>Choose with partner</option></select></label></div><label className="field"><span>Buying for</span><select value={buyerType} onChange={(event) => setBuyerType(event.target.value)}>{buyerTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="field payment-field"><span>Payment method</span><select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option>Cash on Delivery</option><option>PhonePe</option><option>Google Pay</option></select></label><div className="delivery-breakdown"><span><Route size={14} /> {distanceKm} km x ₹{deliveryChargePerKm}</span><strong>Delivery {money(deliveryCharge)}</strong></div></div>}<button className="primary-button full-button" disabled={showCheckout && (!buyer.trim() || !address.trim())} onClick={() => showCheckout ? onCheckout(cartItems, buyer, address, distanceKm, deliveryWindow, paymentMethod, buyerType) : setShowCheckout(true)}>{showCheckout ? <><Check size={16} /> Place order</> : <><ShoppingBasket size={16} /> Continue to checkout</>}</button></div>}</section>; }

function OperationsDashboard({ orders }) {
  const partnerName = 'GreenRoute Partner';
  const [available, setAvailable] = useState(() => load('farmdirect-delivery-available', false));
  const terminalStatuses = ['delivered', 'rejected'];
  const availableOrders = orders.filter((order) => !order.partner && !terminalStatuses.includes(order.deliveryStatus) && ['Awaiting assignment', 'awaiting_partner'].includes(order.status || order.deliveryStatus));
  const activeOrders = orders.filter((order) => order.partner === partnerName && !terminalStatuses.includes(order.deliveryStatus));
  const history = orders.filter((order) => order.partner === partnerName && terminalStatuses.includes(order.deliveryStatus));
  const updateOrder = (id, changes) => window.dispatchEvent(new CustomEvent('farmdirect-delivery-update', { detail: { id, changes } }));
  const acceptOrder = (order) => updateOrder(order.id, { partner: partnerName, status: 'Accepted by delivery partner', deliveryStatus: 'accepted', acceptedAt: new Date().toISOString() });
  const rejectOrder = (order) => updateOrder(order.id, { partner: partnerName, status: 'Rejected by delivery partner', deliveryStatus: 'rejected', rejectedAt: new Date().toISOString() });
  const markDelivered = (order) => updateOrder(order.id, { status: 'Delivered', deliveryStatus: 'delivered', deliveredAt: new Date().toISOString() });
  const toggleAvailability = () => { setAvailable((current) => { const next = !current; localStorage.setItem('farmdirect-delivery-available', JSON.stringify(next)); return next; }); };
  return <section className="content-page page-enter"><div className="page-header"><div><div className="eyebrow"><span></span> DELIVERY CONTROL CENTRE</div><h1>Operations <em>dashboard</em></h1><p>Manage your availability, accept delivery requests, and keep a record of completed runs.</p></div><div className={`availability-toggle ${available ? 'online' : 'offline'}`}><span></span><strong>{available ? 'Available for deliveries' : 'Off duty'}</strong><button onClick={toggleAvailability}>{available ? 'Go offline' : 'Go online'}</button></div></div>{available && availableOrders.length > 0 && <div className="partner-panel delivery-requests"><div className="panel-heading"><div><div className="eyebrow muted">NEW REQUESTS</div><h2>Delivery requests</h2></div><span>{availableOrders.length} waiting</span></div>{availableOrders.map((order) => <DeliveryPartnerOrder key={order.id} order={order} onAccept={() => acceptOrder(order)} onReject={() => rejectOrder(order)} />)}</div>}{!available && <div className="availability-notice"><Clock3 size={20} /><div><strong>You are off duty</strong><span>Go online when you are ready to receive delivery requests.</span></div></div>}<DeliveryRouteMap orders={activeOrders} /><div className="partner-panel"><div className="partner-hero"><Truck size={27} /><div><span className="panel-kicker">TODAY'S ROUTE</span><h2>Deliveries for {partnerName}</h2><p>Accept a request, follow the route, and mark each order delivered.</p></div></div>{activeOrders.map((order) => <DeliveryPartnerOrder key={order.id} order={order} onReject={() => rejectOrder(order)} onDelivered={() => markDelivered(order)} />)}{activeOrders.length === 0 && <div className="mini-empty"><Route size={20} /> No active deliveries yet.</div>}</div><div className="partner-panel delivery-history"><div className="panel-heading"><div><div className="eyebrow muted">DELIVERY HISTORY</div><h2>Previous deliveries</h2></div><span>{history.length} completed</span></div>{history.map((order) => <div className="history-row" key={order.id}><div><strong>{order.name}</strong><span>{order.buyer || 'Buyer'} · {order.address || 'Address pending'}</span></div><b className={order.deliveryStatus}>{order.deliveryStatus === 'delivered' ? 'Delivered' : 'Rejected'}</b></div>)}{history.length === 0 && <div className="mini-empty"><Clock3 size={20} /> Previous deliveries will appear here.</div>}</div></section>;
}

function DeliveryPartnerOrder({ order, onAccept, onReject, onDelivered }) {
  return <div className="partner-order action-order"><div><strong>{order.name}</strong><span>{order.buyer || 'Buyer'} · {order.address || 'Address pending'} · {order.distanceKm || 0} km</span><small>{order.quantity} {order.unit} · {order.deliveryWindow || 'Flexible timing'}</small><small className="earnings-line">Farmer receives {money(order.productTotal || Math.max(0, order.total - (order.deliveryCharge || 0)))} · You earn {money(order.deliveryCharge || 0)}</small></div><div className="partner-order-actions">{onAccept && <button className="accept-button" onClick={onAccept}><Check size={14} /> Accept</button>}{onReject && <button className="reject-button" onClick={onReject}><X size={14} /> Reject</button>}{onDelivered && <button className="accept-button" onClick={onDelivered}><PackageCheck size={14} /> Mark delivered</button>}</div></div>;
}

function DeliveryRouteMap({ orders }) {
  const partnerName = 'GreenRoute Partner';
  const partnerLocation = partnerLocations[partnerName];
  const stops = orders.filter((order) => order.partner).map((order) => ({ order, stopDistance: distanceBetween(partnerLocation, order.dropoff) })).sort((first, second) => first.stopDistance - second.stopDistance);
  const positions = [{ x: 18, y: 62 }, { x: 38, y: 35 }, { x: 61, y: 57 }, { x: 82, y: 28 }, { x: 74, y: 78 }, { x: 42, y: 82 }];
  const points = stops.slice(0, positions.length).map((stop, index) => ({ ...stop, ...positions[index] }));
  const totalDistance = points.reduce((sum, point) => sum + (Number.isFinite(point.stopDistance) ? point.stopDistance : point.order.distanceKm || 0), 0);
  return <div className="route-board"><div className="route-board-heading"><div><div className="eyebrow muted">ROUTE PLANNER</div><h2>Best route for the next run</h2><p>Nearest stops first, using the partner's current location.</p></div><div className="route-summary"><strong>{points.length}</strong><span>stops</span><strong>{totalDistance.toFixed(1)} km</strong><span>estimated route</span></div></div>{points.length === 0 ? <div className="route-empty"><Route size={22} /><span>Assign orders to a partner to build the route map.</span></div> : <div className="route-layout"><div className="route-map" aria-label="Schematic delivery route map">{points.slice(1).map((point, index) => { const previous = points[index]; const dx = point.x - previous.x; const dy = point.y - previous.y; return <i className="route-line" key={`${previous.order.id}-${point.order.id}`} style={{ left: `${previous.x}%`, top: `${previous.y}%`, width: `${Math.sqrt(dx * dx + dy * dy)}%`, transform: `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)` }} />; })}{points.map((point, index) => <div className="route-stop" key={point.order.id} style={{ left: `${point.x}%`, top: `${point.y}%` }}><b>{index + 1}</b><span>{point.order.buyer}</span></div>)}<div className="route-origin"><Sprout size={15} /> Farm hub</div></div><div className="route-stop-list">{points.map((point, index) => <div className="route-stop-row" key={point.order.id}><b>{index + 1}</b><div><strong>{point.order.buyer}</strong><span>{point.order.address || 'Address pending'}</span></div><small>{(Number.isFinite(point.stopDistance) ? point.stopDistance : point.order.distanceKm || 0).toFixed(1)} km</small></div>)}</div></div>}</div>;
}

function Reviews() {
  const [reviews, setReviews] = useState(() => load('farmdirect-reviews', [
    { id: 'review-1', name: 'Priya Menon', role: 'Hotel buyer', farmer: 'Ramesh Patel', rating: 5, text: 'Fresh produce arrived on time and the farmer communication was clear.' },
    { id: 'review-2', name: 'Arjun Foods', role: 'Caterer', farmer: 'Gurpreet Singh', rating: 4, text: 'The direct pricing is transparent. We can plan weekly supply with confidence.' },
    { id: 'review-3', name: 'Meena Organics', role: 'Farmer', farmer: 'Subhash Sawant', rating: 5, text: 'Retail Connect helps me understand what buyers need before harvest.' }
  ]));
  const [farmer, setFarmer] = useState(seedProduce[0].farmer);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const submit = (event) => { event.preventDefault(); if (!text.trim()) return; const nextReview = { id: `review-${Date.now()}`, name: 'FarmDirect customer', role: 'Buyer', farmer, rating, text: text.trim() }; setReviews((current) => { const next = [nextReview, ...current]; localStorage.setItem('farmdirect-reviews', JSON.stringify(next)); return next; }); setText(''); setRating(5); };
  return <section className="content-page page-enter"><div className="page-header"><div><div className="eyebrow"><span></span> TRUST ACROSS THE NETWORK</div><h1>Reviews & <em>feedback</em></h1><p>Share helpful feedback about the farmers who grow your food.</p></div></div><div className="review-grid">{reviews.map((review) => <article className="review-card" key={review.id}><div className="review-top"><div className="review-avatar"><UserRound size={17} /></div><div><strong>{review.name}</strong><span>{review.role} · {review.farmer}</span></div><div className="stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < review.rating ? 'currentColor' : 'none'} />)}</div></div><p>{review.text}</p></article>)}</div><form className="review-form" onSubmit={submit}><div><span className="panel-kicker">REVIEW A FARMER</span><h2>Help the next buyer choose well.</h2><label className="field"><span>Farmer</span><select value={farmer} onChange={(event) => setFarmer(event.target.value)}>{seedProduce.map((item) => <option key={item.farmer}>{item.farmer}</option>)}</select></label><label className="field"><span>Rating</span><select value={rating} onChange={(event) => setRating(Number(event.target.value))}><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label></div><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a review about this farmer or their produce..." rows="4" required /><button className="primary-button" type="submit"><Star size={16} /> Publish review</button></form></section>;
}


function FarmerSuggestions({ produce }) {
  const suggestions = produce.some((item) => item.category === 'Flowers') ? ['Bundle marigolds with a morning delivery slot for hotels.', 'Add a repeat supply offer for caterers before festival weeks.'] : ['Use Demand Radar before planting your next batch.', 'Add a clear harvest date and production method to improve buyer trust.'];
  return <section className="suggestions-panel"><div className="eyebrow muted">FARMER COACH</div><h2>Suggestions for your next sale</h2><div className="suggestion-list">{suggestions.map((suggestion) => <div key={suggestion}><Sprout size={16} /><span>{suggestion}</span></div>)}</div></section>;
}
function OrderModal({ item, onClose, onPlace }) { const [quantity, setQuantity] = useState(1); const [buyer, setBuyer] = useState(''); const [address, setAddress] = useState(''); const [distanceKm, setDistanceKm] = useState(5); const [deliveryWindow, setDeliveryWindow] = useState('30 minutes'); const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery'); const [buyerType, setBuyerType] = useState(item.buyerType || 'Household'); const productTotal = quantity * item.farmPrice; const deliveryCharge = distanceKm * deliveryChargePerKm; const total = productTotal + deliveryCharge; return <div className="modal-backdrop"><div className="modal"><button className="close-button" onClick={onClose}><X size={19} /></button><div className={`modal-image produce-image ${item.color}`}>{produceImages[item.id] ? <img className="produce-photo" src={produceImages[item.id]} alt={item.name} /> : <div className="produce-illustration"><span></span><span></span><span></span></div>}</div><div className="modal-content"><div className="eyebrow muted">DIRECT FROM {item.farm.toUpperCase()}</div><h2>{item.name}</h2><p className="modal-description">{item.description}</p><div className="quantity-control"><span>Quantity <small>({item.quantity} {item.unit} available)</small></span><div><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><strong>{quantity}</strong><button onClick={() => setQuantity(Math.min(item.quantity, quantity + 1))}><Plus size={15} /></button></div></div><label className="field"><span>Your name</span><input value={buyer} onChange={(event) => setBuyer(event.target.value)} placeholder="e.g. Priya Sharma" /></label><label className="field"><span>Delivery address</span><input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Where should we bring it?" /></label><div className="delivery-fields"><label className="field"><span>Distance (km)</span><input type="number" min="1" value={distanceKm} onChange={(event) => setDistanceKm(Math.max(1, Number(event.target.value) || 1))} /></label><label className="field"><span>Delivery timing</span><select value={deliveryWindow} onChange={(event) => setDeliveryWindow(event.target.value)}><option>30 minutes</option><option>Today evening</option><option>Tomorrow morning</option><option>Choose with partner</option></select></label></div><label className="field"><span>Buying for</span><select value={buyerType} onChange={(event) => setBuyerType(event.target.value)}>{buyerTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="field payment-field"><span>Payment method</span><select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option>Cash on Delivery</option><option>PhonePe</option><option>Google Pay</option></select></label><div className="delivery-breakdown"><span><Route size={14} /> {distanceKm} km x ₹{deliveryChargePerKm}</span><strong>Delivery {money(deliveryCharge)}</strong></div><div className="order-summary"><span>Farmers A to Z total <strong>{money(total)}</strong></span><span className="summary-saving">You save {money(quantity * (item.middlemanPrice - item.farmPrice))}</span></div><button className="primary-button full-button" disabled={!buyer || !address} onClick={() => onPlace(item, quantity, buyer, address, distanceKm, deliveryWindow, paymentMethod, buyerType)}><Check size={17} /> Place direct order</button></div></div></div>; }

function AddListingLegacy({ onClose, onAdd }) { const [form, setForm] = useState({ name: '', category: 'Vegetables', farmPrice: '', unit: 'kg', quantity: '', farmer: 'Your name', farm: 'Your farm', location: 'Your location', organic: true, harvest: 'Freshly harvested', description: 'Fresh produce, grown with care.' }); const update = (key, value) => setForm((current) => ({ ...current, [key]: value })); const submit = (event) => { event.preventDefault(); onAdd({ ...form, farmPrice: Number(form.farmPrice), middlemanPrice: Number(form.farmPrice) * 1.7, quantity: Number(form.quantity) }); }; return <div className="modal-backdrop"><form className="modal add-modal" onSubmit={submit}><button type="button" className="close-button" onClick={onClose}><X size={19} /></button><div className="eyebrow"><span></span> NEW HARVEST</div><h2>List your produce</h2><p className="modal-description">Put a fair price on what you grow and let the right buyers find you.</p><div className="form-grid"><label className="field wide"><span>Produce name</span><input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Red Lady Papaya" /></label><label className="field"><span>Category</span><select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label className="field"><span>Unit</span><select value={form.unit} onChange={(event) => update('unit', event.target.value)}><option>kg</option><option>dozen</option><option>litre</option><option>crate</option></select></label><label className="field"><span>Farm price (₹)</span><input required type="number" min="1" value={form.farmPrice} onChange={(event) => update('farmPrice', event.target.value)} /></label><label className="field"><span>Quantity available</span><input required type="number" min="1" value={form.quantity} onChange={(event) => update('quantity', event.target.value)} /></label><label className="field wide"><span>Farm name</span><input value={form.farm} onChange={(event) => update('farm', event.target.value)} /></label><label className="field wide"><span>Location</span><input value={form.location} onChange={(event) => update('location', event.target.value)} /></label></div><button className="primary-button full-button" type="submit"><Sprout size={17} /> Publish listing</button></form></div>; }

function AddListing({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', category: 'Vegetables', farmPrice: '', middlemanPrice: '', unit: 'kg', quantity: '', farmer: '', farmerPhone: '', farm: '', location: '', organic: true, productionMethod: 'Organic', harvest: '', description: '', photo: '' });
  const [verification, setVerification] = useState(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const capturePhoto = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => update('photo', reader.result); reader.readAsDataURL(file); };
  const apiUrl = import.meta.env.VITE_DELIVERY_API_URL || 'http://localhost:8787';
  const publish = async (photo = form.photo, verificationToken = verification?.verificationToken) => {
    setBusy(true); setError('');
    try {
      let uploadedPhoto = photo;
      if (photo) {
        const uploadResponse = await fetch(`${apiUrl}/api/uploads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageData: photo, verificationToken }) });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || 'Image upload failed.');
        uploadedPhoto = `${apiUrl}${uploadResult.url}`;
      }
      onAdd({ ...form, photo: uploadedPhoto, farmPrice: Number(form.farmPrice), middlemanPrice: Number(form.middlemanPrice), quantity: Number(form.quantity), description: form.description || 'Fresh produce, grown with care.' });
    } catch (uploadError) { setError(uploadError.message); } finally { setBusy(false); }
  };
  const requestVerification = async () => {
    setBusy(true); setError('');
    try {
      const response = await fetch(`${apiUrl}/api/upload-verification/request`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: form.farmerPhone }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send WhatsApp code.');
      setVerification(result);
      if (result.devOtp) setOtp(result.devOtp);
    } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  };
  const verifyAndPublish = async () => {
    setBusy(true); setError('');
    try {
      const response = await fetch(`${apiUrl}/api/upload-verification/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ challengeId: verification.challengeId, code: otp }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Verification failed.');
      setVerification({ ...verification, verificationToken: result.verificationToken });
      await publish(form.photo, result.verificationToken);
    } catch (verifyError) { setError(verifyError.message); setBusy(false); }
  };
  const submit = (event) => {
    event.preventDefault();
    if (form.photo && !verification) { void requestVerification(); return; }
    if (form.photo && !verification.verificationToken) return;
    void publish();
  };
  return <div className="modal-backdrop"><form className="modal add-modal detailed-form" onSubmit={submit}>
    <button type="button" className="close-button" onClick={onClose}><X size={19} /></button>
    <div className="eyebrow"><span></span> NEW HARVEST</div><h2>List your produce</h2>
    <p className="modal-description">Add clear details so buyers know exactly what they are ordering and who grew it.</p>
    <div className="form-section-title"><Sprout size={16} /> Produce details</div>
    <div className="form-grid">
      <label className="field wide"><span>Produce name</span><input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Red Lady Papaya" /></label>
      <label className="field"><span>Category</span><select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="field"><span>Sold by</span><select value={form.unit} onChange={(event) => update('unit', event.target.value)}><option>kg</option><option>dozen</option><option>litre</option><option>crate</option><option>bunch</option></select></label>
    </div>
    <div className="form-section-title"><CircleDollarSign size={16} /> Price and stock</div>
    <div className="form-grid">
      <label className="field"><span>Your farm price (₹ / unit)</span><input required type="number" min="1" value={form.farmPrice} onChange={(event) => update('farmPrice', event.target.value)} placeholder="22" /></label>
      <label className="field"><span>Typical market price (₹ / unit)</span><input required type="number" min="1" value={form.middlemanPrice} onChange={(event) => update('middlemanPrice', event.target.value)} placeholder="45" /></label>
      <label className="field"><span>Available quantity</span><input required type="number" min="1" step="0.1" value={form.quantity} onChange={(event) => update('quantity', event.target.value)} placeholder="150" /></label>
      <label className="field"><span>Production method</span><select value={form.productionMethod} onChange={(event) => update('productionMethod', event.target.value)}><option>Organic</option><option>Natural</option><option>Conventional</option></select></label>
      <label className="field checkbox-field"><input type="checkbox" checked={form.organic} onChange={(event) => update('organic', event.target.checked)} /><span>Organically grown</span></label>
    </div>
    <div className="form-section-title"><MapPin size={16} /> Farm details</div>
    <div className="form-grid">
      <label className="field"><span>Farmer name</span><input required value={form.farmer} onChange={(event) => update('farmer', event.target.value)} placeholder="Your full name" /></label>
      <label className="field"><span>WhatsApp number</span><input required type="tel" value={form.farmerPhone} onChange={(event) => update('farmerPhone', event.target.value)} placeholder="+91 98765 43210" /></label>
      <label className="field"><span>Farm name</span><input required value={form.farm} onChange={(event) => update('farm', event.target.value)} placeholder="Your farm or co-op" /></label>
      <label className="field wide"><span>Farm location</span><input required value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Village, district, state" /></label>
      <label className="field wide"><span>Harvest note</span><input value={form.harvest} onChange={(event) => update('harvest', event.target.value)} placeholder="Harvested today, sun-dried last week..." /></label>
      <label className="field wide"><span>Short description</span><textarea rows="3" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Tell buyers how it is grown or what makes it special." /></label>
      <label className="field wide photo-field"><span>Product photo</span><span className="camera-input"><Camera size={16} /><b>{form.photo ? 'Change photo' : 'Add a photo'}</b><small>{form.photo ? 'Tap to choose a different image' : 'Upload from your device or take a farm photo'}</small><input type="file" accept="image/*" capture="environment" onChange={capturePhoto} /></span>{form.photo && <img className="listing-preview" src={form.photo} alt="Harvest preview" />}</label>
    </div>
    {error && <p className="auth-error">{error}</p>}
    {verification && !verification.verificationToken && <div className="upload-verification"><strong><MessageCircle size={15} /> WhatsApp verification</strong><span>Enter the 6-digit code sent to {form.farmerPhone}.</span><input inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} placeholder="000000" /><button className="secondary-button" type="button" disabled={busy || otp.length !== 6} onClick={verifyAndPublish}>{busy ? 'Verifying...' : 'Verify & publish'}</button></div>}
    {!verification?.verificationToken && verification?.devOtp && <p className="auth-success">Development mode: code filled automatically.</p>}
    {!verification && <button className="primary-button full-button" type="submit" disabled={busy}><Sprout size={17} /> {busy ? 'Sending code...' : form.photo ? 'Verify WhatsApp & publish' : 'Publish listing'}</button>}
  </form></div>;
}

function AuthModal({ mode, onModeChange, onClose, onAuthenticated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState('consumer');
  const [registerRole, setRegisterRole] = useState('consumer');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isReset = mode === 'reset';

  const submit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (isReset) {
      localStorage.setItem('farmdirect-password-reset', JSON.stringify({ email: normalizedEmail, requestedAt: new Date().toISOString() }));
      setMessage(`Reset request prepared for ${normalizedEmail}. Open your email app to continue.`);
      return;
    }
    const accounts = load('farmdirect-accounts', []);
    if (mode === 'register') {
      if (name.trim().length < 2) {
        setError('Enter your name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (accounts.some((account) => account.email === normalizedEmail)) {
        setError('That email is already registered.');
        return;
      }
      const account = { name: name.trim(), email: normalizedEmail, password, role: registerRole };
      localStorage.setItem('farmdirect-accounts', JSON.stringify([...accounts, account]));
      onAuthenticated({ name: account.name, email: account.email, role: account.role });
      return;
    }
    const account = accounts.find((entry) => entry.email === normalizedEmail && entry.password === password);
    if (!account) {
      setError('Email or password is incorrect.');
      return;
    }
    onAuthenticated({ name: account.name, email: account.email, role: loginRole });
  };

  const title = isReset ? 'Reset your password' : mode === 'register' ? 'Create your account' : 'Welcome back';
  return <div className="modal-backdrop"><div className="modal auth-modal">
    <button className="close-button" onClick={onClose} aria-label="Close"><X size={19} /></button>
    <div className="auth-panel"><div className="auth-icon"><KeyRound size={25} /></div><div className="eyebrow"><span></span> FARMERS A TO Z</div><h2>{title}</h2><p>{isReset ? 'We will prepare a password reset request for your email address.' : 'Keep your orders, savings, and farm connections together.'}</p></div>
    <form className="auth-form" onSubmit={submit}>
      {!isReset && mode === 'register' && <label className="field"><span>Full name</span><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" /></label>}
      <label className="field"><span><Mail size={12} /> Email address</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
      {!isReset && <label className="field"><span><LockKeyhole size={12} /> Password</span><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /></label>}
      {!isReset && mode === 'register' && <label className="field"><span>Create account as</span><select value={registerRole} onChange={(event) => setRegisterRole(event.target.value)}><option value="consumer">Consumer</option><option value="farmer">Farmer</option><option value="delivery">Delivery partner</option></select></label>}
      {!isReset && mode === 'login' && <label className="field"><span>Log in as</span><select value={loginRole} onChange={(event) => setLoginRole(event.target.value)}><option value="consumer">Consumer</option><option value="farmer">Farmer</option><option value="delivery">Delivery partner</option></select></label>}
      {error && <p className="auth-error">{error}</p>}{message && <p className="auth-success">{message}</p>}
      <button className="primary-button full-button" type="submit">{isReset ? <><Mail size={16} /> Prepare reset email</> : mode === 'register' ? <><LogIn size={16} /> Create account</> : <><LogIn size={16} /> Log in</>}</button>
      {isReset && <a className="email-link" href={`mailto:${email}?subject=Farmers%20A%20to%20Z%20password%20reset`}>Open email app</a>}
      {!isReset && mode === 'login' && <button className="text-button" type="button" onClick={() => onModeChange('reset')}>Forgot password?</button>}
      {isReset ? <button className="text-button" type="button" onClick={() => onModeChange('login')}>Back to login</button> : <p className="auth-switch">{mode === 'register' ? 'Already have an account?' : 'New to Farmers A to Z?'} <button type="button" onClick={() => onModeChange(mode === 'register' ? 'login' : 'register')}>{mode === 'register' ? 'Log in' : 'Create account'}</button></p>}
    </form>
  </div></div>;
}

function PaymentScannerHost() {
  const [scanning, setScanning] = useState(false);
  const [qrPayment, setQrPayment] = useState(null);
  useEffect(() => {
    const handlePaymentChoice = (event) => {
      if (event.target.matches('.payment-field select') && ['PhonePe', 'Google Pay'].includes(event.target.value)) {
        const checkout = event.target.closest('.cart-list, .modal-content');
        const totalText = checkout?.querySelector('.order-summary strong')?.textContent || checkout?.querySelector('.cart-total strong')?.textContent || '0';
        const deliveryText = checkout?.querySelector('.delivery-breakdown strong')?.textContent || '';
        const amount = (Number(totalText.replace(/[^0-9.]/g, '')) || 0) + (checkout?.querySelector('.order-summary strong') ? 0 : Number(deliveryText.replace(/[^0-9.]/g, '')) || 0);
        setQrPayment({ method: event.target.value, amount });
      }
    };
    document.addEventListener('change', handlePaymentChoice);
    return () => document.removeEventListener('change', handlePaymentChoice);
  }, []);
  if (scanning) return <PaymentScanner onClose={() => setScanning(false)} onScan={(value) => { setScanning(false); window.location.href = value; }} />;
  if (!qrPayment) return null;
  return <UpiQrModal method={qrPayment.method} amount={qrPayment.amount} onClose={() => setQrPayment(null)} onScan={() => { setQrPayment(null); setScanning(true); }} onOpenApp={() => { openPaymentApp(qrPayment.method, qrPayment.amount); setQrPayment(null); }} />;
}

function WhatsAppSupport() {
  return <a className="whatsapp-support" href={whatsappLink('+919876543210', 'Hello, I am a farmer and need help with Farmers A to Z.')} target="_blank" rel="noreferrer" title="Chat with Farmers A to Z on WhatsApp"><MessageCircle size={18} /><span>WhatsApp help</span></a>;
}

createRoot(document.getElementById('root')).render(<><LanguageProvider><App /></LanguageProvider><PaymentScannerHost /><WhatsAppSupport /></>);