import React from "react";
import { Input } from "@windmill/react-ui";
const CollectionForm = ({ data, handleInputChange }) => {
  return (
    <form action="#">
      <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
        <span>Category Name</span>
        <Input
          type="text"
          className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          onChange={(e) => handleInputChange("name", e.target?.value || "")}
          value={(data && data.name) || ""}
        />
      </div>
    </form>
  );
};
export default CollectionForm;
