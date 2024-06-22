package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.dtos.product.ResponseProductStatsDto;
import com.hcmute.tlcn.services.ProductService;
import com.hcmute.tlcn.services.ProductStatsService;
import com.hcmute.tlcn.utils.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/${application.version}/productStats")
@RequiredArgsConstructor
public class ProductStatsController {
    private final ProductStatsService service;
    @GetMapping("/paging")
    public ResponseEntity<Page<ResponseProductStatsDto>> getProductStatsPaging(
            @RequestParam(name = "search", required = false, defaultValue = "") String search,
            @RequestParam(name = "page", required = false, defaultValue = "${application.default.paging.page}") int page,
            @RequestParam(name = "size", required = false, defaultValue = "${application.default.paging.size}") int size,
            @RequestParam(name = "sort", required = false, defaultValue = "DESC") String sort,
            @RequestParam(name = "column", required = false, defaultValue = "productName") String sortColumn) {

        Pageable pageable = PageUtils.createPageable(page, size, sort, sortColumn);
        Page<ResponseProductStatsDto> result = service.getProductStats(search, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
