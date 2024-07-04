package com.hcmute.tlcn.dtos.statistic;

import com.hcmute.tlcn.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseBestProductDto {
    private String productId;
    private Product product;
    private int totalQuantitySold;
}
