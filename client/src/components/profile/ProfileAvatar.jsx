import { useRef } from 'react';
import { Camera, UploadSimple, User } from '@phosphor-icons/react';

const ProfileAvatar = ({ avatar, name, email, onAvatarChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Giới hạn dung lượng 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh quá lớn. Vui lòng chọn tệp ảnh nhỏ hơn 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result); // Chuyển sang Base64 để hiển thị & lưu DB
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-xl p-8 rounded-3xl border border-white/60 text-center shadow-float flex flex-col items-center">
      {/* Container Khung Ảnh Đại Diện */}
      <div className="relative group w-36 h-36 mb-6">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/30 p-1 shadow-soft bg-white">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar User"
              className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-accent/80 text-primary font-bold flex items-center justify-center text-4xl uppercase">
              {name ? name.charAt(0) : <User size={48} />}
            </div>
          )}
        </div>

        {/* Overlay nút chọn ảnh khi hover */}
        <button
          type="button"
          onClick={triggerFileInput}
          className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] cursor-pointer"
          title="Tải ảnh từ máy tính"
        >
          <Camera size={28} className="mb-1" />
          <span className="text-[11px] font-medium uppercase tracking-wider">Đổi ảnh</span>
        </button>
      </div>

      {/* Tên & Email */}
      <h3 className="font-heading text-xl font-semibold text-text-main mb-1">
        {name || 'Thành viên Lumière'}
      </h3>
      <p className="text-xs text-text-muted mb-6 font-light">{email}</p>

      {/* Input file ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Nút chọn ảnh từ máy tính */}
      <button
        type="button"
        onClick={triggerFileInput}
        className="w-full inline-flex items-center justify-center gap-2 bg-background hover:bg-white text-text-main border border-border hover:border-primary/50 text-xs font-semibold py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-xs cursor-pointer"
      >
        <UploadSimple size={18} className="text-primary" />
        Tải ảnh từ máy tính
      </button>

      <p className="text-[11px] text-text-muted mt-3 font-light">
        Dung lượng tối đa 5MB (JPG, PNG, WEBP)
      </p>
    </div>
  );
};

export default ProfileAvatar;
