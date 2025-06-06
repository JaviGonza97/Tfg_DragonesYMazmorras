package com.dyd.dungeonsydragonsv1.config;

import com.dyd.dungeonsydragonsv1.entidades.*;
import com.dyd.dungeonsydragonsv1.entidades.enumerado.TipoEquipo;
import com.dyd.dungeonsydragonsv1.repositorios.ClaseRepository;
import com.dyd.dungeonsydragonsv1.repositorios.RazaRepository;
import com.dyd.dungeonsydragonsv1.repositorios.RolRepository;
import com.dyd.dungeonsydragonsv1.repositorios.UsuarioRepository;
import com.dyd.dungeonsydragonsv1.servicios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
@Profile("!test")
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
    private final ClaseRepository claseRepository;
    private final RazaRepository razaRepository;

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
            System.out.println("Usuario admin creado: admin / admin123");
        }
    }

    public void initDatos() {

        // Razas
        List<String> nombresRaza = List.of("Enano","Orco","Elfo","Humano","Dragon");

        List<Raza> razas = nombresRaza.stream()
                .map(n -> razaRepository.findByNombre(n)
                        .orElseGet(() -> razaService.saveRaza(Raza.builder()
                                .nombre(n).build())))
                .toList();

        Map<String,Raza> razaMap = razas.stream()
                .collect(Collectors.toMap(Raza::getNombre, r -> r));

        // Clases
        List<String> nombresClase = List.of("Guerrero","Hechicero","Paladin");

        List<Clase> clases = nombresClase.stream()
                .map(n -> claseRepository.findByNombre(n)
                        .orElseGet(() -> claseService.saveClase(Clase.builder()
                                .nombre(n).build())))
                .toList();

        Map<String,Clase> claseMap = clases.stream()
                .collect(Collectors.toMap(Clase::getNombre, c -> c));


        // Equipos (todos creados ANTES de asignarlos)
        List<Equipo> equipos = equipoService.saveAll(List.of(
                Equipo.builder().nombre("Espada de hierro").tipo(TipoEquipo.ARMA).build(),
                Equipo.builder().nombre("Baculo magico").tipo(TipoEquipo.ARMA).build(),
                Equipo.builder().nombre("Escudo de hierro").tipo(TipoEquipo.ARMADURA).build(),
                Equipo.builder().nombre("Garra de dragon").tipo(TipoEquipo.ARMA).build(),
                Equipo.builder().nombre("Pocion curativa").tipo(TipoEquipo.OBJETO).build(),
                Equipo.builder().nombre("Armadura de mithril").tipo(TipoEquipo.ARMADURA).build(),
                Equipo.builder().nombre("Casco de plata").tipo(TipoEquipo.ARMADURA).build()
        ));

        //Hechizos
        List<Hechizo> hechizos = hechizoService.saveAll(List.of(
                Hechizo.builder().nombre("Bola de fuego").nivel("Alto")
                        .descripcion("Lanza una bola de fuego explosiva").build(),
                Hechizo.builder().nombre("Escudo magico").nivel("Bajo")
                        .descripcion("Aumenta la defensa del personaje").build(),
                Hechizo.builder().nombre("Aliento de dragon").nivel("Maximo")
                        .descripcion("Llamas de fuego de dragon").build()
        ));

        // Personajes (asignación de equipos SIN repetir instancias)
        List<Personaje> personajes = new ArrayList<>();

        personajes.add(Personaje.builder()
                .nombre("Thorin")
                .raza(razaMap.get("Enano"))
                .clase(claseMap.get("Guerrero"))
                .equipo(List.of(equipos.get(0), equipos.get(2)))
                .build());

        personajes.add(Personaje.builder()
                .nombre("Ragnar")
                .raza(razaMap.get("Humano"))
                .clase(claseMap.get("Guerrero"))
                .equipo(List.of(equipos.get(1)))
                .build());

        personajes.add(Personaje.builder()
                .nombre("Elrond")
                .raza(razaMap.get("Elfo"))
                .clase(claseMap.get("Hechicero"))
                .equipo(List.of(equipos.get(3)))
                .hechizos(List.of(hechizos.get(0), hechizos.get(1)))
                .build());

        personajes.add(Personaje.builder()
                .nombre("Merlin")
                .raza(razaMap.get("Humano"))
                .clase(claseMap.get("Hechicero"))
                .equipo(List.of(equipos.get(4)))
                .hechizos(List.of(hechizos.get(1)))
                .build());

        personajes.add(Personaje.builder()
                .nombre("Morgana")
                .raza(razaMap.get("Elfo"))
                .clase(claseMap.get("Hechicero"))
                .equipo(List.of(equipos.get(6)))
                .hechizos(List.of(hechizos.get(0), hechizos.get(1)))
                .build());

        personajes.add(Personaje.builder()
                .nombre("Smaug")
                .raza(razaMap.get("Dragon"))
                .clase(claseMap.get("Guerrero"))
                .equipo(List.of(equipos.get(5)))
                .hechizos(List.of(hechizos.get(2)))
                .build());

        personajes.forEach(personajeService::savePersonaje);
    }
}
