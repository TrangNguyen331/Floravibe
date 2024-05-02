package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.RegisterDto;
import com.hcmute.tlcn.dtos.UpdatePasswordDto;
import com.hcmute.tlcn.dtos.UpdateUserInfoDto;
import com.hcmute.tlcn.entities.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccountService {
    String register(RegisterDto input);
    Page<Account> getPaging(String search, Pageable pageable);
    Account getAccountByAccountName(String userName);
    Account updateAccountInfo(String userName, UpdateUserInfoDto dto);
    Account updatePassword(String userName, UpdatePasswordDto dto);
    Account activeDeActive(String id);
    String forgotPassword(String email);
}
