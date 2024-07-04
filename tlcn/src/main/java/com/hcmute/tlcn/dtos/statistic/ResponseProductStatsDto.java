package com.hcmute.tlcn.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseProductStatsDto {
    private String productId;
    public List<String> productImages=new ArrayList<>();
    private String productName;
    private int orderCount;
    private int totalQuantitySold;
    private double averageRating;
    private int reviewCount;
    private double totalRevenue;
}
