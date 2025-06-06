package com.dyd.dungeonsydragonsv1.controladores.testControllers;

import com.dyd.dungeonsydragonsv1.config.InitData;
import com.dyd.dungeonsydragonsv1.dto.personajes.EquipoBack;
import com.dyd.dungeonsydragonsv1.dto.personajes.EquipoFront;
import com.dyd.dungeonsydragonsv1.dto.personajes.EquipoMapper;
import com.dyd.dungeonsydragonsv1.entidades.Equipo;
import com.dyd.dungeonsydragonsv1.entidades.enumerado.TipoEquipo;
import com.dyd.dungeonsydragonsv1.servicios.EquipoService;
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

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración (MockMvc) para EquipoRestController.
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class EquipoRestControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper json;

    @MockitoBean InitData      initData;
    @MockitoBean EquipoService equipoService;
    @MockitoBean EquipoMapper  equipoMapper;

    private Equipo espada, baculo;
    private EquipoFront frontEspada, frontBaculo;
    private List<Equipo>      listaEntity;
    private List<EquipoFront> listaFront;
    private EquipoBack nuevoBack;

    @BeforeEach
    void setUp() {
        espada = Equipo.builder()
                .id(10L).nombre("Espada de hierro").tipo(TipoEquipo.ARMA)
                .build();

        baculo = Equipo.builder()
                .id(20L).nombre("Báculo mágico").tipo(TipoEquipo.ARMA)
                .build();

        frontEspada = EquipoFront.builder()
                .id(10L).nombre("Espada de hierro")
                .tipo(TipoEquipo.ARMA)
                .build();

        frontBaculo = EquipoFront.builder()
                .id(20L).nombre("Báculo mágico")
                .tipo(TipoEquipo.ARMA)
                .build();

        listaEntity = List.of(espada, baculo);
        listaFront  = List.of(frontEspada, frontBaculo);

        // DTO para crear un nuevo equipo
        nuevoBack = EquipoBack.builder()
                .nombre("Armadura de mithril")
                .tipo(TipoEquipo.ARMADURA)
                .build();
    }

    // GET /api/equipos
    @Test
    void obtenerTodos_devuelveLista() throws Exception {

        when(equipoService.getAllEquipos()).thenReturn(listaEntity);
        when(equipoMapper.toFrontList(listaEntity)).thenReturn(listaFront);

        mockMvc.perform(get("/api/equipos").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nombre", equalTo("Espada de hierro")))
                .andExpect(jsonPath("$[1].nombre", equalTo("Báculo mágico")));
    }

    //GET /api/equipos/buscar/{nombre}
    @Test
    void buscarPorNombre_conCoincidencias_devuelve200() throws Exception {

        when(equipoService.buscarPorNombre("Espada"))
                .thenReturn(List.of(espada));
        when(equipoMapper.toFrontList(List.of(espada)))
                .thenReturn(List.of(frontEspada));

        mockMvc.perform(get("/api/equipos/buscar/Espada"))
                .andDo(r -> System.out.println("Busqueda por el nombre: "
                        + r.getResponse().getContentAsString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nombre", equalTo("Espada de hierro")));
    }

    //GET /api/equipos/buscar/{nombre}
    @Test
    void buscarPorNombre_sinCoincidencias_devuelve204() throws Exception {

        when(equipoService.buscarPorNombre("Inexistente"))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/equipos/buscar/Inexistente"))
                .andDo(r -> System.out.println("Buscara por inexistencia:"
                        + r.getResponse().getStatus()))
                .andExpect(status().isNoContent());
    }

    // GET /api/equipos/{id}
    @Test
    void obtenerPorId_existente_devuelve200() throws Exception {

        when(equipoService.findById(10L)).thenReturn(Optional.of(espada));
        when(equipoMapper.toFront(espada)).thenReturn(frontEspada);

        mockMvc.perform(get("/api/equipos/10"))
                .andDo(r -> System.out.println("Obtiene el equipo por el id: "
                        + r.getResponse().getContentAsString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre", equalTo("Espada de hierro")));
    }
}

