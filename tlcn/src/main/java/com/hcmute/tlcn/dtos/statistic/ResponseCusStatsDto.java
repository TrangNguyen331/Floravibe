package com.hcmute.tlcn.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseCusStatsDto {
    private String customerId;
    private String customerAvatar;
    private String fullName;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private boolean isActive;
    private int cancelTimes;
}
