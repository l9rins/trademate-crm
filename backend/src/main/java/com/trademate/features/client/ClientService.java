package com.trademate.features.client;

import com.trademate.features.client.model.Client;
import com.trademate.features.auth.UserRepository;
import com.trademate.shared.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public List<Client> getClients(String username) {
        var user = userRepository.findByUsername(username).orElseThrow();
        return clientRepository.findByUserId(user.getId());
    }

    @CacheEvict(value = "dashboardStats", key = "#username")
    public Client createClient(String username, Client clientRequest) {
        var user = userRepository.findByUsername(username).orElseThrow();
        clientRequest.setUser(user);
        clientRequest.setCreatedAt(LocalDateTime.now());
        return clientRepository.save(clientRequest);
    }

    @CacheEvict(value = "dashboardStats", key = "#username")
    public Client updateClient(String username, Long id, Client clientRequest) {
        var user = userRepository.findByUsername(username).orElseThrow();
        var client = clientRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + id));
        client.setName(clientRequest.getName());
        client.setEmail(clientRequest.getEmail());
        client.setPhone(clientRequest.getPhone());
        client.setAddress(clientRequest.getAddress());
        client.setNotes(clientRequest.getNotes());
        return clientRepository.save(client);
    }

    @CacheEvict(value = "dashboardStats", key = "#username")
    public void deleteClient(String username, Long id) {
        var user = userRepository.findByUsername(username).orElseThrow();
        var client = clientRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + id));
        clientRepository.delete(client);
    }
}
