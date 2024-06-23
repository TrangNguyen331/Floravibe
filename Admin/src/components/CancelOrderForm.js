import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { ModalBody, Button } from "@windmill/react-ui";
import axiosInstance from "../axiosInstance";
import { reasonList } from "../helper/numberhelper";
import { FaSpinner } from "react-icons/fa";
const CancelOrderForm = ({
  isModalOpen,
  onClose,
  orderId,
  cancelEmail,
  data,
  fetchData,
}) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [reason, setReason] = useState("");

  const clickSubmit = async () => {
    setLoadingSubmit(true);
    try {
      let body = data.filter((order) => order.id === orderId)[0];
      body.status = "CANCEL";
      body.cancelDetail = {
        cancelEmail: cancelEmail,
        cancelReason: reason,
        cancelRole: "ADMIN",
      };
      await axiosInstance.put(`/api/v1/orders/${orderId}`, body);
      setLoadingSubmit(false);
      setReason("");
      onClose();
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Dialog
        open={isModalOpen}
        onClose={onClose}
        disableBackdropClick={true}
        PaperProps={{
          component: "form",
        }}
      >
        <Toolbar className="justify-between">
          <Typography
            sx={{ color: "#7e3af2", fontWeight: "bold", fontSize: 19 }}
          >
            Lý do hủy đơn hàng
          </Typography>
          <IconButton
            edge="end"
            style={{ color: "#7e3af2" }}
            onClick={onClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
        <DialogContent dividers>
          <ModalBody>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg block w-full h-10 p-3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="" disabled>
                Select reason for cancellation
              </option>
              {reasonList.map((reason) => (
                <option key={reason.key} value={reason.value}>
                  {reason.value}
                </option>
              ))}
            </select>
          </ModalBody>
        </DialogContent>
        <DialogActions className="mt-2 mb-2 mr-3">
          <div className="hidden sm:block">
            <Button layout="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              disabled={loadingSubmit}
              onClick={clickSubmit}
              className="gap-2 items-center"
            >
              {loadingSubmit ? <FaSpinner className="animate-spin" /> : null}
              Submit
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default CancelOrderForm;
