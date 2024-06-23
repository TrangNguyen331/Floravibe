package com.hcmute.tlcn.entities;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CancelOrderDetail {
    private String cancelEmail;
    private String cancelReason;
    private String cancelRole;
    private LocalDateTime cancelDate;
}
