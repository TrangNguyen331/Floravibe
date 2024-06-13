package com.hcmute.tlcn.dtos.order;

import com.hcmute.tlcn.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDto {
    private String productId;
    private Product product;
    private double unitPrice;
    private int quantity;
    private double subtotal;
}
