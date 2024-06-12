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

const StatisticProduct = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    products: [],
    statisticOrder: {},
    statisticProduct: {},
  });

  const [completedOrders, setCompletedOrders] = useState([]);
  const [quantityCompletedOrders, setQuantityCompletedOrders] = useState([]);
  const [totalPages, setTotalPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  async function onPageChange(e, p) {
    console.log("Trigger on page change");
    await fetchData(p);
  }

    const fetchCompletedOrdersStatistic = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/orders/paging?page=0&size=999');
            const completed = response.data.content
                             .filter(order => order.status === 'COMPLETED');

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
    } catch (error) {
        console.error('Error fetching completed orders statistic: ', error);
    }
    };

    useEffect(() => {
        fetchData(1);
        fetchCompletedOrdersStatistic();
    }, []);

    const fetchData = async (page) => {
        try {
        const response = await axiosInstance.get(
            `/api/v1/products/paging?page=${page - 1}&size=${resultsPerPage}`
        );
        setData((prevData) => ({
            ...prevData,
            products: response.data.content,
        }));
        setPage(page);
        setTotalPage(response.data.totalPages);
        setTotalResult(response.data.totalElements);
        setDataLoaded(true);
        } catch (error) {
        console.error("Error fetching data: ", error);
        }
    };

  return (
    <div>
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
            {data.products.map((product) => (
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
            
            // <Pagination
            //   totalResults={totalResults}
            //   resultsPerPage={resultsPerPage}
            //   label="Table navigation"
            //   onChange={(page) => onPageChange(page)}
            // />
          )}
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default StatisticProduct;
