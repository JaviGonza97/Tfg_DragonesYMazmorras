package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Clase;
import com.dyd.dungeonsydragonsv1.entidades.Estadistica;
import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.entidades.Raza;
import com.dyd.dungeonsydragonsv1.repositorios.HechizoRepository;
import com.dyd.dungeonsydragonsv1.repositorios.PersonajeRepository;
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
        // 1. Resolver Raza
        Long razaId = personaje.getRaza().getId();
        Raza raza = razaService.findById(razaId)
                .orElseThrow(() -> new RuntimeException("Raza no encontrada con ID: " + razaId));

        // 2. Resolver Clase
        Long claseId = personaje.getClase().getId();
        Clase clase = claseService.findById(claseId)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada con ID: " + claseId));

        // 3. Validar combinaciones prohibidas
        if (raza.getNombre().equalsIgnoreCase("ELFO") &&
                clase.getNombre().equalsIgnoreCase("GUERRERO")) {
            throw new IllegalArgumentException("Un Elfo no puede ser Guerrero.");
        }

        if (raza.getNombre().equalsIgnoreCase("ORCO") &&
                clase.getNombre().equalsIgnoreCase("PALADÍN")) {
            throw new IllegalArgumentException("Un Orco no puede ser Paladín.");
        }

        // 4. Calcular estadísticas
        Estadistica stats = estadisticaService.calcularEstadistica(raza, clase);
        stats.setPersonaje(personaje); // asociación bidireccional
        personaje.setEstadistica(stats);

        // 5. Asignar raza y clase
        personaje.setRaza(raza);
        personaje.setClase(clase);

        // 6. Guardar personaje
        return personajeRepository.save(personaje);
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
        if (!claseNombre.equalsIgnoreCase("HECHICERO")) {
            throw new IllegalArgumentException("Solo los personajes de clase HECHICERO pueden tener hechizos.");
        }

        personaje.getHechizos().add(hechizo);
        return personajeRepository.save(personaje);
    }

    public Personaje agregarHechizoExistente(Long personajeId, Long hechizoId) {
        Personaje personaje = personajeRepository.findById(personajeId)
                .orElseThrow(() -> new RuntimeException("Personaje no encontrado con ID: " + personajeId));

        if (!personaje.getClase().getNombre().equalsIgnoreCase("HECHICERO")) {
            throw new IllegalArgumentException("Solo los personajes de clase HECHICERO pueden tener hechizos.");
        }

        Hechizo hechizo = hechizoRepository.findById(hechizoId)
                .orElseThrow(() -> new RuntimeException("Hechizo no encontrado con ID: " + hechizoId));

        personaje.getHechizos().add(hechizo);
        return personajeRepository.save(personaje);
    }
}
