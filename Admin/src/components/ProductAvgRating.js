import React from "react";
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function ProductAvgRating({ product }) {
  // Tính tổng và số lượng đánh giá
  const totalRating = product.reviews.reduce(
    (acc, review) => acc + review.ratingValue,
    0
  );

  // Tính trung bình mức sao
  const averageRating = !!product.reviews.length
    ? totalRating / product.reviews.length
    : 0;

  // Làm tròn số và chỉ hiển thị đến 1 chữ số thập phân
  const roundedAverageRating = Math.round(averageRating * 100) / 100;
  const formattedAverageRating = roundedAverageRating.toFixed(1);
  
  return (
    <React.Fragment>
      <Rating
        name="average-rating"
        value={roundedAverageRating}
        precision={0.1}
        emptyIcon={<StarBorderIcon />}
        readOnly
        className="mr-2"
      />
      {`${formattedAverageRating}`}
    </React.Fragment>
  );
}