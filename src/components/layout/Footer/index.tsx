import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t">
      <div className="app-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">ReviewHub</h3>
            <p className="text-gray-600">
              Your trusted source for honest company reviews and insights.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/submit-review" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Write a Review
                </Link>
              </li>
              <li>
                <Link to="/api-test" className="text-gray-600 hover:text-blue-600 transition-colors">
                  API Test
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-600">
                Email: support@reviewhub.com
              </li>
              <li className="text-gray-600">
                Phone: (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} ReviewHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 