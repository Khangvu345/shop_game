package com.gameshop.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:GameShop API}")
    private String applicationName;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                        localServer(),
                        developmentServer()
                ));
    }

    private Info apiInfo() {
        return new Info()
                .title(applicationName)
                .version("1.0.0")
                .description("""
                        **Backend API cho hệ thống quản lý cửa hàng GameShop**
                        
                        API này cung cấp các endpoints để:
                        - Quản lý sản phẩm (Products)
                        - Quản lý khách hàng (Customers)
                        - Quản lý đơn hàng (Orders)
                        - Quản lý kho (Inventory)
                        """)
                .contact(teamContact())
                .license(apiLicense());
    }

    private Contact teamContact() {
        return new Contact()
                .name("GameShop Team")
                .email("team@gameshop.com")
                .url("https://github.com/your-repo");
    }

    private License apiLicense() {
        return new License()
                .name("Academic Project License")
                .url("https://github.com/your-repo/LICENSE");
    }

    private Server localServer() {
        return new Server()
                .url("http://localhost:8080")
                .description("Local Development Server");
    }

    private Server developmentServer() {
        return new Server()
                .url("http://dev.gameshop.com")
                .description("Development Server (Optional)");
    }
}
