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
import { Link } from "react-router-dom";
import { Box, LinearProgress, Rating } from "@mui/material";
import { StarBorder } from "@mui/icons-material";

const TestStatstic = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalResults, setTotalResult] = useState(0);
  const [loadingGet, setLoadingGet] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState([]);

  const onPageChange = async (e, p) => {
    console.log("Trigger on page change");
    await fetchData(p);
    console.log("page", p);
  };

  const fetchData = async (page) => {
    try {
      setLoadingGet(true);
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
      setDataLoaded(true);
      setLoadingGet(false);
      console.log(response.data.content);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData(1);
  }, []);

  return (
    <div>
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
            <TableHeader className="text-center">
              <TableCell>Product Name</TableCell>
              <TableCell>Order Number For Product</TableCell>
              <TableCell>Number Of Bouquets Sold</TableCell>
              <TableCell>Rating Of Product</TableCell>
            </TableHeader>
            <TableBody className="text-center">
              {data.map((product, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Link to={`/app/product/${product.productId}`}>
                        <Avatar
                          className="hidden mr-4 md:block"
                          src={product.productImage}
                          alt="Product image"
                        />
                      </Link>
                      <div>
                        <Link to={`/app/product/${product.productId}`}>
                          <p className="font-semibold">{product.productName}</p>
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {product.orderCount}
                  </TableCell>
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
      )}
    </div>
  );
};

export default TestStatstic;
