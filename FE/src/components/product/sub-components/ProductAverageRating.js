import React from "react";

const ProductAverageRating = ({ product }) => {
  // Tính tổng và số lượng đánh giá
  const totalRating = product.reviews.reduce(
    (acc, review) => acc + review.ratingValue,
    0
  );
  const numberOfReviews = product.reviews.length;

  // Tính trung bình mức sao
  const averageRating =
    numberOfReviews === 0 ? 0 : totalRating / numberOfReviews;

  // Làm tròn số và chỉ hiển thị đến 1 chữ số thập phân
  const formattedAverageRating = averageRating.toFixed(1);

  // Tạo mảng các biểu tượng sao dựa trên trung bình mức sao
  const stars = [];
  const fullStars = Math.floor(averageRating); // Số lượng sao đầy
  const hasHalfStar = averageRating - fullStars >= 0.5; // Có sao nửa không

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<i className="fa fa-star yellow" key={i}></i>);
    } else if (hasHalfStar && i === fullStars) {
      stars.push(<i className="fa fa-star-half-o yellow" key={i}></i>);
    } else {
      stars.push(<i className="fa fa-star-o" key={i}></i>);
    }
  }

  return (
    <div>
      <p>
        {stars} {formattedAverageRating} ({numberOfReviews} reviews)
      </p>
    </div>
  );
};

export default ProductAverageRating;
