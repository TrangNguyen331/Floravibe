package com.hcmute.tlcn.entities;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ThirdPartyPaymentDetail {
    private String namePlatform;
    private String payDate;
    // storage transaction detail response from third party payment  {vnp_TransactionNo; vnp_BankCode; vnp_BankTranNo; vnp_CardType; vnp_ResponseCode; vnp_TransactionStatus}
    // example: VNP14440171;NCB;VNP14440171;ATM;00;00
    private String transactionDetail;
    private ThirdPaymentStatusEnum status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
