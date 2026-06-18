package com.tiffin.management.dto.request;

import com.tiffin.management.enums.MealType;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuUpdateRequest {

    private LocalDate menuDate;
    private MealType mealType;

    @Size(max = 150)
    private String title;

    private String description;
    private Map<String, Object> items;
    private Boolean isPublished;
}
