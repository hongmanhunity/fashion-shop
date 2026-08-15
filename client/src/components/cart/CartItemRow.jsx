import { Link } from 'react-router-dom';
import { Trash } from '@phosphor-icons/react';

const CartItemRow = ({ item, updatingId, handleUpdateQuantity, handleRemoveItem, formatVND }) => {
  const product = item.product;
  if (!product) return null;
  const itemPrice = product.price || item.price || 0;
  const maxStock = product.quantity || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 items-center py-6 border-b border-border">
      {/* Product Info */}
      <div className="flex gap-4 items-center">
        <img 
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'} 
          alt={product.title} 
          className="w-20 h-24 object-cover rounded-lg bg-surface flex-shrink-0"
        />
        <div>
          <h3 className="font-heading font-medium text-base hover:text-primary transition-colors">
            <Link to={`/products/${product._id}`}>{product.title}</Link>
          </h3>
          {item.color && <p className="text-xs text-text-muted mt-1">Màu: {item.color}</p>}
          <p className="text-xs text-emerald-600 mt-1">Còn {maxStock} sản phẩm</p>
        </div>
      </div>

      {/* Price */}
      <div className="text-center font-medium text-sm">
        {formatVND(itemPrice)}
      </div>

      {/* Quantity Controls */}
      <div className="flex justify-center">
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            disabled={updatingId === product._id || item.quantity <= 1}
            onClick={() => handleUpdateQuantity(product._id, item.quantity - 1, maxStock)}
            className="px-3 py-1 bg-surface hover:bg-border text-text-main font-bold text-sm disabled:opacity-40"
          >
            -
          </button>
          <span className="px-3 py-1 text-sm font-semibold min-w-[32px] text-center">
            {item.quantity}
          </span>
          <button
            disabled={updatingId === product._id || item.quantity >= maxStock}
            onClick={() => handleUpdateQuantity(product._id, item.quantity + 1, maxStock)}
            className="px-3 py-1 bg-surface hover:bg-border text-text-main font-bold text-sm disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Total Item Price */}
      <div className="text-right font-semibold text-primary text-base">
        {formatVND(itemPrice * item.quantity)}
      </div>

      {/* Remove Button */}
      <div className="flex justify-end">
        <button
          disabled={updatingId === product._id}
          onClick={() => handleRemoveItem(product._id)}
          className="text-text-muted hover:text-red-500 transition-colors p-2"
          title="Xóa khỏi giỏ hàng"
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
