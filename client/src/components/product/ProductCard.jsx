import { Link } from 'react-router-dom';

/**
 * 💡 COMPONENT: ProductCard (Thẻ Sản phẩm)
 * -------------------------------------------------------------------
 * Component con hiển thị thông tin tóm tắt sản phẩm (Hình ảnh, Tiêu đề, Thương hiệu, Giá tiền, Badge).
 * Được tái sử dụng trong các Grid danh sách sản phẩm (ProductList.jsx, Home.jsx).
 */
const ProductCard = ({ product = {} }) => {
  // Định dạng số tiền sang chuẩn VNĐ (VD: 550.000 ₫)
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price || 0);

  return (
    <div className="flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 group">
      {/* Khung Ảnh Sản Phẩm */}
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-[#F5F5F5]">
          <img 
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x500?text=Lumiere'} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Nhãn HOT cho sản phẩm bán chạy */}
          {product.sold > 100 && (
            <span className="absolute top-3 left-3 bg-error text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">Hot</span>
          )}
        </div>
      </Link>

      {/* Thông Tin Tên & Giá */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-text-muted uppercase tracking-widest">{product.brand}</div>
        <Link to={`/products/${product._id}`} className="group-hover:text-primary transition-colors">
          <h3 className="text-base font-medium text-text-main m-0 truncate">{product.title}</h3>
        </Link>
        <div className="font-semibold text-text-main text-base mt-1">{formattedPrice}</div>
      </div>
    </div>
  );
};

export default ProductCard;
