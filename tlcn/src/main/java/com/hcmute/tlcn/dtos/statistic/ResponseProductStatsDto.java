package com.hcmute.tlcn.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseProductStatsDto {
    private String productId;
    private String productImage;
    private String productName;
    private int orderCount;
    private int totalQuantitySold;
    private double averageRating;
    private int reviewCount;
}
