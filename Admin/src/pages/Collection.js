import React, { useState, useEffect } from "react";
import {
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import { HomeIcon, AddIcon, EditIcon, DashboardIcon } from "../icons";
import axiosInstance from "../axiosInstance";
import { useToasts } from "react-toast-notifications";
function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}
const Collection = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { addToast } = useToasts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add"); // 'add', 'edit'
  const closeModal = () => {
    setMode(null);
    setIsModalOpen(false);
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/collections/all");
      setData(response.data);
      setDataLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <PageTitle>Product Collections</PageTitle>
      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={DashboardIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Collections</p>
      </div>

      {/* Add */}
      <div className="flex items-center justify-end mt-5 mb-5">
        <div className="flex">
          <Button size="large" iconLeft={AddIcon} className="mx-3">
            Add collection
          </Button>
        </div>
      </div>

      {/* Modal */}
      <div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalHeader className="flex items-center text-2xl">
            {mode === "add" ? "Add New Voucher" : "Edit Voucher"}
          </ModalHeader>
          <ModalBody></ModalBody>
          <ModalFooter>
            <div className="hidden sm:block">
              <Button layout="outline" onClick={closeModal}>
                Cancel
              </Button>
            </div>
            <div className="hidden sm:block">
              {/* {mode === "edit" ? (
                <Button block size="large" onClick={() => handleSave("edit")}>
                  Save
                </Button>
              ) : (
                <Button block size="large" onClick={() => handleSave("add")}>
                  Add
                </Button>
              )} */}
            </div>
          </ModalFooter>
        </Modal>
      </div>

      {/* Table */}
      <TableContainer className="mb-8 mt-5">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataLoaded &&
              data.map((collection, i) => (
                <TableRow key={i}>
                  <TableCell className="text-base">{collection.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Collection;
