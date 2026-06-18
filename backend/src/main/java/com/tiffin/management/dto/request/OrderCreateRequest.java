package com.tiffin.management.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateRequest {

    @NotNull(message = "Menu ID is required")
    private Long menuId;

    @NotNull(message = "Order date is required")
    private LocalDate orderDate;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 5, message = "Quantity cannot exceed 5")
    private Integer quantity = 1;

    @Size(max = 500)
    private String specialInstructions;
}
