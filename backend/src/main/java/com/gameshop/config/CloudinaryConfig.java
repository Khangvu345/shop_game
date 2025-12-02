package com.gameshop.config;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "ddehnsjtw", // Copy từ Dashboard
            "api_key", "336843645464722",           // Copy từ Dashboard
            "api_secret", "eTXEyEHRbPeoVHNmYiyyeUbodDo"      // Copy từ Dashboard (Bảo mật kĩ cái này)
        ));
    }
}