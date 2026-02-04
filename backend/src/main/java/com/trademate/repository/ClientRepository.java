package com.trademate.repository;

import com.trademate.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByUserId(UUID userId);
}
