package com.trademate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TradeMateApplication {

    public static void main(String[] args) {
        // Render Patch: Auto-correct postgres:// to jdbc:postgresql://
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl != null && dbUrl.startsWith("postgres://")) {
            System.out.println("Applying Render JDBC URL patch...");
            System.setProperty("spring.datasource.url", "jdbc:" + dbUrl);
        }
        SpringApplication.run(TradeMateApplication.class, args);
    }

}
