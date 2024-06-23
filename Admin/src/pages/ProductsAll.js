import React, { useState, useEffect, createContext, useContext } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink } from "react-router-dom";
import {
  EditIcon,
  TrashIcon,
  DashboardIcon,
  UpIcon,
  DownIcon,
  SortDefaultIcon,
  RefreshIcon,
  SearchIcon,
} from "../icons";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Select,
} from "@windmill/react-ui";
import Icon from "../components/Icon";
import EditForm from "../components/EditForm";
import { AddIcon } from "../icons";
import "../index.css";
import axiosInstance from "../axiosInstance";
import { fa, tr } from "faker/lib/locales";
import RoundIcon from "../components/RoundIcon";
import Paginate from "../components/Pagination/Paginate";
import { useToasts } from "react-toast-notifications";
import { Box, LinearProgress } from "@mui/material";
// import { Grid, Typography, Pagination } from '@mui/material';

const ProductsAll = () => {
  // Table and grid data handlling
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [collections, setCollections] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [collectionLoaded, setCollectionLoaded] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [allProductsData, setAllProductsData] = useState([]);

  const [sortName, setSortName] = useState("default");
  const [sortPrice, setSortPrice] = useState("default");
  const [sortQty, setSortQty] = useState("default");

  const [searchType, setSearchType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // pagination setup
  const [resultsPerPage, setResultsPerPage] = useState(8);
  const [totalPages, setTotalPage] = useState(0);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingGet, setLoadingGet] = useState(false);

  const { addToast } = useToasts();

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

  const fetchData = async (page) => {
    try {
      setLoadingGet(true);
      const response = await axiosInstance.get(
        "/api/v1/products/paging?page=" + (page - 1) + "&size=" + resultsPerPage
      );
      const allProductsResponse = await axiosInstance.get(
        "/api/v1/products/allProducts"
      );

      const sortedProducts = allProductsResponse.data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setProductsData(sortedProducts);
      // // setTotalPage(Math.ceil(sortedProducts.length / resultsPerPage));

      // const sortedData = response.data.content.sort(
      //   (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      // );
      // setData(sortedData.slice((page - 1) * resultsPerPage, page * resultsPerPage));
      // setPage(page);
      // setTotalPage(response.data.totalPages);
      // setTotalResult(response.data.totalElements);
      // setDataLoaded(true);
      const totalPageFromAllProducts = Math.ceil(
        sortedProducts.length / resultsPerPage
      );

      const sortedData = response.data.content.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setData(
        sortedData.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      setPage(page);

      const totalPageFromResponse = response.data.totalPages;
      const finalTotalPages =
        totalPageFromAllProducts > totalPageFromResponse
          ? totalPageFromAllProducts
          : totalPageFromResponse;
      setTotalPage(finalTotalPages);

      setTotalResult(response.data.totalElements);
      setDataLoaded(true);
      setLoadingGet(false);
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
    setPage(1);
    fetchData(1);
    fetchCollections();
    fetchTags();
    //setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, []);

  useEffect(() => {
    setData(
      productsData.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  }, [productsData, page, resultsPerPage]);

  async function onPageChange(e, p) {
    setPage(p);
    setData(productsData.slice((p - 1) * resultsPerPage, p * resultsPerPage));
    setTotalPage(Math.ceil(productsData.length / resultsPerPage));
  }
  // async function onPageChange(p) {
  //   await fetchData(p);
  // }
  const handleSortName = () => {
    let newProduct, sortedProducts;
    switch (sortName) {
      case "default":
        newProduct = "asc";
        sortedProducts = [...productsData].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case "asc":
        newProduct = "desc";
        sortedProducts = [...productsData].sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;
      case "desc":
        newProduct = "default";
        sortedProducts = [...productsData].sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        break;
    }
    setSortName(newProduct);
    setProductsData(sortedProducts);
    setData(
      sortedProducts.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  };
  const handleSortPrice = () => {
    let newProduct, sortedProducts;
    switch (sortPrice) {
      case "default":
        newProduct = "asc";
        sortedProducts = [...productsData].sort((a, b) => a.price - b.price);
        break;
      case "asc":
        newProduct = "desc";
        sortedProducts = [...productsData].sort((a, b) => b.price - a.price);
        break;
      case "desc":
        newProduct = "default";
        sortedProducts = [...productsData].sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        break;
    }
    setSortPrice(newProduct);
    setProductsData(sortedProducts);
    setData(
      sortedProducts.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  };
  const handleSortQty = () => {
    let newProduct, sortedProducts;
    switch (sortQty) {
      case "default":
        newProduct = "asc";
        sortedProducts = [...productsData].sort(
          (a, b) => a.stockQty - b.stockQty
        );
        break;
      case "asc":
        newProduct = "desc";
        sortedProducts = [...productsData].sort(
          (a, b) => b.stockQty - a.stockQty
        );
        break;
      case "desc":
        newProduct = "default";
        sortedProducts = [...productsData].sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        break;
    }
    setSortQty(newProduct);
    setProductsData(sortedProducts);
    setData(
      sortedProducts.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  };

  const handleSearch = () => {
    try {
      let filterProducts;
      switch (searchType) {
        case "Name Of Product":
          filterProducts = productsData.filter((product) =>
            product.name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(
                searchValue
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              )
          );
          break;
        case "Price":
          filterProducts = productsData.filter(
            (product) => product.price >= minPrice && product.price <= maxPrice
          );
          break;
        case "Category":
          filterProducts = productsData.filter(
            (product) =>
              product.collections &&
              product.collections.some(
                (collection) =>
                  collection.name &&
                  collection.name
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .includes(
                      searchValue
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                    )
              )
          );
          break;
        case "Tag":
          filterProducts = productsData.filter(
            (product) =>
              product.tags &&
              product.tags.some(
                (tag) =>
                  tag.name &&
                  tag.name
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .includes(
                      searchValue
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                    )
              )
          );
          break;
        case "Quantity":
          switch (searchValue) {
            case "Out of stock":
              filterProducts = productsData.filter(
                (product) => product.stockQty === 0
              );
              break;
            case "From 10 to 50":
              filterProducts = productsData.filter(
                (product) => product.stockQty >= 10 && product.stockQty <= 50
              );
              break;
            case "From 51 to 100":
              filterProducts = productsData.filter(
                (product) => product.stockQty >= 51 && product.stockQty <= 100
              );
              break;
            case "More than 100":
              filterProducts = productsData.filter(
                (product) => product.stockQty > 100
              );
              break;
            default:
              filterProducts = [...productsData];
          }
          break;
        default:
          filterProducts = [...productsData];
      }
      setTotalResult(filterProducts.length);
      setData(
        filterProducts.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      setTotalPage(Math.ceil(filterProducts.length / resultsPerPage));
    } catch (error) {
      console.log("Error occurred while handling search", error.message);
      setTotalResult(productsData.length);
      setData(
        productsData.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      setTotalPage(Math.ceil(productsData.length / resultsPerPage));
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchType, searchValue, page]);

  const resetData = async () => {
    await fetchData();
    setPage(1);
  };

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
        tags: product.tags,
        images: product.images,
        collections: product.collections,
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
          addToast("Delete product successfully", {
            appearance: "success",
            autoDismiss: true,
          });
        } catch (error) {
          console.log("Error", error);
          addToast("Error occurred while trying to delete product", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }
      if (mode === "edit") {
        let body = {
          name: selectedProduct.name,
          description: selectedProduct.description,
          additionalInformation: selectedProduct.additionalInformation,
          price: selectedProduct.price,
          tags: selectedProduct.tags,
          images: selectedProduct.images,
          collections: selectedProduct.collections,
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
      <Card className="mt-5 mb-5 pt-3 pb-3 shadow-md flex justify-between items-center">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-md text-gray-600 dark:text-gray-400">
                All Products
              </p>
            </div>
          </div>
        </CardBody>
        <Label className="mx-0 ml-auto">
          <Select
            className="py-3 rounded-r-none bg-purple-200"
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchValue("");
              setPage(1);
            }}
          >
            <option hidden>Choose to search</option>
            <option>Name Of Product</option>
            {/* <option>Price</option> */}
            <option>Category</option>
            <option>Tag</option>
            <option>Quantity</option>
          </Select>
        </Label>

        {searchType === "Price" ? (
          <div className="flex space-x-2">
            <Label className="w-32">
              <input
                type="number"
                placeholder="Min price"
                className="form-input"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </Label>
            <span className="self-center">-</span>
            <Label className="w-32">
              <input
                type="number"
                placeholder="Max price"
                className="form-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Label>
          </div>
        ) : searchType === "Quantity" ? (
          <Label className="mx-0 w-70">
            <div className="relative text-gray-500 dark:focus-within:text-purple-400">
              <Select
                className="py-3 pl-5 pr-10 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-r-sm w-70"
                value={searchValue}
                onChange={(e) => {
                  setPage(1);
                  setSearchValue(e.target.value);
                }}
              >
                <option hidden>Select a Option</option>
                <option>Out of stock</option>
                <option>From 10 to 50</option>
                <option>From 51 to 100</option>
                <option>More than 100</option>
              </Select>
            </div>
          </Label>
        ) : (
          <Label className="mx-0 w-70">
            <div className="relative text-gray-500 dark:focus-within:text-purple-400">
              <div className="absolute inset-y-0 right-0 flex items-center mr-3">
                <SearchIcon
                  className="w-5 h-5 text-purple-500 transition-colors duration-200"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                className="py-3 pl-5 pr-10 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-r-full w-70"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => {
                  setPage(1);
                  setSearchValue(e.target.value);
                }}
              />
            </div>
          </Label>
        )}
        <RoundIcon
          icon={RefreshIcon}
          onClick={() => {
            setSearchType("Choose to search");
            setSearchValue("");
            setPage(1);
            setResultsPerPage(resultsPerPage);
            handleSearch();
          }}
          className="pr-3 mr-6 ml-3 hover:bg-gray-200 dark:hover:bg-gray-400 transition ease-in-out duration-200 cursor-pointer"
        />
      </Card>

      {/* Product modal  */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="fullscreen-modal"
        // className={mode === "edit" ? "fullscreen-modal" : ""}
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
              <Button block onClick={() => handleSave("edit")}>
                Save
              </Button>
            ) : (
              <Button block onClick={() => handleSave("delete")}>
                Delete
              </Button>
            )}
          </div>
        </ModalFooter>
      </Modal>

      {/* Product Views */}
      {loadingGet ? (
        <Box
          sx={{ width: "100%", color: "grey.500", backgroundColor: "grey.500" }}
        >
          <LinearProgress
            sx={{
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#edebfe", // Customize bar color
              },
              backgroundColor: "#7e3af2", // Customize background color
            }}
          />
        </Box>
      ) : (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>
                  <div className="flex items-center">
                    Name
                    <div className="cursor-pointer">
                      <Icon
                        className="w-3 h-3 ml-2 text-purple-600 hover:text-red-500"
                        aria-hidden="true"
                        onClick={handleSortName}
                        icon={
                          sortName === "asc"
                            ? UpIcon
                            : sortName === "desc"
                            ? DownIcon
                            : SortDefaultIcon
                        }
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    Price
                    <div className="cursor-pointer">
                      <Icon
                        className="w-3 h-3 ml-2 text-purple-600 hover:text-red-500"
                        aria-hidden="true"
                        onClick={handleSortPrice}
                        icon={
                          sortPrice === "asc"
                            ? UpIcon
                            : sortPrice === "desc"
                            ? DownIcon
                            : SortDefaultIcon
                        }
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    Quantity
                    <div className="cursor-pointer">
                      <Icon
                        className="w-3 h-3 ml-2 text-purple-600 hover:text-red-500"
                        aria-hidden="true"
                        onClick={handleSortQty}
                        icon={
                          sortQty === "asc"
                            ? UpIcon
                            : sortQty === "desc"
                            ? DownIcon
                            : SortDefaultIcon
                        }
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Action</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {data
                .filter((item) => item.isActive)
                .map((product) => (
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
                    <TableCell
                      className={`text-sm text-center ${
                        product.stockQty === 0 ? "text-red-500" : ""
                      }`}
                    >
                      {product.stockQty}
                    </TableCell>
                    <TableCell className="text-sm space-x-2">
                      {product &&
                      product.collections &&
                      product.collections.length > 0
                        ? product.collections.map((collection) => (
                            <Badge
                              className="bg-purple-100 text-purple-700"
                              type="success"
                              key={collection.id}
                            >
                              {collection.name}
                            </Badge>
                          ))
                        : null}
                    </TableCell>
                    <TableCell className="text-sm">
                      {product && product.tags && product.tags.length > 0
                        ? product.tags.map((tag) => (
                            <div key={tag.id} className="flex">
                              <span
                                className="px-2 inline-flex text-xs leading-5
                      font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 mb-2 mt-2"
                              >
                                {tag.name}
                              </span>
                            </div>
                          ))
                        : null}
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
              {searchValue && data.length === 0 && (
                <p className="text-center my-4 text-purple-500">
                  No result match
                </p>
              )}
            </TableBody>
          </Table>
          <TableFooter>
            {dataLoaded && (
              <Paginate
                totalPages={totalPages}
                totalResults={totalResults}
                page={page}
                onPageChange={onPageChange}
              />
            )}
          </TableFooter>
        </TableContainer>
      )}
    </div>
  );
};

export default ProductsAll;
