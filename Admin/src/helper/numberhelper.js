export function formatNumberWithDecimal(number) {
  // Convert the number to a string
  const numString = String(number);
  // Split the string into groups of three digits
  const groups = numString.split(/(?=(?:\d{3})+(?!\d))/);

  // Join the groups with a decimal point
  const formattedNumber = groups.join(".");

  return formattedNumber;
}

export const statusOptions = [
  {
    value: "IN_REQUEST",
    label: "In Request",
    color:
      "p-2 rounded-md bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100 mb-2 mt-2",
  },
  {
    value: "IN_PROCESSING",
    label: "In Progress",
    color:
      "p-2 rounded-md bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-pink-100 mb-2 mt-2",
  },
  {
    value: "CANCEL",
    label: "Cancel",
    color:
      "p-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100 mb-2 mt-2",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color:
      "p-2 rounded-md bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 mb-2 mt-2",
  },
];
export const statusSingleOptions = [
  {
    value: "IN_REQUEST",
    label: "IN REQUEST",
    color:
      "px-5 py-4 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100",
  },
  {
    value: "IN_PROCESSING",
    label: "IN PROGRESS",
    color:
      "px-4 py-4 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-pink-100",
  },
  {
    value: "CANCEL",
    label: "CANCELLED",
    color:
      "px-5 py-3 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100",
  },
  {
    value: "COMPLETED",
    label: "COMPLETED",
    color:
      "px-5 py-3 rounded-full bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
  },
];
export const reasonList = [
  {
    key: "out_of_stock",
    value: "Sản phẩm hết hàng",
  },
  {
    key: "shipping_problem",
    value: "Có vấn đề về vận chuyển",
  },
  {
    key: "cancel_by_user",
    value: "Khách hàng yêu cầu hủy",
  },
  {
    key: "wrong_product_info",
    value: "Giá cả/ Thông tin sản phẩm không đúng",
  },
  {
    key: "black_list",
    value: "Khách hàng nằm trong danh sách đen",
  },
];
