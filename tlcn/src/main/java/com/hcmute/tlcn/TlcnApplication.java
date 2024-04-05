package com.hcmute.tlcn;

import com.hcmute.tlcn.entities.Account;
import com.hcmute.tlcn.entities.Voucher;
import com.hcmute.tlcn.repositories.AccountRepository;
import com.hcmute.tlcn.repositories.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
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
    @Autowired
    private VoucherRepository voucherRepository;
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

        if (voucherRepository.count()==0) {
            // Tạo danh sách các bản ghi voucher


            // Tạo và thêm các bản ghi voucher vào danh sách
            Voucher voucher1 = new Voucher();
            voucher1.setVoucherName("Voucher A");
            voucher1.setDescription("abcd");
            voucher1.setEffectiveDate(LocalDate.of(2024, 3, 19));
            voucher1.setValidUntil(LocalDate.of(2024, 5, 31));
            voucher1.setQuantity(100);
            voucher1.setUsedVoucher(0);
            voucher1.setActive(true);


            Voucher voucher2 = new Voucher();
            voucher2.setVoucherName("Voucher B");
            voucher1.setDescription("abcd");
            voucher2.setEffectiveDate(LocalDate.of(2024, 3, 20));
            voucher2.setValidUntil(LocalDate.of(2024, 5, 30));
            voucher2.setQuantity(50);
            voucher2.setUsedVoucher(0);
            voucher2.setActive(true);


            voucherRepository.saveAll(Arrays.asList(voucher1, voucher2));
        }
    }


}
