import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Star, CaretLeft, CaretRight } from '@phosphor-icons/react';
import RatingForm from '../components/product/RatingForm';
import RatingList from '../components/product/RatingList';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // States cho Giỏ hàng
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/product/${id}`);
      if (response.data && response.data.success) {
        setProduct(response.data.productData);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async (isBuyNow = false) => {
    if (!isLoggedIn) {
      setErrorMsg('Vui lòng đăng nhập để thực hiện!');
      return;
    }
    setAdding(true);
    setMessage('');
    setErrorMsg('');
    try {
      const response = await axiosInstance.put('/user/cart', {
        pid: product._id,
        quantity,
        color: product.color
      });
      if (response.data && response.data.success) {
        if (isBuyNow) {
          navigate('/cart');
        } else {
          setMessage(response.data.message || 'Đã thêm sản phẩm vào giỏ hàng thành công!');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng!';
      setErrorMsg(msg);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="container-custom text-center py-16 text-lg text-text-muted">Đang tải thông tin...</div>;
  if (!product) return <div className="container-custom text-center py-16 text-lg text-text-muted">Không tìm thấy sản phẩm!</div>;

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price);

  const avgRating = product.totalRatings || 0;
  const ratingCount = product.ratings ? product.ratings.length : 0;

  return (
    <div className="container-custom py-8">
      {/* Product Main Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
        {/* Product Images Gallery Slider */}
        <div className="flex flex-col gap-4 max-w-[500px] mx-auto md:mx-0 w-full">
          <div className="relative w-full rounded-2xl overflow-hidden bg-[#F5F5F5] aspect-[3/4] max-h-[580px] group shadow-sm">
            {/* Slider Container */}
            <div 
              className="flex w-full h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${selectedImage * 100}%)` }}
            >
              {product.images && product.images.length > 0 ? (
                product.images.map((imgUrl, idx) => (
                  <img 
                    key={idx}
                    src={imgUrl} 
                    alt={`${product.title} ${idx + 1}`} 
                    className="w-full h-full object-cover flex-shrink-0"
                  />
                ))
              ) : (
                <img 
                  src="https://via.placeholder.com/600x800?text=Lumiere" 
                  alt={product.title} 
                  className="w-full h-full object-cover flex-shrink-0"
                />
              )}
            </div>

            {/* Navigation Arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-text-main shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  title="Ảnh trước"
                >
                  <CaretLeft size={20} weight="bold" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-text-main shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  title="Ảnh sau"
                >
                  <CaretRight size={20} weight="bold" />
                </button>
              </>
            )}
          </div>

          {/* List Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 justify-center md:justify-start overflow-x-auto pb-1">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col gap-6">
          <div className="text-sm text-text-muted uppercase tracking-[2px]">{product.brand}</div>
          <h1 className="text-4xl font-heading leading-tight m-0">{product.title}</h1>
          <div className="text-3xl font-semibold text-primary">{formattedPrice}</div>
          
          <div className="flex items-center gap-3">
            <div className="flex text-[#FFC107]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  weight={star <= Math.round(avgRating) ? "fill" : "regular"} 
                  size={20} 
                />
              ))}
            </div>
            <span className="text-sm font-medium text-text-main">
              {avgRating > 0 ? `${avgRating} / 5` : 'Chưa có điểm'}
            </span>
            <span className="text-sm text-text-muted">
              ({ratingCount} đánh giá)
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
            <p className="text-text-muted leading-relaxed">{product.description}</p>
          </div>

          {/* Chọn số lượng & Kiểm tra kho */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-text-main">Số lượng:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-surface text-text-main hover:bg-border font-bold text-base transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 1;
                    setQuantity(Math.max(1, Math.min(val, product.quantity || 1)));
                  }}
                  className="w-12 text-center py-1 font-semibold text-sm focus:outline-none bg-white"
                />
                <button
                  onClick={() => setQuantity(prev => Math.min(product.quantity || 99, prev + 1))}
                  className="px-3 py-1 bg-surface text-text-main hover:bg-border font-bold text-base transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-text-muted">
                (Kho còn: <strong className="text-text-main">{product.quantity ?? 0}</strong> sản phẩm)
              </span>
            </div>

            {/* Thông báo thành công hoặc Lỗi Tồn Kho */}
            {message && <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-md font-medium border border-emerald-200">{message}</div>}
            {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md font-medium border border-red-200">{errorMsg}</div>}
          </div>

          <div className="flex gap-4 mt-2">
            <button 
              disabled={adding || product.quantity <= 0}
              onClick={() => handleAddToCart(false)}
              className="flex-1 bg-primary text-white py-4 text-base font-semibold rounded-full uppercase tracking-widest transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-soft"
            >
              {adding ? 'Đang xử lý...' : product.quantity <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
            <button 
              disabled={adding || product.quantity <= 0}
              onClick={() => handleAddToCart(true)}
              className="flex-1 bg-text-main text-white py-4 text-base font-semibold rounded-full uppercase tracking-widest transition-all duration-300 hover:bg-black hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-soft"
            >
              Mua ngay
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-text-muted flex flex-col gap-2">
            <p><strong>Màu sắc:</strong> {product.color || 'Đang cập nhật'}</p>
            <p><strong>Đã bán:</strong> {product.sold || 0}</p>
          </div>
        </div>
      </div>

      {/* Review Section Components */}
      <RatingForm 
        productId={product._id} 
        isLoggedIn={isLoggedIn} 
        onRatingSuccess={fetchProduct} 
      />

      <RatingList 
        ratings={product.ratings} 
        avgRating={avgRating} 
        ratingCount={ratingCount} 
      />
    </div>
  );
};

export default ProductDetail;
