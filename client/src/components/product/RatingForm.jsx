import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Star,
  ChatCircleText,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";

const RatingForm = ({
  productId = "",
  onRatingSuccess = null,
  isLoggedIn = false,
}) => {
  const [ratingStar, setRatingStar] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setMessage({ type: "error", text: "Bạn cần đăng nhập để gửi đánh giá!" });
      return;
    }

    if (!comment.trim()) {
      setMessage({
        type: "error",
        text: "Vui lòng viết nội dung nhận xét của bạn.",
      });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.put(
        "http://localhost:3000/api/product/ratings",
        {
          pid: productId,
          star: ratingStar,
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data && response.data.success) {
        setMessage({
          type: "success",
          text: "Ghi nhận đánh giá thành công! Cảm ơn bạn.",
        });
        setComment("");
        if (onRatingSuccess) onRatingSuccess();
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      const apiErrorMsg =
        error.response?.data?.mes || error.response?.data?.message;
      setMessage({
        type: "error",
        text: apiErrorMsg || "Có lỗi xảy ra khi gửi đánh giá.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border mb-12 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ChatCircleText size={24} className="text-primary" /> Viết đánh giá của
        bạn
      </h3>

      {isLoggedIn ? (
        <form onSubmit={handleSubmitRating} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Đánh giá số sao:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStar(star)}
                  onMouseEnter={() => setHoverStar(star)}
                  onMouseLeave={() => setHoverStar(0)}
                  className="text-[#FFC107] hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star
                    size={28}
                    weight={
                      star <= (hoverStar || ratingStar) ? "fill" : "regular"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-medium text-text-muted">
                ({ratingStar} trên 5 sao)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Nhận xét chi tiết:
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hãy chia sẻ cảm nhận của bạn về chất lượng sản phẩm, kiểu dáng, chất liệu..."
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-text-main"
            ></textarea>
          </div>

          {message.text && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <WarningCircle size={20} />
              )}
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors shadow-soft disabled:opacity-50"
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-accent/30 rounded-xl border border-border text-center flex flex-col items-center gap-3">
          <p className="text-text-main font-medium">Bạn chưa đăng nhập?</p>
          <p className="text-sm text-text-muted">
            Vui lòng đăng nhập tài khoản của bạn để có thể gửi đánh giá cho sản
            phẩm này.
          </p>
          <Link
            to="/login"
            className="mt-2 inline-block bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      )}
    </div>
  );
};

export default RatingForm;
