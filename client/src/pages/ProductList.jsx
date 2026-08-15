import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ProductCard from '../components/product/ProductCard';
import ProductFilterSidebar from '../components/product/ProductFilterSidebar';

/**
 * 💡 PAGE COMPONENT: ProductList (Danh sách Sản phẩm)
 * -----------------------------------------------------------------------
 * Quản lý logic Lọc (Filter), Sắp xếp (Sort), Tìm kiếm (Search) và Phân trang (Pagination).
 * Dữ liệu tự động đồng bộ từ Backend qua API /product mỗi khi State thay đổi.
 */
const ProductList = () => {
  // 1. Quản lý danh sách sản phẩm & trạng thái tải
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Quản lý Bộ Lọc (Filter States)
  const [sort, setSort] = useState('-createdAt'); // Mới nhất lên đầu
  const [category, setCategory] = useState('all'); // Tất cả danh mục
  const [priceRange, setPriceRange] = useState('all'); // Tất cả khoảng giá
  const [searchQuery, setSearchQuery] = useState(''); // Từ khóa tìm kiếm
  const [page, setPage] = useState(1); // Trang hiện tại
  const [paginationInfo, setPaginationInfo] = useState({
    totalCount: 0,
    totalPages: 1,
    currentPage: 1
  });

  // 3. Tự động gọi API lấy dữ liệu mỗi khi 1 trong các bộ lọc thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          sort,
          page,
          limit: 6 // Hiển thị 6 sản phẩm / trang
        };

        // Lọc theo Danh mục
        if (category !== 'all') {
          params.category = category;
        }

        // Tìm kiếm theo từ khóa
        if (searchQuery.trim()) {
          params.q = searchQuery.trim();
        }

        // Lọc theo Khoảng giá
        if (priceRange === 'under500') {
          params['price[lte]'] = 500000;
        } else if (priceRange === '500to1000') {
          params['price[gte]'] = 500000;
          params['price[lte]'] = 1000000;
        } else if (priceRange === 'above1000') {
          params['price[gte]'] = 1000000;
        }

        // Gọi API backend với query params
        const response = await axiosInstance.get('/product', { params });
        if (response.data && response.data.success) {
          setProducts(response.data.products);
          setPaginationInfo({
            totalCount: response.data.totalCount || 0,
            totalPages: response.data.totalPages || 1,
            currentPage: response.data.currentPage || 1
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sort, category, priceRange, searchQuery, page]);

  // 4. Handlers thay đổi bộ lọc -> Luôn reset về trang 1
  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  return (
    <div className="container-custom py-6">
      {/* Header & Thanh Tìm Kiếm / Sắp Xếp */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 pb-4 border-b border-border">
        <h1 className="text-4xl font-heading">Tất Cả Sản Phẩm</h1>

        <div className="flex flex-wrap items-center gap-4">
          {/* Ô Tìm Kiếm Từ Khóa */}
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-border rounded-md font-body text-sm bg-surface focus:outline-none focus:border-primary w-full sm:w-64"
          />

          {/* Selector Sắp Xếp */}
          <select 
            value={sort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-border rounded-md font-body text-sm bg-surface cursor-pointer focus:outline-none focus:border-primary"
          >
            <option value="-createdAt">Sắp xếp: Mới nhất</option>
            <option value="price">Giá: Thấp đến Cao</option>
            <option value="-price">Giá: Cao đến Thấp</option>
            <option value="-sold">Bán chạy nhất</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
        {/* Sidebar Bộ Lọc Đã Tách Nhỏ Component */}
        <ProductFilterSidebar
          category={category}
          handleCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          handlePriceChange={handlePriceChange}
        />

        {/* Danh Sách Sản Phẩm & Phân Trang */}
        <main className="flex flex-col gap-8">
          {loading ? (
            <div className="text-center py-12 text-text-muted text-lg">Đang tải danh sách sản phẩm...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-lg">Không tìm thấy sản phẩm phù hợp!</div>
          ) : (
            <>
              {/* Grid 3 Cột Sản Phẩm */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Thanh Phân Trang (Pagination Controls) */}
              {paginationInfo.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 pt-8 border-t border-border">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => prev - 1)}
                    className="px-4 py-2 border border-border rounded-md text-sm font-medium disabled:opacity-40 hover:bg-surface transition-colors"
                  >
                    Trang trước
                  </button>

                  <span className="text-sm font-medium text-text-muted">
                    Trang {paginationInfo.currentPage} / {paginationInfo.totalPages}
                  </span>

                  <button
                    disabled={page === paginationInfo.totalPages}
                    onClick={() => setPage(prev => prev + 1)}
                    className="px-4 py-2 border border-border rounded-md text-sm font-medium disabled:opacity-40 hover:bg-surface transition-colors"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
