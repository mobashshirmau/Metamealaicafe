
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const sampleMenu = [
  { id: 1, name: "Veggie Delight Pizza", price: 199, image: "https://via.placeholder.com/150", category: "veg" },
  { id: 2, name: "Butter Chicken Bowl", price: 249, image: "https://via.placeholder.com/150", category: "non-veg" },
  { id: 3, name: "Chole Bhature", price: 149, image: "https://via.placeholder.com/150", category: "veg" },
  { id: 4, name: "Paneer Wrap", price: 129, image: "https://via.placeholder.com/150", category: "veg" },
];

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const placeOrder = () => {
    setOrderPlaced(true);
    setCartItems([]);
  };

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSignup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <nav className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Metameal AI Cafe</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/menu" className="hover:underline">Menu</Link>
            <Link to="/cart" className="hover:underline">Cart ({cartItems.length})</Link>
            <Link to="/status" className="hover:underline">Order Status</Link>
            <Link to="/admin" className="hover:underline">Admin</Link>
            {user ? (
              <>
                <span className="ml-4">Hi, {user.email}</span>
                <button onClick={handleLogout} className="ml-4 text-red-600 hover:underline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/signup" className="hover:underline">Sign Up</Link>
              </>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} placeOrder={placeOrder} />} />
          <Route path="/status" element={<OrderStatus orderPlaced={orderPlaced} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Replace rest of the components with firebase-compatible forms if needed
export default App;
