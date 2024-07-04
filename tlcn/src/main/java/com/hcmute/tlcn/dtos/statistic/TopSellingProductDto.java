package com.hcmute.tlcn.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopSellingProductDto {
    private String productId;
    private String productName;
    private int quantitySold;
    private int month;
    private int year;
}
