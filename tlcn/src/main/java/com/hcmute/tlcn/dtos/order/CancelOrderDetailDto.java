package com.hcmute.tlcn.dtos.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CancelOrderDetailDto {
//    private String cancelEmail;
    private String cancelReason;
    private String cancelRole;
}
