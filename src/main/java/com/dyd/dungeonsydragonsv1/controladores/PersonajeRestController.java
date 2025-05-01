package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.servicios.PersonajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/personajes")
@RequiredArgsConstructor
public class PersonajeRestController {

    private final PersonajeService personajeService;

    // Obtener todos los personajes
    @GetMapping
    public ResponseEntity<List<Personaje>> obtenerTodos() {
        List<Personaje> personajes = personajeService.findAll();
        return ResponseEntity.ok(personajes);
    }

    // Obtener un personaje por ID
    @GetMapping("/{id}")
    public ResponseEntity<Personaje> obtenerPorId(@PathVariable Long id) {
        Optional<Personaje> personaje = personajeService.findById(id);
        return personaje.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Buscar personajes por nombre
    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<List<Personaje>> buscarPorNombre(@PathVariable String nombre) {
        List<Personaje> personajes = personajeService.findByNombre(nombre);
        return personajes.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(personajes);
    }

    // Crear un nuevo personaje
    @PostMapping
    public ResponseEntity<Personaje> crear(@RequestBody Personaje personaje) {
        Personaje nuevoPersonaje = personajeService.save(personaje);
        return ResponseEntity.ok(nuevoPersonaje);
    }

    // Filtrar personajes por clase y raza
    @PostMapping("/filtrar")
    public ResponseEntity<List<Personaje>> filtrar(@RequestBody Personaje personajeFiltro) {
        List<Personaje> personajes = personajeService.filtrarPorClaseYRaza(personajeFiltro.getClase(), personajeFiltro.getRaza());
        return personajes.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(personajes);
    }

    // Actualizar un personaje existente
    @PutMapping("/{id}")
    public ResponseEntity<Personaje> actualizar(@PathVariable Long id, @RequestBody Personaje personaje) {
        if (!personajeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        personaje.setId(id);
        Personaje actualizado = personajeService.save(personaje);
        return ResponseEntity.ok(actualizado);
    }

    // Eliminar un personaje por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!personajeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        personajeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
