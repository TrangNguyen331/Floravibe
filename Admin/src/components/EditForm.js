import React, { useState } from "react";
import { Input, Textarea } from "@windmill/react-ui";
import { TagsInput } from "react-tag-input-component";
import { formatNumberWithDecimal } from "../helper/numberhelper";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const EditForm = ({ data, onSave, onCancel, onProductChange }) => {
  const handleCollectionsChange = (collections) => {
    onProductChange("collections", collections);
  };
  const handleTagsChange = (tags) => {
    onProductChange("tags", tags);
  };
  const handleImagesChange = (images) => {
    onProductChange("images", images);
  };
  const handleAdditionalInfoChange = (e, editor) => {
    const data = editor.getData();
    onProductChange("additionalInformation", data);
    console.log(data);
  };
  return (
    <form action="#">
      <div>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="block text-sm font-medium text-gray-900 dark:text-white">
            <strong>Product Name</strong>
            <Input
              type="text"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={(e) => onProductChange("name", e.target?.value || "")}
              value={(data && data.name) || ""}
            />
          </div>
          <div className="block text-sm font-medium text-gray-900 dark:text-white">
            <strong>Product Price</strong>
            <Input
              type="text"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={(e) => onProductChange("price", e.target?.value || "")}
              value={(data && data.price) || ""}
            />
          </div>
        </div>
        <div className="dark:text-white mb-4">
          <strong>Product Image</strong>
          <TagsInput
            type="text"
            rows="5"
            className="mb-4 mt-2 text-gray-800 dark:text-gray-300"
            onChange={handleImagesChange}
            value={(data && data.images) || []}
          />
        </div>
        <div className="grid gap-4 grid-cols-2">
          <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
            <strong>Product Collection</strong>
            <TagsInput
              type="text"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder=""
              onChange={handleCollectionsChange}
              value={(data && data.collections) || []}
            />
          </div>
          <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
            <strong>Product Tag</strong>
            <TagsInput
              classNames="mt-2"
              onChange={handleTagsChange}
              placeholder="Add tags (press Enter to add)"
              value={(data && data.tags) || []}
            />
          </div>
        </div>

        <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          <strong>Product Description</strong>
          <Textarea
            id="description"
            rows="5"
            className="block p-2.5 mt-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-transparent bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Write a description..."
            onChange={(e) =>
              onProductChange("description", e.target?.value || "")
            }
            value={(data && data.description) || ""}
          />
        </div>
        <div className="block mt-2 text-sm font-medium text-gray-900 dark:text-white">
          <strong>Product Additional Information</strong>
          {/* <Textarea
            id="additionalInformation"
            rows="5"
            className="block p-2.5 mt-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-transparent bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Write a description..."
            onChange={(e) =>
              onProductChange("additionalInformation", e.target?.value || "")
            }
            value={(data && data.additionalInformation) || ""}
          /> */}
          <CKEditor
            editor={ClassicEditor}
            onChange={(event, editor) => {
              handleAdditionalInfoChange(event, editor);
            }}
            config={{
              heading: {
                options: [
                  {
                    model: "paragraph",
                    title: "Paragraph",
                    class: "ck-heading_paragraph",
                  },
                  {
                    model: "heading1",
                    view: "h1",
                    title: "Heading 1",
                    class: "ck-heading_heading1",
                  },
                  {
                    model: "heading2",
                    view: "h2",
                    title: "Heading 2",
                    class: "ck-heading_heading2",
                  },
                  {
                    model: "heading3",
                    view: "h3",
                    title: "Heading 3",
                    class: "ck-heading_heading3",
                  },
                  {
                    model: "heading4",
                    view: "h4",
                    title: "Heading 4",
                    class: "ck-heading_heading4",
                  },
                  {
                    model: "heading5",
                    view: "h5",
                    title: "Heading 5",
                    class: "ck-heading_heading5",
                  },
                  {
                    model: "heading6",
                    view: "h6",
                    title: "Heading 6",
                    class: "ck-heading_heading6",
                  },
                ],
              },
            }}
            data={(data && data.additionalInformation) || ""}
          />
        </div>
      </div>
    </form>
  );
};

export default EditForm;
