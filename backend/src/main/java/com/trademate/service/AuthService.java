package com.trademate.service;

import com.trademate.config.JwtUtils;
import com.trademate.dto.AuthRequest;
import com.trademate.dto.AuthResponse;
import com.trademate.model.Role;
import com.trademate.model.User;
import com.trademate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already in use");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PROVIDER)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        var jwt = jwtUtils.generateToken(userDetails);
        return AuthResponse.builder().token(jwt).build();
    }

    public AuthResponse login(AuthRequest request) {
        // Login can be by email or username? Let's assume username for now as per
        // loadUserByUsername
        // But the request might send email.
        // Let's allow login with username.

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        var userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        var jwt = jwtUtils.generateToken(userDetails);
        return AuthResponse.builder().token(jwt).build();
    }
}
