package com.dyd.dungeonsydragonsv1.config;

import com.dyd.dungeonsydragonsv1.entidades.*;
import com.dyd.dungeonsydragonsv1.entidades.enumerado.TipoEquipo;
import com.dyd.dungeonsydragonsv1.repositorios.RolRepository;
import com.dyd.dungeonsydragonsv1.repositorios.UsuarioRepository;
import com.dyd.dungeonsydragonsv1.servicios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InitData {

    private final RazaService razaService;
    private final ClaseService claseService;
    private final EquipoService equipoService;
    private final HechizoService hechizoService;
    private final PersonajeService personajeService;
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationEvent(ApplicationReadyEvent event) {
        crearRolesSiNoExisten();
        crearAdminPorDefecto();
        initDatos();
    }

    private void crearRolesSiNoExisten() {
        if (rolRepository.findByNombre("ADMIN").isEmpty()) {
            rolRepository.save(Rol.builder().nombre("ADMIN").build());
        }
        if (rolRepository.findByNombre("USUARIO").isEmpty()) {
            rolRepository.save(Rol.builder().nombre("USUARIO").build());
        }
    }

    private void crearAdminPorDefecto() {
        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Rol rolAdmin = rolRepository.findByNombre("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Rol ADMIN no encontrado"));
            Usuario admin = Usuario.builder()
                    .username("admin")
                    .email("admin@dyd.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(rolAdmin))
                    .build();
            usuarioRepository.save(admin);
            System.out.println("🛡 Usuario admin creado: admin / admin123");
        }
    }

    public void initDatos() {
        // ——— Razas y clases ———
        List<Raza> razas = razaService.saveAll(List.of(
                Raza.builder().nombre("Enano").build(),
                Raza.builder().nombre("Orco").build(),
                Raza.builder().nombre("Elfo").build(),
                Raza.builder().nombre("Humano").build(),
                Raza.builder().nombre("Dragon").build()
        ));
        Map<String, Raza> razaMap = razas.stream()
                .collect(Collectors.toMap(Raza::getNombre, r -> r));

        List<Clase> clases = claseService.saveAll(List.of(
                Clase.builder().nombre("Guerrero").build(),
                Clase.builder().nombre("Hechicero").build(),
                Clase.builder().nombre("Paladin").build()
        ));
        Map<String, Clase> claseMap = clases.stream()
                .collect(Collectors.toMap(Clase::getNombre, c -> c));

        // ——— Equipos (todos creados ANTES de asignarlos) ———
        List<Equipo> equipos = equipoService.saveAll(List.of(
                Equipo.builder().nombre("Espada de hierro").tipo(TipoEquipo.ARMA).build(),
                Equipo.builder().nombre("Baculo magico").tipo(TipoEquipo.ARMA).build(),
                Equipo.builder().nombre("Escudo de hierro").tipo(TipoEquipo.ARMADURA).build(),
                Equipo.builder().nombre("Garra de dragon").tipo(TipoEquipo.ARMA).build(),
                Equipo.builder().nombre("Pocion curativa").tipo(TipoEquipo.OBJETO).build(),
                Equipo.builder().nombre("Armadura de mithril").tipo(TipoEquipo.ARMADURA).build(),
                Equipo.builder().nombre("Casco de plata").tipo(TipoEquipo.ARMADURA).build()
        ));

        // ——— Hechizos ———
        List<Hechizo> hechizos = hechizoService.saveAll(List.of(
                Hechizo.builder().nombre("Bola de fuego").nivel("Alto")
                        .descripcion("Lanza una bola de fuego explosiva").build(),
                Hechizo.builder().nombre("Escudo magico").nivel("Bajo")
                        .descripcion("Aumenta la defensa del personaje").build(),
                Hechizo.builder().nombre("Aliento de dragon").nivel("Maximo")
                        .descripcion("Llamas de fuego de dragon").build()
        ));

        // ——— Personajes (asignación de equipos SIN repetir instancias) ———
        List<Personaje> personajes = new ArrayList<>();

        personajes.add(Personaje.builder()
                .nombre("Thorin")
                .raza(razaMap.get("Enano"))
                .clase(claseMap.get("Guerrero"))
                .equipo(List.of(equipos.get(0), equipos.get(2))) // Espada de hierro, Escudo de hierro
                .build());

        personajes.add(Personaje.builder()
                .nombre("Ragnar")
                .raza(razaMap.get("Humano"))
                .clase(claseMap.get("Guerrero"))
                .equipo(List.of(equipos.get(1)))                // Baculo magico
                .build());

        personajes.add(Personaje.builder()
                .nombre("Elrond")
                .raza(razaMap.get("Elfo"))
                .clase(claseMap.get("Hechicero"))
                .equipo(List.of(equipos.get(3)))                // Garra de dragon
                .hechizos(List.of(hechizos.get(0), hechizos.get(1)))
                .build());

        personajes.add(Personaje.builder()
                .nombre("Merlin")
                .raza(razaMap.get("Humano"))
                .clase(claseMap.get("Hechicero"))
                .equipo(List.of(equipos.get(4)))                // Pocion curativa
                .hechizos(List.of(hechizos.get(1)))
                .build());

        personajes.add(Personaje.builder()
                .nombre("Morgana")
                .raza(razaMap.get("Elfo"))
                .clase(claseMap.get("Hechicero"))
                .equipo(List.of(equipos.get(6)))                // Casco de plata
                .hechizos(List.of(hechizos.get(0), hechizos.get(1)))
                .build());

        personajes.add(Personaje.builder()
                .nombre("Smaug")
                .raza(razaMap.get("Dragon"))
                .clase(claseMap.get("Guerrero"))
                .equipo(List.of(equipos.get(5)))                // Armadura de mithril
                .hechizos(List.of(hechizos.get(2)))
                .build());

        personajes.forEach(personajeService::savePersonaje);
    }
}
