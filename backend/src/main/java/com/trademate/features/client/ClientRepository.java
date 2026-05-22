package com.trademate.features.client;

import com.trademate.features.client.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByUserId(UUID userId);

    Optional<Client> findByIdAndUserId(Long id, UUID userId);

    long countByUserId(UUID userId);
}
