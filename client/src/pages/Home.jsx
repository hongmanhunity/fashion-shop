import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/product');
        if (response.data && response.data.success) {
          setProducts(response.data.products.slice(0, 8)); // Just show 8 on home
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
    <div>
      {/* Hero Section */}
      <section className="h-[70vh] min-h-[500px] bg-accent flex items-center justify-center text-center mb-16 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative before:content-[''] before:absolute before:inset-0 before:bg-white/40">
        <div className="relative max-w-[600px] p-6 bg-white/85 backdrop-blur-md rounded-2xl shadow-float">
          <h1 className="text-5xl mb-4 text-text-main font-heading">Bộ sưu tập Mùa Hè</h1>
          <p className="text-lg text-text-muted mb-8 leading-relaxed">
            Khám phá những thiết kế tươi mới, mang đậm hơi thở mùa hè dành riêng cho phái đẹp.
          </p>
          <button className="bg-primary text-white px-8 py-4 text-base font-semibold rounded-full transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-soft uppercase tracking-widest">Khám phá ngay</button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-2 font-heading">Sản Phẩm Nổi Bật</h2>
          <p className="text-text-muted text-base">Những lựa chọn được yêu thích nhất trong tuần qua</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-text-muted text-lg">Đang tải dữ liệu...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
