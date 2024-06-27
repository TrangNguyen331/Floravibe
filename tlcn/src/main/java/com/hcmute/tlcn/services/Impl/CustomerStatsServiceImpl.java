package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.statistic.ResponseCusStatsDto;
import com.hcmute.tlcn.entities.Account;
import com.hcmute.tlcn.entities.Order;
import com.hcmute.tlcn.repositories.OrderRepository;
import com.hcmute.tlcn.services.AccountService;
import com.hcmute.tlcn.services.CustomerStatsService;
import com.hcmute.tlcn.utils.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@RequiredArgsConstructor
@Service
public class CustomerStatsServiceImpl implements CustomerStatsService {
    private final OrderRepository orderRepository;
    private final AccountService accountService;

    @Override
    public List<ResponseCusStatsDto> getCusStats() {
        List<Order> cancelOrder = orderRepository.findAllByStatus("CANCEL");
        List<Account> allAccount = accountService.getAllAccounts();
        List<ResponseCusStatsDto> statsList = new ArrayList<>();
        for (Account account : allAccount) {
            if (account.getRoles().contains("ROLE_ADMIN")) {
                continue;
            }
            // Tính số lượng orders bị hủy bởi account này
            long cancelCount = cancelOrder.stream()
                    .filter(order -> order.getAdditionalOrder().getEmail().equals(account.getEmail()))
                    .filter(order -> !order.getCancelDetail().getCancelRole().contains("ADMIN"))
                    .count();

            // Tạo một dto chứa thông tin thống kê của user này
            ResponseCusStatsDto dto = new ResponseCusStatsDto();
            dto.setCustomerId(account.getId());
            dto.setCustomerAvatar(account.getAvatar());
            dto.setUsername(account.getUsername());
            dto.setFullName(account.getFullName());
            dto.setFirstName(account.getFirstName());
            dto.setLastName(account.getLastName());
            dto.setActive(account.isActive());
            dto.setEmail(account.getEmail());
            dto.setCancelTimes((int)cancelCount);

            statsList.add(dto);
        }

        return statsList;
    }
//    @Override
//    public Page<ResponseCusStatsDto> getCusStats(String email, String search, Pageable pageable) {
//        List<Order> cancelOrder = orderRepository.findAllByStatus("CANCEL");
//        List<Account> allAccount = accountService.getAllAccounts(email);
//        List<ResponseCusStatsDto> statsList = new ArrayList<>();
//        for (Account account : allAccount) {
//            if (account.getRoles().contains("ROLE_ADMIN")) {
//                continue;
//            }
//            // Tính số lượng orders bị hủy bởi account này
//            long cancelCount = cancelOrder.stream()
//                    .filter(order -> order.getAdditionalOrder().getEmail().equals(account.getEmail()))
//                    .count();
//
//            // Tạo một dto chứa thông tin thống kê của user này
//            ResponseCusStatsDto dto = new ResponseCusStatsDto();
//            dto.setCustomerId(account.getId());
//            dto.setCustomerAvatar(account.getAvatar());
//            dto.setUsername(account.getUsername());
//            dto.setEmail(account.getEmail());
//            dto.setCancelTimes((int)cancelCount);
//
//            statsList.add(dto);
//        }
//
//        return PageUtils.convertListToPage(statsList, pageable);
//
//    }


}
