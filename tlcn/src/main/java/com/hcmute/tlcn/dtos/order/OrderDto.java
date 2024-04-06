package com.hcmute.tlcn.dtos.order;

import com.hcmute.tlcn.dtos.voucher.VoucherDto;
import com.hcmute.tlcn.entities.OrderDetail;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private List<OrderDetail> details;
    private AdditionalOrderDetailDto additionalOrder;
    private VoucherDto voucherDetail;
    private double total;
    private String status;
    private String methodPaid;
    private boolean isPaid =false;
}
