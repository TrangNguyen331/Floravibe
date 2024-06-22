import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
} from "@windmill/react-ui";
import axiosInstance from "../axiosInstance";

const TestStatstic = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/productStats/paging?page=" +
          (page - 1) +
          "&size=" +
          resultsPerPage
      );
      setPage(page);
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, []);

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
            {/* {data.products.map((product) => (
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
            ))} */}
          </TableBody>
        </Table>
        <TableFooter>
          {/* {dataLoaded && (
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              label="Table navigation"
              onChange={(page) => onPageChange(page)}
            />
          )} */}
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default TestStatstic;
