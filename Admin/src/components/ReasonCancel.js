import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { ModalBody, Button } from "@windmill/react-ui";
import axiosInstance from "../axiosInstance";
import { reasonList } from "../helper/numberhelper";
import { FaSpinner } from "react-icons/fa";
const ReasonCancel = ({
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
      data.status = "CANCEL";
      data.cancelDetail = {
        cancelEmail: cancelEmail,
        cancelReason: reason,
        cancelRole: "ADMIN",
      };
      await axiosInstance.put(`/api/v1/orders/${orderId}`, data);
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
        maxWidth="md"
        disableBackdropClick={true}
        PaperProps={{
          component: "form",
        }}
      >
        <Toolbar className="justify-between">
          <Typography
            sx={{ color: "#7e3af2", fontWeight: "bold", fontSize: 19 }}
          >
            Reason For Order Cancellation
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
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Select reason for cancellation
              </FormLabel>
              <RadioGroup
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {reasonList.map((reason) => (
                  <FormControlLabel
                    key={reason.key}
                    value={reason.value}
                    control={
                      <Radio
                        style={{
                          color: "#7e3af2",
                        }}
                      />
                    }
                    label={reason.value}
                  />
                ))}
              </RadioGroup>
            </FormControl>
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
export default ReasonCancel;
