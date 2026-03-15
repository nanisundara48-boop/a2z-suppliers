import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, BrowserRouter } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { ShoppingCart, Package, ShieldCheck, LogIn, Globe, Star, Heart, Home, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Simple Components defined here
function CustomerSite() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (s) => setProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">A2Z Suppliers</h1>
      <div className="grid grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white p-2 rounded-lg shadow">
            <img src={p.image} className="w-full h-32 object-cover rounded" />
            <h2 className="text-sm font-bold mt-2">{p.name}</h2>
            <p className="text-blue-600 font-bold">₹{p.price}</p>
            <button onClick={() => setCart([...cart, p])} className="w-full bg-black text-white py-1 mt-2 rounded">Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSite() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const add = async () => {
    await addDoc(collection(db, "products"), { name, price, image, createdAt: new Date() });
    alert("Added!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
      <input className="w-full border p-2 mb-2" placeholder="Name" onChange={e => setName(e.target.value)} />
      <input className="w-full border p-2 mb-2" placeholder="Price" onChange={e => setPrice(e.target.value)} />
      <input className="w-full border p-2 mb-2" placeholder="Image URL" onChange={e => setImage(e.target.value)} />
      <button onClick={add} className="w-full bg-blue-600 text-white p-2">Add Product</button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerSite />} />
        <Route path="/admin" element={<AdminSite />} />
      </Routes>
    </BrowserRouter>
  );
}
