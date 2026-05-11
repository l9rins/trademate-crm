package com.trademate.features.auth;

import com.trademate.features.auth.dto.AuthRequest;
import com.trademate.features.auth.dto.AuthResponse;
import com.trademate.shared.security.JwtUtils;
import com.trademate.shared.security.UserDetailsServiceImpl;
import com.trademate.features.auth.model.Role;
import com.trademate.features.auth.model.User;
import com.trademate.features.auth.UserRepository;
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
        // Supports login with either username or email
        String usernameOrEmail = request.getUsername();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(usernameOrEmail, request.getPassword()));
        var userDetails = userDetailsService.loadUserByUsername(usernameOrEmail);
        var jwt = jwtUtils.generateToken(userDetails);
        return AuthResponse.builder().token(jwt).build();
    }
}
