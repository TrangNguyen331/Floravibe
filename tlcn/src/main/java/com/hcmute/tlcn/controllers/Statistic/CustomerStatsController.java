package com.hcmute.tlcn.controllers.Statistic;

import com.hcmute.tlcn.dtos.statistic.ResponseCusStatsDto;
import com.hcmute.tlcn.entities.Product;
import com.hcmute.tlcn.services.CustomerStatsService;
import com.hcmute.tlcn.utils.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/${application.version}/customerStats")
@RequiredArgsConstructor
public class CustomerStatsController {
    private final CustomerStatsService service;

//    @GetMapping("/paging")
//    public ResponseEntity<Page<ResponseCusStatsDto>>getCusStatsPaging(
//            @RequestParam(name = "email") String email,
//            @RequestParam(name = "search", required = false, defaultValue = "") String search,
//            @RequestParam(name = "page", required = false, defaultValue = "${application.default.paging.page}") int page,
//            @RequestParam(name = "size", required = false, defaultValue = "${application.default.paging.size}") int size,
//            @RequestParam(name = "sort", required = false, defaultValue = "DESC") String sort,
//            @RequestParam(name = "column", required = false, defaultValue = "productName") String sortColumn){
//
//        Pageable pageable = PageUtils.createPageable(page, size, sort, sortColumn);
//        Page<ResponseCusStatsDto> result = service.getCusStats(email, search, pageable);
//        return new ResponseEntity<>(result, HttpStatus.OK);
//    }

    @GetMapping("/all")
    public ResponseEntity<List<ResponseCusStatsDto>> getAllCusStats(){

        List<ResponseCusStatsDto> result = service.getCusStats();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
