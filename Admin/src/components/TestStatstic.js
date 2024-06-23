import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  Avatar,
} from "@windmill/react-ui";
import axiosInstance from "../axiosInstance";
import Paginate from "./Pagination/Paginate";
import ProductAvgRating from "./ProductAvgRating";
import { Box, Rating } from "@mui/material";
import { StarBorder } from "@mui/icons-material";

const TestStatstic = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState([]);

  const onPageChange = async (e, p) => {
    console.log("Trigger on page change");
    await fetchData(p);
    console.log("page", p);
  };

  const fetchData = async (page) => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/productStats/paging?page=" +
          (page - 1) +
          "&size=" +
          resultsPerPage
      );
      setPage(page);
      setData(response.data.content);
      setTotalPage(response.data.totalPages);
      setTotalResult(response.data.totalElements);
      // setTotalPage(Math.ceil(sortedOrdersData.length / resultsPerPage)); // dòng này sử dụng cho @mui
      // setTotalResult(sortedOrdersData.length);
      setDataLoaded(true);
      console.log(response.data.content);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData(1);
  }, []);
  // const paginatedProducts = data.products.slice(
  //   (page - 1) * resultsPerPage,
  //   page * resultsPerPage
  // );

  return (
    <div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader className="text-center">
            <tr>
              <TableCell>Product Name</TableCell>
              <TableCell>Order Number For Product</TableCell>
              <TableCell>Number Of Bouquets Sold</TableCell>
              <TableCell>Rating Of Product</TableCell>
            </tr>
          </TableHeader>
          <TableBody className="text-center">
            {data.map((product, index) => (
              <TableRow key={index} className="transition-colors duration-200">
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-4 md:block"
                      src={product.productImage}
                      alt="Product image"
                    />
                    <div>
                      <p className="font-semibold">{product.productName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{product.orderCount}</TableCell>
                <TableCell className="text-sm">
                  {product.totalQuantitySold}
                </TableCell>
                <TableCell className="text-center text-sm align-middle">
                  <Box
                    display="flex"
                    alignItems="center"
                    className="justify-center items-center w-full"
                  >
                    <Rating
                      name="average-rating"
                      value={product.averageRating}
                      precision={0.1}
                      emptyIcon={<StarBorder />}
                      readOnly
                      className="mr-2"
                    />{" "}
                    {parseFloat(product.averageRating).toFixed(1)} (
                    {product.reviewCount} reviews)
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
    </div>
  );
};

export default TestStatstic;
