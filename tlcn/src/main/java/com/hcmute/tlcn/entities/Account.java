package com.hcmute.tlcn.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Document
public class Account {
    @Id
    public String id;
    public String username;
    public String password;
    public String email;
    public String fullName;
    public String firstName;
    public String lastName;
    public String address;
    public String phone;
    public boolean gender; // True is man, False is woman
    public boolean isActive= true;
    public String avatar;
    public List<String> roles;
}
