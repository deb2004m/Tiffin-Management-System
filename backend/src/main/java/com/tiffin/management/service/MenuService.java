package com.tiffin.management.service;

import com.tiffin.management.dto.request.MenuCreateRequest;
import com.tiffin.management.dto.request.MenuUpdateRequest;
import com.tiffin.management.dto.response.MenuResponse;
import com.tiffin.management.entity.Menu;
import com.tiffin.management.entity.User;
import com.tiffin.management.exception.DuplicateResourceException;
import com.tiffin.management.exception.ResourceNotFoundException;
import com.tiffin.management.repository.MenuRepository;
import com.tiffin.management.repository.UserRepository;
import com.tiffin.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<MenuResponse> getMenus(LocalDate startDate, LocalDate endDate) {
        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = endDate != null ? endDate : start.plusDays(6);

        List<Menu> menus = SecurityUtils.isAdmin()
                ? menuRepository.findByMenuDateBetweenOrderByMenuDateAscMealTypeAsc(start, end)
                : menuRepository.findByMenuDateBetweenAndIsPublishedTrueOrderByMenuDateAscMealTypeAsc(start, end);

        return menus.stream().map(MenuResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public MenuResponse getMenuById(Long id) {
        Menu menu = findMenuOrThrow(id);
        if (!SecurityUtils.isAdmin() && !Boolean.TRUE.equals(menu.getIsPublished())) {
            throw new ResourceNotFoundException("Menu not found with id: " + id);
        }
        return MenuResponse.from(menu);
    }

    @Transactional
    public MenuResponse createMenu(MenuCreateRequest request) {
        menuRepository.findByMenuDateAndMealType(request.getMenuDate(), request.getMealType())
                .ifPresent(menu -> {
                    throw new DuplicateResourceException(
                            "Menu already exists for " + request.getMenuDate() + " " + request.getMealType()
                    );
                });

        User admin = userRepository.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        Menu menu = Menu.builder()
                .menuDate(request.getMenuDate())
                .mealType(request.getMealType())
                .title(request.getTitle())
                .description(request.getDescription())
                .items(request.getItems())
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : false)
                .createdBy(admin)
                .build();

        return MenuResponse.from(menuRepository.save(menu));
    }

    @Transactional
    public MenuResponse updateMenu(Long id, MenuUpdateRequest request) {
        Menu menu = findMenuOrThrow(id);

        if (request.getMenuDate() != null && request.getMealType() != null) {
            menuRepository.findByMenuDateAndMealType(request.getMenuDate(), request.getMealType())
                    .filter(existing -> !existing.getId().equals(id))
                    .ifPresent(existing -> {
                        throw new DuplicateResourceException(
                                "Menu already exists for " + request.getMenuDate() + " " + request.getMealType()
                        );
                    });
            menu.setMenuDate(request.getMenuDate());
            menu.setMealType(request.getMealType());
        } else {
            if (request.getMenuDate() != null) {
                menu.setMenuDate(request.getMenuDate());
            }
            if (request.getMealType() != null) {
                menu.setMealType(request.getMealType());
            }
        }

        if (request.getTitle() != null) {
            menu.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            menu.setDescription(request.getDescription());
        }
        if (request.getItems() != null) {
            menu.setItems(request.getItems());
        }
        if (request.getIsPublished() != null) {
            menu.setIsPublished(request.getIsPublished());
        }

        return MenuResponse.from(menuRepository.save(menu));
    }

    @Transactional
    public void deleteMenu(Long id) {
        Menu menu = findMenuOrThrow(id);
        menuRepository.delete(menu);
    }

    private Menu findMenuOrThrow(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));
    }
}
