import React from "react";
import { Input } from "@windmill/react-ui";

export const AccountForm = ({ data, handleInputChange }) => {
  return (
    <form action="#">
      <div>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
            <strong>First name</strong>
            <Input
              type="text"
              onChange={(e) =>
                handleInputChange("firstName", e.target?.value || "")
              }
              value={(data && data.firstName) || ""}
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>
          <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
            <strong>Last name</strong>
            <Input
              type="text"
              onChange={(e) =>
                handleInputChange("lastName", e.target?.value || "")
              }
              value={(data && data.lastName) || ""}
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>
        </div>
        <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
          <strong>Email</strong>
          <Input
            type="email"
            onChange={(e) => handleInputChange("email", e.target?.value || "")}
            value={(data && data.email) || ""}
            className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
        </div>
        <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
          <strong>Username</strong>
          <Input
            type="text"
            onChange={(e) =>
              handleInputChange("username", e.target?.value || "")
            }
            value={(data && data.username) || ""}
            className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
        </div>
        <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
          <strong>Password</strong>
          <Input
            type="password"
            onChange={(e) =>
              handleInputChange("password", e.target?.value || "")
            }
            value={(data && data.password) || ""}
            className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
        </div>
        <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
          <Input
            type="checkbox"
            checked={data.admin}
            onChange={(e) => handleInputChange("admin", e.target.checked)}
            className="h-5 w-5"
          />
          <span className="ml-2">is Admin</span>
        </div>
      </div>
    </form>
  );
};
