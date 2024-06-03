package com.hcmute.tlcn.entities;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Document
public class Payments {
    public static final String CASH = "CASH";
    public static final String VNPAY = "VNPAY";
    public static final String MOMO = "MOMO";

    @Id
    private String id;
    private String orderId;
    private String paymentMethod;
    private BigDecimal totalAmount;
    private boolean isPaid = false;
    ThirdPartyPaymentDetail thirdPartyPaymentDetail;
    @CreatedDate
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

}
