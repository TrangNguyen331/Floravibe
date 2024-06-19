package com.hcmute.tlcn.dtos.voucher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherDto {
    public String id;
    public String voucherName;
    public double voucherValue;
    public String description;
    public LocalDate effectiveDate;
    public LocalDate validUntil;
    public int quantity;
    public int usedVoucher;
    public boolean guest=false;
}
