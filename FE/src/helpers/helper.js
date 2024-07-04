export const filterOrderByStatus = (orders, status) => {
  if (orders && status) {
    switch (status) {
      case "All":
        return [...orders].sort((a, b) => a.createdDate - b.createdDate);
      case "InProgress":
        return [...orders]
          .filter((x) => x.status === "IN_REQUEST")
          .sort((a, b) => a.createdDate - b.createdDate);
      case "Processing":
        return [...orders]
          .filter((x) => x.status === "IN_PROCESSING")
          .sort((a, b) => a.createdDate - b.createdDate);
      case "Completed":
        return [...orders]
          .filter((x) => x.status === "COMPLETED")
          .sort((a, b) => a.createdDate - b.createdDate);
      case "Canceled":
        return [...orders]
          .filter(
            (x) =>
              x.status === "CANCEL" &&
              x.cancelDetail &&
              x.cancelDetail.cancelDate !== null
          )
          .sort((a, b) => {
            const dateA = new Date(a.cancelDetail.cancelDate);
            const dateB = new Date(b.cancelDetail.cancelDate);
            return dateB - dateA;
          });
      default:
        return [...orders].sort((a, b) => a.createdDate - b.createdDate);
    }
  }
  return [];
};

export const getStatus = (key) => {
  switch (key) {
    case "IN_REQUEST":
      return "In Request";
    case "IN_PROCESSING":
      return "Processing";
    case "COMPLETED":
      return "COMPLETED";
    case "CANCEL":
      return "CANCELED";
    default:
      return "";
  }
};

export const formatReadableDate = (date) => {
  const parsedDate = new Date(date);

  // Format the date using Intl.DateTimeFormat
  const formattedDateTime = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(parsedDate);
  return formattedDateTime;
};

export const reasonList = [
  {
    key: "bad_service",
    value: "Không hài lòng với dịch vụ",
  },
  {
    key: "wrong_product",
    value: "Sai sản phẩm",
  },
  {
    key: "wrong_address_phone",
    value: "Muốn cập nhật địa chỉ/sdt nhận hàng",
  },
  {
    key: "change_voucher",
    value: "Muốn đổi mã giảm giá",
  },
  {
    key: "dont-buy",
    value: "Không muốn mua nữa",
  },
  {
    key: "cheaper_shop",
    value: "Phát hiện chỗ có giá rẻ hơn",
  },
  {
    key: "no_reason",
    value: "Không tìm được lý do hủy phù hợp ",
  },
];
