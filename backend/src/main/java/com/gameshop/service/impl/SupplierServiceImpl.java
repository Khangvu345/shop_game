package com.gameshop.service.impl;

import com.gameshop.exception.BadRequestException;
import com.gameshop.exception.ResourceNotFoundException;
import com.gameshop.model.dto.request.CreateSupplierRequest;
import com.gameshop.model.dto.request.UpdateSupplierRequest;
import com.gameshop.model.dto.response.SupplierResponse;
import com.gameshop.model.entity.Supplier;
import com.gameshop.repository.SupplierRepository;
import com.gameshop.service.SupplierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation của SupplierService
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    @Override
    public SupplierResponse createSupplier(CreateSupplierRequest request) {
        log.info("Creating supplier: {}", request.name());

        // Validate unique name
        if (supplierRepository.existsByName(request.name())) {
            throw new BadRequestException("Nhà cung cấp với tên '" + request.name() + "' đã tồn tại");
        }

        // Validate unique email if provided
        if (request.contactEmail() != null && !request.contactEmail().isBlank()) {
            if (supplierRepository.existsByContactEmail(request.contactEmail())) {
                throw new BadRequestException("Email '" + request.contactEmail() + "' đã được sử dụng");
            }
        }

        Supplier supplier = new Supplier();
        supplier.setName(request.name());
        supplier.setContactEmail(request.contactEmail());
        supplier.setContactPhone(request.contactPhone());

        Supplier saved = supplierRepository.save(supplier);
        log.info("Supplier created successfully: id={}", saved.getSupplierId());

        return mapToResponse(saved);
    }

    @Override
    public SupplierResponse getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp ID: " + id));

        return mapToResponse(supplier);
    }

    @Override
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SupplierResponse> searchSuppliersByName(String name) {
        return supplierRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierResponse updateSupplier(Long id, UpdateSupplierRequest request) {
        log.info("Updating supplier: id={}", id);

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp ID: " + id));

        // Update name if provided
        if (request.name() != null && !request.name().isBlank()) {
            // Check unique name if changed
            if (!supplier.getName().equals(request.name()) &&
                supplierRepository.existsByName(request.name())) {
                throw new BadRequestException("Nhà cung cấp với tên '" + request.name() + "' đã tồn tại");
            }
            supplier.setName(request.name());
        }

        // Update email if provided
        if (request.contactEmail() != null) {
            // Check unique email if changed
            if (!request.contactEmail().equals(supplier.getContactEmail()) &&
                supplierRepository.existsByContactEmail(request.contactEmail())) {
                throw new BadRequestException("Email '" + request.contactEmail() + "' đã được sử dụng");
            }
            supplier.setContactEmail(request.contactEmail());
        }

        // Update phone if provided
        if (request.contactPhone() != null) {
            supplier.setContactPhone(request.contactPhone());
        }

        Supplier updated = supplierRepository.save(supplier);
        log.info("Supplier updated successfully: id={}", id);

        return mapToResponse(updated);
    }

    @Override
    public void deleteSupplier(Long id) {
        log.info("Deleting supplier: id={}", id);

        if (!supplierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy nhà cung cấp ID: " + id);
        }

        supplierRepository.deleteById(id);
        log.info("Supplier deleted successfully: id={}", id);
    }

    // Helper method
    private SupplierResponse mapToResponse(Supplier supplier) {
        return new SupplierResponse(
                supplier.getSupplierId(),
                supplier.getName(),
                supplier.getContactEmail(),
                supplier.getContactPhone()
        );
    }
}