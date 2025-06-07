package com.dyd.dungeonsydragonsv1.controladores.testControllers;

import com.dyd.dungeonsydragonsv1.DungeonsYDragonsV1Application;
import com.dyd.dungeonsydragonsv1.dto.personajes.*;
import com.dyd.dungeonsydragonsv1.entidades.*;
import com.dyd.dungeonsydragonsv1.seguridad.UsuarioDetails;
import com.dyd.dungeonsydragonsv1.servicios.ClaseService;
import com.dyd.dungeonsydragonsv1.servicios.PersonajeService;
import com.dyd.dungeonsydragonsv1.servicios.RazaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = DungeonsYDragonsV1Application.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class PersonajeRestControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper json;

    @MockitoBean PersonajeService personajeService;
    @MockitoBean PersonajeMapper personajeMapper;
    @MockitoBean ClaseService claseService;
    @MockitoBean RazaService razaService;
    @MockitoBean HechizoMapper hechizoMapper;

    private Personaje entidad;
    private PersonajeFront front;
    private PersonajeBack back;
    private PersonajeBack filterBack;

    private HechizoBack hechizoBack;
    private Hechizo hechizoEntidad;
    private PersonajeGaleriaDto galeriaDto;

    @BeforeEach
    void setUp() {
        entidad = Personaje.builder()
                .id(1L)
                .nombre("Aragorn")
                .build();

        front = PersonajeFront.builder()
                .id(1L)
                .nombre("Aragorn")
                .build();

        back = PersonajeBack.builder()
                .nombre("Aragorn")
                .razaId(10L)
                .claseId(20L)
                .build();

        filterBack = PersonajeBack.builder()
                .claseId(20L)
                .razaId(10L)
                .build();

        hechizoBack = HechizoBack.builder()
                .nombre("BolaFuego")
                .nivel("Alto")
                .descripcion("Explosión")
                .build();

        hechizoEntidad = Hechizo.builder()
                .id(100L)
                .nombre("BolaFuego")
                .nivel("Alto")
                .descripcion("Explosión")
                .build();

        galeriaDto = PersonajeGaleriaDto.builder()
                .id(1L)
                .nombre("Aragorn")
                .build();
    }

    @Test
    void obtenerTodos_devuelveLista() throws Exception {
        var listaEnt = List.of(entidad);
        var listaFront = List.of(front);

        when(personajeService.getAllPersonajes()).thenReturn(listaEnt);
        when(personajeMapper.toFrontList(listaEnt)).thenReturn(listaFront);

        mockMvc.perform(get("/api/personajes").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].nombre").value("Aragorn"));
    }

    @Test
    void obtenerPorId_existente_devuelve200() throws Exception {
        when(personajeService.findById(1L)).thenReturn(Optional.of(entidad));
        when(personajeMapper.toFront(entidad)).thenReturn(front);

        mockMvc.perform(get("/api/personajes/1").accept(MediaType.APPLICATION_JSON))
                .andDo(result -> System.out.println("Obtener por id: " + result.getResponse().getContentAsString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Aragorn"));
    }

    @Test
    void obtenerPorId_inexistente_devuelve404() throws Exception {
        when(personajeService.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/personajes/99").accept(MediaType.APPLICATION_JSON))
                .andDo(result -> System.out.println("El id será inexistente=" + result.getResponse().getStatus()))
                .andExpect(status().isNotFound());
    }

    @Test
    void buscarPorNombre_conResultados_devuelve200() throws Exception {
        var listaEnt = List.of(entidad);
        var listaFront = List.of(front);

        when(personajeService.findByNombre("Aragorn")).thenReturn(listaEnt);
        when(personajeMapper.toFrontList(listaEnt)).thenReturn(listaFront);

        mockMvc.perform(get("/api/personajes/buscar/Aragorn").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Aragorn"));
    }

    @Test
    void buscarPorNombre_sinResultados_devuelve204() throws Exception {
        when(personajeService.findByNombre("NoExiste")).thenReturn(List.of());

        mockMvc.perform(get("/api/personajes/buscar/NoExiste").accept(MediaType.APPLICATION_JSON))
                .andDo(result -> System.out.println("Busqueda por nombre=" + result.getResponse().getStatus()))
                .andExpect(status().isNoContent());
    }

    @Test
    void crear_devuelve201() throws Exception {
        // DTO de entrada
        PersonajeBack backLocal = PersonajeBack.builder()
                .nombre("Aragorn")
                .razaId(10L)
                .claseId(20L)
                .build();

        // Simulo entidad guardada con todos sus campos
        Personaje personajeCreado = Personaje.builder()
                .id(1L)
                .nombre("Aragorn")
                .raza(Raza.builder().id(10L).nombre("Enano").build())
                .clase(Clase.builder().id(20L).nombre("Guerrero").build())
                .build();

        PersonajeFront frontCreado = PersonajeFront.builder()
                .id(1L)
                .nombre("Aragorn")
                .raza("Enano")
                .clase("Guerrero")
                .build();

        var principal = new UsuarioDetails(
                Usuario.builder()
                        .id(99L)
                        .username("neo")
                        .roles(Set.of())
                        .build()
        );
        var authToken = new UsernamePasswordAuthenticationToken(principal, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        when(personajeService.savePersonaje(any(Personaje.class))).thenReturn(personajeCreado);
        when(personajeMapper.toFront(personajeCreado)).thenReturn(frontCreado);

        mockMvc.perform(post("/api/personajes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(backLocal)))
                .andDo(print())
                .andDo(r -> System.out.println("Si se crea devuelve un 201: " + r.getResponse().getContentAsString()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Aragorn"))
                .andExpect(jsonPath("$.raza").value("Enano"))
                .andExpect(jsonPath("$.clase").value("Guerrero"));
    }

    @Test
    void actualizar_existente_devuelve200() throws Exception {
        PersonajeBack backLocal = PersonajeBack.builder()
                .nombre("Aragorn")
                .razaId(10L)
                .claseId(20L)
                .build();

        when(personajeService.existsById(1L)).thenReturn(true);

        Personaje personajeActualizado = Personaje.builder()
                .id(1L)
                .nombre("Aragorn")
                .raza(Raza.builder().id(10L).nombre("Enano").build())
                .clase(Clase.builder().id(20L).nombre("Guerrero").build())
                .build();

        PersonajeFront frontActualizado = PersonajeFront.builder()
                .id(1L)
                .nombre("Aragorn")
                .raza("Enano")
                .clase("Guerrero")
                .build();

        when(personajeService.savePersonaje(any(Personaje.class))).thenReturn(personajeActualizado);
        when(personajeMapper.toFront(personajeActualizado)).thenReturn(frontActualizado);

        mockMvc.perform(put("/api/personajes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(backLocal)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Aragorn"))
                .andExpect(jsonPath("$.raza").value("Enano"))
                .andExpect(jsonPath("$.clase").value("Guerrero"));
    }

    @Test
    void actualizar_inexistente_devuelve404() throws Exception {
        PersonajeBack backLocal = PersonajeBack.builder()
                .nombre("Aragorn")
                .razaId(10L)
                .claseId(20L)
                .build();

        when(personajeService.existsById(99L)).thenReturn(false);

        mockMvc.perform(put("/api/personajes/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(backLocal)))
                .andDo(result -> System.out.println("Actualizar inexistente devuelve un 404=" + result.getResponse().getStatus()))
                .andExpect(status().isNotFound());
    }

    @Test
    void filtrar_conResultados_devuelve200() throws Exception {
        when(claseService.findById(20L))
                .thenReturn(Optional.of(Clase.builder().id(20L).nombre("Guerrero").build()));
        when(razaService.findById(10L))
                .thenReturn(Optional.of(Raza.builder().id(10L).nombre("Enano").build()));

        var listaEnt = List.of(entidad);
        var listaFront = List.of(front);

        when(personajeService.filtrarPorClaseYRaza("Guerrero", "Enano")).thenReturn(listaEnt);
        when(personajeMapper.toFrontList(listaEnt)).thenReturn(listaFront);

        mockMvc.perform(post("/api/personajes/filtrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(filterBack)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Aragorn"));
    }

    @Test
    void filtrar_sinResultados_devuelve204() throws Exception {
        when(claseService.findById(20L))
                .thenReturn(Optional.of(Clase.builder().id(20L).nombre("Guerrero").build()));
        when(razaService.findById(10L))
                .thenReturn(Optional.of(Raza.builder().id(10L).nombre("Enano").build()));

        when(personajeService.filtrarPorClaseYRaza("Guerrero", "Enano")).thenReturn(List.of());

        mockMvc.perform(post("/api/personajes/filtrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(filterBack)))
                .andDo(r -> System.out.println("Filtrar sin resultados → status: " + r.getResponse().getStatus()))
                .andExpect(status().isNoContent());
    }

    @Test
    void eliminar_existente_devuelve204() throws Exception {
        when(personajeService.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/personajes/1"))
                .andDo(r -> System.out.println("Si se elimina devuelve un 204=" + r.getResponse().getStatus()))
                .andExpect(status().isNoContent());
    }

    @Test
    void eliminar_inexistente_devuelve404() throws Exception {
        when(personajeService.existsById(99L)).thenReturn(false);

        mockMvc.perform(delete("/api/personajes/99"))
                .andDo(r -> System.out.println("Eliminar (no existe)=" + r.getResponse().getStatus()))
                .andExpect(status().isNotFound());
    }

    @Test
    void agregarHechizoNuevo_devuelve200() throws Exception {
        // DTO de entrada para nuevo hechizo
        HechizoBack hechizoBackLocal = HechizoBack.builder()
                .nombre("BolaFuego")
                .nivel("Alto")
                .descripcion("Explosión")
                .build();

        // Personaje después de agregar el hechizo
        Personaje personajeConHechizos = Personaje.builder()
                .id(1L)
                .nombre("Aragorn")
                .hechizos(List.of(hechizoEntidad))
                .build();

        PersonajeFront frontConHechizos = PersonajeFront.builder()
                .id(1L)
                .nombre("Aragorn")
                .hechizos(List.of("BolaFuego"))
                .build();

        when(hechizoMapper.toEntity(hechizoBackLocal)).thenReturn(hechizoEntidad);
        when(personajeService.agregarHechizo(1L, hechizoEntidad)).thenReturn(personajeConHechizos);
        when(personajeMapper.toFront(personajeConHechizos)).thenReturn(frontConHechizos);

        mockMvc.perform(post("/api/personajes/1/hechizos/nuevo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(hechizoBackLocal)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Aragorn"))
                .andExpect(jsonPath("$.hechizos[0]").value("BolaFuego"));
    }

    @Test
    void agregarHechizoExistente_devuelve200() throws Exception {
        // Personaje después de agregar hechizo existente
        Personaje personajeConHechizos = Personaje.builder()
                .id(1L)
                .nombre("Aragorn")
                .hechizos(List.of(hechizoEntidad))
                .build();

        PersonajeFront frontConHechizos = PersonajeFront.builder()
                .id(1L)
                .nombre("Aragorn")
                .hechizos(List.of("BolaFuego"))
                .build();

        when(personajeService.agregarHechizoExistente(1L, 100L)).thenReturn(personajeConHechizos);
        when(personajeMapper.toFront(personajeConHechizos)).thenReturn(frontConHechizos);

        mockMvc.perform(post("/api/personajes/1/hechizos/100"))
                .andDo(r -> System.out.println("Hechizo existente Status=" + r.getResponse().getStatus()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Aragorn"))
                .andExpect(jsonPath("$.hechizos[0]").value("BolaFuego"));
    }

    @Test
    void eliminarHechizoDePersonaje_devuelve200() throws Exception {
        // Personaje después de eliminar un hechizo
        Hechizo hech2 = Hechizo.builder()
                .id(200L)
                .nombre("EscudoMagico")
                .nivel("Bajo")
                .descripcion("Defensa")
                .build();

        Personaje personajeDespues = Personaje.builder()
                .id(1L)
                .nombre("Aragorn")
                .hechizos(List.of(hech2))
                .build();

        PersonajeFront frontDespues = PersonajeFront.builder()
                .id(1L)
                .nombre("Aragorn")
                .hechizos(List.of("EscudoMagico"))
                .build();

        when(personajeService.eliminarHechizoDePersonaje(1L, 100L))
                .thenReturn(personajeDespues);
        when(personajeMapper.toFront(personajeDespues))
                .thenReturn(frontDespues);

        mockMvc.perform(delete("/api/personajes/1/hechizos/100"))
                .andDo(r -> System.out.println("Hechizo eliminado=" + r.getResponse().getStatus()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Aragorn"))
                .andExpect(jsonPath("$.hechizos[0]").value("EscudoMagico"))
                .andExpect(jsonPath("$.hechizos.length()").value(1));
    }

    @Test
    void eliminarTodosLosHechizos_devuelve200() throws Exception {
        // Personaje después de eliminar todos los hechizos
        Personaje personajeDespues = Personaje.builder()
                .id(1L)
                .nombre("Aragorn")
                .hechizos(List.of())
                .build();

        PersonajeFront frontDespues = PersonajeFront.builder()
                .id(1L)
                .nombre("Aragorn")
                .hechizos(List.of())
                .build();

        when(personajeService.eliminarTodosHechizos(1L))
                .thenReturn(personajeDespues);
        when(personajeMapper.toFront(personajeDespues))
                .thenReturn(frontDespues);

        mockMvc.perform(delete("/api/personajes/1/hechizos"))
                .andDo(r -> System.out.println("Todos hechizos eliminados=" + r.getResponse().getStatus()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Aragorn"))
                .andExpect(jsonPath("$.hechizos.length()").value(0));
    }


}
