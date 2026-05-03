import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { companyAtom } from '../store/atom';

function Option() {
  const company = useRecoilValue(companyAtom);
  const primaryColor = company?.branding?.primaryColor || '#000000';

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 tracking-tight">Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-5xl">
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition hover:shadow-xl">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Invoice</h2>
          <p className="text-gray-500 mb-6">Generate a new GST-compliant invoice instantly.</p>
          <Link to="/create-invoice" className="px-6 py-3 text-white rounded-lg font-bold shadow hover:opacity-90 w-full" style={{ backgroundColor: primaryColor }}>
            Create Invoice
          </Link>
        </div>

        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition hover:shadow-xl">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">View Invoices</h2>
          <p className="text-gray-500 mb-6">Manage, edit, or print your existing invoices.</p>
          <Link to="/view-invoices" className="px-6 py-3 text-white rounded-lg font-bold shadow hover:opacity-90 w-full" style={{ backgroundColor: primaryColor }}>
            View All Invoices
          </Link>
        </div>

        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition hover:shadow-xl">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Profile</h2>
          <p className="text-gray-500 mb-6">Setup your company identity, tax, and bank info.</p>
          <Link to="/business-profile" className="px-6 py-3 text-white rounded-lg font-bold shadow hover:opacity-90 w-full" style={{ backgroundColor: primaryColor }}>
            Manage Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Option;
