package com.hcmute.tlcn.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserInfoDto {
    public String fullName;
    public String firstName;
    public String lastName;
    public String address;
    public String phone;
    public String avatar;
}
