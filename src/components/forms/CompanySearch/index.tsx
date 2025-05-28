import { useState } from 'react';
import type { Company } from '../../../types';

interface CompanySearchProps {
  onSelect: (company: Company) => void;
  selectedCompany?: Company;
  error?: string;
}

const CompanySearch = ({ onSelect, selectedCompany, error }: CompanySearchProps) => {
  const [companyName, setCompanyName] = useState(selectedCompany?.name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Company[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCompanyName(name);
    onSelect({
      id: 0,
      name,
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={companyName}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Enter company name..."
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)] ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {showSuggestions && suggestions.length > 0 && (
        null // Placeholder for suggestions component
      )}
    </div>
  );
};

export default CompanySearch; 