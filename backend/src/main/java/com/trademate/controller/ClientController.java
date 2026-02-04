package com.trademate.controller;

import com.trademate.model.Client;
import com.trademate.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<List<Client>> getClients(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(clientService.getClients(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Client client) {
        return ResponseEntity.ok(clientService.createClient(userDetails.getUsername(), client));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client client) {
        return ResponseEntity.ok(clientService.updateClient(id, client));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
