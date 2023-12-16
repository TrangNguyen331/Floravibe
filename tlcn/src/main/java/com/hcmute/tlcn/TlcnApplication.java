package com.hcmute.tlcn;

import com.hcmute.tlcn.entities.Account;
import com.hcmute.tlcn.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

@SpringBootApplication
@EnableMongoAuditing
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class TlcnApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(TlcnApplication.class, args);
    }


    @Autowired
    private AccountRepository repository;
    @Override
    public void run(String... args) throws Exception {
        Optional<Account> newAccount= repository.findByUsername("hanhnguyen237");
        if(newAccount.isEmpty()){
            BCryptPasswordEncoder bCryptPasswordEncoder=new BCryptPasswordEncoder();
            String hashPassword=bCryptPasswordEncoder.encode("123");
            Account account=new Account();
            account.setUsername("hanhnguyen237");
            account.setPassword(hashPassword);
            account.setEmail("hanhnguyen237@gmail.com");
            account.setFullName("Nguyen Kim Hanh");
            account.setGender(true);
            account.setRoles(new ArrayList<>(Arrays.asList("ROLE_USER", "ROLE_ADMIN")));
            repository.save(account);
        }
    }
}
