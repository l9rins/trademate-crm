package com.trademate.features.client;

import com.trademate.features.client.model.Client;
import com.trademate.features.auth.UserRepository;
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

    @CacheEvict(value = "dashboardStats", allEntries = true)
    public Client updateClient(Long id, Client clientRequest) {
        var client = clientRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));
        client.setName(clientRequest.getName());
        client.setEmail(clientRequest.getEmail());
        client.setPhone(clientRequest.getPhone());
        client.setAddress(clientRequest.getAddress());
        client.setNotes(clientRequest.getNotes());
        return clientRepository.save(client);
    }

    @CacheEvict(value = "dashboardStats", allEntries = true)
    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}
