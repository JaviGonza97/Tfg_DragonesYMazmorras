package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.entidades.Raza;
import com.dyd.dungeonsydragonsv1.entidades.Clase;
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

    public List<Personaje> getAllPersonajes() {
        return personajeRepository.findAll();
    }

    public Optional<Personaje> findById(Long id) {
        return personajeRepository.findById(id);
    }

    public List<Personaje> findByNombre(String nombre) {
        return personajeRepository.findByNombre(nombre);
    }

    /**
     * Guarda un Personaje, asegurándose de que Raza y Clase existan y se enlacen correctamente.
     */
    public Personaje savePersonaje(Personaje personaje) {
        // Resolver Raza
        Long razaId = personaje.getRaza().getId();
        Raza raza = razaService.findById(razaId)
                .orElseThrow(() -> new RuntimeException("Raza no encontrada con ID: " + razaId));
        // Resolver Clase
        Long claseId = personaje.getClase().getId();
        Clase clase = claseService.findById(claseId)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada con ID: " + claseId));

        personaje.setRaza(raza);
        personaje.setClase(clase);

        return personajeRepository.save(personaje);
    }

    /**
     * Guarda varios personajes, aplicando la misma lógica de resolución de Raza y Clase.
     */
    public List<Personaje> saveAll(List<Personaje> personajes) {
        personajes.forEach(this::savePersonaje);
        return personajes;
    }

    /**
     * Filtra personajes por nombre de clase y raza (Strings), haciendo join sobre las entidades.
     */
    public List<Personaje> filtrarPorClaseYRaza(String claseNombre, String razaNombre) {
        return personajeRepository.filtrarPorClaseYRaza(claseNombre, razaNombre);
    }

    public boolean existsById(Long id) {
        return personajeRepository.existsById(id);
    }

    public void deleteById(Long id) {
        personajeRepository.deleteById(id);
    }
}
