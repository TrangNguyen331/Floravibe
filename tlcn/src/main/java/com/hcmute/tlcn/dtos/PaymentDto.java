package com.hcmute.tlcn.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDto implements Serializable {
    private String status;
    private String message;
    private String paymentUrl;
}
