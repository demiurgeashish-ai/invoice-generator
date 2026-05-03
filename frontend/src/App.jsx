import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { companyAtom, userAtom } from './store/atom';
import fallbackCompany from './config/company';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Option from './pages/Option';
import InvoiceForm from './pages/InvoiceForm';
import View from './pages/View';
import UpdateForm from './pages/UpdateForm';
import InvoicePage from './pages/InvoicePage';
import BusinessProfile from './pages/BusinessProfile';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function App() {
  const setCompany = useSetRecoilState(companyAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for Google OAuth token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    let token = urlToken || localStorage.getItem('token');
    
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      window.history.replaceState({}, document.title, "/");
      navigate('/options');
    }

    if (token) {
      fetchUserProfile(token);
    } else {
      axios.get(`${BASE_URL}/company/config`)
        .then(res => {
          if (res.data.success) {
            setCompany(res.data.data);
          }
        })
        .catch((err) => {
          console.error("Failed to load company config", err);
          setCompany(fallbackCompany);
        });
    }
  }, [setCompany]);

  const fetchUserProfile = async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...res.data, token });

      // Fetch user's specific business profile
      const businessRes = await axios.get(`${BASE_URL}/api/business`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (businessRes.data.data) {
        setCompany(businessRes.data.data);
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/options" element={<Option />} />
          <Route path="/business-profile" element={<BusinessProfile />} />
          <Route path="/create-invoice" element={<InvoiceForm />} />
          <Route path="/view-invoices" element={<View />} />
          <Route path="/update-invoice" element={<UpdateForm />} />
          <Route path="/invoice/:id" element={<InvoicePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
