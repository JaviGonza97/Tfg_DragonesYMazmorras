package com.dyd.dungeonsydragonsv1.controladores.testControllers;

import com.dyd.dungeonsydragonsv1.config.InitData;
import com.dyd.dungeonsydragonsv1.dto.personajes.ClaseFront;
import com.dyd.dungeonsydragonsv1.dto.personajes.ClaseMapper;
import com.dyd.dungeonsydragonsv1.entidades.Clase;
import com.dyd.dungeonsydragonsv1.servicios.ClaseService;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class ClaseRestControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper json;

    @MockitoBean
    InitData initData;
    @MockitoBean  ClaseService claseService;
    @MockitoBean  ClaseMapper  claseMapper;

    private Clase guerrero;
    private Clase hechicero;
    private ClaseFront frontGuerrero;
    private ClaseFront frontHechicero;
    private List<Clase> listaClases;
    private List<ClaseFront> listaFront;

    @BeforeEach
    void setUp() {
        guerrero  = Clase.builder().id(1L).nombre("Guerrero").build();
        hechicero = Clase.builder().id(2L).nombre("Hechicero").build();

        frontGuerrero  = ClaseFront.builder().id(1L).nombre("Guerrero").build();
        frontHechicero = ClaseFront.builder().id(2L).nombre("Hechicero").build();

        listaClases = List.of(guerrero, hechicero);
        listaFront  = List.of(frontGuerrero, frontHechicero);
    }


    @Test
    void obtenerTodas_devuelveListaConDosElementos() throws Exception {
        when(claseService.getAllClases()).thenReturn(listaClases);
        when(claseMapper.toFrontList(listaClases)).thenReturn(listaFront);

        mockMvc.perform(get("/api/clases").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nombre", equalTo("Guerrero")))
                .andExpect(jsonPath("$[1].nombre", equalTo("Hechicero")));
    }

    @Test
    void obtenerPorId_existente_devuelve200() throws Exception {
        when(claseService.findById(1L)).thenReturn(Optional.of(guerrero));
        when(claseMapper.toFront(guerrero)).thenReturn(frontGuerrero);

        mockMvc.perform(get("/api/clases/1").accept(MediaType.APPLICATION_JSON))
                .andDo(result -> System.out.println(
                        "Respuesta con el nomre de la clase y el id: " + result.getResponse().getContentAsString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre", equalTo("Guerrero")));
    }

    @Test
    void obtenerPorId_noExiste_devuelve404() throws Exception {
        when(claseService.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/clases/99").accept(MediaType.APPLICATION_JSON))
                .andDo(result -> System.out.println(
                        "Respuesta obtenerPorId inexistente: "
                                + result.getResponse().getStatus()))
                .andExpect(status().isNotFound());
    }
}
