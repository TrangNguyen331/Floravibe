package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.statistic.ResponseCusStatsDto;

import java.util.List;

public interface CustomerStatsService {
//    Page<ResponseCusStatsDto> getCusStats(String email, String search, Pageable pageable);
    List<ResponseCusStatsDto> getCusStats();
}
