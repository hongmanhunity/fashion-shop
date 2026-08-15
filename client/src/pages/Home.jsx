import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkle } from '@phosphor-icons/react';
import axiosInstance from '../api/axiosInstance';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/product');
        if (response.data && response.data.success) {
          setProducts(response.data.products.slice(0, 8)); // Hiển thị 8 sản phẩm
        }
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-background">
      {/* 1. Ultra Luxury Split Editorial Hero Banner */}
      <section className="bg-surface py-12 lg:py-20 border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Cột Trái: Thông điệp thời trang tinh tế */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[5px] font-semibold text-primary px-3.5 py-1.5 rounded-full bg-accent/40 border border-primary/20">
                <Sparkle size={13} /> Lumière • Edition 2026
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading leading-[1.2] text-text-main font-medium">
                Khí Chất Độc Bản & <br />
                <span className="text-primary font-normal italic">Vẻ Đẹp Vượt Thời Gian</span>
              </h1>

              <div className="w-16 h-[2px] bg-primary/40 my-1" />

              <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-xl font-light">
                Từng đường nét thiết kế tại Lumière là sự hòa quyện giữa chất liệu tơ tằm tự nhiên thượng hạng 
                và nghệ thuật cắt may thủ công tinh xảo. Tôn vinh vẻ đẹp kiêu hãnh và sự tự tin vốn có của bạn.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  to="/products"
                  className="group inline-flex items-center gap-3 bg-text-main text-white px-7 py-3.5 rounded-full font-semibold uppercase tracking-[2px] text-xs hover:bg-primary hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300"
                >
                  Khám Phá Bộ Sưu Tập 
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>

                <Link
                  to="/about"
                  className="text-xs uppercase tracking-[2px] font-semibold text-text-main hover:text-primary transition-colors py-3 px-4"
                >
                  Câu chuyện thương hiệu
                </Link>
              </div>
            </div>

            {/* Cột Phải: Ảnh Lookbook Khung Gọn Tinh Tế */}
            <div className="lg:col-span-5 relative max-w-md mx-auto lg:max-w-none w-full">
              <div className="relative group rounded-3xl overflow-hidden shadow-float bg-[#F8F6F4] aspect-[4/5]">
                <img 
                  src="/luxury-hero.png" 
                  alt="Lumière Haute Couture" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Overlay Badge Nhỏ Gọn */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-border shadow-soft group-hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-main uppercase tracking-wider">Lumière Silk Edition</p>
                      <p className="text-[11px] text-text-muted">Thiết kế giới hạn 2026</p>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">New</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="container-custom py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[4px] font-semibold text-primary mb-3 block">
            Exclusive Selection
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading mb-4 text-text-main font-medium">
            Tuyệt Tác Thời Trang Nổi Bật
          </h2>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed font-light">
            Tuyển chọn các sáng tạo được phái đẹp yêu thích nhất – Biểu tượng của sự sang trọng & đẳng cấp vượt thời gian.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-text-muted text-base animate-pulse">
            Đang tải những bộ sưu tập mới nhất...
          </div>
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
