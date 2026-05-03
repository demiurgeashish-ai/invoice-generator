import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { userAtom, companyAtom } from '../store/atom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function SignUp() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const setUser = useSetRecoilState(userAtom);
  const company = useRecoilValue(companyAtom);
  const setCompany = useSetRecoilState(companyAtom);
  const navigate = useNavigate();

  const primaryColor = company?.branding?.primaryColor || '#000000';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const res = await axios.post(`${BASE_URL}${endpoint}`, formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      
      // Fetch user's business profile immediately upon login
      try {
        const businessRes = await axios.get(`${BASE_URL}/api/business`, {
          headers: { Authorization: `Bearer ${res.data.token}` }
        });
        if (businessRes.data.data) {
          setCompany(businessRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch business profile after login", err);
      }
      
      navigate('/options');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="flex gap-4">
              <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className="w-1/2 p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className="w-1/2 p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
            </div>
          )}
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
          
          <button type="submit" className="w-full p-3 text-white rounded-lg font-bold shadow hover:opacity-90 transition" style={{ backgroundColor: primaryColor }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <span className="text-gray-400 bg-white px-2">OR</span>
        </div>

        <button onClick={handleGoogleAuth} className="w-full p-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-semibold hover:underline" style={{ color: primaryColor }}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
