import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-5">
      <div className="flex justify-between items-center cursor-pointer mb-3 select-none" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-bold text-[14px] uppercase text-gray-800">{title}</h3>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
};

// Nhận prop onFilterChange từ cha
const FilterSidebar = ({ onFilterChange }) => {
  
  // Xử lý khi chọn Size
  const handleSizeClick = (size) => {
    onFilterChange({ size: size });
  };

  // Xử lý khi chọn Màu
  const handleColorClick = (colorName) => {
    onFilterChange({ color: colorName });
  };

  // Xử lý khi chọn Giá
  const handlePriceChange = (val) => {
    if (!val) {
        onFilterChange({ minPrice: null, maxPrice: null });
        return;
    }
    const [min, max] = val.split('-');
    onFilterChange({ 
        minPrice: min, 
        maxPrice: max === 'MAX' ? null : max 
    });
  };

  return (
    <div className="w-full pr-4">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
         <span className="font-bold text-lg">Bộ lọc</span>
         <button 
            onClick={() => onFilterChange({ size: null, color: null, minPrice: null, maxPrice: null })}
            className="text-xs text-gray-400 hover:text-blue-600 hover:underline"
         >
            Xóa tất cả
         </button>
      </div>

      {/* 1. Kích cỡ */}
      <FilterSection title="Kích cỡ">
         <div className="grid grid-cols-4 gap-2">
            {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
               <button 
                  key={size} 
                  onClick={() => handleSizeClick(size)}
                  className="border border-gray-200 rounded text-sm py-2 hover:border-black hover:bg-black hover:text-white transition-all focus:bg-black focus:text-white"
               >
                  {size}
               </button>
            ))}
         </div>
      </FilterSection>

      {/* 2. Màu sắc */}
      <FilterSection title="Màu sắc">
         <div className="flex flex-wrap gap-3">
            {[
               {hex: '#000000', name: 'Đen'}, 
               {hex: '#FFFFFF', name: 'Trắng', border: true}, 
               {hex: '#1e3a8a', name: 'Xanh'}, // Lưu ý: Tên phải khớp DB (Ví dụ DB là 'Xanh' chứ không phải 'Xanh Navy')
               {hex: '#dc2626', name: 'Đỏ'}
            ].map((c, idx) => (
               <div key={idx} className="group relative" onClick={() => handleColorClick(c.name)}>
                  <div 
                    className={`w-8 h-8 rounded-full cursor-pointer shadow-sm hover:scale-110 transition-transform ${c.border ? 'border border-gray-300' : ''}`} 
                    style={{backgroundColor: c.hex}}
                  ></div>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                     {c.name}
                  </span>
               </div>
            ))}
         </div>
      </FilterSection>

      {/* 3. Mức giá */}
      <FilterSection title="Mức giá">
          {[
             { label: 'Dưới 100k', val: '0-100000' },
             { label: '100k - 200k', val: '100000-200000' },
             { label: '200k - 500k', val: '200000-500000' },
             { label: 'Trên 500k', val: '500000-MAX' }
          ].map((price, idx) => (
             <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <input 
                    type="radio" 
                    name="price" 
                    className="w-4 h-4 accent-black cursor-pointer" 
                    onChange={() => handlePriceChange(price.val)}
                />
                <span className="text-sm text-gray-600 group-hover:text-blue-600">{price.label}</span>
             </label>
          ))}
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;