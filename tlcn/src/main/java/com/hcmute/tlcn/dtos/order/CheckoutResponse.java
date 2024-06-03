package com.hcmute.tlcn.dtos.order;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CheckoutResponse {
    private String id;
    private double total;
    private String status;
    private LocalDateTime createdDate;
    private String paymentLink;
}
