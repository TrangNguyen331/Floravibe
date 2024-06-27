package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.RegisterDto;
import com.hcmute.tlcn.dtos.UpdatePasswordDto;
import com.hcmute.tlcn.dtos.UpdateUserInfoDto;
import com.hcmute.tlcn.entities.Account;
import com.hcmute.tlcn.exceptions.BadRequestException;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.AccountRepository;
import com.hcmute.tlcn.services.AccountService;
import com.hcmute.tlcn.services.EmailService;
import com.hcmute.tlcn.utils.Roles;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {

    ModelMapper modelMapper = new ModelMapper();
    private final AccountRepository accountRepository;
    private final EmailService emailService;

    public AccountServiceImpl(AccountRepository accountRepository, EmailService emailService) {
        this.accountRepository = accountRepository;
        this.emailService = emailService;
    }

    @Override
    public String register(RegisterDto input) {
        Optional<Account> check = accountRepository.findByUsername(input.getUsername());
        if(check.isPresent()){
            throw new BadRequestException("Username was register, please using another username !!!");
        }
        Optional<Account> checkEmail = accountRepository.findByEmail(input.getEmail());
        if(checkEmail.isPresent()){
            throw new BadRequestException("Email was register, please using another Email !!!");
        }
        Account account=new Account();
        account.setFirstName(input.getFirstName());
        account.setLastName(input.getLastName());
        account.setUsername(input.getUsername());
        account.setEmail(input.getEmail());
        BCryptPasswordEncoder bCryptPasswordEncoder=new BCryptPasswordEncoder();
        String hashPassword=bCryptPasswordEncoder.encode(input.getPassword());
        account.setPassword(hashPassword);

        System.out.println("isAdmin value before setting roles: " + input.isAdmin());

        List<String> roles = new ArrayList<>(List.of(Roles.ROLE_USER.name()));
//        List<String> roles = new ArrayList<>();
//        roles.add(Roles.ROLE_USER.name());
        if(input.isAdmin()){
            roles.add(Roles.ROLE_ADMIN.name());
        }
        account.setRoles(roles);
        accountRepository.save(account);


        return "Success";
    }

    @Override
    public Page<Account> getPaging(String search, Pageable pageable) {
        return accountRepository.findPaging(search,pageable);
    }

    @Override
    public Account getAccountByAccountName(String userName) {
        return accountRepository.findByUsername(userName).orElse(new Account());
    }

    @Override
    public Account updateAccountInfo(String userName, UpdateUserInfoDto dto) {
        Account account = accountRepository.findByUsername(userName)
                .orElseThrow(() -> new NotFoundException("Account not found!"));
        modelMapper.map(dto,account);
        accountRepository.save(account);
        return account;
    }

    @Override
    public Account updatePassword(String userName, UpdatePasswordDto dto) {
        Account account = accountRepository.findByUsername(userName)
                .orElseThrow(() -> new NotFoundException("Account not found!"));
        if(!dto.getPassword().equals(dto.getConfirmPassword())){
            throw new BadRequestException("New password and confirm password much be same");
        }
        BCryptPasswordEncoder bCryptPasswordEncoder=new BCryptPasswordEncoder();
        String hashPassword=bCryptPasswordEncoder.encode(dto.getPassword());
        account.setPassword(hashPassword);
        accountRepository.save(account);
        return account;
    }

    @Override
    public Account activeDeActive(String id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Account not found!"));
        account.setActive(!account.isActive);
        accountRepository.save(account);
        return account;
    }

    @Override
    public String forgotPassword(String email) {
        Optional<Account> accountOptional = accountRepository.findByEmail(email);
        if (accountOptional.isEmpty()) {
            throw new NotFoundException("Account not found!");
        }
        try {
            emailService.sendMail(accountOptional.get());
        }
        catch (Exception e){
            return "Fail";
        }
        return "Success";
    }
    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
}
