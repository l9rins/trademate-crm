package com.trademate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TradeMateApplication {

    public static void main(String[] args) {
        // Render patches: Ensure JDBC URL format
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl != null && dbUrl.startsWith("postgres://")) {
            System.setProperty("spring.datasource.url", "jdbc:" + dbUrl);
        }
        SpringApplication.run(TradeMateApplication.class, args);
    }

}
