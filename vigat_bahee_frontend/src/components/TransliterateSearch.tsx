// components/TransliterateSearch.tsx
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { ReactTransliterate } from 'react-transliterate';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

const TransliterateSearch: React.FC<Props> = ({ 
  value, 
  onChange, 
  onSearch, 
  onClear, 
  placeholder 
}) => (
  <div className="relative w-full max-w-md sm:max-w-lg">
    <ReactTransliterate
      value={value}
      onChangeText={onChange}
      lang="hi"
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg pl-4 pr-20 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      style={{ 
        fontSize: '14px', 
        lineHeight: '1.5', 
        fontFamily: 'inherit', 
        boxSizing: 'border-box', 
        height: '44px' 
      }}
      onKeyDown={(e: any) => { 
        if (e.key === 'Enter') onSearch(value); 
      }}
    />
    <button
      type="button"
      onClick={() => onSearch(value)}
      className="absolute inset-y-0 right-0 flex items-center justify-center w-12 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Search"
    >
      <SearchOutlined className="text-lg" />
    </button>
    {value && (
      <button
        type="button"
        onClick={onClear}
        className="absolute inset-y-0 right-12 flex items-center justify-center w-8 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        aria-label="Clear search"
      >
        <span className="text-lg">✕</span>
      </button>
    )}
  </div>
);

export default TransliterateSearch;