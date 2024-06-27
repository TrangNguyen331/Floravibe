import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import {
  AddIcon,
  TrashIcon,
  PublishIcon,
  StoreIcon,
  DashboardIcon,
} from "../icons";
import { TagsInput } from "react-tag-input-component";
import axiosInstance from "../axiosInstance";
import axiosImgBB from "../axiosImgBB";
import { useToasts } from "react-toast-notifications";
import { FaSpinner } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import {
  Card,
  CardBody,
  Label,
  Input,
  Textarea,
  Button,
} from "@windmill/react-ui";
import Select, { createFilter } from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../index.css";
import CustomOption from "../components/CustomOption";
const FormTitle = ({ children }) => {
  return (
    <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
      {children}
    </h2>
  );
};

const AddProduct = () => {
  const [loadingImg, setLoadingImg] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { addToast } = useToasts();
  const [collections, setCollections] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [tagLoaded, setTagLoaded] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({
    id: "",
    name: "",
    description: "",
    additionalInformation: "",
    price: 0,
    stockQty: 0,
    tags: [],
    images: [],
    collections: [],
  });
  const fetchCollections = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/collections/all");
      setCollections(response.data);
      setDataLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };
  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/tags/all");
      setAllTags(response.data);
      setTagLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };
  const handleProductChange = (property, value) => {
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [property]: value,
    }));
    console.log(value);
  };
  const handleAdditionalInfoChange = (e, editor) => {
    const data = editor.getData();
    handleProductChange("additionalInformation", data);
  };
  const handleImageChange = (e) => {
    const files = e.target.files;
    const urls = [];
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
          urls.push(
            "http://localhost:8080/api/v1/files/viewfile/" + item.identifier
          );
        });
        if (urls.length === files.length) {
          handleProductChange("images", urls);
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error uploading:", error);
        // You can show an error message to the user
      });
  };
  const handleDeleteImage = (index) => {
    const updatedImages = [...selectedProduct.images];
    updatedImages.splice(index, 1);
    handleProductChange("images", updatedImages);
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
            if (imgUrls.length === files.length) {
              handleProductChange("images", [
                ...selectedProduct.images,
                ...imgUrls,
              ]);
              setLoadingImg(false);
            }
          });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  const handleSave = async () => {
    if (
      !selectedProduct.name ||
      !selectedProduct.description ||
      selectedProduct.price < 0 ||
      selectedProduct.stockQty < 0 ||
      selectedProduct.tags.length === 0 ||
      selectedProduct.images.length === 0 ||
      selectedProduct.collections.length === 0
    ) {
      addToast("Please fill in all the required fields", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    setLoadingSave(true);
    let body = {
      name: selectedProduct.name,
      description: selectedProduct.description,
      additionalInformation: selectedProduct.additionalInformation,
      price: selectedProduct.price,
      stockQty: selectedProduct.stockQty,
      tags: selectedProduct.tags,
      images: selectedProduct.images,
      collections: selectedProduct.collections,
    };
    try {
      await axiosInstance.post("/api/v1/products", body);
      addToast("Added new product successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      setSelectedProduct({
        id: "",
        name: "",
        description: "",
        additionalInformation: "",
        price: 0,
        stockQty: 0,
        tags: [],
        images: [],
        collections: [],
      });
      setLoadingSave(false);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    fetchCollections();
    fetchTags();
  }, []);
  return (
    <div>
      <PageTitle>Add New Product</PageTitle>

      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={DashboardIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add New Product</p>
      </div>

      <div className="w-full my-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:col-span-1">
          <CardBody>
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="block text-sm font-medium text-gray-900 dark:text-white">
                <FormTitle>Product Name</FormTitle>
                <Label>
                  <Input
                    type="text"
                    placeholder="Enter product name"
                    className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={selectedProduct.name}
                    onChange={(e) =>
                      handleProductChange("name", e.target?.value || "")
                    }
                  />
                </Label>
              </div>
              <div className="block text-sm font-medium text-gray-900 dark:text-white">
                <FormTitle>Product Price</FormTitle>
                <Label>
                  <Input
                    type="number"
                    placeholder="Enter product price here"
                    className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={selectedProduct.price}
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        handleProductChange("price", e.target.value);
                      }
                    }}
                  />
                </Label>
              </div>
            </div>

            <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
              <FormTitle>Product Category</FormTitle>
              <Select
                isMulti
                className="custom-select bg-transparent border-gray-300 text-gray-900 placeholder-gray-100 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                placeholder="Enter product category"
                filterOption={createFilter({ ignoreAccents: false })}
                closeMenuOnSelect={false}
                options={
                  dataLoaded && collections
                    ? collections.map((collection) => ({
                        value: collection.id,
                        label: collection.name,
                      }))
                    : []
                }
                value={selectedProduct.collections.map((collection) => ({
                  value: collection.id,
                  label: collection.name,
                }))}
                onChange={(value) =>
                  handleProductChange(
                    "collections",
                    value.map((item) => ({ id: item.value, name: item.label }))
                  )
                }
              />
            </div>
            <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
              <FormTitle>Product Tag</FormTitle>
              {/* <TagsInput
                classNames="mt-2"
                placeholder="Add tags (press Enter to add)"
                value={selectedProduct.tags || []}
                onChange={(value) => handleProductChange("tags", value)}
              /> */}
              <Select
                isMulti
                className="custom-select"
                components={{ Option: CustomOption }}
                styles={{
                  menu: (base) => ({
                    ...base,
                    zIndex: 2,
                  }),
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
                options={
                  tagLoaded && allTags
                    ? allTags.map((tag) => ({
                        value: tag.id,
                        label: tag.name,
                      }))
                    : []
                }
                value={selectedProduct.tags.map((collection) => ({
                  value: collection.id,
                  label: collection.name,
                }))}
                onChange={(value) =>
                  handleProductChange(
                    "tags",
                    value.map((item) => ({ id: item.value, name: item.label }))
                  )
                }
              />
            </div>
            <div className="mb-4">
              <FormTitle>Description</FormTitle>
              <Label>
                <Textarea
                  className="block p-2.5 mt-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-transparent bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  rows="2"
                  placeholder="Enter product short description here"
                  value={selectedProduct.description}
                  onChange={(e) =>
                    handleProductChange("description", e.target?.value || "")
                  }
                />
              </Label>
            </div>
            <div className="mb-4">
              <FormTitle>Stock Quantity</FormTitle>
              <Label>
                <Input
                  type="number"
                  className="mt-2"
                  placeholder="Enter product stock quantity"
                  value={selectedProduct.stockQty}
                  onChange={(e) => {
                    if (e.target.value >= 0) {
                      handleProductChange("stockQty", e.target.value);
                    }
                  }}
                />
              </Label>
            </div>
            <div className="block mt-2 mb-6 text-sm font-medium text-gray-900 dark:text-white">
              <FormTitle>Product Additional Information</FormTitle>
              <CKEditor
                className="h-32"
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
                data={selectedProduct.additionalInformation}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={loadingSave}
                className="gap-2 items-center"
              >
                {loadingSave ? <FaSpinner className="animate-spin" /> : null}
                Save
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="h-2/3 md:col-span-1">
          <CardBody>
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
                  {selectedProduct.images.map((imageUrl, index) => (
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
