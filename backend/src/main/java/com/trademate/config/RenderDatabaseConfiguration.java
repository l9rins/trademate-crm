package com.trademate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.jdbc.DataSourceBuilder;
import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class RenderDatabaseConfiguration {

    @Bean
    public DataSource dataSource() throws URISyntaxException {
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        String username = System.getenv("SPRING_DATASOURCE_USERNAME");
        String password = System.getenv("SPRING_DATASOURCE_PASSWORD");

        if (dbUrl != null && dbUrl.startsWith("postgres://")) {
            // Fix for Render's missing jdbc: prefix
            dbUrl = "jdbc:" + dbUrl;
        }

        return DataSourceBuilder.create()
                .url(dbUrl)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
