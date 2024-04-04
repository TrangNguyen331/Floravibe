package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.voucher.VoucherDto;
import com.hcmute.tlcn.entities.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VoucherService {
    Page<Voucher> getPaging(String search, Pageable pageable);
    Voucher addNew(VoucherDto dto);
    Voucher update(String id, VoucherDto dto);
    Voucher delete(String id);
    List<Voucher> getAllVouchers();
}
