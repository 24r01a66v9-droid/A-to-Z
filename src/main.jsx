import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, BarChart3, Check, ChevronDown, CircleDollarSign, Clock3,
  Camera, Leaf, MapPin, Menu, MessageCircle, Minus, PackageCheck, Phone, Plus, Radar, Search, Send, ShoppingBasket,
  Axe, Clock, KeyRound, LockKeyhole, LogIn, LogOut, Mail, Route, ShieldCheck, Sprout, Star, Store, TrendingDown, Truck, UserRound, X, Zap
} from 'lucide-react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const seedProduce = [
  { id: 1, name: 'Organic Vine Tomatoes', category: 'Vegetables', farmPrice: 22, middlemanPrice: 45, unit: 'kg', quantity: 150, farmer: 'Ramesh Patel', farm: 'Green Valley Organic Farm', location: 'Pune District, Maharashtra', organic: true, harvest: 'Harvested today', color: 'tomato', description: 'Sun-ripened tomatoes picked fresh at dawn, with zero synthetic pesticides.' },
  { id: 2, name: 'Farm Fresh Potatoes', category: 'Vegetables', farmPrice: 18, middlemanPrice: 32, unit: 'kg', quantity: 400, farmer: 'Gurpreet Singh', farm: 'Golden Fields Agro', location: 'Jalandhar, Punjab', organic: false, harvest: '2 days ago', color: 'potato', description: 'Firm, soil-dusted tubers direct from harvest. Perfect for boiling and roasting.' },
  { id: 3, name: 'Natural Alphonso Mangoes', category: 'Fruits', farmPrice: 450, middlemanPrice: 850, unit: 'dozen', quantity: 45, farmer: 'Subhash Sawant', farm: 'Konkan Heritage Orchards', location: 'Ratnagiri, Maharashtra', organic: true, harvest: 'Freshly picked', color: 'mango', description: 'Hand-plucked Devgad Alphonsos, naturally straw-ripened with intense sweetness.' },
  { id: 4, name: 'Crisp Shimla Apples', category: 'Fruits', farmPrice: 90, middlemanPrice: 160, unit: 'kg', quantity: 200, farmer: 'Tara Chand Verma', farm: 'Himalayan Breeze Orchard', location: 'Kotgarh, Himachal Pradesh', organic: true, harvest: '3 days ago', color: 'apple', description: 'High-altitude mountain apples with a crisp bite and sweet-tart crunch.' },
  { id: 5, name: 'Sharbati Golden Wheat', category: 'Grains', farmPrice: 38, middlemanPrice: 65, unit: 'kg', quantity: 1000, farmer: 'Balram Chouhan', farm: 'Narmada Soil Agro', location: 'Sehore, Madhya Pradesh', organic: true, harvest: 'Recent harvest', color: 'wheat', description: 'Unpolished, protein-rich grain that yields soft, sweet rotis.' },
  { id: 6, name: 'Organic Toor Dal', category: 'Pulses', farmPrice: 120, middlemanPrice: 195, unit: 'kg', quantity: 350, farmer: 'Anasuya Devi', farm: 'Gramodaya Women Farmers Co-op', location: 'Gulbarga, Karnataka', organic: true, harvest: 'Sun-dried last week', color: 'dal', description: 'Unpolished native yellow lentils with an authentic earthy aroma.' },
  { id: 7, name: 'Pure Wild Forest Honey', category: 'Honey', farmPrice: 340, middlemanPrice: 580, unit: 'kg', quantity: 60, farmer: 'Bhimrao Korva', farm: 'Satpura Tribal Bio-Reserve', location: 'Hoshangabad, Madhya Pradesh', organic: true, harvest: 'Raw and unfiltered', color: 'honey', description: 'Raw multi-flora forest honey collected by local beekeepers.' },
  { id: 8, name: 'Fresh A2 Gir Cow Milk', category: 'Dairy', farmPrice: 60, middlemanPrice: 90, unit: 'litre', quantity: 80, farmer: 'Devendra Joshi', farm: 'Gokul Desi Gaushala', location: 'Anand, Gujarat', organic: true, harvest: 'Fresh morning batch', color: 'milk', description: 'Pure grass-fed indigenous Gir cow milk, rich in natural nutrients.' },
  { id: 9, name: 'Fresh Marigold Flowers', category: 'Flowers', farmPrice: 80, middlemanPrice: 140, unit: 'kg', quantity: 120, farmer: 'Lakshmi Reddy', farm: 'Sunrise Flower Farm', location: 'Karnal, Haryana', organic: true, harvest: 'Picked this morning', color: 'flower', description: 'Bright marigolds for hotels, caterers, temples, and celebrations.' }
];

const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Honey', 'Flowers'];
const buyerTypes = ['Household', 'Caterer', 'Supermarket', 'Hotel'];
const deliveryPartners = ['Anil Kumar', 'Meena Logistics', 'GreenRoute Partner'];
const deliveryChargePerKm = 20;
const adminEmail = 'morubagalmanaswinisharma@gmail.com';
const adminPassword = 'presentlovenoregret69';
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
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const LanguageContext = createContext(null);
const translations = {
  en: { marketplace: 'Marketplace', radar: 'Demand Radar', calculator: 'Zero cut', orders: 'Orders', farmer: 'Farmer hub', consumer: 'Consumer', farmerRole: 'Farmer', login: 'Log in', directSource: 'DIRECT FROM THE SOURCE', goodFood: 'Good food.', fairlyPriced: 'Fairly priced.', explore: 'Explore the harvest', weeklyHarvest: 'THE WEEKLY HARVEST', findStaple: 'Find your next staple', searchProduce: 'Search produce, farms, or places', radarKicker: 'AI-POWERED MARKET SIGNALS', demandRadar: 'Demand radar', demandIntro: 'See where demand is rising before you plant, price, or move your harvest.', liveSignals: 'LIVE SIGNALS', searchDemand: 'Search a produce to see demand...', aiSearch: 'AI SEARCH', telanganaNetwork: 'TELANGANA NETWORK', demandAcross: 'Demand across the state', aiReadout: 'AI READOUT', growNext: 'What to grow next', noSignal: 'No matching demand signal yet', tryTracked: 'Try one of the tracked crops to see a live market recommendation.', low: 'Low', medium: 'Medium', high: 'High' },
  hi: { marketplace: 'बाज़ार', radar: 'मांग रडार', calculator: 'बिचौलिया मुक्त', orders: 'ऑर्डर', farmer: 'किसान केंद्र', consumer: 'ग्राहक', farmerRole: 'किसान', login: 'लॉग इन', directSource: 'सीधे खेत से', goodFood: 'अच्छा खाना।', fairlyPriced: 'उचित कीमत पर।', explore: 'फसल देखें', weeklyHarvest: 'साप्ताहिक फसल', findStaple: 'अपनी अगली फसल खोजें', searchProduce: 'फसल, खेत या जगह खोजें', radarKicker: 'एआई बाज़ार संकेत', demandRadar: 'मांग रडार', demandIntro: 'बोने, कीमत तय करने या फसल भेजने से पहले बढ़ती मांग देखें।', liveSignals: 'लाइव संकेत', searchDemand: 'मांग देखने के लिए फसल खोजें...', aiSearch: 'एआई खोज', telanganaNetwork: 'तेलंगाना नेटवर्क', demandAcross: 'राज्य में मांग', aiReadout: 'एआई जानकारी', growNext: 'अगली फसल क्या उगाएं', noSignal: 'कोई मिलती मांग नहीं मिली', tryTracked: 'लाइव सुझाव के लिए सूचीबद्ध फसल खोजें।', low: 'कम', medium: 'मध्यम', high: 'अधिक' },
  te: { marketplace: 'మార్కెట్', radar: 'డిమాండ్ రాడార్', calculator: 'మధ్యవర్తులు లేరు', orders: 'ఆర్డర్లు', farmer: 'రైతు కేంద్రం', consumer: 'వినియోగదారు', farmerRole: 'రైతు', login: 'లాగిన్', directSource: 'పొలం నుంచే నేరుగా', goodFood: 'మంచి ఆహారం.', fairlyPriced: 'న్యాయమైన ధరలో.', explore: 'పంటను చూడండి', weeklyHarvest: 'ఈ వారం పంట', findStaple: 'మీకు కావాల్సిన పంటను కనుగొనండి', searchProduce: 'పంట, పొలం లేదా ప్రాంతాన్ని వెతకండి', radarKicker: 'ఏఐ మార్కెట్ సంకేతాలు', demandRadar: 'డిమాండ్ రాడార్', demandIntro: 'విత్తే ముందు, ధర నిర్ణయించే ముందు లేదా పంటను పంపే ముందు పెరుగుతున్న డిమాండ్‌ను చూడండి.', liveSignals: 'లైవ్ సంకేతాలు', searchDemand: 'డిమాండ్ చూడటానికి పంటను వెతకండి...', aiSearch: 'ఏఐ శోధన', telanganaNetwork: 'తెలంగాణ నెట్‌వర్క్', demandAcross: 'రాష్ట్రవ్యాప్తంగా డిమాండ్', aiReadout: 'ఏఐ సమాచారం', growNext: 'తర్వాత ఏ పంట పండించాలి', noSignal: 'సరిపోలే డిమాండ్ సంకేతం లేదు', tryTracked: 'లైవ్ సూచన కోసం అందుబాటులో ఉన్న పంటను వెతకండి.', low: 'తక్కువ', medium: 'మధ్యస్థం', high: 'ఎక్కువ' }
};
function LanguageProvider({ children }) { const [language, setLanguage] = useState(() => load('farmdirect-language', 'en')); const changeLanguage = (value) => { setLanguage(value); localStorage.setItem('farmdirect-language', value); }; const t = (key) => translations[language]?.[key] || translations.en[key] || key; return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>{children}</LanguageContext.Provider>; }
function useLanguage() { return useContext(LanguageContext); }

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [produce, setProduce] = useState(() => load('farmdirect-produce', seedProduce));
  const [orders, setOrders] = useState(() => load('farmdirect-orders', []));
  const [tab, setTab] = useState('market');
  const [role, setRole] = useState(() => load('farmdirect-role', load('farmdirect-user', null)?.role || 'consumer'));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [buyerType, setBuyerType] = useState('Household');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => load('farmdirect-user', null));
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [cart, setCart] = useState([]);
  useEffect(() => localStorage.setItem('farmdirect-produce', JSON.stringify(produce)), [produce]);
  useEffect(() => localStorage.setItem('farmdirect-orders', JSON.stringify(orders)), [orders]);
  const filtered = useMemo(() => produce.filter((item) => {
    const haystack = `${item.name} ${item.farmer} ${item.location} ${item.category}`.toLowerCase();
    return (category === 'All' || item.category === category) && haystack.includes(query.toLowerCase());
  }), [produce, category, query]);
  const placeOrder = (item, quantity, buyer, address, distanceKm, deliveryWindow) => {
    const placedAt = new Date();
    const deliveryCharge = distanceKm * deliveryChargePerKm;
    const order = { id: Date.now(), itemId: item.id, name: item.name, farm: item.farm, farmer: item.farmer, quantity, unit: item.unit, total: item.farmPrice * quantity + deliveryCharge, productTotal: item.farmPrice * quantity, deliveryCharge, distanceKm, middlemanTotal: item.middlemanPrice * quantity, savings: (item.middlemanPrice - item.farmPrice) * quantity, buyer, address, deliveryWindow, placedAt: placedAt.toISOString(), date: placedAt.toLocaleDateString('en-IN'), estimatedDelivery: deliveryWindow === '30 minutes' ? new Date(placedAt.getTime() + 30 * 60000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : deliveryWindow, status: 'Awaiting assignment', partner: '' };
    setOrders((current) => [order, ...current]);
    setProduce((current) => current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity - quantity } : entry));
    setSelected(null); setTab('orders');
  };
  const addListing = (listing) => { setProduce((current) => [{ ...listing, id: Date.now(), color: 'leaf' }, ...current]); setShowAdd(false); setTab('farmer'); };
  const handleAuth = (user) => { const nextRole = user.role || 'consumer'; setCurrentUser(user); setRole(nextRole); localStorage.setItem('farmdirect-user', JSON.stringify(user)); localStorage.setItem('farmdirect-role', nextRole); setShowAuth(false); setTab(nextRole === 'admin' ? 'operations' : nextRole === 'farmer' ? 'farmer' : 'market'); };
  const handleLogout = () => { setCurrentUser(null); localStorage.removeItem('farmdirect-user'); localStorage.removeItem('farmdirect-role'); setRole('consumer'); setTab('market'); };
  const requireLogin = (action) => { if (!currentUser) { setAuthMode('login'); setShowAuth(true); return; } action(); };
  const addToCart = (item) => setCart((current) => [...current, { ...item, cartId: `${item.id}-${Date.now()}` }]);
  const handleProduceSelect = (item) => requireLogin(() => setSelected(item));
  const handleRoleChange = () => { if (role === 'admin') return; const nextRole = role === 'consumer' ? 'farmer' : 'consumer'; setRole(nextRole); localStorage.setItem('farmdirect-role', nextRole); setTab(nextRole === 'farmer' ? 'farmer' : 'market'); };
  const navItems = role === 'admin'
    ? [['reviews', 'Reviews', Star], ['orders', t('orders'), Truck]]
    : role === 'farmer'
    ? [['farmer', t('farmer'), Sprout], ['connect', 'Retail Connect', MessageCircle], ['radar', t('radar'), Radar], ['orders', t('orders'), Truck], ['reviews', 'Reviews', Star]]
    : [['market', t('marketplace'), Store], ['radar', t('radar'), Radar], ['connect', 'Retail Connect', MessageCircle], ['orders', t('orders'), Truck], ['reviews', 'Reviews', Star]];
  return <div className="app-shell">
    <header className="topbar"><div className="brand" onClick={() => setTab(role === 'admin' ? 'operations' : role === 'farmer' ? 'farmer' : 'market')}><div className="brand-mark farmer-logo" aria-label="Indian farmer logo"><span role="img" aria-label="Indian farmer">👨🏾‍🌾</span></div><span>Farmers <span>A to Z</span></span></div><nav className="desktop-nav">{navItems.map(([key, label, Icon]) => <button className={tab === key ? 'active' : ''} key={key} onClick={() => setTab(key)}><Icon size={17} />{label}{key === 'orders' && orders.length > 0 && <b className="nav-count">{orders.length}</b>}</button>)}</nav><div className="top-actions"><label className="language-switcher"><span> भाषा / భాష</span><select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Choose language"><option value="en">English</option><option value="hi">हिन्दी</option><option value="te">తెలుగు</option></select></label><button className="cart-button" onClick={() => requireLogin(() => setTab('cart'))} title="Open cart"><ShoppingBasket size={16} /><span>Cart</span>{cart.length > 0 && <b>{cart.length}</b>}</button><button className={`role-switch ${role}-mode`} onClick={handleRoleChange} aria-label={`Switch to ${role === 'consumer' ? 'farmer' : 'consumer'} mode`}><UserRound size={15} /><span>{role === 'admin' ? 'Admin mode' : role === 'consumer' ? 'Consumer mode' : 'Farmer mode'}</span><ChevronDown size={14} /></button>{currentUser ? <button className="account-button" onClick={handleLogout} title="Log out"><LogOut size={15} /> {currentUser.name}</button> : <button className="account-button" onClick={() => { setAuthMode('login'); setShowAuth(true); }}><LogIn size={15} /> {t('login')}</button>}<button className="mobile-menu"><Menu size={20} /></button></div></header>
    <main>{tab === 'market' && <Marketplace produce={filtered} query={query} setQuery={setQuery} category={category} setCategory={setCategory} buyerType={buyerType} setBuyerType={setBuyerType} onSelect={handleProduceSelect} onAddToCart={(item) => requireLogin(() => addToCart(item))} />}{tab === 'connect' && <RetailConnect />}{tab === 'radar' && <DemandRadar />}{tab === 'calculator' && <Calculator />}{tab === 'orders' && <Orders orders={orders} />}{tab === 'cart' && <Cart items={cart} />}{tab === 'operations' && <OperationsDashboard orders={orders} onAssign={(id, partner) => setOrders((current) => current.map((order) => order.id === id ? { ...order, partner, status: 'Assigned to delivery partner' } : order))} />}{tab === 'reviews' && <Reviews />} {tab === 'farmer' && <><FarmerHub produce={produce} orders={orders} onAdd={() => setShowAdd(true)} onDelete={(id) => setProduce((current) => current.filter((item) => item.id !== id))} onBuyInput={(item) => requireLogin(() => addToCart(item))} /><FarmerSuggestions produce={produce} /></>}</main>
    <div className="mobile-nav">{navItems.map(([key, label, Icon]) => <button className={tab === key ? 'active' : ''} key={key} onClick={() => setTab(key)}><Icon size={19} /><span>{label.split(' ')[0]}</span></button>)}</div>
    {selected && <OrderModal item={selected} onClose={() => setSelected(null)} onPlace={placeOrder} />}{showAdd && <AddListing onClose={() => setShowAdd(false)} onAdd={addListing} />}{showAuth && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={() => setShowAuth(false)} onAuthenticated={handleAuth} />}
  </div>;
}

function Marketplace({ produce, query, setQuery, category, setCategory, buyerType, setBuyerType, onSelect, onAddToCart }) {
  const { t } = useLanguage();
  return <section className="market-page page-enter"><div className="hero-band"><div className="hero-copy"><div className="eyebrow"><span></span> {t('directSource')}</div><h1>{t('goodFood')}<br /><em>{t('fairlyPriced')}</em></h1><p>Meet the farmers behind your food. Buy fresh produce at farm-gate prices, with every rupee accounted for.</p><button className="primary-button" onClick={() => document.querySelector('.listing-section')?.scrollIntoView({ behavior: 'smooth' })}>{t('explore')} <ArrowRight size={17} /></button></div><div className="hero-art"><div className="sun"></div><div className="field field-one"></div><div className="field field-two"></div><span className="hero-label">THIS WEEK'S<br /><strong>FRESH PICK</strong></span><span className="hero-stamp">0%<small>MIDDLEMEN</small></span></div></div><div className="trust-row"><div><Check size={16} /> Prices set by farmers</div><div><Leaf size={16} /> Freshness you can trace</div><div><CircleDollarSign size={16} /> Average savings 38%</div></div><div className="listing-section"><div className="section-heading"><div><div className="eyebrow muted">{t('weeklyHarvest')}</div><h2>{t('findStaple')}</h2></div><span className="result-count">{produce.length} listings near you</span></div><div className="buyer-switch"><span>Buying for</span>{buyerTypes.map((type) => <button key={type} className={buyerType === type ? 'selected' : ''} onClick={() => setBuyerType(type)}>{type}</button>)}</div><div className="toolbar"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchProduce')} /></label><div className="category-row">{categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="produce-grid">{produce.map((item) => <ProduceCard key={item.id} item={item} onSelect={onSelect} onAddToCart={onAddToCart} />)}</div>{produce.length === 0 && <div className="empty-state">No harvests match that search. Try another crop or place.</div>}</div></section>;
}

function ProduceCard({ item, onSelect, onAddToCart }) { const savings = Math.round(((item.middlemanPrice - item.farmPrice) / item.middlemanPrice) * 100); const image = item.photo || produceImages[item.id]; return <article className="produce-card"><div className={`produce-image ${item.color}`} onClick={() => onSelect(item)}>{image ? <img className="produce-photo" src={image} alt={item.name} /> : <div className="produce-illustration"><span></span><span></span><span></span></div>}<span className="category-label">{item.category}</span>{item.organic && <span className="organic-label"><Leaf size={12} /> ORGANIC</span>}</div><div className="produce-body"><div className="produce-title"><div><h3>{item.name}</h3><p>{item.farm}</p></div><span className="savings-pill">-{savings}%</span></div><div className="location"><MapPin size={13} /> {item.location}</div><div className="price-line"><div><strong>{money(item.farmPrice)}</strong><span> / {item.unit}</span><del>{money(item.middlemanPrice)}</del></div><button className="buy-button" disabled={item.quantity <= 0} onClick={() => onAddToCart(item)}>{item.quantity > 0 ? 'Add to cart' : 'Sold out'} <ShoppingBasket size={15} /></button></div></div></article>; }

function RetailConnect() {
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [message, setMessage] = useState('');
  const [sentFarmer, setSentFarmer] = useState('');
  const farmers = seedProduce.slice(0, 4);
  const sendMessage = (event) => { event.preventDefault(); if (!message.trim() || !selectedFarmer) return; setSentFarmer(selectedFarmer.farmer); setMessage(''); };
  return <section className="connect-page page-enter">
    <div className="connect-heading"><div><div className="eyebrow"><span></span> FARM TO RETAIL, DIRECT</div><h1>Build better <em>farm connections.</em></h1><p>Retailers can discover reliable growers, discuss supply, and buy closer to the source.</p></div><div className="connect-status"><span></span> OPEN TO RETAILERS</div></div>
    <div className="connect-grid"><div className="farmer-directory"><div className="directory-top"><div><span className="panel-kicker">GROWER DIRECTORY</span><h2>Farmers ready to supply</h2></div><span>{farmers.length} active growers</span></div>{farmers.map((farmer) => <article className={`farmer-card ${selectedFarmer?.id === farmer.id ? 'selected' : ''}`} key={farmer.id}><div className={`farmer-avatar ${farmer.color}`}><Sprout size={23} /></div><div className="farmer-card-main"><div><h3>{farmer.farmer}</h3><p>{farmer.farm}</p></div><span className="farmer-location"><MapPin size={12} /> {farmer.location.split(',')[0]}</span><div className="supply-line"><strong>{farmer.name}</strong><span>{farmer.quantity} {farmer.unit} available</span></div></div><div className="farmer-card-actions"><button className="connect-button" onClick={() => setSelectedFarmer(farmer)}><MessageCircle size={15} /> Message</button><a className="phone-button" href={`tel:${farmer.id === 1 ? '+919876543210' : '+919812345678'}`} title={`Call ${farmer.farmer}`}><Phone size={15} /></a></div></article>)}</div><aside className="compose-panel"><div className="panel-kicker">DIRECT CONVERSATION</div><h2>{selectedFarmer ? `Message ${selectedFarmer.farmer}` : 'Start a supply conversation'}</h2>{selectedFarmer ? <><div className="compose-recipient"><div className={`farmer-avatar small ${selectedFarmer.color}`}><Sprout size={18} /></div><div><strong>{selectedFarmer.farm}</strong><span>{selectedFarmer.name} · {selectedFarmer.quantity} {selectedFarmer.unit} available</span></div></div><form onSubmit={sendMessage}><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about quantity, delivery, or a recurring order..." rows="5" /><button className="primary-button full-button" type="submit" disabled={!message.trim()}><Send size={16} /> Send supply request</button></form>{sentFarmer === selectedFarmer.farmer && <p className="sent-confirmation"><Check size={15} /> Message sent to {selectedFarmer.farmer}</p>}</> : <div className="compose-empty"><MessageCircle size={32} /><p>Select a farmer to discuss supply, pricing, and delivery directly.</p></div>}</aside></div>
  </section>;
}

function DemandRadar() {
  const { t } = useLanguage();
  const [cropQuery, setCropQuery] = useState('');
  const cities = [
    { name: 'Delhi NCR', crop: 'Tomato demand', produce: ['tomato', 'potato', 'apple'], change: '+21%', level: 'high', position: { top: '24%', left: '47%' } },
    { name: 'Mumbai', crop: 'Onion demand', produce: ['onion', 'mango', 'honey'], change: '+18%', level: 'high', position: { top: '57%', left: '31%' } },
    { name: 'Bengaluru', crop: 'Tur dal demand', produce: ['tur dal', 'dal', 'milk'], change: '+12%', level: 'medium', position: { top: '68%', left: '52%' } },
    { name: 'Kolkata', crop: 'Chilli demand', produce: ['chilli', 'wheat', 'grain'], change: '+9%', level: 'medium', position: { top: '43%', left: '77%' } }
  ];
  const normalizedQuery = cropQuery.trim().toLowerCase();
  const queryTerms = normalizedQuery.split(/\s+/).filter((term) => term.length > 2).map((term) => term.replace(/s$/, ''));
  const matchesProduce = (produceTerms) => !normalizedQuery || produceTerms.some((item) => queryTerms.some((term) => item.includes(term) || term.includes(item)));
  const matchingCity = cities.find((city) => matchesProduce(city.produce)) || cities[0];
  const hasMatch = !normalizedQuery || Boolean(cities.find((city) => matchesProduce(city.produce)));
  const searchedProduce = normalizedQuery || matchingCity.produce;
  return <section className="radar-page page-enter">
    <div className="radar-heading"><div><div className="eyebrow"><span></span> {t('radarKicker')}</div><h1>{t('demandRadar')}</h1><p>{t('demandIntro')}</p></div><div className="radar-status"><span></span> {t('liveSignals')} <small>Updated 12 min ago</small></div></div>
    <label className="radar-search"><Search size={18} /><input value={cropQuery} onChange={(event) => setCropQuery(event.target.value)} placeholder={t('searchDemand')} /><span>{t('aiSearch')}</span></label>
    <div className="radar-layout">
      <div className="radar-map-panel">
        <div className="radar-panel-top"><div><span className="panel-kicker">INDIA NETWORK</span><h2>{t('demandAcross')}</h2></div><div className="radar-legend"><span><i className="low"></i> {t('low')}</span><span><i className="medium"></i> {t('medium')}</span><span><i className="high"></i> {t('high')}</span></div></div>
        <div className="radar-map india-map" aria-label="India demand map showing Delhi NCR, Mumbai, Bengaluru, and Kolkata">
          <div className="map-grid"></div><div className="state-shape india-shape"><span></span></div><div className="state-label">INDIA</div>
          {cities.map((city) => <div className={`map-pin ${city.level}`} key={city.name} style={city.position}><span></span><b>{city.name}</b></div>)}
          <div className="map-callout"><span>{hasMatch ? 'DEMAND SIGNAL' : 'NO SIGNAL YET'}</span><strong>{hasMatch ? searchedProduce : cropQuery}</strong><b>{hasMatch ? `${matchingCity.change} in ${matchingCity.name}` : 'Try tomato, onion, tur dal, or chilli'}</b><ArrowRight size={15} /></div>
        </div>
      </div>
      <aside className="radar-insights"><div className="insight-header"><div><span className="panel-kicker">{t('aiReadout')}</span><h2>{t('growNext')}</h2></div><Radar size={20} /></div><div className={`radar-callout ${hasMatch ? '' : 'no-signal'}`}><div className="signal-icon"><TrendingDown size={18} /></div><div><strong>{hasMatch ? `Move ${searchedProduce} toward ${matchingCity.name}` : t('noSignal')}</strong><p>{hasMatch ? 'Demand is outpacing nearby supply this week.' : t('tryTracked')}</p></div><b>{hasMatch ? matchingCity.change : '?'}</b></div><div className="city-list">{cities.map((city) => <div className={`city-row ${city.name === matchingCity.name && hasMatch ? 'selected' : ''}`} key={city.name}><span className={`city-dot ${city.level}`}></span><div><strong>{city.name}</strong><small>{city.crop}</small></div><b>{city.change}</b><ArrowRight size={14} /></div>)}</div><div className="radar-footer"><MapPin size={15} /> 4 markets tracked <span>•</span> 28 signals analyzed</div></aside>
    </div>
  </section>;
}

function Calculator() { const [quantity, setQuantity] = useState(12); const farmPrice = 22 * quantity; const marketPrice = 45 * quantity; const saved = marketPrice - farmPrice; return <section className="tool-page page-enter"><div className="tool-intro"><div className="eyebrow"><span></span> SEE THE DIFFERENCE</div><h1>What does the middleman<br /><em>really cost you?</em></h1><p>Move the dial. Watch the extra layers disappear from your basket and your bill.</p></div><div className="calculator-layout"><div className="calculator-panel"><div className="panel-top"><span>CALCULATE YOUR SAVINGS</span><TrendingDown size={18} /></div><div className="quantity-display"><small>BUYING</small><strong>{quantity}<i> kg</i></strong><span>of vine tomatoes</span></div><input className="range" type="range" min="1" max="100" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /><div className="range-labels"><span>1 kg</span><span>100 kg</span></div><div className="price-compare"><div><span>Typical retail price</span><strong className="struck">{money(marketPrice)}</strong><small>includes 51% of middleman layers</small></div><div className="arrow-separator"><ArrowRight size={18} /></div><div className="fair-price"><span>Farmers A to Z price</span><strong>{money(farmPrice)}</strong><small>paid straight to the farm</small></div></div><div className="saved-total"><div><Zap size={18} /><span>You keep</span></div><strong>{money(saved)}</strong><small>in your pocket</small></div></div><div className="flow-panel"><div className="eyebrow muted">WHERE YOUR MONEY GOES</div><h2>One clean connection.</h2><p>With Farmers A to Z, your money travels a shorter, clearer distance.</p><div className="money-flow"><div className="flow-node farmer-node"><div><Sprout size={24} /></div><span>Farmer</span><strong>{money(farmPrice)}</strong></div><div className="flow-line direct"><span>100% of farm price</span></div><div className="flow-node buyer-node"><div><ShoppingBasket size={24} /></div><span>Your basket</span><strong>{money(farmPrice)}</strong></div><div className="flow-line middle"><span>retail route</span></div><div className="flow-node market-node"><div><Store size={24} /></div><span>Middlemen</span><strong>{money(saved)}</strong></div></div></div></div></section>; }

function Orders({ orders }) { const total = orders.reduce((sum, order) => sum + order.total, 0); const saved = orders.reduce((sum, order) => sum + order.savings, 0); return <section className="content-page page-enter"><div className="page-header"><div><div className="eyebrow"><span></span> YOUR FARM CONNECTIONS</div><h1>Orders & <em>savings</em></h1><p>Every order is a direct line to the people who grow your food.</p></div><div className="stat-cluster"><div><small>TOTAL SPENT</small><strong>{money(total)}</strong></div><div><small>YOU'VE SAVED</small><strong className="green-text">{money(saved)}</strong></div></div></div>{orders.length === 0 ? <div className="empty-orders"><PackageCheck size={44} /><h2>Your basket is waiting</h2><p>Orders you place from the marketplace will appear here.</p></div> : <div className="orders-list">{orders.map((order) => <article className="order-row" key={order.id}><div className="order-icon"><Truck size={21} /></div><div className="order-main"><div><h3>{order.name}</h3><p>{order.farm} · {order.date}</p></div><span className="status"><span></span>{order.status}</span></div><div className="order-amount"><strong>{money(order.total)}</strong><span>Saved {money(order.savings)}</span></div><ChevronDown size={18} /></article>)}</div>}</section>; }

function FarmerHub({ produce, orders, onAdd, onDelete, onBuyInput }) { const revenue = orders.reduce((sum, order) => sum + order.total, 0); const inputs = [{ name: 'Neem Shield Bio-pesticide', type: 'Pesticide', price: 499, discount: produce.some((item) => item.organic) ? '15% farmer offer' : '10% farmer offer' }, { name: 'Organic Soil Booster', type: 'Fertilizer', price: 699, discount: produce.some((item) => item.category === 'Flowers') ? '20% flower grower offer' : '12% farmer offer' }, { name: 'Drip Irrigation Starter Kit', type: 'Farm supply', price: 1299, discount: '8% direct grower offer' }]; return <section className="content-page page-enter"><div className="page-header farmer-header"><div><div className="eyebrow"><span></span> YOUR FARM, YOUR TERMS</div><h1>Farmer <em>hub</em></h1><p>Manage your harvest, reach buyers, and source what your farm needs.</p></div><button className="primary-button" onClick={onAdd}><Plus size={17} /> Add a listing</button></div><div className="dashboard-stats"><div><Sprout size={19} /><small>ACTIVE LISTINGS</small><strong>{produce.length}</strong></div><div><CircleDollarSign size={19} /><small>DIRECT REVENUE</small><strong>{money(revenue)}</strong></div><div><PackageCheck size={19} /><small>ORDERS RECEIVED</small><strong>{orders.length}</strong></div><div><BarChart3 size={19} /><small>YOUR REACH</small><strong>{new Set(orders.map((order) => order.buyer)).size || 0} buyers</strong></div></div><div className="hub-grid"><div className="hub-panel"><div className="panel-heading"><div><div className="eyebrow muted">YOUR HARVEST</div><h2>Active listings</h2></div><span>{produce.length} crops</span></div>{produce.map((item) => <div className="listing-row" key={item.id}><div className={`mini-produce ${item.color}`}></div><div><strong>{item.name}</strong><span>{item.quantity} {item.unit} available · {money(item.farmPrice)}/{item.unit}</span></div><button className="icon-button" title="Delete listing" onClick={() => onDelete(item.id)}><X size={16} /></button></div>)}</div><div className="hub-panel incoming"><div className="panel-heading"><div><div className="eyebrow muted">INCOMING</div><h2>Recent orders</h2></div></div>{orders.length === 0 ? <div className="mini-empty"><Clock3 size={20} /> No orders yet</div> : orders.slice(0, 4).map((order) => <div className="incoming-row" key={order.id}><div><strong>{order.name}</strong><span>{order.quantity} {order.unit} · {order.buyer}</span></div><b>{money(order.total)}</b></div>)}</div></div><div className="input-shop"><div className="panel-heading"><div><div className="eyebrow muted">FARM INPUTS</div><h2>Stock up for less</h2></div><span>Offers matched to your farm</span></div><div className="input-grid">{inputs.map((input) => <article className="input-card" key={input.name}><span className="input-type">{input.type}</span><h3>{input.name}</h3><strong>{money(input.price)}</strong><small>{input.discount}</small><button className="buy-input" onClick={() => onBuyInput({ ...input, category: 'Farm input', unit: 'item', quantity: 1, farm: 'FarmDirect Inputs', middlemanPrice: input.price })}>Buy now <ShoppingBasket size={14} /></button></article>)}</div></div></section>; }

function Cart({ items }) { const total = items.reduce((sum, item) => sum + (item.price || item.farmPrice || 0), 0); return <section className="content-page page-enter"><div className="page-header"><div><div className="eyebrow"><span></span> YOUR SHOPPING BAG</div><h1>Cart & <em>checkout</em></h1><p>Review produce and farm supplies before placing your order.</p></div></div>{items.length === 0 ? <div className="empty-orders"><ShoppingBasket size={44} /><h2>Your cart is empty</h2><p>Add produce or farm inputs to see them here.</p></div> : <div className="cart-list">{items.map((item) => <div className="cart-row" key={item.cartId}><div><strong>{item.name}</strong><span>{item.category} · {item.discount || 'Direct farm price'}</span></div><b>{money(item.price || item.farmPrice)}</b></div>)}<div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div><button className="primary-button full-button"><Check size={16} /> Continue to checkout</button></div>}</section>; }

function OperationsDashboard({ orders, onAssign }) {
  const [view, setView] = useState('admin');
  return <section className="content-page page-enter"><div className="page-header"><div><div className="eyebrow"><span></span> DELIVERY CONTROL CENTRE</div><h1>Operations <em>dashboard</em></h1><p>Assign orders to delivery partners and keep farmers and buyers updated.</p></div><div className="ops-mode"><button className={view === 'admin' ? 'selected' : ''} onClick={() => setView('admin')}><ShieldCheck size={14} /> Admin</button><button className={view === 'partner' ? 'selected' : ''} onClick={() => setView('partner')}><Truck size={14} /> Delivery partner</button></div></div>{view === 'admin' ? <div className="ops-panel"><div className="panel-heading"><div><div className="eyebrow muted">DELIVERY PARTNERS</div><h2>Choose who is on route</h2></div><span>{deliveryPartners.length} available</span></div><div className="partner-roster">{deliveryPartners.map((partner) => <div className="partner-roster-card" key={partner}><div className="partner-avatar"><Truck size={17} /></div><div><strong>{partner}</strong><span>Available for assignment</span></div><b>Available</b></div>)}</div><div className="panel-heading order-assignment-heading"><div><div className="eyebrow muted">ADMIN ASSIGNMENT</div><h2>Orders waiting for a driver</h2></div><span>{orders.length} total orders</span></div>{orders.length === 0 ? <div className="mini-empty"><Clock size={20} /> Orders will appear here after checkout.</div> : <div className="delivery-orders">{orders.map((order) => <div className="delivery-order" key={order.id}><div className="order-icon"><Truck size={19} /></div><div><strong>{order.name}</strong><span>{order.buyer} · {order.address || 'Address pending'} · {order.distanceKm || 0} km</span><small>Placed {order.date} · {order.deliveryWindow || 'Timing pending'} · {order.estimatedDelivery || 'To be confirmed'}</small></div><select value={order.partner || ''} onChange={(event) => onAssign(order.id, event.target.value)}><option value="">Assign partner</option>{deliveryPartners.map((partner) => <option key={partner}>{partner}</option>)}</select></div>)}</div>}</div> : <div className="partner-panel"><div className="partner-hero"><Truck size={27} /><div><span className="panel-kicker">TODAY'S ROUTE</span><h2>Deliveries for GreenRoute Partner</h2><p>Open the assigned order, call the buyer, and mark delivery complete.</p></div></div>{orders.filter((order) => order.partner).map((order) => <div className="partner-order" key={order.id}><div><strong>{order.name}</strong><span>{order.address || 'Address pending'} · {order.distanceKm || 0} km</span></div><b>{order.status}</b></div>)}{!orders.some((order) => order.partner) && <div className="mini-empty"><Route size={20} /> No assigned routes yet.</div>}</div>}</section>;
}

function Reviews() {
  const reviews = [{ name: 'Priya Menon', role: 'Hotel buyer', rating: 5, text: 'Fresh produce arrived on time and the farmer communication was clear.' }, { name: 'Arjun Foods', role: 'Caterer', rating: 4, text: 'The direct pricing is transparent. We can plan weekly supply with confidence.' }, { name: 'Meena Organics', role: 'Farmer', rating: 5, text: 'Retail Connect helps me understand what buyers need before harvest.' }];
  return <section className="content-page page-enter"><div className="page-header"><div><div className="eyebrow"><span></span> TRUST ACROSS THE NETWORK</div><h1>Reviews & <em>feedback</em></h1><p>Farmers, retailers, delivery partners, and shoppers build trust together.</p></div></div><div className="review-grid">{reviews.map((review) => <article className="review-card" key={review.name}><div className="review-top"><div className="review-avatar"><UserRound size={17} /></div><div><strong>{review.name}</strong><span>{review.role}</span></div><div className="stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < review.rating ? 'currentColor' : 'none'} />)}</div></div><p>{review.text}</p></article>)}</div><div className="review-form"><div><span className="panel-kicker">SHARE YOUR EXPERIENCE</span><h2>Help the next farmer or buyer choose well.</h2></div><textarea placeholder="Write a review about a farmer, order, or delivery partner..." rows="3" /><button className="primary-button"><Star size={16} /> Publish review</button></div></section>;
}


function FarmerSuggestions({ produce }) {
  const suggestions = produce.some((item) => item.category === 'Flowers') ? ['Bundle marigolds with a morning delivery slot for hotels.', 'Add a repeat supply offer for caterers before festival weeks.'] : ['Use Demand Radar before planting your next batch.', 'Add a clear harvest date and production method to improve buyer trust.'];
  return <section className="suggestions-panel"><div className="eyebrow muted">FARMER COACH</div><h2>Suggestions for your next sale</h2><div className="suggestion-list">{suggestions.map((suggestion) => <div key={suggestion}><Sprout size={16} /><span>{suggestion}</span></div>)}</div></section>;
}
function OrderModal({ item, onClose, onPlace }) { const [quantity, setQuantity] = useState(1); const [buyer, setBuyer] = useState(''); const [address, setAddress] = useState(''); const [distanceKm, setDistanceKm] = useState(5); const [deliveryWindow, setDeliveryWindow] = useState('30 minutes'); const productTotal = quantity * item.farmPrice; const deliveryCharge = distanceKm * deliveryChargePerKm; const total = productTotal + deliveryCharge; return <div className="modal-backdrop"><div className="modal"><button className="close-button" onClick={onClose}><X size={19} /></button><div className={`modal-image produce-image ${item.color}`}>{produceImages[item.id] ? <img className="produce-photo" src={produceImages[item.id]} alt={item.name} /> : <div className="produce-illustration"><span></span><span></span><span></span></div>}</div><div className="modal-content"><div className="eyebrow muted">DIRECT FROM {item.farm.toUpperCase()}</div><h2>{item.name}</h2><p className="modal-description">{item.description}</p><div className="quantity-control"><span>Quantity <small>({item.quantity} {item.unit} available)</small></span><div><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><strong>{quantity}</strong><button onClick={() => setQuantity(Math.min(item.quantity, quantity + 1))}><Plus size={15} /></button></div></div><label className="field"><span>Your name</span><input value={buyer} onChange={(event) => setBuyer(event.target.value)} placeholder="e.g. Priya Sharma" /></label><label className="field"><span>Delivery address</span><input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Where should we bring it?" /></label><div className="delivery-fields"><label className="field"><span>Distance (km)</span><input type="number" min="1" value={distanceKm} onChange={(event) => setDistanceKm(Math.max(1, Number(event.target.value) || 1))} /></label><label className="field"><span>Delivery timing</span><select value={deliveryWindow} onChange={(event) => setDeliveryWindow(event.target.value)}><option>30 minutes</option><option>Today evening</option><option>Tomorrow morning</option><option>Choose with partner</option></select></label></div><div className="delivery-breakdown"><span><Route size={14} /> {distanceKm} km x ₹{deliveryChargePerKm}</span><strong>Delivery {money(deliveryCharge)}</strong></div><div className="order-summary"><span>Farmers A to Z total <strong>{money(total)}</strong></span><span className="summary-saving">You save {money(quantity * (item.middlemanPrice - item.farmPrice))}</span></div><button className="primary-button full-button" disabled={!buyer || !address} onClick={() => onPlace(item, quantity, buyer, address, distanceKm, deliveryWindow)}><Check size={17} /> Place direct order</button></div></div></div>; }

function AddListingLegacy({ onClose, onAdd }) { const [form, setForm] = useState({ name: '', category: 'Vegetables', farmPrice: '', unit: 'kg', quantity: '', farmer: 'Your name', farm: 'Your farm', location: 'Your location', organic: true, harvest: 'Freshly harvested', description: 'Fresh produce, grown with care.' }); const update = (key, value) => setForm((current) => ({ ...current, [key]: value })); const submit = (event) => { event.preventDefault(); onAdd({ ...form, farmPrice: Number(form.farmPrice), middlemanPrice: Number(form.farmPrice) * 1.7, quantity: Number(form.quantity) }); }; return <div className="modal-backdrop"><form className="modal add-modal" onSubmit={submit}><button type="button" className="close-button" onClick={onClose}><X size={19} /></button><div className="eyebrow"><span></span> NEW HARVEST</div><h2>List your produce</h2><p className="modal-description">Put a fair price on what you grow and let the right buyers find you.</p><div className="form-grid"><label className="field wide"><span>Produce name</span><input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Red Lady Papaya" /></label><label className="field"><span>Category</span><select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label className="field"><span>Unit</span><select value={form.unit} onChange={(event) => update('unit', event.target.value)}><option>kg</option><option>dozen</option><option>litre</option><option>crate</option></select></label><label className="field"><span>Farm price (₹)</span><input required type="number" min="1" value={form.farmPrice} onChange={(event) => update('farmPrice', event.target.value)} /></label><label className="field"><span>Quantity available</span><input required type="number" min="1" value={form.quantity} onChange={(event) => update('quantity', event.target.value)} /></label><label className="field wide"><span>Farm name</span><input value={form.farm} onChange={(event) => update('farm', event.target.value)} /></label><label className="field wide"><span>Location</span><input value={form.location} onChange={(event) => update('location', event.target.value)} /></label></div><button className="primary-button full-button" type="submit"><Sprout size={17} /> Publish listing</button></form></div>; }

function AddListing({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', category: 'Vegetables', farmPrice: '', middlemanPrice: '', unit: 'kg', quantity: '', farmer: '', farm: '', location: '', organic: true, productionMethod: 'Organic', harvest: '', description: '', photo: '' });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const capturePhoto = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => update('photo', reader.result); reader.readAsDataURL(file); };
  const submit = (event) => {
    event.preventDefault();
    onAdd({ ...form, farmPrice: Number(form.farmPrice), middlemanPrice: Number(form.middlemanPrice), quantity: Number(form.quantity), description: form.description || 'Fresh produce, grown with care.' });
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
      <label className="field"><span>Farm name</span><input required value={form.farm} onChange={(event) => update('farm', event.target.value)} placeholder="Your farm or co-op" /></label>
      <label className="field wide"><span>Farm location</span><input required value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Village, district, state" /></label>
      <label className="field wide"><span>Harvest note</span><input value={form.harvest} onChange={(event) => update('harvest', event.target.value)} placeholder="Harvested today, sun-dried last week..." /></label>
      <label className="field wide"><span>Short description</span><textarea rows="3" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Tell buyers how it is grown or what makes it special." /></label>
      <label className="field wide photo-field"><span>Show your harvest</span><span className="camera-input"><Camera size={16} /><b>Take a farm photo</b><input type="file" accept="image/*" capture="environment" onChange={capturePhoto} /></span>{form.photo && <img className="listing-preview" src={form.photo} alt="Harvest preview" />}</label>
    </div>
    <button className="primary-button full-button" type="submit"><Sprout size={17} /> Publish listing</button>
  </form></div>;
}

function AuthModal({ mode, onModeChange, onClose, onAuthenticated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState('consumer');
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
    if (normalizedEmail === adminEmail && password === adminPassword) {
      onAuthenticated({ name: 'Manaswini Sharma', email: adminEmail, role: 'admin' });
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
      const account = { name: name.trim(), email: normalizedEmail, password };
      localStorage.setItem('farmdirect-accounts', JSON.stringify([...accounts, account]));
      onAuthenticated({ name: account.name, email: account.email });
      return;
    }
    const account = accounts.find((entry) => entry.email === normalizedEmail && entry.password === password);
    if (!account) {
      setError('Email or password is incorrect.');
      return;
    }
    if (loginRole === 'admin') {
      setError('Use the authorized admin account to continue.');
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
      {!isReset && mode === 'login' && <label className="field"><span>Log in as</span><select value={loginRole} onChange={(event) => setLoginRole(event.target.value)}><option value="consumer">Consumer</option><option value="farmer">Farmer</option><option value="admin">Admin</option></select></label>}
      {error && <p className="auth-error">{error}</p>}{message && <p className="auth-success">{message}</p>}
      <button className="primary-button full-button" type="submit">{isReset ? <><Mail size={16} /> Prepare reset email</> : mode === 'register' ? <><LogIn size={16} /> Create account</> : <><LogIn size={16} /> Log in</>}</button>
      {isReset && <a className="email-link" href={`mailto:${email}?subject=Farmers%20A%20to%20Z%20password%20reset`}>Open email app</a>}
      {!isReset && mode === 'login' && <button className="text-button" type="button" onClick={() => onModeChange('reset')}>Forgot password?</button>}
      {isReset ? <button className="text-button" type="button" onClick={() => onModeChange('login')}>Back to login</button> : <p className="auth-switch">{mode === 'register' ? 'Already have an account?' : 'New to Farmers A to Z?'} <button type="button" onClick={() => onModeChange(mode === 'register' ? 'login' : 'register')}>{mode === 'register' ? 'Log in' : 'Create account'}</button></p>}
    </form>
  </div></div>;
}

createRoot(document.getElementById('root')).render(<LanguageProvider><App /></LanguageProvider>);