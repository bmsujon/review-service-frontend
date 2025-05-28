import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="app-container">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            ReviewHub
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/submit-review" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Write a Review
            </Link>
            <Link 
              to="/api-test" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              API Test
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 