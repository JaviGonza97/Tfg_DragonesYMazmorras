package com.dyd.dungeonsydragonsv1.controladores.testControllers;

import com.dyd.dungeonsydragonsv1.DungeonsYDragonsV1Application;
import com.dyd.dungeonsydragonsv1.config.InitData;
import com.dyd.dungeonsydragonsv1.dto.personajes.HechizoBack;
import com.dyd.dungeonsydragonsv1.dto.personajes.HechizoFront;
import com.dyd.dungeonsydragonsv1.dto.personajes.HechizoMapper;
import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import com.dyd.dungeonsydragonsv1.servicios.HechizoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = DungeonsYDragonsV1Application.class)
@AutoConfigureMockMvc(addFilters = false)
class HechizoRestControllerTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper  json;

    @MockitoBean InitData initData;
    @MockitoBean HechizoService hechizoService;
    @MockitoBean HechizoMapper  hechizoMapper;

    private Hechizo bolaFuego;
    private HechizoFront frontBolaFuego;
    private HechizoBack  backBolaFuego;

    @BeforeEach
    void setUp() {
        bolaFuego = Hechizo.builder()
                .id(10L).nombre("Bola de fuego")
                .nivel("Alto")
                .descripcion("Lanza una bola de fuego explosiva")
                .build();

        frontBolaFuego = HechizoFront.builder()
                .id(10L).nombre("Bola de fuego")
                .nivel("Alto")
                .descripcion("Lanza una bola de fuego explosiva")
                .build();

        backBolaFuego = HechizoBack.builder()
                .nombre("Bola de fuego")
                .nivel("Alto")
                .descripcion("Lanza una bola de fuego explosiva")
                .build();
    }

    // GET /api/hechizos/buscar/{nombre}

    @Test
    void buscarPorNombre_encontrado_devuelveLista() throws Exception {

        when(hechizoService.buscarPorNombre("Bola"))
                .thenReturn(List.of(bolaFuego));
        when(hechizoMapper.toFrontList(List.of(bolaFuego)))
                .thenReturn(List.of(frontBolaFuego));

        mockMvc.perform(get("/api/hechizos/buscar/Bola")
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nombre", equalTo("Bola de fuego")))
                .andDo(r ->
                        System.out.println("Busqueda por nombre=" +
                                r.getResponse().getContentAsString()));
    }

    @Test
    void buscarPorNombre_sinResultados_devuelve204() throws Exception {

        when(hechizoService.buscarPorNombre("Inexistente"))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/hechizos/buscar/Inexistente")
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(r -> System.out.println(
                        "Aqui busco por el nombre= " + r.getResponse().getStatus()))
                .andExpect(status().isNoContent());
    }

    // GET /api/hechizos

    @Test
    void obtenerTodos_devuelveListaConUnElemento() throws Exception {

        when(hechizoService.getAllHechizos()).thenReturn(List.of(bolaFuego));
        when(hechizoMapper.toFrontList(any())).thenReturn(List.of(frontBolaFuego));

        mockMvc.perform(get("/api/hechizos").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nombre", equalTo("Bola de fuego")));
    }

    // GET /api/hechizos/{id}

    @Test
    void obtenerPorId_existente_devuelve200() throws Exception {

        when(hechizoService.findById(10L)).thenReturn(Optional.of(bolaFuego));
        when(hechizoMapper.toFront(bolaFuego)).thenReturn(frontBolaFuego);

        mockMvc.perform(get("/api/hechizos/10").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nivel", equalTo("Alto")));
    }

    @Test
    void obtenerPorId_noExiste_devuelve404() throws Exception {

        when(hechizoService.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/hechizos/999").accept(MediaType.APPLICATION_JSON))
                .andDo(r -> System.out.println("Obtenemos el hechizo por el id= " +
                        r.getResponse().getStatus()))
                .andExpect(status().isNotFound());
    }

    // POST /api/hechizos

    @Test
    void crear_hechizoNuevo_devuelve201() throws Exception {

        when(hechizoMapper.toEntity(backBolaFuego)).thenReturn(bolaFuego);
        when(hechizoService.guardarSiNoExiste(bolaFuego)).thenReturn(bolaFuego);
        when(hechizoMapper.toFront(bolaFuego)).thenReturn(frontBolaFuego);

        mockMvc.perform(post("/api/hechizos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(backBolaFuego)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre", equalTo("Bola de fuego")));
    }

    @Test
    void crear_hechizoDuplicado_devuelve400() throws Exception {

        when(hechizoMapper.toEntity(backBolaFuego)).thenReturn(bolaFuego);
        when(hechizoService.guardarSiNoExiste(bolaFuego))
                .thenThrow(new IllegalArgumentException("duplicado"));

        mockMvc.perform(post("/api/hechizos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(backBolaFuego)))
                .andDo(r -> System.out.println(
                        "Este hechizo ya existe= " + r.getResponse().getStatus()))
                .andExpect(status().isBadRequest());
    }

    // DELETE /api/hechizos/{id}
    @Test
    void eliminar_existente_devuelve204() throws Exception {

        when(hechizoService.existsById(10L)).thenReturn(true);

        mockMvc.perform(delete("/api/hechizos/10"))
                .andDo(r -> System.out.println(
                        "Eliminado el hechizo = "
                                + r.getResponse().getStatus()))
                .andExpect(status().isNoContent());
    }


}
