import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  Pagination,
  Avatar,
} from "@windmill/react-ui";
import axiosInstance from "../axiosInstance";

const StatisticProduct = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    products: [],
    statisticOrder: {},
    statisticProduct: {},
  });

  const [completedOrders, setCompletedOrders] = useState([]);
  const [quantityCompletedOrders, setQuantityCompletedOrders] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  async function onPageChange(p) {
    console.log("Trigger on page change");
    await fetchData(p);
  }

  const fetchCompletedOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/orders");
      const completed = response.data
        .filter((order) => order.status === "COMPLETED")
        .map((order) => order.details.map((detail) => detail.productId)) // lấy productId từ mỗi chi tiết đơn hàng
        .flat();

      setCompletedOrders(completed);
    } catch (error) {
      console.error("Error fetching completed orders: ", error);
    }
  };
  const fetchQuantityCompletedOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/orders");
      const completed = response.data.filter(
        (order) => order.status === "COMPLETED"
      );
      var productCounts = {};
      completed.forEach((order) => {
        order.details.forEach((detail) => {
          // Nếu chưa có productId này trong productCounts, khởi tạo bằng 0
          if (!productCounts[detail.productId]) {
            productCounts[detail.productId] = 0;
          }
          // Cộng số lượng sản phẩm này vào tổng
          productCounts[detail.productId] += detail.quantity;
        });
      });
      //   console.log(productCounts);
      setQuantityCompletedOrders(productCounts);
    } catch (error) {
      console.error("Error fetching completed orders: ", error);
    }
  };

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

  useEffect(() => {
    fetchData(1);
    fetchCompletedOrders();
    fetchQuantityCompletedOrders();
  }, []);

  useEffect(() => {
    if (completedOrders.length > 0) {
      let productStatistics = {};
      completedOrders.forEach((productId) => {
        if (!productStatistics[productId]) {
          productStatistics[productId] = 0;
        }
        productStatistics[productId]++;
      });
      setData((prevData) => ({
        ...prevData,
        statisticOrder: productStatistics,
      }));
    }
  }, [completedOrders]);

  useEffect(() => {
    if (Object.keys(quantityCompletedOrders).length > 0) {
      setData((prevData) => ({
        ...prevData,
        statisticProduct: quantityCompletedOrders,
      }));
    }
  }, [quantityCompletedOrders]);

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
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              label="Table navigation"
              onChange={(page) => onPageChange(page)}
            />
          )}
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default StatisticProduct;
