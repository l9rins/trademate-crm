package com.trademate.service;

import com.trademate.model.Client;
import com.trademate.repository.ClientRepository;
import com.trademate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    public Client createClient(String username, Client clientRequest) {
        var user = userRepository.findByUsername(username).orElseThrow();
        clientRequest.setUser(user);
        clientRequest.setCreatedAt(LocalDateTime.now());
        return clientRepository.save(clientRequest);
    }

    public Client updateClient(Long id, Client clientRequest) {
        var client = clientRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));
        client.setName(clientRequest.getName());
        client.setEmail(clientRequest.getEmail());
        client.setPhone(clientRequest.getPhone());
        client.setAddress(clientRequest.getAddress());
        client.setNotes(clientRequest.getNotes());
        return clientRepository.save(client);
    }

    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}
