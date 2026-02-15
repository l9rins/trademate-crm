package com.trademate.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

/**
 * Enables Spring Cache abstraction.
 * Uses Redis as the backing store (configured in application.properties).
 * Fallback: set CACHE_TYPE=simple for in-memory caching without Redis.
 */
@Configuration
@EnableCaching
public class CacheConfig {
}
