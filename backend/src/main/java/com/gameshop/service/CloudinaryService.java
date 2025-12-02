package com.gameshop.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        // Upload file lên Cloudinary
        // "folder", "gameshop_products" -> Tự động tạo thư mục tên gameshop_products trên cloud để chứa ảnh
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap("folder", "gameshop_products"));

        // Trả về đường dẫn ảnh (URL) để lưu vào database
        return uploadResult.get("url").toString();
    }
}