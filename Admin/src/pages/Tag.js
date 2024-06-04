import React, { useState, useEffect } from "react";
import {
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import { AddIcon, EditIcon, DashboardIcon } from "../icons";
import axiosInstance from "../axiosInstance";
import { useToasts } from "react-toast-notifications";
import TagForm from "../components/TagForm";
import { FaSpinner } from "react-icons/fa";
import ".././assets/css/customLoading.css";
function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const Tag = () => {
  const [data, setData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { addToast } = useToasts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [mode, setMode] = useState("add"); // 'add', 'edit'
  const [tagData, setTagData] = useState({
    id: null,
    name: null,
  });

  const closeModal = () => {
    setMode(null);
    setIsModalOpen(false);
  };

  const openModal = async (mode, tagId) => {
    if (mode === "edit") {
      let result = await data.find((item) => item.id === tagId);
      setTagData(result);
    } else {
      setTagData({
        id: null,
        name: null,
      });
    }
    setMode(mode);
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/tags/all");
      setData(response.data);
      setDataLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (mode) => {
    if (!tagData.name) {
      addToast("Please fill in all the required fields", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    setLoadingSave(true);
    try {
      let body = {
        name: tagData.name,
      };
      if (mode === "add") {
        await axiosInstance.post("/api/v1/tags", body);
        closeModal();
        addToast("Added new tag successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } else if (mode === "edit") {
        await axiosInstance.put(`/api/v1/tags/${tagData.id}`, body);
        setData((prevData) =>
          prevData.map((item) =>
            item.id === tagData.id ? { ...item, ...tagData } : item
          )
        );
        closeModal();
        addToast("Save change successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      }
      setTagData({
        id: null,
        name: null,
      });
      fetchData();
      setLoadingSave(false);
    } catch (error) {
      addToast("An error occurred while saving. Please try again.", {
        appearance: "error",
        autoDismiss: true,
      });
      console.error("Error saving collection:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setTagData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <div>
      <PageTitle>Product Tags</PageTitle>
      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={DashboardIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Tags</p>
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
            Add tag
          </Button>
        </div>
      </div>

      {/* Modal */}
      <div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalHeader className="flex items-center text-2xl">
            {mode === "add" ? "Add New Tag" : "Edit Tag"}
          </ModalHeader>
          <ModalBody>
            <TagForm data={tagData} handleInputChange={handleInputChange} />
          </ModalBody>
          <ModalFooter>
            <div className="hidden sm:block">
              <Button layout="outline" onClick={closeModal}>
                Cancel
              </Button>
            </div>
            <div className="hidden sm:block">
              <Button
                size="large"
                onClick={() => handleSave(mode)}
                disabled={loadingSave}
                className="gap-2 items-center"
              >
                {loadingSave ? <FaSpinner className="animate-spin" /> : null}
                Save
              </Button>
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
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataLoaded &&
              data.map((tag, i) => (
                <TableRow key={i}>
                  <TableCell className="text-base">{tag.name}</TableCell>
                  <TableCell>
                    <Button
                      icon={EditIcon}
                      className="mr-3"
                      layout="outline"
                      aria-label="Edit"
                      onClick={() => openModal("edit", tag.id)}
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

export default Tag;
