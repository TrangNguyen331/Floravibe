package com.hcmute.tlcn.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressDetailDto {
    public String ward;
    public String district;
    public String city;
    public String houseNumber;

}
