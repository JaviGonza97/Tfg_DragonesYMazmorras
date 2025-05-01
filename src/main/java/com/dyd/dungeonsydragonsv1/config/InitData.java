package com.dyd.dungeonsydragonsv1.config;


import com.dyd.dungeonsydragonsv1.entidades.Equipo;
import com.dyd.dungeonsydragonsv1.entidades.Habilidad;
import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.servicios.EquipoService;
import com.dyd.dungeonsydragonsv1.servicios.HabilidadService;
import com.dyd.dungeonsydragonsv1.servicios.HechizoService;
import com.dyd.dungeonsydragonsv1.servicios.PersonajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
@Component
@RequiredArgsConstructor
public class InitData {

    private final PersonajeService personajeService;
    private final HabilidadService habilidadService;
    private final EquipoService equipoService;
    private final HechizoService hechizoService;

    @Transactional
    @EventListener
    public void onApplicationEvent(ApplicationReadyEvent event) {
        initDatos();
    }

    public void initDatos() {
        List<Habilidad> habilidades = habilidadService.saveAll(Arrays.asList(
                Habilidad.builder().nombre("Fuerza").valor(18).build(),
                Habilidad.builder().nombre("Constitución").valor(16).build(),
                Habilidad.builder().nombre("Inteligencia").valor(20).build(),
                Habilidad.builder().nombre("Sabiduría").valor(18).build(),
                Habilidad.builder().nombre("Agilidad").valor(15).build(),
                Habilidad.builder().nombre("Resistencia al fuego").valor(25).build()
        ));

        List<Equipo> equipos = equipoService.saveAll(Arrays.asList(
                Equipo.builder().nombre("Espada de hierro").tipo("Arma").build(),
                Equipo.builder().nombre("Báculo mágico").tipo("Arma").build(),
                Equipo.builder().nombre("Escudo de hierro").tipo("Defensa").build(),
                Equipo.builder().nombre("Garra de dragón").tipo("Arma").build()
        ));

        List<Hechizo> hechizos = hechizoService.saveAll(Arrays.asList(
                Hechizo.builder().nombre("Bola de fuego").nivel("Alto").descripcion("Lanza una bola de fuego explosiva").build(),
                Hechizo.builder().nombre("Escudo mágico").nivel("Bajo").descripcion("Aumenta la defensa del personaje").build(),
                Hechizo.builder().nombre("Aliento de dragón").nivel("Máximo").descripcion("Llamas de fuego de drágon").build()
        ));

        Personaje guerrero1 = Personaje.builder()
                .nombre("Thorin")
                .raza("Enano")
                .clase("Guerrero")
                .habilidades(Arrays.asList(habilidades.get(0), habilidades.get(1)))  //Como ejemplo aqui se ve que este personaje posee dos habilidades fuerza y constitución
                .equipo(Arrays.asList(equipos.get(0), equipos.get(2)))  // Aqui se ve que posee como equipo una espada y un escudo pero este personaje no posee hechizos
                .build();

        Personaje guerrero2 = Personaje.builder()
                .nombre("Ragnar")
                .raza("Humano")
                .clase("Guerrero")
                .habilidades(Arrays.asList(habilidades.get(0), habilidades.get(4)))
                .equipo(Arrays.asList(equipos.get(0)))
                .build();

        Personaje mago1 = Personaje.builder()
                .nombre("Elrond")
                .raza("Elfo")
                .clase("Mago")
                .habilidades(Arrays.asList(habilidades.get(2), habilidades.get(3)))
                .equipo(Arrays.asList(equipos.get(1)))
                .hechizos(Arrays.asList(hechizos.get(0), hechizos.get(1)))
                .build();

        Personaje mago2 = Personaje.builder()
                .nombre("Merlín")
                .raza("Humano")
                .clase("Mago")
                .habilidades(Arrays.asList(habilidades.get(2), habilidades.get(3)))
                .equipo(Arrays.asList(equipos.get(1)))
                .hechizos(Arrays.asList(hechizos.get(1)))
                .build();

        Personaje mago3 = Personaje.builder()
                .nombre("Morgana")
                .raza("Elfa")
                .clase("Mago")
                .habilidades(Arrays.asList(habilidades.get(2), habilidades.get(3)))
                .equipo(Arrays.asList(equipos.get(1)))
                .hechizos(Arrays.asList(hechizos.get(0), hechizos.get(1)))
                .build();

        Personaje dragon1 = Personaje.builder()
                .nombre("Smaug")
                .raza("Dragón")
                .clase("Criatura")
                .habilidades(Arrays.asList(habilidades.get(5), habilidades.get(4)))
                .equipo(Arrays.asList(equipos.get(3)))
                .hechizos(Arrays.asList(hechizos.get(2)))
                .build();

        Personaje dragon2 = Personaje.builder()
                .nombre("Alduin")
                .raza("Dragón")
                .clase("Criatura")
                .habilidades(Arrays.asList(habilidades.get(5), habilidades.get(4)))
                .equipo(Arrays.asList(equipos.get(3)))
                .hechizos(Arrays.asList(hechizos.get(2)))
                .build();

        Personaje dragon3 = Personaje.builder()
                .nombre("Draco")
                .raza("Dragón")
                .clase("Criatura")
                .habilidades(Arrays.asList(habilidades.get(5), habilidades.get(4)))
                .equipo(Arrays.asList(equipos.get(3)))
                .hechizos(Arrays.asList(hechizos.get(2)))
                .build();

        personajeService.saveAll(Arrays.asList(
                guerrero1, guerrero2,
                mago1, mago2, mago3,
                dragon1, dragon2, dragon3
        ));
    }
}
