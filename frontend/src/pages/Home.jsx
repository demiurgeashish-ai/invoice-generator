import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { companyAtom, userAtom } from '../store/atom';

function Home() {
  const company = useRecoilValue(companyAtom);
  const user = useRecoilValue(userAtom);

  const primaryColor = company?.branding?.primaryColor || '#000000';

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Welcome to <span style={{ color: primaryColor }}>{company?.name || 'Invoice Generator'}</span>
      </h1>
      {company?.tagline && (
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">{company.tagline}</p>
      )}
      
      <div className="flex gap-4">
        {user ? (
          <Link
            to="/options"
            className="px-8 py-3 text-white rounded-lg font-semibold text-lg shadow-lg hover:opacity-90 transition transform hover:-translate-y-1"
            style={{ backgroundColor: primaryColor }}
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/signup"
            className="px-8 py-3 text-white rounded-lg font-semibold text-lg shadow-lg hover:opacity-90 transition transform hover:-translate-y-1"
            style={{ backgroundColor: primaryColor }}
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
