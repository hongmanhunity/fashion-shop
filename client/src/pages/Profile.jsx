import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import ProfileForm from '../components/profile/ProfileForm';
import { useProfile } from '../hooks/useProfile';

const Profile = () => {
  const {
    formData,
    loading,
    updating,
    message,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  } = useProfile();

  if (loading) {
    return (
      <div className="container-custom py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4" />
        <p className="text-text-muted text-sm">Đang tải thông tin tài khoản Lumière...</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[80vh]">
      {/* 1. Header Hồ sơ cá nhân */}
      <ProfileHeader user={formData} />

      {/* 2. Thân trang Profile chứa background.jpg hồng luxury mờ 30% */}
      <div className="relative pt-8 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none z-0"
          style={{ backgroundImage: `url('/background.jpg')` }}
        />

        <div className="container-custom max-w-5xl mx-auto relative z-10">
          {/* Alert Thông Báo */}
          {message.text && (
            <div
              className={`p-4 rounded-2xl mb-8 flex items-center gap-3 border text-sm shadow-xs animate-fade-in ${
                message.type === 'success'
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50/90 border-rose-200 text-rose-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={22} className="shrink-0 text-emerald-600" />
              ) : (
                <WarningCircle size={22} className="shrink-0 text-rose-600" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Grid Layout 2 Cột */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cột 1: Avatar Component */}
            <div className="lg:col-span-4">
              <ProfileAvatar
                avatar={formData.avatar}
                name={`${formData.firstname} ${formData.lastname}`.trim()}
                email={formData.email}
                onAvatarChange={handleAvatarChange}
              />
            </div>

            {/* Cột 2: Profile Form Component */}
            <div className="lg:col-span-8">
              <ProfileForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                updating={updating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
