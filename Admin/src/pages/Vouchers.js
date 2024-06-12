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
import VoucherForm from "../components/VoucherForm";
import { useToasts } from "react-toast-notifications";
function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}
const Vouchers = () => {
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
  const openModal = async (mode, voucherId) => {
    console.log(voucherId);
    if (mode === "edit") {
      let voucher = await data.find((product) => product.id === voucherId);
      setVoucherInfo(voucher);
    } else {
      setVoucherInfo({
        id: null,
        voucherName: null,
        description: null,
        voucherValue: null,
        effectiveDate: null,
        validUntil: null,
        quantity: null,
        usedVoucher: null,
      });
    }
    setMode(mode);
    setIsModalOpen(true);
  };

  const [voucherInfo, setVoucherInfo] = useState({
    id: null,
    voucherName: null,
    description: null,
    voucherValue: null,
    effectiveDate: null,
    validUntil: null,
    quantity: null,
    usedVoucher: null,
  });
  const fetchData = async (page) => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/vouchers/paging?page=" + (page - 1) + "&size=" + resultsPerPage
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
  async function onPageChange(p) {
    await fetchData(p);
  }
  const handleCheckboxChange = async (voucherId) => {
    console.log("Handle on change", voucherId);
    try {
      await axiosInstance.put(`/api/v1/vouchers/active/${voucherId}`);
      await fetchData(1);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSave = async (mode) => {
    if (
      !voucherInfo.voucherName ||
      !voucherInfo.description ||
      !voucherInfo.voucherValue ||
      !voucherInfo.effectiveDate ||
      !voucherInfo.validUntil ||
      !voucherInfo.quantity
    ) {
      addToast("Please fill in all the required fields", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    try {
      let body = {
        voucherName: voucherInfo.voucherName,
        description: voucherInfo.description,
        voucherValue: voucherInfo.voucherValue,
        effectiveDate: voucherInfo.effectiveDate,
        validUntil: voucherInfo.validUntil,
        quantity: voucherInfo.quantity,
        usedVoucher: voucherInfo.usedVoucher,
      };

      if (mode === "add") {
        await axiosInstance.post("/api/v1/vouchers", body);
      } else if (mode === "edit") {
        await axiosInstance.put("/api/v1/vouchers/" + voucherInfo.id, body);

        setData((prevData) =>
          prevData.map((voucher) =>
            voucher.id === voucherInfo.id
              ? { ...voucher, ...voucherInfo }
              : voucher
          )
        );
      }
      closeModal();
      setVoucherInfo({
        id: null,
        voucherName: null,
        voucherValue: null,
        description: null,
        effectiveDate: null,
        validUntil: null,
        quantity: null,
      });
      fetchData(1);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleInputChange = (key, value) => {
    setVoucherInfo((prevVoucher) => ({
      ...prevVoucher,
      [key]: value,
    }));
  };
  useEffect(() => {
    fetchData(1);
  }, []);
  return (
    <div>
      <PageTitle>Vouchers</PageTitle>
      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={DashboardIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Vouchers</p>
      </div>

      {/* Add */}
      <div className="flex items-center justify-end mt-5 mb-5">
        <div className="flex">
          <Button
            size="large"
            iconLeft={AddIcon}
            className="mx-3"
            onClick={() => openModal("add", null)}
          >
            Create voucher
          </Button>
        </div>
      </div>

      {/* Modal */}
      <div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalHeader className="flex items-center text-2xl">
            {mode === "add" ? "Add New Voucher" : "Edit Voucher"}
          </ModalHeader>
          <ModalBody>
            {mode === "add" ? (
              <VoucherForm
                data={voucherInfo}
                handleInputChange={handleInputChange}
              />
            ) : (
              <VoucherForm
                data={voucherInfo}
                handleInputChange={handleInputChange}
              />
            )}
          </ModalBody>
          <ModalFooter>
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
                <Button block onClick={() => handleSave("add")}>
                  Add
                </Button>
              )}
            </div>
          </ModalFooter>
        </Modal>
      </div>

      {/* Table */}
      <TableContainer className="mb-8 mt-5">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Voucher Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Voucher Value</TableCell>
              <TableCell>Effective Date</TableCell>
              <TableCell>Valid Til</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Used</TableCell>
              <TableCell>Status</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((voucher, i) => (
              <TableRow key={i}>
                <TableCell className="text-base">
                  {voucher.voucherName}
                </TableCell>
                <TableCell className="text-base">
                  {voucher.description}
                </TableCell>
                <TableCell className="text-base">
                  {voucher.voucherValue}
                </TableCell>
                <TableCell className={new Date(voucher.effectiveDate) < new Date() ? "text-base text-green-400" : "text-base"}>
                  {new Date(voucher.effectiveDate).toLocaleDateString()}
                </TableCell>
                <TableCell className={new Date(voucher.validUntil) < new Date() ? "text-base text-red-600" : "text-base"}>
                  {new Date(voucher.validUntil).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-base">{voucher.quantity}</TableCell>
                <TableCell className="text-base">
                  {voucher.usedVoucher}
                </TableCell>
                <TableCell className="text-base">
                  <Input
                    type="checkbox"
                    checked={voucher.isActive}
                    onChange={() => handleCheckboxChange(voucher.id)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    icon={EditIcon}
                    className="mr-3"
                    layout="outline"
                    aria-label="Edit"
                    onClick={() => openModal("edit", voucher.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Vouchers;
