package com.tiffin.management.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Jwt jwt = new Jwt();
    private Upload upload = new Upload();

    @Data
    public static class Jwt {
        private String secret;
        private long expirationMs;
    }

    @Data
    public static class Upload {
        private String baseDir = "./uploads";
        private String aadhaarSubdir = "aadhaar";
    }
}
