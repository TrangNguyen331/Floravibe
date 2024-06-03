import React, { useState, useEffect, createContext, useContext } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink } from "react-router-dom";
import { EditIcon, HomeIcon, TrashIcon, DashboardIcon } from "../icons";
import {
  Card,
  CardBody,
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import Icon from "../components/Icon";
import EditForm from "../components/EditForm";
import { AddIcon } from "../icons";
import "../index.css";
import axiosInstance from "../axiosInstance";
import { fa, tr } from "faker/lib/locales";
import AddForm from "../components/AddForm";
const ProductsAll = () => {
  // Table and grid data handlling
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [collections, setCollections] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [collectionLoaded, setCollectionLoaded] = useState(false);
  // pagination setup
  const [resultsPerPage, setResultsPerPage] = useState(4);
  const [totalPage, setTotalPage] = useState(0);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  //const totalResults = response.length;

  // pagination change control

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState(null); // 'edit', 'delete'
  const [selectedProduct, setSelectedProduct] = useState({
    id: "",
    name: "",
    description: "",
    additionalInformation: "",
    price: 0,
    tags: [],
    images: [],
    collections: [],
    stockQty: 0,
  });

  // on page change, load new sliced data
  // here you would make another server request for new data
  const fetchData = async (page) => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/products/paging?page=" + (page - 1) + "&size=" + resultsPerPage
      );
      setData(response.data.content);
      setPage(page);
      setTotalPage(response.data.totalPages);
      setTotalResult(response.data.totalElements);
      setDataLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };
  const fetchCollections = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/collections/all");
      setCollections(response.data);
      setCollectionLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };
  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/tags/all");
      setAllTags(response.data);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };
  useEffect(() => {
    fetchData(1);
    fetchCollections();
    fetchTags();
  }, []);

  async function onPageChange(p) {
    console.log("Trigger on page change");
    await fetchData(p);
  }

  function formatNumberWithDecimal(number) {
    // Convert the number to a string
    const numString = String(number);

    // Split the string into groups of three digits
    const groups = numString.split(/(?=(?:\d{3})+(?!\d))/);

    // Join the groups with a decimal point
    const formattedNumber = groups.join(".");

    return formattedNumber;
  }
  async function openModal(mode, productId) {
    console.log("Product", productId);
    if (mode === "edit" || mode === "delete") {
      let product = await data.filter((product) => product.id === productId)[0];
      setSelectedProduct({
        id: product.id,
        name: product.name,
        description: product.description,
        additionalInformation: product.additionalInformation,
        price: product.price,
        tags: product.tags.map((tag) => ({
          value: tag,
          label: tag,
        })),
        images: product.images,
        collections: product.collections.map((collection) => ({
          value: collection,
          label: collection,
        })),
        stockQty: product.stockQty,
      });
    }
    setMode(mode);
    setIsModalOpen(true);
  }
  const closeModal = () => {
    setMode(null);
    setSelectedProduct({
      id: "",
      name: "",
      description: "",
      additionalInformation: "",
      price: 0,
      tags: [],
      images: [],
      collections: [],
      stockQty: 0,
    });
    setIsModalOpen(false);
  };
  const handleSave = async (mode) => {
    try {
      console.log("mode", mode);
      console.log("current model", selectedProduct);
      if (mode === "delete") {
        try {
          await axiosInstance.delete("/api/v1/products/" + selectedProduct.id);
        } catch (error) {
          console.log("Error", error);
        }
      }
      if (mode === "edit") {
        let body = {
          name: selectedProduct.name,
          description: selectedProduct.description,
          additionalInformation: selectedProduct.additionalInformation,
          price: selectedProduct.price,
          tags: selectedProduct.tags.map((item) => item.value),
          images: selectedProduct.images,
          collections: selectedProduct.collections.map((item) => item.value),
          stockQty: selectedProduct.stockQty,
        };
        console.log(body);
        try {
          await axiosInstance.put(
            "/api/v1/products/" + selectedProduct.id,
            body
          );
        } catch (error) {
          console.log("Error", error);
        }
      }

      setMode(null);
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Save error:", error);
    }
  };
  const handleProductChange = (property, value) => {
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [property]: value,
    }));
    console.log(value);
  };
  const truncateContent = (content) => {
    return content.length > 120 ? content.substr(0, 120) + "..." : content;
  };
  return (
    <div>
      <PageTitle>All Products</PageTitle>

      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={DashboardIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Products</p>
      </div>

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All Products
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Product modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="fullscreen-modal"
      >
        <ModalHeader className="flex items-center text-2xl mb-4">
          {mode === "edit" && "Edit Product"}
          {mode === "delete" && "Delete Product"}
        </ModalHeader>
        <ModalBody className="modal-body">
          {mode === "edit" ? (
            <EditForm
              data={selectedProduct}
              collectionData={collections}
              tagData={allTags}
              onSave={handleSave}
              onCancel={closeModal}
              onProductChange={handleProductChange}
            />
          ) : (
            <p>
              Make sure you want to delete product{" "}
              {selectedProduct && `"${selectedProduct.name}"`}
            </p>
          )}
        </ModalBody>
        <ModalFooter className="modal-footer">
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            {mode === "edit" ? (
              <Button block size="large" onClick={() => handleSave("edit")}>
                Save
              </Button>
            ) : (
              <Button block size="large" onClick={() => handleSave("delete")}>
                Delete
              </Button>
            )}
          </div>
        </ModalFooter>
      </Modal>

      {/* Product Views */}
      <>
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Collections</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Action</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {data.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Link to={`/app/product/${product.id}`}>
                        <Avatar
                          className="hidden mr-4 md:block"
                          src={
                            product &&
                            product.images &&
                            product.images.length > 0
                              ? product.images[0]
                              : ""
                          }
                          alt="Product image"
                        />
                      </Link>
                      <div>
                        <Link to={`/app/product/${product.id}`}>
                          <p className="font-semibold">{product.name}</p>
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-normal break-words">
                    {truncateContent(product.description)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatNumberWithDecimal(product.price)}₫
                  </TableCell>
                  <TableCell className="text-sm space-x-2">
                    {product &&
                    product.collections &&
                    product.collections.length > 0
                      ? product.collections.map((collection, index) => (
                          <Badge type="success" key={index}>
                            {collection}
                          </Badge>
                        ))
                      : ""}
                  </TableCell>
                  <TableCell className="text-sm">
                    {product && product.tags && product.tags.length > 0
                      ? product.tags.map((tag, index) => (
                          <div key={index} className="flex">
                            <span
                              className="px-2 inline-flex text-xs leading-5
                      font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 mb-2 mt-2"
                            >
                              {tag}
                            </span>
                          </div>
                        ))
                      : ""}
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <Button
                        icon={EditIcon}
                        className="mr-3"
                        layout="outline"
                        aria-label="Edit"
                        onClick={() => openModal("edit", product.id)}
                      />
                      <Button
                        icon={TrashIcon}
                        layout="outline"
                        aria-label="Delete"
                        onClick={() => openModal("delete", product.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            {dataLoaded && (
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                label="Table navigation"
                onChange={(page) => onPageChange(page)}
              />
            )}
          </TableFooter>
        </TableContainer>
      </>
    </div>
  );
};

export default ProductsAll;
