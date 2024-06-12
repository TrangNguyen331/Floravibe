import React, { useState } from "react";
import { Input, Textarea, Button } from "@windmill/react-ui";
import { TagsInput } from "react-tag-input-component";
import { formatNumberWithDecimal } from "../helper/numberhelper";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axiosInstance from "../axiosInstance";
import axiosImgBB from "../axiosImgBB";
import { TrashIcon } from "../icons";
import { FaSpinner } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import CustomOption from "./CustomOption";
import Select, { createFilter } from "react-select";
const EditForm = ({
  data,
  collectionData,
  tagData,
  onSave,
  onCancel,
  onProductChange,
}) => {
  const [loadingImg, setLoadingImg] = useState(false);

  const handleCollectionsChange = (collections) => {
    onProductChange("collections", collections);
  };
  const handleTagsChange = (tags) => {
    onProductChange("tags", tags);
  };
  const handleDeleteImage = (index) => {
    const updatedImages = [...data.images];
    updatedImages.splice(index, 1);
    onProductChange("images", updatedImages);
  };
  const handleImageChange = (e) => {
    const files = e.target.files;
    const newImages = [];
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    axiosInstance
      .post("/api/v1/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Handle success
        console.log("Upload successful:", response);
        response.data.forEach((item) => {
          newImages.push(
            "http://localhost:8080/api/v1/files/viewfile/" + item.identifier
          );
        });
        // Update product images with new images
        if (newImages.length > 0) {
          onProductChange("images", [...data.images, ...newImages]);
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error uploading:", error);
        // You can show an error message to the user
      });
  };
  const API_KEY = process.env.REACT_APP_IMAGE_HOSTING_KEY;
  const handleImgChange = async (e) => {
    setLoadingImg(true);
    const files = e.target.files;
    const imgUrls = [];
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("image", files[i]);
      try {
        await axiosImgBB
          .post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            imgUrls.push(response.data.data.url);
          });
        onProductChange("images", [...data.images, ...imgUrls]);

        setLoadingImg(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  const handleAdditionalInfoChange = (e, editor) => {
    const data = editor.getData();
    onProductChange("additionalInformation", data);
  };
  console.log(data);
  return (
    <div>
      <form action="#">
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-1">
            <div className="grid gap-4 mb-5 grid-cols-2">
              <div className="block text-base font-medium text-gray-900 dark:text-white">
                <strong>Product Name</strong>
                <Input
                  type="text"
                  placeholder="Type product name here"
                  className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={(e) => onProductChange("name", e.target?.value || "")}
                  value={(data && data.name) || ""}
                />
              </div>
              <div className="block text-base font-medium text-gray-900 dark:text-white">
                <strong>Product Price</strong>
                <Input
                  type="number"
                  placeholder="Enter product price here"
                  className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={(e) =>
                    onProductChange("price", e.target?.value || "")
                  }
                  value={(data && data.price) || ""}
                />
              </div>
            </div>

            <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
              <strong>Product Collection</strong>
              {/* <TagsInput
                  type="text"
                  className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  onChange={handleCollectionsChange}
                  value={(data && data.collections) || []}
                /> */}
              <Select
                isMulti
                className="custom-select"
                components={{ Option: CustomOption }}
                styles={{
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "rgba(126, 58, 242, 1)",
                    color: "#ffffff",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#ffffff",
                  }),
                }}
                placeholder="Enter product collection"
                filterOption={createFilter({ ignoreAccents: false })}
                closeMenuOnSelect={false}
                options={collectionData.map((collection) => ({
                  value: collection.id,
                  label: collection.name,
<<<<<<< Updated upstream
                }))
              }
              onChange={(value) =>
                handleCollectionsChange(
                  value.map((item) => ({ id: item.value, name: item.label }))
                )
              }
            />
          </div>
          <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
            <strong>Product Tag</strong>
            {/* <TagsInput
                classNames="mt-2"
                onChange={handleTagsChange}
                placeholder="Add tags (press Enter to add)"
                value={(data && data.tags) || []}
              /> */}
            <Select
              isMulti
              className="custom-select"
              components={{ Option: CustomOption }}
              styles={{
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "rgba(126, 58, 242, 1)",
                  color: "#ffffff",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "#ffffff",
                }),
              }}
              placeholder="Enter product tag"
              filterOption={createFilter({ ignoreAccents: false })}
              closeMenuOnSelect={false}
              options={tagData.map((tag) => ({
                value: tag.name,
                label: tag.name,
              }))}
              value={
                data &&
                data.tags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))
              }
              onChange={(value) =>
                handleTagsChange(
                  value.map((item) => ({ id: item.value, name: item.label }))
                )
              }
            />
          </div>

          <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
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
          <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
            <strong>Stock Quantity</strong>
            <Input
              type="number"
              className="block p-2.5 mt-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-transparent bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={(data && data.stockQty) || ""}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  onProductChange("stockQty", e.target.value);
=======
                }))}
                value={
                  data &&
                  data.collections.map((collection) => ({
                    value: collection.id,
                    label: collection.name,
                  }))
                }
                onChange={(value) =>
                  handleCollectionsChange(
                    value.map((item) => ({ id: item.value, name: item.label }))
                  )
>>>>>>> Stashed changes
                }
              />
            </div>
            <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
              <strong>Product Tag</strong>
              {/* <TagsInput
                  classNames="mt-2"
                  onChange={handleTagsChange}
                  placeholder="Add tags (press Enter to add)"
                  value={(data && data.tags) || []}
                /> */}
              <Select
                isMulti
                className="custom-select"
                components={{ Option: CustomOption }}
                styles={{
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "rgba(126, 58, 242, 1)",
                    color: "#ffffff",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#ffffff",
                  }),
                }}
                placeholder="Enter product tag"
                filterOption={createFilter({ ignoreAccents: false })}
                closeMenuOnSelect={false}
                options={tagData.map((tag) => ({
                  value: tag.name,
                  label: tag.name,
                }))}
                value={data && data.tags}
                onChange={handleTagsChange}
              />
            </div>

            <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
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
            <div className="block mb-4 text-base font-medium text-gray-900 dark:text-white">
              <strong>Stock Quantity</strong>
              <Input
                type="number"
                className="block p-2.5 mt-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-transparent bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={(data && data.stockQty) || ""}
                onChange={(e) => {
                  if (e.target.value >= 0) {
                    onProductChange("stockQty", e.target.value);
                  }
                }}
              />
            </div>
            <div className="block mt-2 text-base font-medium text-gray-900 dark:text-white">
              <div className="mb-2">
                <strong>Product Additional Information</strong>
              </div>
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
          <div className="col-span-1 bg-gray-100 rounded-lg p-6">
            {/* <div className="dark:text-white mb-4 text-base">
              <strong>Product Image</strong>
              <input type="file" multiple onChange={handleImgChange} />
              <div className="flex flex-wrap gap-2 mt-1">
                {data &&
                  data.images.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Product Image ${index}`}
                        className="w-20 h-20 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteImage(index)}
                      >
                        x
                      </button>
                    </div>
                  ))}
              </div>
            </div> */}
            <div className="flex justify-center">
              <label className="upload-product-img">
                <FiUpload />
                Upload Product Image
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleImgChange}
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              {loadingImg ? (
                <FaSpinner className="animate-spin text-gray-800 dark:text-gray-300" />
              ) : (
                <div className="image-container">
                  {data.images.map((imageUrl, index) => (
                    <div className="image-preview" key={index}>
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="preview-image"
                      />
                      <div className="overlay">
                        <Button
                          icon={TrashIcon}
                          onClick={() => handleDeleteImage(index)}
                          className="delete-button"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
