import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star } from '@phosphor-icons/react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/product/${id}`);
        if (response.data && response.data.success) {
          setProduct(response.data.productData);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="container-custom text-center py-16 text-lg text-text-muted">Đang tải thông tin...</div>;
  if (!product) return <div className="container-custom text-center py-16 text-lg text-text-muted">Không tìm thấy sản phẩm!</div>;

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price);

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
        {/* Images */}
        <div className="w-full rounded-2xl overflow-hidden bg-[#F5F5F5]">
          <img 
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600x800?text=Lumiere'} 
            alt={product.title} 
            className="w-full h-auto aspect-[3/4] object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div className="text-sm text-text-muted uppercase tracking-[2px]">{product.brand}</div>
          <h1 className="text-4xl font-heading leading-tight m-0">{product.title}</h1>
          <div className="text-3xl font-semibold text-primary">{formattedPrice}</div>
          
          <div className="flex items-center gap-2">
            <div className="flex text-[#FFC107]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} weight="fill" size={20} />
              ))}
            </div>
            <span className="text-sm text-text-muted">
              {product.ratings ? product.ratings.length : 0} đánh giá
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
            <p className="text-text-muted leading-relaxed">{product.description}</p>
          </div>

          <div className="flex gap-4 mt-4">
            <button className="flex-1 bg-primary text-white py-4 text-base font-semibold rounded-full uppercase tracking-widest transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-soft">
              Thêm vào giỏ hàng
            </button>
            <button className="flex-1 bg-white text-text-main border border-border py-4 text-base font-semibold rounded-full uppercase tracking-widest transition-colors duration-300 hover:border-text-main">
              Mua ngay
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-text-muted flex flex-col gap-2">
            <p><strong>Màu sắc:</strong> {product.color || 'Đang cập nhật'}</p>
            <p><strong>Đã bán:</strong> {product.sold || 0}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-12 border-t border-border">
        <h2 className="text-3xl font-heading mb-8">Đánh giá từ khách hàng</h2>
        {product.ratings && product.ratings.length > 0 ? (
          <div className="flex flex-col gap-6">
            {product.ratings.map((rating, index) => (
              <div key={index} className="bg-surface p-6 rounded-xl border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex text-[#FFC107]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} weight={i < rating.star ? "fill" : "regular"} size={18} />
                    ))}
                  </div>
                  <span className="font-semibold text-text-main">Khách hàng</span>
                </div>
                <p className="text-text-muted leading-relaxed">{rating.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-muted italic">Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
