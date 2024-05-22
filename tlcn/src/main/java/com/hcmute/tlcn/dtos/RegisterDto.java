package com.hcmute.tlcn.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    @Email(message = "Email is not valid")
    @NotBlank(message = "Email field is required")
    private String email;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private boolean admin=false;
}
