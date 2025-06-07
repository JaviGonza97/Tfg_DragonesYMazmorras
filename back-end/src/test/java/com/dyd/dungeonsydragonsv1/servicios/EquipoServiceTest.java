package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Equipo;
import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.repositorios.EquipoRepository;
import com.dyd.dungeonsydragonsv1.repositorios.PersonajeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EquipoServiceTest {

    @Mock
    private PersonajeRepository personajeRepo;

    @Mock
    private EquipoRepository equipoRepo;

    @InjectMocks
    private EquipoService service;

    private Equipo espada;
    private Personaje thorin;

    @BeforeEach
    void setUp() {
        thorin = Personaje.builder()
                .id(10L)
                .nombre("Thorin")
                .build();
        espada = Equipo.builder()
                .id(1L)
                .nombre("Espada de hierro")
                .build();
    }

    @Test
    @DisplayName("Asignar equipo a personaje existente")
    void asignarAEquipoExistente_valido() {
        when(equipoRepo.findById(1L)).thenReturn(Optional.of(espada));
        when(personajeRepo.findById(10L)).thenReturn(Optional.of(thorin));
        when(equipoRepo.save(espada)).thenReturn(espada);

        service.asignarAEquipoExistente(1L, 10L);

        verify(equipoRepo).save(espada);
        assertEquals(thorin, espada.getPersonaje());
        System.out.println("Equipo '" + espada.getNombre()
                + "' asignado a personaje '" + espada.getPersonaje().getNombre() + "'");
    }

    @Test
    @DisplayName("Asignar equipo inexistente lanza EntityNotFoundException")
    void asignarAEquipoExistente_equipoNoExiste() {
        when(equipoRepo.findById(99L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(
                EntityNotFoundException.class,
                () -> service.asignarAEquipoExistente(99L, 10L)
        );
        System.out.println("Excepción esperada: " + ex.getMessage());
    }

    @Test
    @DisplayName("Asignar a personaje inexistente lanza EntityNotFoundException")
    void asignarAEquipoExistente_personajeNoExiste() {
        when(equipoRepo.findById(1L)).thenReturn(Optional.of(espada));
        when(personajeRepo.findById(999L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(
                EntityNotFoundException.class,
                () -> service.asignarAEquipoExistente(1L, 999L)
        );
        System.out.println("Excepción esperada: " + ex.getMessage());
    }

    @Test
    @DisplayName("Guardar un equipo nuevo")
    void guardarEquipo_nuevo() {
        Equipo escudo = Equipo.builder()
                .nombre("Escudo de acero")
                .build();
        when(equipoRepo.save(escudo)).thenReturn(escudo);

        Equipo out = service.guardarEquipo(escudo);
        assertEquals("Escudo de acero", out.getNombre());
        System.out.println("Equipo creado: " + out.getNombre());
    }

    @Test
    void guardarEquipo_existenteSinAsignar() {
        Equipo respaldo = Equipo.builder()
                .id(2L)
                .nombre("Casco de plata")
                .build();
        when(equipoRepo.findById(2L)).thenReturn(Optional.of(respaldo));
        when(equipoRepo.save(respaldo)).thenReturn(respaldo);

        Equipo out = service.guardarEquipo(Equipo.builder()
                .id(2L)
                .nombre("Casco de plata")
                .build()
        );
        assertNull(out.getPersonaje());
        System.out.println("Equipo existente actualizado: " + out.getNombre());
    }

    @Test
    void guardarEquipo_existenteMismoPersonaje() {
        Equipo respaldo = Equipo.builder()
                .id(3L)
                .nombre("Armadura de mithril")
                .personaje(thorin)
                .build();
        when(equipoRepo.findById(3L)).thenReturn(Optional.of(respaldo));
        when(equipoRepo.save(respaldo)).thenReturn(respaldo);

        Equipo out = service.guardarEquipo(Equipo.builder()
                .id(3L)
                .nombre("Armadura de mithril")
                .personaje(thorin)
                .build()
        );
        assertEquals(thorin, out.getPersonaje());
        System.out.println("Equipo '" + out.getNombre()
                + "' sigue asignado a '" + out.getPersonaje().getNombre() + "'");
    }

    @Test
    @DisplayName("Actualizar equipo existente asignado a otro personaje lanza error")
    void guardarEquipo_asignadoAOtro() {
        Personaje bilbo = Personaje.builder().id(20L).nombre("Bilbo").build();
        Equipo respaldo = Equipo.builder()
                .id(4L)
                .nombre("Capa élfica")
                .personaje(bilbo)
                .build();
        when(equipoRepo.findById(4L)).thenReturn(Optional.of(respaldo));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.guardarEquipo(Equipo.builder()
                        .id(4L)
                        .nombre("Capa élfica")
                        .personaje(Personaje.builder().id(30L).nombre("Frodo").build())
                        .build()
                )
        );
        System.out.println("Excepción esperada: " + ex.getMessage());
    }

    @Test
    void buscarPorNombre_conResultados() {
        when(equipoRepo.findByNombreContainingIgnoreCase("hierro"))
                .thenReturn(List.of(espada));
        List<Equipo> out = service.buscarPorNombre("hierro");
        assertEquals(1, out.size());
        System.out.println("Resultados para 'hierro': "
                + out.stream().map(Equipo::getNombre).collect(Collectors.joining(", ")));
    }

    @Test
    @DisplayName("Buscar por nombre sin resultados")
    void buscarPorNombre_sinResultados() {
        when(equipoRepo.findByNombreContainingIgnoreCase("Javier"))
                .thenReturn(List.of());
        List<Equipo> out = service.buscarPorNombre("Javier");
        assertTrue(out.isEmpty());
        System.out.println("No se encontraron equipos para 'Javier'");
    }

    @Test
    @DisplayName("Guardar lista de equipos y buscar por IDs")
    void saveAllYfindAllById_devuelveListas() {
        Equipo casco = Equipo.builder().id(5L).nombre("Casco").build();
        List<Equipo> lista = List.of(espada, casco);
        when(equipoRepo.saveAll(lista)).thenReturn(lista);
        when(equipoRepo.findAllById(List.of(1L, 5L))).thenReturn(lista);

        List<Equipo> saved = service.saveAll(lista);
        List<Equipo> byId = service.findAllById(List.of(1L, 5L));
        assertEquals(2, saved.size());
        assertEquals(2, byId.size());

        System.out.println("Guardados: "
                + saved.stream().map(Equipo::getNombre).collect(Collectors.joining(", ")));
        System.out.println("Recuperados por ID: "
                + byId.stream().map(Equipo::getNombre).collect(Collectors.joining(", ")));
    }

    @Test
    @DisplayName("Buscar por ID existente e inexistente")
    void findById_existenteE_inexistente() {
        when(equipoRepo.findById(1L)).thenReturn(Optional.of(espada));
        when(equipoRepo.findById(99L)).thenReturn(Optional.empty());

        Optional<Equipo> ok = service.findById(1L);
        Optional<Equipo> none = service.findById(99L);
        assertTrue(ok.isPresent());
        assertTrue(none.isEmpty());

        System.out.println("Encontrado equipo ID=1: " + ok.get().getNombre());
        System.out.println("No encontrado equipo ID=99");
    }

    @Test
    @DisplayName("Obtener todos los equipos")
    void getAllEquipos_devuelveLista() {
        Equipo escudo = Equipo.builder().id(2L).nombre("Escudo").build();
        when(equipoRepo.findAll()).thenReturn(List.of(espada, escudo));

        List<Equipo> out = service.getAllEquipos();
        assertEquals(2, out.size());
        System.out.println("Equipos disponibles: "
                + out.stream().map(Equipo::getNombre).collect(Collectors.joining(", ")));
    }

    @Test
    void deleteById_invocaRepositorio() {
        doNothing().when(equipoRepo).deleteById(2L);
        service.deleteById(2L);
        verify(equipoRepo).deleteById(2L);
        System.out.println("Equipo con ID=2 eliminado");
    }

    @Test
    @DisplayName("ExistsById retorna verdadero y falso")
    void existsById_trueYfalse() {
        when(equipoRepo.existsById(1L)).thenReturn(true);
        when(equipoRepo.existsById(99L)).thenReturn(false);

        assertTrue(service.existsById(1L));
        assertFalse(service.existsById(99L));
        System.out.println("Existe equipo ID=1? " + service.existsById(1L));
        System.out.println("Existe equipo ID=99? " + service.existsById(99L));
    }
}
