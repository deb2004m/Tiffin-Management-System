package com.tiffin.management.dto.response;

import com.tiffin.management.entity.TiffinOrder;
import com.tiffin.management.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private Long studentProfileId;
    private String studentName;
    private String enrollmentNumber;
    private Long menuId;
    private String menuTitle;
    private LocalDate orderDate;
    private Integer quantity;
    private OrderStatus status;
    private String specialInstructions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static OrderResponse from(TiffinOrder order) {
        return OrderResponse.builder()
                .id(order.getId())
                .studentProfileId(order.getStudentProfile().getId())
                .studentName(order.getStudentProfile().getUser().getFirstName() + " "
                        + order.getStudentProfile().getUser().getLastName())
                .enrollmentNumber(order.getStudentProfile().getEnrollmentNumber())
                .menuId(order.getMenu().getId())
                .menuTitle(order.getMenu().getTitle())
                .orderDate(order.getOrderDate())
                .quantity(order.getQuantity())
                .status(order.getStatus())
                .specialInstructions(order.getSpecialInstructions())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
