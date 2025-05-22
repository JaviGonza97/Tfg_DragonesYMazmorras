package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.entidades.Raza;
import com.dyd.dungeonsydragonsv1.entidades.Clase;
import com.dyd.dungeonsydragonsv1.repositorios.PersonajeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class PersonajeServiceTest {

    @Mock
    private PersonajeRepository personajeRepository;

    @Mock
    private RazaService razaService;

    @Mock
    private ClaseService claseService;

    @InjectMocks
    private PersonajeService service;

    private Raza razaExistente;
    private Clase claseExistente;

    @BeforeEach
    void setUp() {
        razaExistente  = new Raza();  razaExistente.setId(10L);
        claseExistente = new Clase(); claseExistente.setId(20L);

        // Marcamos lenient para que Mockito no falle si en algunos tests no se usa esto
        lenient().when(razaService.findById(10L))
                .thenReturn(Optional.of(razaExistente));
        lenient().when(claseService.findById(20L))
                .thenReturn(Optional.of(claseExistente));
    }

    @Test
    void getAllPersonajes_delegatesToRepository() {
        List<Personaje> expected = List.of(new Personaje(), new Personaje());
        when(personajeRepository.findAll()).thenReturn(expected);

        List<Personaje> actual = service.getAllPersonajes();

        assertSame(expected, actual);
        verify(personajeRepository).findAll();
    }

    @Test
    void findById_delegatesToRepository() {
        Personaje p = new Personaje();
        when(personajeRepository.findById(42L)).thenReturn(Optional.of(p));

        Optional<Personaje> result = service.findById(42L);

        assertTrue(result.isPresent());
        assertSame(p, result.get());
        verify(personajeRepository).findById(42L);
    }

    @Test
    void findByNombre_delegatesToRepository() {
        List<Personaje> expected = List.of(new Personaje());
        when(personajeRepository.findByNombre("Foo")).thenReturn(expected);

        List<Personaje> actual = service.findByNombre("Foo");

        assertSame(expected, actual);
        verify(personajeRepository).findByNombre("Foo");
    }

    @Test
    void filtrarPorClaseYRaza_delegatesToRepository() {
        List<Personaje> expected = List.of(new Personaje());
        when(personajeRepository.filtrarPorClaseYRaza("G", "R")).thenReturn(expected);

        List<Personaje> actual = service.filtrarPorClaseYRaza("G", "R");

        assertSame(expected, actual);
        verify(personajeRepository).filtrarPorClaseYRaza("G", "R");
    }

    @Test
    void existsById_delegatesToRepository() {
        when(personajeRepository.existsById(5L)).thenReturn(true);

        boolean exists = service.existsById(5L);

        assertTrue(exists);
        verify(personajeRepository).existsById(5L);
    }

    @Test
    void deleteById_delegatesToRepository() {
        service.deleteById(7L);
        verify(personajeRepository).deleteById(7L);
    }

    @Test
    void savePersonaje_success() {
        Personaje toSave = new Personaje();
        toSave.setRaza( Raza.builder().id(10L).build() );
        toSave.setClase( Clase.builder().id(20L).build() );
        Personaje saved = new Personaje();
        when(personajeRepository.save(toSave)).thenReturn(saved);

        Personaje result = service.savePersonaje(toSave);

        // Verifica que setRaza y setClase hayan reemplazado los proxies
        assertSame(razaExistente, toSave.getRaza());
        assertSame(claseExistente, toSave.getClase());
        assertSame(saved, result);
        verify(razaService).findById(10L);
        verify(claseService).findById(20L);
        verify(personajeRepository).save(toSave);
    }

    @Test
    void savePersonaje_throwsIfRazaMissing() {
        // simulamos que no existe la raza
        when(razaService.findById(123L)).thenReturn(Optional.empty());
        Personaje p = new Personaje();
        p.setRaza(Raza.builder().id(123L).build());
        p.setClase(Clase.builder().id(20L).build());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                service.savePersonaje(p)
        );
        assertEquals("Raza no encontrada con ID: 123", ex.getMessage());
        verify(razaService).findById(123L);
        verifyNoMoreInteractions(personajeRepository, claseService);
    }

    @Test
    void savePersonaje_throwsIfClaseMissing() {
        // raza existe, pero clase no
        when(claseService.findById(999L)).thenReturn(Optional.empty());
        Personaje p = new Personaje();
        p.setRaza(Raza.builder().id(10L).build());
        p.setClase(Clase.builder().id(999L).build());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                service.savePersonaje(p)
        );
        assertEquals("Clase no encontrada con ID: 999", ex.getMessage());
        verify(razaService).findById(10L);
        verify(claseService).findById(999L);
        verifyNoMoreInteractions(personajeRepository);
    }

    @Test
    void saveAll_appliesSavePersonajeToEach() {
        Personaje a = spy(new Personaje()); a.setRaza(razaExistente); a.setClase(claseExistente);
        Personaje b = spy(new Personaje()); b.setRaza(razaExistente); b.setClase(claseExistente);
        List<Personaje> list = List.of(a, b);

        // Para no mockear cada save individual, dejamos que savePersonaje retorne el mismo
        doReturn(a).when(service).savePersonaje(a);
        doReturn(b).when(service).savePersonaje(b);

        List<Personaje> result = service.saveAll(list);

        assertEquals(list, result);
        verify(service).savePersonaje(a);
        verify(service).savePersonaje(b);
    }
}
