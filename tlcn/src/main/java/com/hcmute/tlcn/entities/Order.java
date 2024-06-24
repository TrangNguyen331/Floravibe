package com.hcmute.tlcn.entities;

import com.hcmute.tlcn.dtos.order.AdditionalOrderDetailDto;
import com.hcmute.tlcn.dtos.voucher.VoucherDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Document
public class Order {
    @Id
    private String id;
    private List<OrderDetail> details;
    private AdditionalOrderDetailDto additionalOrder;
    private VoucherDto voucherDetail;
    private LocalDate deliveryDate;
    private String deliveryTime;
    private double unitTotal;
    private double total;
    private String status;
    private String methodPaid;
    private boolean isRated = false;
    private double firstDiscount;
    @CreatedDate
    private LocalDateTime createdDate;
    private LocalDateTime cancelDate;
    private LocalDateTime completedDate;
    CancelOrderDetail cancelDetail;
    private boolean guest;
}
