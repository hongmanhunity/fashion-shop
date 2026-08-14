import { Star } from '@phosphor-icons/react';

const RatingList = ({ ratings = [], avgRating = 0, ratingCount = 0 }) => {
  return (
    <div className="mt-16 pt-12 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-heading mb-2">Đánh giá từ khách hàng</h2>
          <p className="text-text-muted">Ý kiến trải nghiệm thực tế từ những người đã mua sản phẩm này</p>
        </div>
        {ratingCount > 0 && (
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">
              {avgRating} <span className="text-lg font-normal text-text-muted">/ 5</span>
            </div>
            <div className="flex text-[#FFC107] justify-end mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} weight={star <= Math.round(avgRating) ? "fill" : "regular"} size={16} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Danh sách nhận xét */}
      {ratings && ratings.length > 0 ? (
        <div className="flex flex-col gap-6">
          {ratings.map((rating, index) => {
            const reviewerName = rating.postedBy
              ? `${rating.postedBy.firstname || ''} ${rating.postedBy.lastname || ''}`.trim()
              : 'Khách hàng ẩn danh';

            return (
              <div key={index} className="bg-surface p-6 rounded-xl border border-border shadow-xs hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {rating.postedBy?.avatar ? (
                      <img
                        src={rating.postedBy.avatar}
                        alt={reviewerName}
                        className="w-10 h-10 rounded-full object-cover border border-primary/20 shadow-xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-base uppercase">
                        {reviewerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-text-main">{reviewerName}</h4>
                      <div className="flex text-[#FFC107] mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} weight={i < rating.star ? "fill" : "regular"} size={16} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-text-muted leading-relaxed pl-13">{rating.comment}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-text-muted italic text-center py-8 bg-surface rounded-xl border border-border">
          Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và để lại nhận xét!
        </p>
      )}
    </div>
  );
};

export default RatingList;
