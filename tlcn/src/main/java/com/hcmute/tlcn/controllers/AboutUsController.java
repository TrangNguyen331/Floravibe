package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.dtos.DashBoardDto;
import com.hcmute.tlcn.dtos.aboutus.AboutUsDto;
import com.hcmute.tlcn.entities.AboutUs;
import com.hcmute.tlcn.entities.Order;
import com.hcmute.tlcn.repositories.AboutUsRepository;
import com.hcmute.tlcn.repositories.AccountRepository;
import com.hcmute.tlcn.repositories.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/${application.version}/about-us")
public class AboutUsController {
    private final AboutUsRepository aboutUsRepository;

    private final AccountRepository accountRepository;
    private final OrderRepository orderRepository;

    public AboutUsController(AboutUsRepository aboutUsRepository, AccountRepository accountRepository, OrderRepository orderRepository) {
        this.aboutUsRepository = aboutUsRepository;
        this.accountRepository = accountRepository;
        this.orderRepository = orderRepository;
    }
    @GetMapping
    public ResponseEntity<AboutUsDto> getAboutUs(){
        AboutUsDto result = new AboutUsDto();
        Optional<AboutUs> entity =aboutUsRepository.findAll().stream().findFirst();
        if(entity.isPresent())
        {
            result.setId(entity.get().getId());
            result.setDescription(entity.get().getDescription());
        }
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public ResponseEntity<DashBoardDto> getDashBoardInfo(){
        DashBoardDto result = new DashBoardDto();
        result.setTotalCustomer((int) accountRepository.count());
        List<Order> newOrders = orderRepository.findAllByStatus("IN_REQUEST");
        result.setTotalNewOrder(newOrders.size());
        result.setTotalIncome(newOrders.stream().mapToDouble(Order::getTotal).sum());
        return ResponseEntity.ok(result);
    }
}
