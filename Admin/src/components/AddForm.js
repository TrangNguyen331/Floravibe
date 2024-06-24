import React, { useState } from "react";
import { Input, Textarea } from "@windmill/react-ui";
import { TagsInput } from "react-tag-input-component";

const AddForm = () => {
  const [tags, setTags] = useState([]);
  return (
    <form action="#">
      <div>
        <div className="dark:text-white">
          <span>Product Image</span>
          <Input
            type="file"
            className="mb-4 mt-2 text-gray-800 dark:text-gray-300"
          />
        </div>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
            <span>Product Name</span>
            <Input
              type="text"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Ex. Apple iMac 27&ldquo;"
            />
          </div>
          <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
            <span>Product Price</span>
            <Input
              type="number"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="$299"
            />
          </div>
        </div>

        <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
          <span>Product Collection</span>
          <Input
            type="text"
            value="Summer"
            className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder=""
          />
        </div>

        <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
          <span>Product Tag</span>
          <TagsInput
            classNames="mt-2"
            defaultValue={tags}
            onChange={setTags}
            placeholder="Add tags (press Enter to add)"
          />
        </div>

        <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          <span>Product Description</span>
          <Textarea
            id="description"
            rows="5"
            className="block p-2.5 mt-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-transparent bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Write a description..."
          />
        </div>
      </div>
    </form>
  );
};

export default AddForm;
