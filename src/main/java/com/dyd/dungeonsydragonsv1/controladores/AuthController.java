package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.dto.jwt.JwtLoginRequest;
import com.dyd.dungeonsydragonsv1.dto.jwt.JwtLoginResponse;
import com.dyd.dungeonsydragonsv1.dto.jwt.JwtRegistroResponse;
import com.dyd.dungeonsydragonsv1.dto.usuario.UsuarioDto;
import com.dyd.dungeonsydragonsv1.entidades.Usuario;
import com.dyd.dungeonsydragonsv1.repositorios.UsuarioRepository;
import com.dyd.dungeonsydragonsv1.seguridad.JwtUtil;
import com.dyd.dungeonsydragonsv1.dto.jwt.JwtMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtMapper jwtMapper;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UsuarioDto dto) {
        if (usuarioRepository.findByUsername(dto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Usuario ya existe");
        }

        Usuario usuario = Usuario.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .roles(dto.getRoles()) // ya viene como Set<Rol>
                .build();

        usuarioRepository.save(usuario);

        JwtRegistroResponse response = jwtMapper.toRegistroResponse(usuario);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody JwtLoginRequest loginRequest) {
        try {
            var authToken = new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(), loginRequest.getPassword());
            authManager.authenticate(authToken);

            String token = jwtUtil.generarToken(loginRequest.getUsername());

            Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow();

            JwtLoginResponse response = JwtLoginResponse.builder()
                    .token(token)
                    .username(usuario.getUsername())
                    .roles(usuario.getRoles())
                    .build();

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }
}
