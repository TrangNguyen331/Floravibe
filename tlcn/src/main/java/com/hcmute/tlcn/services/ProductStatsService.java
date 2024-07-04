package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.statistic.ResponseProductStatsDto;
import com.hcmute.tlcn.dtos.statistic.TopSellingProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductStatsService {
    Page<ResponseProductStatsDto> getProductStats(String search, Pageable pageable);
    List<TopSellingProductDto> getTopSellingProducts( int year);
}
