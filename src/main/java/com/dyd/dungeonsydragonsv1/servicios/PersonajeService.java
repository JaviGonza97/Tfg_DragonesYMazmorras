package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.*;
import com.dyd.dungeonsydragonsv1.repositorios.HechizoRepository;
import com.dyd.dungeonsydragonsv1.repositorios.PersonajeRepository;
import com.dyd.dungeonsydragonsv1.repositorios.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonajeService {

    private final PersonajeRepository personajeRepository;
    private final RazaService razaService;
    private final ClaseService claseService;
    private final HechizoRepository hechizoRepository;
    private final EstadisticaService estadisticaService;
    private final EquipoService equipoService;
    private final HechizoService hechizoService;
    private final UsuarioRepository usuarioRepository;

    public List<Personaje> getAllPersonajes() {
        return personajeRepository.findAll();
    }

    public Optional<Personaje> findById(Long id) {
        return personajeRepository.findById(id);
    }

    public List<Personaje> findByNombre(String nombre) {
        return personajeRepository.findByNombre(nombre);
    }

    public Personaje savePersonaje(Personaje personaje) {
        // 1) Resuelvo raza y clase
        Raza raza = razaService.findById(personaje.getRaza().getId())
                .orElseThrow(() -> new RuntimeException("Raza no encontrada"));
        Clase clase = claseService.findById(personaje.getClase().getId())
                .orElseThrow(() -> new RuntimeException("Clase no encontrada"));
        personaje.setRaza(raza);
        personaje.setClase(clase);

        // 2) Calculo y asigno estadisticas
        Estadistica stats = estadisticaService.calcularEstadistica(raza, clase);
        stats.setPersonaje(personaje);
        personaje.setEstadistica(stats);

        // 3) Guardo primero el Personaje (sin equipos ni hechizos todavía)
        Personaje guardado = personajeRepository.save(personaje);

        // 4) Ahora asocio sus Equipos SIN duplicar asignaciones
        if (personaje.getEquipo() != null && !personaje.getEquipo().isEmpty()) {
            List<Long> equipoIds = personaje.getEquipo().stream()
                    .map(Equipo::getId)
                    .toList();
            List<Equipo> equipos = equipoService.findAllById(equipoIds);

            for (Equipo e : equipos) {
                // sólo asigno si está libre o ya apuntando a este mismo personaje
                if (e.getPersonaje() == null || e.getPersonaje().getId().equals(guardado.getId())) {
                    e.setPersonaje(guardado);
                    equipoService.guardarEquipo(e);
                }
            }
        }

        // 5) Ahora asocio sus Hechizos (si permite)
        boolean esDragon    = raza.getNombre().equalsIgnoreCase("DRAGON");
        boolean esHechicero = clase.getNombre().equalsIgnoreCase("HECHICERO");
        if (personaje.getHechizos() != null && !personaje.getHechizos().isEmpty()) {
            if (!esDragon && !esHechicero) {
                throw new IllegalArgumentException("Solo Dragones o Hechiceros pueden llevar hechizos");
            }
            List<Long> hechizoIds = personaje.getHechizos().stream()
                    .map(Hechizo::getId)
                    .toList();
            List<Hechizo> hechizos = hechizoService.findAllById(hechizoIds);
            guardado.setHechizos(hechizos);
        }

        // 6) Finalmente recargo para devolver todo ligado
        return personajeRepository.findById(guardado.getId()).orElse(guardado);
    }

    public List<Personaje> saveAll(List<Personaje> personajes) {
        personajes.forEach(this::savePersonaje);
        return personajes;
    }

    public List<Personaje> filtrarPorClaseYRaza(String claseNombre, String razaNombre) {
        return personajeRepository.filtrarPorClaseYRaza(claseNombre, razaNombre);
    }

    public boolean existsById(Long id) {
        return personajeRepository.existsById(id);
    }

    public void deleteById(Long id) {
        personajeRepository.deleteById(id);
    }

    public Personaje agregarHechizo(Long personajeId, Hechizo hechizo) {
        Personaje personaje = personajeRepository.findById(personajeId)
                .orElseThrow(() -> new RuntimeException("Personaje no encontrado con ID: " + personajeId));

        String claseNombre = personaje.getClase().getNombre();
        String razaNombre = personaje.getRaza().getNombre();

        if (!claseNombre.equalsIgnoreCase("HECHICERO") &&
                !razaNombre.equalsIgnoreCase("DRAGON")) {
            throw new IllegalArgumentException("Solo los HECHICEROS o los de raza DRAGON pueden tener hechizos.");
        }

        personaje.getHechizos().add(hechizo);
        return personajeRepository.save(personaje);
    }


    public Personaje agregarHechizoExistente(Long personajeId, Long hechizoId) {
        Personaje personaje = personajeRepository.findById(personajeId)
                .orElseThrow(() -> new RuntimeException("Personaje no encontrado con ID: " + personajeId));

        String claseNombre = personaje.getClase().getNombre();
        String razaNombre = personaje.getRaza().getNombre();

        if (!claseNombre.equalsIgnoreCase("HECHICERO") &&
                !razaNombre.equalsIgnoreCase("DRAGON")) {
            throw new IllegalArgumentException("Solo los HECHICEROS o los de raza DRAGON pueden tener hechizos.");
        }

        Hechizo hechizo = hechizoRepository.findById(hechizoId)
                .orElseThrow(() -> new RuntimeException("Hechizo no encontrado con ID: " + hechizoId));

        personaje.getHechizos().add(hechizo);
        return personajeRepository.save(personaje);
    }


    public Personaje eliminarHechizoDePersonaje(Long personajeId, Long hechizoId) {
        Personaje personaje = personajeRepository.findById(personajeId)
                .orElseThrow(() -> new RuntimeException("Personaje no encontrado con ID: " + personajeId));

        personaje.getHechizos().removeIf(h -> h.getId().equals(hechizoId));
        return personajeRepository.save(personaje);
    }

    public Personaje eliminarTodosHechizos(Long personajeId) {
        Personaje personaje = personajeRepository.findById(personajeId)
                .orElseThrow(() -> new RuntimeException("Personaje no encontrado con ID: " + personajeId));

        personaje.getHechizos().clear();
        return personajeRepository.save(personaje);
    }

    //Metodo para obtener los personajes que creo un usuario
    public List<Personaje> getPersonajesDelUsuario(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return personajeRepository.findByUsuario(usuario);
    }


}
