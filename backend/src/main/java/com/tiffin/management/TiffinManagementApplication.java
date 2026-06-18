package com.tiffin.management;

import com.tiffin.management.config.AppProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class TiffinManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(TiffinManagementApplication.class, args);
    }
}
