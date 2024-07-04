package com.hcmute.tlcn.controllers.Statistic;

import com.hcmute.tlcn.dtos.statistic.MonthlyRevenueStatsDto;
import com.hcmute.tlcn.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/statistics")
public class OrderStatisticController {
    @Autowired
    private OrderService statisticService;

    @GetMapping("/monthly-revenue/{year}")
    public List<MonthlyRevenueStatsDto> getMonthlyRevenue(@PathVariable int year) {
        return statisticService.getMonthlyRevenueStats(year);
    }
}
