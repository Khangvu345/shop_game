package com.gameshop.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = Arrays.asList("image/jpeg", "image/png", "image/webp",
            "image/jpg");

    public String uploadImage(MultipartFile file) throws IOException {
        // Validate file không null hoặc empty
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        // Validate kích thước file
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File quá lớn. Kích thước tối đa: 5MB");
        }

        // Validate loại file
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)");
        }

        // Upload file lên Cloudinary
        // "folder", "gameshop_products" -> Tự động tạo thư mục tên gameshop_products
        // trên cloud để chứa ảnh
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "gameshop_products"));

        // Trả về đường dẫn ảnh (URL) để lưu vào database
        return uploadResult.get("url").toString();
    }
}