package com.hcmute.tlcn.dtos.payment;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PaymentDTO {
    private String orderId;
    private String paymentMethod;
    private BigDecimal totalAmount;
}
