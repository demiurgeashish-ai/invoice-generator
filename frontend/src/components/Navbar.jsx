import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { companyAtom, userAtom } from '../store/atom';

function Navbar() {
  const company = useRecoilValue(companyAtom);
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const companyName = company?.name || 'Invoice Generator';
  const primaryColor = company?.branding?.primaryColor || '#000000';

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold flex items-center gap-3" style={{ color: primaryColor }}>
        {company?.logoUrl && <img src={company.logoUrl} alt="Logo" className="h-8 object-contain" />}
        {companyName}
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="font-semibold text-gray-700">Hi, {user.name}</span>
            <Link to="/options" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
            <Link to="/business-profile" className="text-gray-600 hover:text-gray-900 font-medium">Business Profile</Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white rounded font-medium shadow transition hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/signup"
            className="px-4 py-2 text-white rounded font-medium shadow transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
