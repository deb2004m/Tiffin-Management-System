package com.tiffin.management.service;

import com.tiffin.management.dto.response.DashboardStatsResponse;
import com.tiffin.management.dto.response.OrderResponse;
import com.tiffin.management.enums.AttendanceStatus;
import com.tiffin.management.enums.Role;
import com.tiffin.management.repository.AttendanceRepository;
import com.tiffin.management.repository.TiffinOrderRepository;
import com.tiffin.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final TiffinOrderRepository orderRepository;
    private final AttendanceRepository attendanceRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getAdminStats() {
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long activeStudents = userRepository.countByRoleAndIsActiveTrue(Role.STUDENT);
        long totalOrders = orderRepository.count();

        long todayAttendanceCount = attendanceRepository.countByDateAndStatus(
                LocalDate.now(),
                AttendanceStatus.PRESENT
        );

        List<OrderResponse> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(OrderResponse::from)
                .toList();

        return DashboardStatsResponse.builder()
                .totalStudents(totalStudents)
                .activeStudents(activeStudents)
                .totalOrders(totalOrders)
                .todayAttendanceCount(todayAttendanceCount)
                .recentOrders(recentOrders)
                .build();
    }
}
