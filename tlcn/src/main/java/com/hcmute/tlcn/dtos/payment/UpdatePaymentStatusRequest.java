package com.hcmute.tlcn.dtos.payment;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdatePaymentStatusRequest {
    @NotBlank
    private String status;
    @NotBlank
    private String transactionDetail;
    @NotBlank
    private String payDate;
}
