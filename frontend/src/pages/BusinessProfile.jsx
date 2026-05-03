import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom, companyAtom } from '../store/atom';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function BusinessProfile() {
  const user = useRecoilValue(userAtom);
  const [company, setCompany] = useRecoilState(companyAtom);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const debounceTimer = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    tagline: '',
    address: { line1: '', line2: '', state: '', pincode: '' },
    tax: { gst: '', pan: '' },
    bank: { accountNo: '', ifsc: '', name: '', branch: '', upiId: '' },
    contact: { phone: '', email: '', website: '' },
    branding: { primaryColor: '#000000', invoicePrefix: 'IN' },
    disclaimer: 'This invoice is prepared by {COMPANY_NAME}. For any discrepancy, kindly connect within 24 hours from the date of generation.'
  });

  useEffect(() => {
    if (!user) {
      navigate('/signup');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/business`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.data.data) {
          setFormData((prev) => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        console.error("Failed to fetch business profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    let newFormData;
    if (section) {
      newFormData = {
        ...formData,
        [section]: {
          ...formData[section],
          [name]: value
        }
      };
    } else {
      newFormData = {
        ...formData,
        [name]: value
      };
    }
    
    if (section === 'address' || !section) {
      const fullAddress = [
        newFormData.address.line1,
        newFormData.address.line2,
        newFormData.address.state,
        newFormData.address.pincode
      ].filter(Boolean).join(', ');
      newFormData.address.full = fullAddress;
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSaving(true);
    setSuccess('');
    
    try {
      await axios.put(`${BASE_URL}/api/business`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCompany(formData);
      setSuccess('Business profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error saving', err);
      alert('Error saving business profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  const primaryColor = formData.branding.primaryColor || '#000000';

  return (
    <div className="flex-grow p-6 bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800">Business Profile</h2>
          <div className="text-sm font-medium h-6">
            {saving && <span className="text-gray-500 animate-pulse">Saving...</span>}
            {!saving && success && <span className="text-green-600">{success}</span>}
          </div>
        </div>
        
        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* General Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700" style={{ color: primaryColor }}>General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Business Name" value={formData.name} onChange={(e) => handleChange(e)} required className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="tagline" placeholder="Tagline" value={formData.tagline} onChange={(e) => handleChange(e)} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="logoUrl" placeholder="Logo Image URL" value={formData.logoUrl} onChange={(e) => handleChange(e)} className="w-full md:col-span-2 p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700" style={{ color: primaryColor }}>Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" name="phone" placeholder="Phone Number" value={formData.contact.phone} onChange={(e) => handleChange(e, 'contact')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="email" name="email" placeholder="Email Address" value={formData.contact.email} onChange={(e) => handleChange(e, 'contact')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="website" placeholder="Website" value={formData.contact.website} onChange={(e) => handleChange(e, 'contact')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700" style={{ color: primaryColor }}>Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="line1" placeholder="Address Line 1" value={formData.address.line1} onChange={(e) => handleChange(e, 'address')} className="w-full md:col-span-2 p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="line2" placeholder="Address Line 2 (Optional)" value={formData.address.line2} onChange={(e) => handleChange(e, 'address')} className="w-full md:col-span-2 p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="state" placeholder="State/Province" value={formData.address.state} onChange={(e) => handleChange(e, 'address')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="pincode" placeholder="ZIP / Pincode" value={formData.address.pincode} onChange={(e) => handleChange(e, 'address')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
            </div>
          </div>

          {/* Tax Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700" style={{ color: primaryColor }}>Tax Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="gst" placeholder="GST Number" value={formData.tax.gst} onChange={(e) => handleChange(e, 'tax')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="pan" placeholder="PAN Number" value={formData.tax.pan} onChange={(e) => handleChange(e, 'tax')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700" style={{ color: primaryColor }}>Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Bank Name" value={formData.bank.name} onChange={(e) => handleChange(e, 'bank')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="branch" placeholder="Branch Name" value={formData.bank.branch} onChange={(e) => handleChange(e, 'bank')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="accountNo" placeholder="Account Number" value={formData.bank.accountNo} onChange={(e) => handleChange(e, 'bank')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="ifsc" placeholder="IFSC Code" value={formData.bank.ifsc} onChange={(e) => handleChange(e, 'bank')} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
              <input type="text" name="upiId" placeholder="UPI ID (Optional)" value={formData.bank.upiId} onChange={(e) => handleChange(e, 'bank')} className="w-full md:col-span-2 p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
            </div>
          </div>

          {/* Branding & Invoice Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700" style={{ color: primaryColor }}>Branding & Invoice Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Brand Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" name="primaryColor" value={formData.branding.primaryColor} onChange={(e) => handleChange(e, 'branding')} className="h-10 w-10 border-none rounded cursor-pointer" />
                  <input type="text" name="primaryColor" value={formData.branding.primaryColor} onChange={(e) => handleChange(e, 'branding')} className="w-full p-2 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Invoice Prefix (e.g. IN)</label>
                <input type="text" name="invoicePrefix" placeholder="IN" value={formData.branding.invoicePrefix} onChange={(e) => handleChange(e, 'branding')} className="w-full p-2 border rounded focus:ring-2 outline-none uppercase" style={{ '--tw-ring-color': primaryColor }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Invoice Disclaimer</label>
                <textarea name="disclaimer" placeholder="Disclaimer..." value={formData.disclaimer} onChange={(e) => handleChange(e)} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} rows="2" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-4 text-white rounded-lg font-bold text-lg shadow hover:opacity-90 transition disabled:opacity-50 mt-8" style={{ backgroundColor: primaryColor }}>
            {saving ? 'Saving...' : 'Save Business Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BusinessProfile;
