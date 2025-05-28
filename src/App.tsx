import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import ReviewDetail from './pages/ReviewDetail';
import { CompanyReviews } from './pages/CompanyReviews';
import SubmitReview from './pages/SubmitReview';
import ApiTest from './pages/ApiTest';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen w-full bg-gray-50">
          <Header />
          <main className="flex-grow w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reviews" element={<CompanyReviews />} />
              <Route path="/reviews/:id" element={<ReviewDetail />} />
              <Route path="/companies/:id/reviews" element={<CompanyReviews />} />
              <Route path="/submit-review" element={<SubmitReview />} />
              <Route path="/api-test" element={<ApiTest />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
