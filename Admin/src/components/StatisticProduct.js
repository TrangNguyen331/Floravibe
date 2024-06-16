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
import { Box, LinearProgress } from "@mui/material";

const StatisticProduct = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    products: [],
    statisticOrder: {},
    statisticProduct: {},
  });

  const [totalPages, setTotalPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingGet, setLoadingGet] = useState(false);

  const onPageChange = async (e, p) => {
    console.log("Trigger on page change");
    setPage(p);
  };

  const fetchCompletedOrdersStatistic = async () => {
    try {
      setLoadingGet(true);
      const response = await axiosInstance.get('/api/v1/orders/allOrders', {
        timeout: 10000, 
      });
      const completed = response.data.filter(order => order.status === 'COMPLETED');

      let productOrderCounts = {};
      let productQuantityCounts = {};
      completed.forEach(order => {
        order.details.forEach(detail => {
          if (!productOrderCounts[detail.productId]) {
            productOrderCounts[detail.productId] = 0;
          }
          if (!productQuantityCounts[detail.productId]) {
            productQuantityCounts[detail.productId] = 0;
          }
          productOrderCounts[detail.productId]++;
          productQuantityCounts[detail.productId] += detail.quantity;
        });
      });

      setData(prevData => ({
        ...prevData,
        statisticOrder: productOrderCounts,
        statisticProduct: productQuantityCounts,
      }));
      setLoadingGet(false);
    } catch (error) {
      console.error('Error fetching completed orders statistic: ', error.response ? error.response.data : error.message);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/products/allProducts');
      setData((prevData) => ({
        ...prevData,
        products: response.data,
      }));
      setTotalPage(Math.ceil(response.data.length / resultsPerPage));
      setTotalResult(response.data.length);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data: ", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCompletedOrdersStatistic();
  }, []);

  const paginatedProducts = data.products.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <div>
      {loadingGet ? (
        <Box sx={{ width: '100%', color: 'grey.500', backgroundColor: 'grey.500'}}>
          <LinearProgress sx={{
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#edebfe', // Customize bar color
            },
            backgroundColor: '#7e3af2', // Customize background color
          }}
          />
        </Box> 
      ) : ( 
        <TableContainer className="mb-8">
          <Table>
            <TableHeader className="text-center">
              <tr>
                <TableCell>Product Name</TableCell>
                <TableCell>Order Number For Product</TableCell>
                <TableCell>Number Of Bouquets Sold</TableCell>
              </tr>
            </TableHeader>
            <TableBody className="text-center">
              {paginatedProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="transition-colors duration-200"
                >
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Avatar
                        className="hidden mr-4 md:block"
                        src={
                          product && product.images && product.images.length > 0
                            ? product.images[0]
                            : ""
                        }
                        alt="Product image"
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {data.statisticOrder[product.id] || 0}
                  </TableCell>
                  <TableCell className="text-sm">
                    {data.statisticProduct[product.id] || 0}
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

export default StatisticProduct;
