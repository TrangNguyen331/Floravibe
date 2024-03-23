package com.hcmute.tlcn.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@Document
public class Voucher {
    @Id
    public String id;
    public String voucherName;
    public String description;
    public LocalDate effectiveDate;
    public LocalDate validUntil;
    public int quantity;
    public int usedVoucher;
    public boolean isActive=true;
}
