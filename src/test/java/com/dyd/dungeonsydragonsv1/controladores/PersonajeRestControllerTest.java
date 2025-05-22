package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.entidades.Raza;
import com.dyd.dungeonsydragonsv1.entidades.Clase;
import com.dyd.dungeonsydragonsv1.servicios.PersonajeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.*;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PersonajeRestControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PersonajeService personajeService;

    @InjectMocks
    private PersonajeRestController controller;

    private ObjectMapper objectMapper;

    private Personaje ejemploPersonaje;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc      = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();

        // Un personaje de ejemplo
        ejemploPersonaje = Personaje.builder()
                .id(1L)
                .nombre("Thorin")
                .raza(Raza.builder().id(1L).nombre("Enano").build())
                .clase(Clase.builder().id(1L).nombre("Guerrero").build())
                .habilidades(Collections.emptyList())
                .equipo(Collections.emptyList())
                .hechizos(Collections.emptyList())
                .build();
    }

    @Test
    void obtenerTodos_deberiaRetornarLista() throws Exception {
        // dado
        Personaje ejemplo = new Personaje();
        ejemplo.setId(1L);
        ejemplo.setNombre("Thorin");
        when(personajeService.getAllPersonajes())
                .thenReturn(List.of(ejemplo));

        // cuando / entonces
        mockMvc.perform(get("/api/personajes"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Thorin"));

        verify(personajeService).getAllPersonajes();
    }

    @Test
    void obtenerPorId_existente_deberiaRetornar200() throws Exception {
        when(personajeService.findById(1L))
                .thenReturn(Optional.of(ejemploPersonaje));

        mockMvc.perform(get("/api/personajes/{id}", 1L))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Thorin"));

        verify(personajeService).findById(1L);
    }

    @Test
    void obtenerPorId_noExistente_deberiaRetornar404() throws Exception {
        when(personajeService.findById(999L))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/personajes/{id}", 999L))
                .andExpect(status().isNotFound());

        verify(personajeService).findById(999L);
    }

    @Test
    void buscarPorNombre_conResultados_deberiaRetornar200() throws Exception {
        when(personajeService.findByNombre("Thorin"))
                .thenReturn(List.of(ejemploPersonaje));

        mockMvc.perform(get("/api/personajes/buscar/{nombre}", "Thorin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));

        verify(personajeService).findByNombre("Thorin");
    }

    @Test
    void buscarPorNombre_sinResultados_deberiaRetornar204() throws Exception {
        when(personajeService.findByNombre("Nadie"))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/personajes/buscar/{nombre}", "Nadie"))
                .andExpect(status().isNoContent());

        verify(personajeService).findByNombre("Nadie");
    }

    @Test
    void crear_deberiaRetornar201ConCuerpo() throws Exception {
        when(personajeService.savePersonaje(any(Personaje.class)))
                .thenReturn(ejemploPersonaje);

        mockMvc.perform(post("/api/personajes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ejemploPersonaje)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Thorin"));

        verify(personajeService).savePersonaje(any(Personaje.class));
    }

    @Test
    void filtrar_conResultados_deberiaRetornar200() throws Exception {
        Personaje filtro = Personaje.builder()
                .raza(Raza.builder().nombre("Enano").build())
                .clase(Clase.builder().nombre("Guerrero").build())
                .build();

        when(personajeService.filtrarPorClaseYRaza("Guerrero", "Enano"))
                .thenReturn(List.of(ejemploPersonaje));

        mockMvc.perform(post("/api/personajes/filtrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(filtro)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Thorin"));

        verify(personajeService)
                .filtrarPorClaseYRaza("Guerrero", "Enano");
    }

    @Test
    void filtrar_sinResultados_deberiaRetornar204() throws Exception {
        Personaje filtro = Personaje.builder()
                .raza(Raza.builder().nombre("Orco").build())
                .clase(Clase.builder().nombre("Mago").build())
                .build();

        when(personajeService.filtrarPorClaseYRaza("Mago", "Orco"))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(post("/api/personajes/filtrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(filtro)))
                .andExpect(status().isNoContent());

        verify(personajeService)
                .filtrarPorClaseYRaza("Mago", "Orco");
    }

    @Test
    void actualizar_existente_deberiaRetornar200() throws Exception {
        when(personajeService.existsById(1L)).thenReturn(true);
        when(personajeService.savePersonaje(any(Personaje.class)))
                .thenReturn(ejemploPersonaje);

        mockMvc.perform(put("/api/personajes/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ejemploPersonaje)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(personajeService).existsById(1L);
        verify(personajeService).savePersonaje(any(Personaje.class));
    }

    @Test
    void actualizar_noExistente_deberiaRetornar404() throws Exception {
        when(personajeService.existsById(2L)).thenReturn(false);

        mockMvc.perform(put("/api/personajes/{id}", 2L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ejemploPersonaje)))
                .andExpect(status().isNotFound());

        verify(personajeService).existsById(2L);
        verify(personajeService, never()).savePersonaje(any());
    }

    @Test
    void eliminar_existente_deberiaRetornar204() throws Exception {
        when(personajeService.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/personajes/{id}", 1L))
                .andExpect(status().isNoContent());

        verify(personajeService).existsById(1L);
        verify(personajeService).deleteById(1L);
    }

    @Test
    void eliminar_noExistente_deberiaRetornar404() throws Exception {
        when(personajeService.existsById(3L)).thenReturn(false);

        mockMvc.perform(delete("/api/personajes/{id}", 3L))
                .andExpect(status().isNotFound());

        verify(personajeService).existsById(3L);
        verify(personajeService, never()).deleteById(anyLong());
    }
}
