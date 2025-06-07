package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import com.dyd.dungeonsydragonsv1.repositorios.HechizoRepository;
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
class HechizoServiceTest {

    @Mock
    private HechizoRepository hechizoRepo;

    @InjectMocks
    private HechizoService service;

    private Hechizo fuego, escudo;

    @BeforeEach
    void setUp() {
        fuego = Hechizo.builder()
                .id(1L)
                .nombre("Bola de fuego")
                .nivel("Alto")
                .descripcion("Explosiva")
                .build();
        escudo = Hechizo.builder()
                .id(2L)
                .nombre("Escudo mágico")
                .nivel("Medio")
                .descripcion("Protección extra")
                .build();
    }

    @Test
    @DisplayName("Guardar nuevo hechizo exitoso")
    void guardarSiNoExiste_nuevo_devuelveGuardado() {
        // ninguno existe
        when(hechizoRepo.findByNombreIgnoreCase(fuego.getNombre()))
                .thenReturn(Optional.empty());
        when(hechizoRepo.save(fuego)).thenReturn(fuego);

        Hechizo out = service.guardarSiNoExiste(fuego);
        assertEquals(fuego, out);

        System.out.println("Hechizo guardado: " + out.getNombre());
    }

    @Test
    @DisplayName("Guardar hechizo existente lanza excepción")
    void guardarSiNoExiste_existente_lanzaIllegalArgument() {
        when(hechizoRepo.findByNombreIgnoreCase(fuego.getNombre()))
                .thenReturn(Optional.of(fuego));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.guardarSiNoExiste(fuego)
        );
        System.out.println("Excepción esperada: " + ex.getMessage());
    }

    @Test
    @DisplayName("Buscar por ID existente")
    void findById_existente_devuelveOptionalConHechizo() {
        when(hechizoRepo.findById(1L)).thenReturn(Optional.of(fuego));

        Optional<Hechizo> out = service.findById(1L);
        assertTrue(out.isPresent());
        System.out.println("Encontrado hechizo ID=1: " + out.get().getNombre());
    }

    @Test
    @DisplayName("Buscar por ID inexistente")
    void findById_inexistente_devuelveEmpty() {
        when(hechizoRepo.findById(99L)).thenReturn(Optional.empty());

        Optional<Hechizo> out = service.findById(99L);
        assertTrue(out.isEmpty());
        System.out.println("No se encontró hechizo para ID=99");
    }

    @Test
    @DisplayName("Obtener todos los hechizos")
    void getAllHechizos_devuelveLista() {
        List<Hechizo> todos = List.of(fuego, escudo);
        when(hechizoRepo.findAll()).thenReturn(todos);

        List<Hechizo> out = service.getAllHechizos();
        assertEquals(2, out.size());

        String nombres = out.stream()
                .map(Hechizo::getNombre)
                .collect(Collectors.joining(", "));
        System.out.println("Hechizos disponibles: " + nombres);
    }

    @Test
    @DisplayName("Buscar por nombre con coincidencias")
    void buscarPorNombre_conCoincidencia_devuelveLista() {
        when(hechizoRepo.findByNombreContainingIgnoreCase("bola"))
                .thenReturn(List.of(fuego));

        List<Hechizo> out = service.buscarPorNombre("bola");
        assertFalse(out.isEmpty());
        System.out.println("Resultados para 'bola': " +
                out.stream().map(Hechizo::getNombre).collect(Collectors.joining(", ")));
    }

    @Test
    @DisplayName("Buscar por nombre sin coincidencias")
    void buscarPorNombre_sinCoincidencia_devuelveEmpty() {
        when(hechizoRepo.findByNombreContainingIgnoreCase("xyz"))
                .thenReturn(List.of());

        List<Hechizo> out = service.buscarPorNombre("xyz");
        assertTrue(out.isEmpty());
        System.out.println("No se encontraron hechizos para 'xyz'");
    }

    @Test
    @DisplayName("Existe por ID verdadero y falso")
    void existsById_trueYfalse() {
        when(hechizoRepo.existsById(1L)).thenReturn(true);
        when(hechizoRepo.existsById(99L)).thenReturn(false);

        assertTrue(service.existsById(1L));
        System.out.println("Existe hechizo ID=1? " + service.existsById(1L));

        assertFalse(service.existsById(99L));
        System.out.println("Existe hechizo ID=99? " + service.existsById(99L));
    }

    @Test
    @DisplayName("Eliminar por ID invoca repositorio")
    void deleteById_invocaRepositorio() {
        // no lanza excepción
        doNothing().when(hechizoRepo).deleteById(2L);
        service.deleteById(2L);

        verify(hechizoRepo).deleteById(2L);
        System.out.println("Hechizo con ID=2 eliminado");
    }

    @Test
    @DisplayName("Guardar lista de hechizos y listar por IDs")
    void saveAllYfindAllById_devuelveListas() {
        List<Hechizo> lista = List.of(fuego, escudo);
        when(hechizoRepo.saveAll(lista)).thenReturn(lista);
        when(hechizoRepo.findAllById(List.of(1L, 2L))).thenReturn(lista);

        List<Hechizo> saved = service.saveAll(lista);
        List<Hechizo> byId = service.findAllById(List.of(1L, 2L));

        assertEquals(2, saved.size());
        assertEquals(2, byId.size());
        System.out.println("Guardados: " +
                saved.stream().map(Hechizo::getNombre).collect(Collectors.joining(", ")));
        System.out.println("Recuperados por ID: " +
                byId.stream().map(Hechizo::getNombre).collect(Collectors.joining(", ")));
    }
}
