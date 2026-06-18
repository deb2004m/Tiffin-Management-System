package com.tiffin.management.dto.response;

import com.tiffin.management.entity.Menu;
import com.tiffin.management.enums.MealType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuResponse {

    private Long id;
    private LocalDate menuDate;
    private MealType mealType;
    private String title;
    private String description;
    private Map<String, Object> items;
    private Boolean isPublished;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MenuResponse from(Menu menu) {
        return MenuResponse.builder()
                .id(menu.getId())
                .menuDate(menu.getMenuDate())
                .mealType(menu.getMealType())
                .title(menu.getTitle())
                .description(menu.getDescription())
                .items(menu.getItems())
                .isPublished(menu.getIsPublished())
                .createdById(menu.getCreatedBy().getId())
                .createdByName(menu.getCreatedBy().getFirstName() + " " + menu.getCreatedBy().getLastName())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }
}
