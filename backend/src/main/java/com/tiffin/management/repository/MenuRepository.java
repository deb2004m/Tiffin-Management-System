package com.tiffin.management.repository;

import com.tiffin.management.entity.Menu;
import com.tiffin.management.enums.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    Optional<Menu> findByMenuDateAndMealType(LocalDate menuDate, MealType mealType);

    List<Menu> findByMenuDateBetweenOrderByMenuDateAscMealTypeAsc(LocalDate startDate, LocalDate endDate);

    List<Menu> findByMenuDateBetweenAndIsPublishedTrueOrderByMenuDateAscMealTypeAsc(
            LocalDate startDate,
            LocalDate endDate
    );
}
