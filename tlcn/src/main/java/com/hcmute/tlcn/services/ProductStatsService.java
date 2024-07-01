package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.statistic.ResponseBestProductDto;
import com.hcmute.tlcn.dtos.statistic.ResponseProductStatsDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductStatsService {
    Page<ResponseProductStatsDto> getProductStats(String search, Pageable pageable);
    List<ResponseBestProductDto> getBestProducts();
}
