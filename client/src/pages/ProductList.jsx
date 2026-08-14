import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/product');
        if (response.data && response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container-custom py-6">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
        <h1 className="text-4xl font-heading">Tất Cả Sản Phẩm</h1>
        <div>
          <select className="px-4 py-2 border border-border rounded-md font-body text-sm bg-surface cursor-pointer focus:outline-none focus:border-primary">
            <option>Sắp xếp: Mới nhất</option>
            <option>Giá: Thấp đến Cao</option>
            <option>Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
        {/* Sidebar Filters */}
        <aside className="flex flex-col gap-8">
          <div>
            <h3 className="text-base uppercase tracking-widest font-semibold mb-4">Danh mục</h3>
            <label className="flex items-center gap-2 mb-3 text-text-muted text-sm cursor-pointer hover:text-primary transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-primary" /> Áo
            </label>
            <label className="flex items-center gap-2 mb-3 text-text-muted text-sm cursor-pointer hover:text-primary transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-primary" /> Quần
            </label>
            <label className="flex items-center gap-2 mb-3 text-text-muted text-sm cursor-pointer hover:text-primary transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-primary" /> Váy
            </label>
          </div>
          <div>
            <h3 className="text-base uppercase tracking-widest font-semibold mb-4">Khoảng giá</h3>
            <label className="flex items-center gap-2 mb-3 text-text-muted text-sm cursor-pointer hover:text-primary transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-primary" /> Dưới 500.000đ
            </label>
            <label className="flex items-center gap-2 mb-3 text-text-muted text-sm cursor-pointer hover:text-primary transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-primary" /> 500.000đ - 1.000.000đ
            </label>
            <label className="flex items-center gap-2 mb-3 text-text-muted text-sm cursor-pointer hover:text-primary transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-primary" /> Trên 1.000.000đ
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <main>
          {loading ? (
            <div className="text-center py-12 text-text-muted text-lg">Đang tải danh sách sản phẩm...</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
