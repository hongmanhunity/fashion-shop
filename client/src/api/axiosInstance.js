import axios from 'axios';

/**
 * 💡 BIẾN LƯU TOKEN TRONG BỘ NHỚ RAM & LOCALSTORAGE
 * AccessToken hết hạn nhanh (ví dụ 15 phút) để bảo mật.
 * Lưu trữ trong RAM + fallback localStorage giúp người dùng F5 tải lại trang không bị văng đăng xuất.
 */
let inMemoryAccessToken = localStorage.getItem('accessToken') || null;

/**
 * Hàm cập nhật AccessToken mới vào RAM & localStorage
 */
export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

/**
 * Hàm lấy AccessToken hiện tại
 */
export const getAccessToken = () => inMemoryAccessToken || localStorage.getItem('accessToken');

/**
 * 💡 KHỞI TẠO AXIOS INSTANCE TRUNG TÂM
 * withCredentials: true -> Bắt buộc gửi kèm Cookie (chứa RefreshToken) trong mọi request cross-origin.
 */
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

/**
 * 1. REQUEST INTERCEPTOR (Chốt chặn Gửi đi)
 * Trước khi bất kỳ request nào được gửi tới Backend,
 * tự động "dán" thẻ AccessToken vào Header: Authorization: Bearer <token>
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 2. RESPONSE INTERCEPTOR (Chốt chặn Phản hồi - Silent Refresh)
 * Khi Backend trả về lỗi 401 Unauthorized (do AccessToken hết hạn):
 * Tự động gọi API /user/refresh-token lấy AccessToken mới và gửi lại request bị lỗi ban đầu!
 */
let isRefreshing = false;
let failedQueue = [];

// Hàm giải quyết danh sách các request đang chờ refresh token hoàn tất
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Bắt lỗi 401 (Hết hạn Token) và chưa từng thử retry lại request này
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/user/refresh-token') &&
      !originalRequest.url?.includes('/user/login')
    ) {
      if (isRefreshing) {
        // Nếu đang trong quá trình lấy token mới, xếp request này vào hàng chờ
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi Backend xin cấp AccessToken mới bằng RefreshToken trong Cookie
        const res = await axiosInstance.post('/user/refresh-token');
        const newAccessToken = res.data.accessToken;

        // Lưu AccessToken mới & cập nhật Header cho request ban đầu
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Chạy lại tất cả các request trong hàng chờ
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu RefreshToken cũng hết hạn (7 ngày) -> Xóa token và buộc đăng nhập lại
        processQueue(refreshError, null);
        setAccessToken(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
