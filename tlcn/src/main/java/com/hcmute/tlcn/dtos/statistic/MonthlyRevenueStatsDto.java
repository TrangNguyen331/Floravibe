package com.hcmute.tlcn.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyRevenueStatsDto {
    private int year;
    private int month;
    private double totalRevenue;
}
