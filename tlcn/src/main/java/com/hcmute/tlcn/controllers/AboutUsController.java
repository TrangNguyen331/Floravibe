package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.dtos.DashBoardDto;
import com.hcmute.tlcn.dtos.aboutus.AboutUsDto;
import com.hcmute.tlcn.entities.*;
import com.hcmute.tlcn.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

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
        List<Order> shippingOrders = orderRepository.findAllByStatus("IN_PROCESSING");
        result.setTotalShippingOrder(shippingOrders.size());
        List<Order> cancelOrders = orderRepository.findAllByStatus("CANCEL");
        result.setTotalCancelOrder(cancelOrders.size());
        List<Order> completeOrders = orderRepository.findAllByStatus("COMPLETED");
        result.setTotalCompleteOrder(completeOrders.size());

        result.setTotalIncome(completeOrders.stream().mapToDouble(Order::getTotal).sum());
        return ResponseEntity.ok(result);
    }
}
