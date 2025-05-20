package com.dyd.dungeonsydragonsv1.config;

import com.dyd.dungeonsydragonsv1.entidades.*;
import com.dyd.dungeonsydragonsv1.servicios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InitData {

    private final RazaService razaService;
    private final ClaseService claseService;
    private final HabilidadService habilidadService;
    private final EquipoService equipoService;
    private final HechizoService hechizoService;
    private final PersonajeService personajeService;

    @Transactional
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationEvent(ApplicationReadyEvent event) {
        initDatos();
    }

    public void initDatos() {
        // 1) Crear Razas
        List<Raza> razas = razaService.saveAll(Arrays.asList(
                Raza.builder().nombre("Enano").build(),
                Raza.builder().nombre("Orco").build(),
                Raza.builder().nombre("Elfo").build(),
                Raza.builder().nombre("Humano").build(),
                Raza.builder().nombre("Dragón").build()
        ));
        Map<String, Raza> razaMap = razas.stream()
                .collect(Collectors.toMap(Raza::getNombre, r -> r));

        // 2) Crear Clases
        List<Clase> clases = claseService.saveAll(Arrays.asList(
                Clase.builder().nombre("Guerrero").build(),
                Clase.builder().nombre("Hechicero").build(),
                Clase.builder().nombre("Paladín").build()
        ));
        Map<String, Clase> claseMap = clases.stream()
                .collect(Collectors.toMap(Clase::getNombre, c -> c));

        // 3) Crear Habilidades
        List<Habilidad> habilidades = habilidadService.saveAll(Arrays.asList(
                Habilidad.builder().nombre("Fuerza").valor(18).build(),
                Habilidad.builder().nombre("Constitución").valor(16).build(),
                Habilidad.builder().nombre("Inteligencia").valor(20).build(),
                Habilidad.builder().nombre("Sabiduría").valor(18).build(),
                Habilidad.builder().nombre("Agilidad").valor(15).build(),
                Habilidad.builder().nombre("Resistencia al fuego").valor(25).build()
        ));

        // 4) Crear Equipo
        List<Equipo> equipos = equipoService.saveAll(Arrays.asList(
                Equipo.builder().nombre("Espada de hierro").tipo("Arma").build(),
                Equipo.builder().nombre("Báculo mágico").tipo("Arma").build(),
                Equipo.builder().nombre("Escudo de hierro").tipo("Defensa").build(),
                Equipo.builder().nombre("Garra de dragón").tipo("Arma").build()
        ));

        // 5) Crear Hechizos
        List<Hechizo> hechizos = hechizoService.saveAll(Arrays.asList(
                Hechizo.builder().nombre("Bola de fuego")
                        .nivel("Alto")
                        .descripcion("Lanza una bola de fuego explosiva")
                        .build(),
                Hechizo.builder().nombre("Escudo mágico")
                        .nivel("Bajo")
                        .descripcion("Aumenta la defensa del personaje")
                        .build(),
                Hechizo.builder().nombre("Aliento de dragón")
                        .nivel("Máximo")
                        .descripcion("Llamas de fuego de dragón")
                        .build()
        ));

        // 6) Construir Personajes
        List<Personaje> personajes = new ArrayList<>();

        personajes.add(Personaje.builder()
                .nombre("Thorin")
                .raza(razaMap.get("Enano"))
                .clase(claseMap.get("Guerrero"))
                .habilidades(Arrays.asList(habilidades.get(0), habilidades.get(1)))
                .equipo(Arrays.asList(equipos.get(0), equipos.get(2)))
                .build()
        );

        personajes.add(Personaje.builder()
                .nombre("Ragnar")
                .raza(razaMap.get("Humano"))
                .clase(claseMap.get("Guerrero"))
                .habilidades(Arrays.asList(habilidades.get(0), habilidades.get(4)))
                .equipo(Arrays.asList(equipos.get(0)))
                .build()
        );

        personajes.add(Personaje.builder()
                .nombre("Elrond")
                .raza(razaMap.get("Elfo"))
                .clase(claseMap.get("Hechicero"))
                .habilidades(Arrays.asList(habilidades.get(2), habilidades.get(3)))
                .equipo(Arrays.asList(equipos.get(1)))
                .hechizos(Arrays.asList(hechizos.get(0), hechizos.get(1)))
                .build()
        );

        personajes.add(Personaje.builder()
                .nombre("Merlín")
                .raza(razaMap.get("Humano"))
                .clase(claseMap.get("Hechicero"))
                .habilidades(Arrays.asList(habilidades.get(2), habilidades.get(3)))
                .equipo(Arrays.asList(equipos.get(1)))
                .hechizos(Arrays.asList(hechizos.get(1)))
                .build()
        );

        personajes.add(Personaje.builder()
                .nombre("Morgana")
                .raza(razaMap.get("Elfo"))
                .clase(claseMap.get("Hechicero"))
                .habilidades(Arrays.asList(habilidades.get(2), habilidades.get(3)))
                .equipo(Arrays.asList(equipos.get(1)))
                .hechizos(Arrays.asList(hechizos.get(0), hechizos.get(1)))
                .build()
        );

        personajes.add(Personaje.builder()
                .nombre("Smaug")
                .raza(razaMap.get("Dragón"))
                .clase(claseMap.get("Guerrero"))    // o si prefieres "Criatura", crea esa clase previamente
                .habilidades(Arrays.asList(habilidades.get(5), habilidades.get(4)))
                .equipo(Arrays.asList(equipos.get(3)))
                .hechizos(Arrays.asList(hechizos.get(2)))
                .build()
        );

        personajes.add(Personaje.builder()
                .nombre("Alduin")
                .raza(razaMap.get("Dragón"))
                .clase(claseMap.get("Guerrero"))
                .habilidades(Arrays.asList(habilidades.get(5), habilidades.get(4)))
                .equipo(Arrays.asList(equipos.get(3)))
                .hechizos(Arrays.asList(hechizos.get(2)))
                .build()
        );

        personajes.add(Personaje.builder()
                .nombre("Draco")
                .raza(razaMap.get("Dragón"))
                .clase(claseMap.get("Guerrero"))
                .habilidades(Arrays.asList(habilidades.get(5), habilidades.get(4)))
                .equipo(Arrays.asList(equipos.get(3)))
                .hechizos(Arrays.asList(hechizos.get(2)))
                .build()
        );

        // 7) Guardar todos los personajes
        personajes.forEach(personajeService::savePersonaje);
    }
}
