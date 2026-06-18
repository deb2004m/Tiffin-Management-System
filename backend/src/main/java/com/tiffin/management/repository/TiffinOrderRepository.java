package com.tiffin.management.repository;

import com.tiffin.management.entity.TiffinOrder;
import com.tiffin.management.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TiffinOrderRepository extends JpaRepository<TiffinOrder, Long> {

    List<TiffinOrder> findByStudentProfileIdOrderByCreatedAtDesc(Long studentProfileId);

    boolean existsByStudentProfileIdAndMenuIdAndOrderDate(Long studentProfileId, Long menuId, LocalDate orderDate);

    List<TiffinOrder> findAllByOrderByCreatedAtDesc();

    long countByStatus(OrderStatus status);

    List<TiffinOrder> findTop10ByOrderByCreatedAtDesc();
}
