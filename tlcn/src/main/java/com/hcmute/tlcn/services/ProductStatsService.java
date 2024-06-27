package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.statistic.ResponseProductStatsDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductStatsService {
    Page<ResponseProductStatsDto> getProductStats(String search, Pageable pageable);
}
