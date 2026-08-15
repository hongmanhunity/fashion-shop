const ProductFilterSidebar = ({ 
  category, 
  handleCategoryChange, 
  priceRange, 
  handlePriceChange 
}) => {
  return (
    <aside className="flex flex-col gap-8">
      <div>
        <h3 className="text-base uppercase tracking-widest font-semibold mb-4">Danh mục</h3>
        <div className="flex flex-col gap-3 text-sm text-text-muted">
          <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <input 
              type="radio" 
              name="category" 
              checked={category === 'all'} 
              onChange={() => handleCategoryChange('all')}
              className="w-4 h-4 accent-primary" 
            /> 
            Tất cả danh mục
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <input 
              type="radio" 
              name="category" 
              checked={category === 'Áo'} 
              onChange={() => handleCategoryChange('Áo')}
              className="w-4 h-4 accent-primary" 
            /> 
            Áo
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <input 
              type="radio" 
              name="category" 
              checked={category === 'Quần'} 
              onChange={() => handleCategoryChange('Quần')}
              className="w-4 h-4 accent-primary" 
            /> 
            Quần
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <input 
              type="radio" 
              name="category" 
              checked={category === 'Váy'} 
              onChange={() => handleCategoryChange('Váy')}
              className="w-4 h-4 accent-primary" 
            /> 
            Váy
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-base uppercase tracking-widest font-semibold mb-4">Khoảng giá</h3>
        <div className="flex flex-col gap-3 text-sm text-text-muted">
          <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <input 
              type="radio" 
              name="priceRange" 
              checked={priceRange === 'all'} 
              onChange={() => handlePriceChange('all')}
              className="w-4 h-4 accent-primary" 
            /> 
            Tất cả mức giá
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <input 
              type="radio" 
              name="priceRange" 
              checked={priceRange === 'under500'} 
              onChange={() => handlePriceChange('under500')}
              className="w-4 h-4 accent-primary" 
            /> 
            Dưới 500.000đ
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <input 
              type="radio" 
              name="priceRange" 
              checked={priceRange === '500to1000'} 
              onChange={() => handlePriceChange('500to1000')}
              className="w-4 h-4 accent-primary" 
            /> 
            500.000đ - 1.000.000đ
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <input 
              type="radio" 
              name="priceRange" 
              checked={priceRange === 'above1000'} 
              onChange={() => handlePriceChange('above1000')}
              className="w-4 h-4 accent-primary" 
            /> 
            Trên 1.000.000đ
          </label>
        </div>
      </div>
    </aside>
  );
};

export default ProductFilterSidebar;
