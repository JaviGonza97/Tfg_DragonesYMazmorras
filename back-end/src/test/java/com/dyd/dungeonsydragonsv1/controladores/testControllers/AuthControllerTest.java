package com.dyd.dungeonsydragonsv1.controladores.testControllers;

import com.dyd.dungeonsydragonsv1.DungeonsYDragonsV1Application;
import com.dyd.dungeonsydragonsv1.dto.jwt.*;
import com.dyd.dungeonsydragonsv1.entidades.Rol;
import com.dyd.dungeonsydragonsv1.entidades.Usuario;
import com.dyd.dungeonsydragonsv1.repositorios.UsuarioRepository;
import com.dyd.dungeonsydragonsv1.seguridad.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.Set;

import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = DungeonsYDragonsV1Application.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper json;

    /* ------------- mocks con @MockitoBean ---------------- */
    @MockitoBean UsuarioRepository     usuarioRepo;
    @MockitoBean PasswordEncoder       encoder;
    @MockitoBean JwtUtil              jwtUtil;
    @MockitoBean AuthenticationManager authManager;
    @MockitoBean JwtMapper             jwtMapper;
    /* ----------------------------------------------------- */

    private Usuario usuario;
    private JwtRegistroResponse regResponse;
    private JwtLoginRequest  loginReq;
    private JwtLoginResponse loginResp;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder()
                .id(1L)
                .username("neo")
                .email("neo@matrix.com")
                .password("ENC")
                .roles(Set.of(Rol.builder().nombre("USUARIO").build()))
                .build();

        regResponse = JwtRegistroResponse.builder()
                .id(1L)
                .username("neo")
                .build();

        loginReq = new JwtLoginRequest("neo", "matrix");

        loginResp = JwtLoginResponse.builder()
                .token("tokentest")
                .username("neo")
                .roles(usuario.getRoles())
                .build();
    }

    @Test
    void register_UsuarioNuevo_devuelve200_e_imprimeRespuesta() throws Exception {

        when(usuarioRepo.findByUsername("neo")).thenReturn(Optional.empty());
        when(encoder.encode("matrix")).thenReturn("ENC");
        when(usuarioRepo.save(any(Usuario.class))).thenReturn(usuario);
        when(jwtMapper.toRegistroResponse(any(Usuario.class))).thenReturn(regResponse);

        var dto = com.dyd.dungeonsydragonsv1.dto.usuario.UsuarioDto.builder()
                .username("neo")
                .email("neo@matrix.com")
                .password("matrix")
                .passwordConfirm("matrix")
                .roles(usuario.getRoles())
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", equalTo("neo")))
                .andDo(result ->
                        System.out.println("Datos que devuelve el test: " +
                                result.getResponse().getContentAsString())
                );
    }

    @Test
    void register_existeUsuario_devuelve400_e_imprimeMensaje() throws Exception {
        when(usuarioRepo.findByUsername("neo")).thenReturn(Optional.of(usuario));

        var dto = com.dyd.dungeonsydragonsv1.dto.usuario.UsuarioDto.builder()
                .username("neo")
                .email("neo@matrix.com")
                .password("matrix")
                .passwordConfirm("matrix")
                .roles(usuario.getRoles())
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Usuario ya existe"))
                .andDo(result ->
                        System.out.println("En caso de que el usuario ya exista: " +
                                result.getResponse().getContentAsString())
                );
    }

    @Test
    void login_correcto_devuelveToken_e_imprimeRespuesta() throws Exception {
        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);

        when(jwtUtil.generarToken("neo")).thenReturn("tokentest");
        when(usuarioRepo.findByUsername("neo")).thenReturn(Optional.of(usuario));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", equalTo("tokentest")))
                .andExpect(jsonPath("$.username", equalTo("neo")))
                .andDo(result -> {
                    System.out.println("Login exitoso devuelve: "
                            + result.getResponse().getContentAsString());
                });
    }

    @Test
    void login_invalido_devuelve401() throws Exception {

        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new org.springframework.security.core.AuthenticationException("bad") {});

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized());
    }
}
