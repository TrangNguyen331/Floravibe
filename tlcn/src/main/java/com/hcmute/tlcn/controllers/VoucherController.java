package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.dtos.voucher.VoucherDto;
import com.hcmute.tlcn.entities.Voucher;
import com.hcmute.tlcn.services.VoucherService;
import com.hcmute.tlcn.utils.PageUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/${application.version}/vouchers")
public class VoucherController {
    private final VoucherService service;

    public VoucherController(VoucherService service) {
        this.service = service;
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<Voucher>> getVoucherPaging(
            @RequestParam(name = "search", required = false, defaultValue = "") String search,
            @RequestParam(name = "page", required = false, defaultValue = "${application.default.paging.page}") int page,
            @RequestParam(name = "size", required = false, defaultValue = "${application.default.paging.size}") int size,
            @RequestParam(name = "sort", required = false, defaultValue = "DESC") String sort,
            @RequestParam(name = "column", required = false, defaultValue = "createdDate") String sortColumn){
        Pageable pageable = PageUtils.createPageable(page, size, sort, sortColumn);
        Page<Voucher> result = service.getPaging(search,pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Voucher> addNewVoucher(@RequestBody VoucherDto dto){
        Voucher result = service.addNew(dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Voucher> updateVoucher(@PathVariable String id, @RequestBody VoucherDto dto) {
        Voucher result = service.update(id, dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("active/{id}")
    public ResponseEntity<Voucher> deleteVoucher(@PathVariable String id) {
        Voucher result = service.delete(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<Voucher>> getAllVouchers() {
        List<Voucher> vouchers = service.getAllVouchers();
        return new ResponseEntity<>(vouchers, HttpStatus.OK);
    }
}
