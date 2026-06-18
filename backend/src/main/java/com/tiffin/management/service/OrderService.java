package com.tiffin.management.service;

import com.tiffin.management.dto.request.OrderCreateRequest;
import com.tiffin.management.dto.request.OrderStatusUpdateRequest;
import com.tiffin.management.dto.response.OrderResponse;
import com.tiffin.management.entity.Menu;
import com.tiffin.management.entity.StudentProfile;
import com.tiffin.management.entity.TiffinOrder;
import com.tiffin.management.enums.OrderStatus;
import com.tiffin.management.exception.BadRequestException;
import com.tiffin.management.exception.DuplicateResourceException;
import com.tiffin.management.exception.ResourceNotFoundException;
import com.tiffin.management.exception.UnauthorizedActionException;
import com.tiffin.management.repository.MenuRepository;
import com.tiffin.management.repository.StudentProfileRepository;
import com.tiffin.management.repository.TiffinOrderRepository;
import com.tiffin.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final TiffinOrderRepository orderRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final MenuRepository menuRepository;

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders() {
        if (SecurityUtils.isAdmin()) {
            return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                    .map(OrderResponse::from)
                    .toList();
        }

        StudentProfile profile = studentProfileRepository.findByUserId(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return orderRepository.findByStudentProfileIdOrderByCreatedAtDesc(profile.getId()).stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        TiffinOrder order = findOrderOrThrow(id);
        assertOrderAccess(order);
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse placeOrder(OrderCreateRequest request) {
        if (!SecurityUtils.isStudent()) {
            throw new UnauthorizedActionException("Only students can place orders");
        }

        StudentProfile profile = studentProfileRepository.findByUserId(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Menu menu = menuRepository.findById(request.getMenuId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found"));

        if (!Boolean.TRUE.equals(menu.getIsPublished())) {
            throw new BadRequestException("Cannot order from an unpublished menu");
        }

        if (orderRepository.existsByStudentProfileIdAndMenuIdAndOrderDate(
                profile.getId(), request.getMenuId(), request.getOrderDate())) {
            throw new DuplicateResourceException("Order already exists for this menu and date");
        }

        TiffinOrder order = TiffinOrder.builder()
                .studentProfile(profile)
                .menu(menu)
                .orderDate(request.getOrderDate())
                .quantity(request.getQuantity() != null ? request.getQuantity() : 1)
                .status(OrderStatus.PENDING)
                .specialInstructions(request.getSpecialInstructions())
                .build();

        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        if (!SecurityUtils.isAdmin()) {
            throw new UnauthorizedActionException("Only admin can update order status");
        }

        TiffinOrder order = findOrderOrThrow(id);

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot update a cancelled order");
        }

        OrderStatus newStatus = request.getStatus();
        if (newStatus != OrderStatus.PENDING
                && newStatus != OrderStatus.CONFIRMED
                && newStatus != OrderStatus.DELIVERED
                && newStatus != OrderStatus.CANCELLED) {
            throw new BadRequestException("Invalid order status");
        }

        order.setStatus(newStatus);
        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse cancelOrder(Long id) {
        TiffinOrder order = findOrderOrThrow(id);
        assertOrderAccess(order);

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Delivered orders cannot be cancelled");
        }
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return OrderResponse.from(orderRepository.save(order));
    }

    private TiffinOrder findOrderOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    private void assertOrderAccess(TiffinOrder order) {
        if (SecurityUtils.isAdmin()) {
            return;
        }
        if (!order.getStudentProfile().getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new UnauthorizedActionException("You can only access your own orders");
        }
    }
}
