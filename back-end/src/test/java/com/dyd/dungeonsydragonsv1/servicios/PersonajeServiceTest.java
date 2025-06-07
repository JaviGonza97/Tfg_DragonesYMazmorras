package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.*;
import com.dyd.dungeonsydragonsv1.entidades.enumerado.TipoEquipo;
import com.dyd.dungeonsydragonsv1.repositorios.HechizoRepository;
import com.dyd.dungeonsydragonsv1.repositorios.PersonajeRepository;
import com.dyd.dungeonsydragonsv1.repositorios.UsuarioRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PersonajeServiceTest {

    @Mock PersonajeRepository personajeRepo;
    @Mock RazaService razaService;
    @Mock ClaseService claseService;
    @Mock EstadisticaService estadisticaService;
    @Mock EquipoService equipoService;
    @Mock HechizoService hechizoService;
    @Mock HechizoRepository hechizoRepo;
    @Mock UsuarioRepository usuarioRepo;

    @InjectMocks PersonajeService service;

    Raza raza;
    Clase clase;
    Estadistica stats;
    Personaje personajeBase;
    Equipo equipoLibre, equipoOcupado;
    Hechizo hechizo;

    @BeforeEach
    void inicializar() {
        raza = Raza.builder().id(1L).nombre("Enano").build();
        clase = Clase.builder().id(2L).nombre("Guerrero").build();
        stats = Estadistica.builder().fuerza(10).destreza(8).build();

        personajeBase = Personaje.builder()
                .id(42L)
                .nombre("Test")
                .raza(Raza.builder().id(1L).build())
                .clase(Clase.builder().id(2L).build())
                .build();

        equipoLibre = Equipo.builder()
                .id(100L).nombre("Espada").tipo(TipoEquipo.ARMA).personaje(null).build();
        equipoOcupado = Equipo.builder()
                .id(200L).nombre("Escudo").tipo(TipoEquipo.ARMADURA)
                .personaje(Personaje.builder().id(42L).build()).build();

        hechizo = Hechizo.builder().id(300L).nombre("Bola de fuego").build();
    }

    @Test
    @DisplayName("Guardar personaje")
    void debeGuardarPersonajeBasico() {
        when(razaService.findById(1L)).thenReturn(Optional.of(raza));
        when(claseService.findById(2L)).thenReturn(Optional.of(clase));
        when(estadisticaService.calcularEstadistica(raza, clase)).thenReturn(stats);
        when(personajeRepo.save(any())).thenAnswer(i -> {
            var p = i.getArgument(0, Personaje.class);
            p.setId(42L);
            return p;
        });
        when(personajeRepo.findById(42L)).thenReturn(Optional.of(personajeBase));

        Personaje result = service.savePersonaje(personajeBase);

        assertEquals("Test", result.getNombre());
        System.out.println("Personaje guardado con ID=" + result.getId());
    }

    @Test
    @DisplayName("Guardar sin raza da un error")
    void errorSiFaltaRaza() {
        when(razaService.findById(1L)).thenReturn(Optional.empty());
        Exception ex = assertThrows(RuntimeException.class,
                () -> service.savePersonaje(personajeBase));
        System.out.println("Error esperado: " + ex.getMessage());
    }

    @Test
    @DisplayName("Asignar equipos que sean validos")
    void asignaSoloEquiposValidos() {
        personajeBase.setEquipo(List.of(equipoLibre, equipoOcupado));
        when(razaService.findById(1L)).thenReturn(Optional.of(raza));
        when(claseService.findById(2L)).thenReturn(Optional.of(clase));
        when(estadisticaService.calcularEstadistica(raza, clase)).thenReturn(stats);
        when(personajeRepo.save(any())).thenReturn(personajeBase);
        when(personajeRepo.findById(42L)).thenReturn(Optional.of(personajeBase));
        when(equipoService.findAllById(List.of(100L,200L)))
                .thenReturn(List.of(equipoLibre, equipoOcupado));

        service.savePersonaje(personajeBase);

        assertEquals(42L, equipoLibre.getPersonaje().getId());
        assertEquals(42L, equipoOcupado.getPersonaje().getId());
        System.out.println("Equipos asignados correctamente");
    }

    @Test
    @DisplayName("Añadir hechizo")
    void permiteHechizoParaHechicero() {
        clase.setNombre("Hechicero");
        personajeBase.setHechizos(List.of(Hechizo.builder().id(300L).build()));

        when(razaService.findById(1L)).thenReturn(Optional.of(raza));
        when(claseService.findById(2L)).thenReturn(Optional.of(clase));
        when(estadisticaService.calcularEstadistica(raza, clase)).thenReturn(stats);
        when(personajeRepo.save(any())).thenReturn(personajeBase);
        when(personajeRepo.findById(42L)).thenReturn(Optional.of(personajeBase));
        when(hechizoService.findAllById(List.of(300L))).thenReturn(List.of(hechizo));

        Personaje out = service.savePersonaje(personajeBase);
        assertFalse(out.getHechizos().isEmpty());
        System.out.println("Hechizo añadido correctamente");
    }

    @Test
    @DisplayName("Eliminar hechizo existente")
    void eliminaHechizoExistente() {
        // Preparo un personaje con una lista mutable de hechizos
        List<Hechizo> hechizosIniciales = new ArrayList<>();
        hechizosIniciales.add(hechizo);
        personajeBase.setHechizos(hechizosIniciales);

        when(personajeRepo.findById(42L)).thenReturn(Optional.of(personajeBase));
        when(personajeRepo.save(personajeBase)).thenReturn(personajeBase);

        // Ejecutamos
        Personaje out = service.eliminarHechizoDePersonaje(42L, 300L);

        // Compruebo que se ha eliminado
        assertTrue(out.getHechizos().isEmpty());
        System.out.println("Hechizo eliminado correctamente: lista ahora = " + out.getHechizos());
    }

    @Test
    @DisplayName("Buscar por usuario")
    void buscaPersonajesPorUsuario() {
        Usuario user = Usuario.builder().username("neo").build();
        personajeBase.setNombre("Aragorn");  // Asegúrate de que personajeBase tenga un nombre
        when(usuarioRepo.findByUsername("neo")).thenReturn(Optional.of(user));
        when(personajeRepo.findByUsuario(user)).thenReturn(List.of(personajeBase));

        List<Personaje> out = service.getPersonajesDelUsuario("neo");
        assertEquals(1, out.size());
        String nombres = out.stream()
                .map(Personaje::getNombre)
                .collect(Collectors.joining(", "));
        System.out.println("Encontrados " + out.size() +
                " personajes para usuario 'neo'. Nombres: " + nombres);
    }
}
