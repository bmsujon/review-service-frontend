import { useState } from 'react';
import { reviewService } from '../../services/reviewService';
import { logger } from '../../utils/logger';

const ApiTest = () => {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});
  const [validation, setValidation] = useState<Record<string, string[]>>({});

  const validateResponse = (name: string, data: any) => {
    const errors: string[] = [];
    
    switch (name) {
      case 'Featured Reviews':
      case 'Recent Reviews':
        if (!data) {
          errors.push('Response is empty');
          break;
        }
        if (!data.content || !Array.isArray(data.content)) {
          errors.push('Response should have a content array');
        } else if (data.content.length === 0) {
          errors.push('Content array is empty');
        } else {
          data.content.forEach((review: any, index: number) => {
            if (!review.id) errors.push(`Review at index ${index} is missing id`);
            if (!review.title) errors.push(`Review at index ${index} is missing title`);
            if (!review.contentHtml) errors.push(`Review at index ${index} is missing content`);
          });
        }
        break;

      case 'Stats':
        if (!data) {
          errors.push('Response is empty');
          break;
        }
        const requiredStats = ['totalReviews', 'totalCompanies', 'activeUsers'];
        requiredStats.forEach(stat => {
          if (typeof data[stat] !== 'number') {
            errors.push(`Stats response is missing or invalid ${stat}`);
          }
        });
        break;
    }

    setValidation(prev => ({ ...prev, [name]: errors }));
    return errors.length === 0;
  };

  const runTest = async (name: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    setError(prev => ({ ...prev, [name]: '' }));
    setValidation(prev => ({ ...prev, [name]: [] }));
    
    try {
      const result = await testFn();
      setResults(prev => ({ ...prev, [name]: result }));
      
      const isValid = validateResponse(name, result);
      if (isValid) {
        logger.info(`${name} test completed successfully:`, result);
      } else {
        logger.warn(`${name} test completed with validation warnings:`, validation[name]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(prev => ({ ...prev, [name]: errorMessage }));
      logger.error(`${name} test failed:`, err);
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const tests = [
    {
      name: 'Featured Reviews',
      run: () => reviewService.getReviews({ featured: true, size: 3 })
    },
    {
      name: 'Recent Reviews',
      run: () => reviewService.getReviews({ sort: 'createdAt,desc', size: 6 })
    },
    {
      name: 'Stats',
      run: () => reviewService.getStats()
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Tests</h1>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">API Configuration</h2>
        <p className="text-blue-700">
          Base URL: {import.meta.env['VITE_API_BASE_URL'] || 'http://localhost:8080/api/v1'}
        </p>
      </div>
      <div className="space-y-6">
        {tests.map(test => {
          const currentValidationMessages = validation[test.name];
          const currentError = error[test.name];
          const currentResults = results[test.name];

          return (
            <div key={test.name} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{test.name}</h2>
                <button
                  onClick={() => runTest(test.name, test.run)}
                  disabled={loading[test.name]}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 focus-ring"
                >
                  {loading[test.name] ? 'Running...' : 'Run Test'}
                </button>
              </div>
              
              {currentError && (
                <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">
                  <h3 className="font-semibold mb-1">Error:</h3>
                  <p>{currentError}</p>
                </div>
              )}
              
              {Array.isArray(currentValidationMessages) && currentValidationMessages.length > 0 && (
                <div className="text-yellow-600 mb-4 p-3 bg-yellow-50 rounded">
                  <h3 className="font-semibold mb-2">Validation Warnings:</h3>
                  <ul className="list-disc list-inside">
                    {currentValidationMessages.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {currentResults && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Response:</h3>
                  <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96 text-sm">
                    {JSON.stringify(currentResults, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApiTest; 