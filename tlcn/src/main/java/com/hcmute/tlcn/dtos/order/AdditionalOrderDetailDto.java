package com.hcmute.tlcn.dtos.order;

import com.hcmute.tlcn.dtos.AddressDetailDto;
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
    private String ward;
    private String district;
    private String city;
    private String houseNumber;
    private String additionalInformation;
}
