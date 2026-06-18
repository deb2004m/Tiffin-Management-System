package com.tiffin.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private long totalStudents;
    private long activeStudents;
    private long totalOrders;
    private long todayAttendanceCount;
    private List<OrderResponse> recentOrders;
}
