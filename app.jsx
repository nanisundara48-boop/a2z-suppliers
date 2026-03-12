import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { ShoppingCart, LogOut, Package, ShieldCheck, UserPlus, LogIn, Globe, Star, Heart, Trash2, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- FIREBASE CONFIG (NEE EXACT DATA) ---
const firebaseConfig = {
  apiKey: "AIzaSyDPB0Twga_QZGwPZXvlRW5y2bhOD2zU4eQ",
  authDomain: "a2zsuppliers-ef2fc.firebaseapp.com",
  projectId: "a2zsuppliers-ef2fc",
  storageBucket: "a2zsuppliers-ef2fc.firebasestorage.app",
  messagingSenderId: "369780934077",
  appId: "1:369780934077:web:6cbdc547742f824267fed4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- TRANSLATIONS ---
const t = {
  EN: { welcome: "Welcome", cart: "Cart", admin: "Owner", add: "Add to Cart", pay: "Pay Now", items: "Items", lang: "Language" },
  TE: { welcome: "స్వాగతం", cart: "కార్ట్", admin: "ఓనర్", add: "కార్ట్‌కు చేర్చు", pay: "చెల్లించండి", items: "వస్తువులు", lang: "భాష" },
  HI: { welcome: "स्वागत हे", cart: "कार्ट", admin: "मालिक", add: "कार्ट में जोड़ें", pay: "भुगतान करें", items: "सामान", lang: "भाषा" }
};

// --- AUTH PAGE (LOGIN/REGISTER) ---
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) { alert("Error: " + err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black text-white text-center mb-8">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setPassword(e.target.value)} />
          <motion.button whileTap={{ scale: 0.95 }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30">Continue</motion.button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} className="text-blue-400 text-center mt-6 cursor-pointer hover:underline text-sm">{isLogin ? "New user? Register" : "Have account? Login"}</p>
      </motion.div>
    </div>
  );
}

// --- CUSTOMER SITE ---
function CustomerSite() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState('EN');
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (s) => setProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const addToCart = (p) => {
    if (navigator.vibrate) navigator.vibrate(40);
    setCart([...cart, p]);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center px-6">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">A2Z Suppliers</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
             <Globe size={18} className="ml-2 text-slate-500" />
             <select onChange={(e) => setLang(e.target.value)} className="bg-transparent text-sm font-bold p-1 outline-none">
                <option value="EN">EN</option>
                <option value="TE">TE</option>
                <option value="HI">HI</option>
             </select>
          </div>
          <Link to="/admin" className="p-2 bg-blue-50 text-blue-600 rounded-xl"><ShieldCheck size={22}/></Link>
          {!user ? <Link to="/auth" className="text-sm font-bold text-blue-600">Login</Link> : <button onClick={() => signOut(auth)}><LogOut size={22}/></button>}
        </div>
      </nav>

      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
        {products.map((p) => (
          <motion.div whileHover={{ y: -5 }} key={p.id} className="bg-white border rounded-[1.5rem] p-3 shadow-sm group">
            <div className="relative overflow-hidden rounded-2xl h-40 mb-3">
               <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               <button className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-red-500"><Heart size={16}/></button>
            </div>
            <h3 className="font-bold text-slate-800 truncate">{p.name}</h3>
            <div className="flex justify-between items-center mt-2">
               <span className="text-blue-600 font-black">₹{p.price}</span>
               <div className="flex items-center text-orange-400 text-[10px] font-bold"><Star size={10} fill="currentColor"/> 4.5</div>
            </div>
            <button onClick={() => addToCart(p)} className="w-full mt-3 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
               <ShoppingCart size={14}/> {t[lang].add}
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 z-50">
            <div className="flex flex-col">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cart.length} {t[lang].items}</span>
               <span className="font-black text-lg">₹{cart.reduce((s,i) => s + Number(i.price), 0)}</span>
            </div>
            <button onClick={() => alert("Paying to 7997195592@ybl")} className="bg-blue-600 px-6 py-2 rounded-full font-black text-sm">{t[lang].pay}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- ADMIN SITE ---
function AdminSite() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), { name, price, image, createdAt: new Date() });
    setName(''); setPrice(''); setImage('');
    alert("Live updated on customer site!");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-10">
           <h2 className="text-3xl font-black text-slate-900 italic">Owner Panel</h2>
           <Link to="/" className="p-3 bg-white shadow rounded-2xl"><Home size={20}/></Link>
        </div>
        <form onSubmit={handleAdd} className="space-y-4 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
           <input placeholder="Product Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 border-none" value={name} onChange={e => setName(e.target.value)} required />
           <input placeholder="Price (₹)" type="number" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 border-none" value={price} onChange={e => setPrice(e.target.value)} required />
           <input placeholder="Image Link (URL)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 border-none" value={image} onChange={e => setImage(e.target.value)} required />
           <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-600/30">Push to Customer Site</button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerSite />} />
      <Route path="/admin" element={<AdminSite />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}
