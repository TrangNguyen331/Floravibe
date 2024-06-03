package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.dtos.*;
import com.hcmute.tlcn.entities.Account;
import com.hcmute.tlcn.entities.Product;
import com.hcmute.tlcn.services.AccountService;
import com.hcmute.tlcn.utils.JwtTokenProvider;
import com.hcmute.tlcn.utils.PageUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/${application.version}/auth")
public class AuthenticationController {
    //Login
    //Register
    //Logout (Fe Handler)
    //Forgot Password
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<LoginResultDto> login(@RequestBody LoginDto input){
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(input.getUsername(), input.getPassword()));
        if (authentication.isAuthenticated()) {
            String token= jwtTokenProvider.generateToken(input.getUsername());
            return ResponseEntity.ok(new LoginResultDto(token));
        } else {
            return (ResponseEntity<LoginResultDto>) ResponseEntity.badRequest();
        }
    }
    @PostMapping("/register")
    public ResponseEntity<MessageDto> register(@Valid @RequestBody RegisterDto input){
       String result = accountService.register(input);
       return ResponseEntity.ok(new MessageDto(HttpStatus.OK.value(), result));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageDto> forgotPassword(@Valid @RequestBody ForgotPasswordDto input){
        String result = accountService.forgotPassword(input.getEmail());
        return ResponseEntity.ok(new MessageDto(HttpStatus.OK.value(), result));
    }

    @PostMapping("/resetpassword/change-password/{userName}")
    public ResponseEntity<Account> updatePassword(@PathVariable("userName") String userName, @RequestBody UpdatePasswordDto dto){
        Account account = accountService.updatePassword(userName,dto);
        return ResponseEntity.ok(account);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/identity")
    public ResponseEntity<Account> getIdentity(Principal principal){
        Account account = accountService.getAccountByAccountName(principal.getName());
        return ResponseEntity.ok(account);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/paging")
    public ResponseEntity<Page<Account>> getProductPaging(@RequestParam(name = "search", required = false, defaultValue = "") String search,
                                                          @RequestParam(name = "page", required = false, defaultValue = "${application.default.paging.page}") int page,
                                                          @RequestParam(name = "size", required = false, defaultValue = "${application.default.paging.size}") int size,
                                                          @RequestParam(name = "sort", required = false, defaultValue = "DESC") String sort,
                                                          @RequestParam(name = "column", required = false, defaultValue = "isActive") String sortColumn){
        Pageable pageable = PageUtils.createPageable(page, size, sort, sortColumn);
        Page<Account> result = accountService.getPaging(search,pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/info")
    public ResponseEntity<Account> updateUserInfo(Principal principal, @RequestBody UpdateUserInfoDto dto){
        Account account = accountService.updateAccountInfo(principal.getName(),dto);
        return ResponseEntity.ok(account);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/change-password")
    public ResponseEntity<Account> updatePassword(Principal principal, @RequestBody UpdatePasswordDto dto){
        Account account = accountService.updatePassword(principal.getName(),dto);
        return ResponseEntity.ok(account);
    }

    @PutMapping("/active/{id}")
    public ResponseEntity<Account> activeDeActive(@PathVariable String id){
        Account account = accountService.activeDeActive(id);
        return ResponseEntity.ok(account);
    }

}
