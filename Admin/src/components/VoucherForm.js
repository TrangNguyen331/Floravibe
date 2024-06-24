import React from "react";
import { Input } from "@windmill/react-ui";
const VoucherForm = ({ data, handleInputChange }) => {
  return (
    <form action="#">
      <div>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
            <span>Voucher name</span>
            <Input
              type="text"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={(e) =>
                handleInputChange("voucherName", e.target?.value || "")
              }
              value={(data && data.voucherName) || ""}
            />
          </div>
          <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
            <span>Quantity</span>
            <Input
              type="number"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={(e) => {
                if (e.target.value >= 0) {
                  handleInputChange("quantity", e.target.value);
                }
              }}
              value={(data && data.quantity) || ""}
            />
          </div>
        </div>
        <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
          <span>Voucher Value</span>
          <Input
            type="number"
            className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            onChange={(e) => {
              if (e.target.value >= 0) {
                handleInputChange("voucherValue", e.target.value);
              }
            }}
            value={(data && data.voucherValue) || ""}
          />
        </div>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="block text-sm font-medium text-gray-900 dark:text-white">
            <span>Effective Date</span>
            <Input
              type="date"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={(e) =>
                handleInputChange("effectiveDate", e.target?.value || "")
              }
              value={(data && data.effectiveDate) || ""}
            />
          </div>
          <div className="block text-sm font-medium text-gray-900 dark:text-white">
            <span>Valid Til</span>
            <Input
              type="date"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={(e) =>
                handleInputChange("validUntil", e.target?.value || "")
              }
              value={(data && data.validUntil) || ""}
            />
          </div>
        </div>
        <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
          <span>Description</span>
          <textarea
            type="text"
            rows="3"
            className="mt-2 px-2 py-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            onChange={(e) =>
              handleInputChange("description", e.target?.value || "")
            }
            value={(data && data.description) || ""}
          />
        </div>
        <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
          <Input
            type="checkbox"
            checked={data.guest}
            onChange={(e) => handleInputChange("guest", e.target.checked)}
            className="h-5 w-5"
          />
          <span className="ml-2">For guest</span>
        </div>
      </div>
    </form>
  );
};
export default VoucherForm;
