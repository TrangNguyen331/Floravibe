package com.hcmute.tlcn.dtos.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdditionalOrderDetailDto {
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private String fullName;
    private String address;
    private String additionalInformation;
}
