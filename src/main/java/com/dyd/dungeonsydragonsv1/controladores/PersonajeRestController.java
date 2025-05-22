package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.servicios.PersonajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/personajes")
@RequiredArgsConstructor
public class PersonajeRestController {

    private final PersonajeService personajeService;

    @GetMapping
    public ResponseEntity<List<Personaje>> obtenerTodos() {
        List<Personaje> personajes = personajeService.getAllPersonajes();
        return ResponseEntity.ok(personajes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Personaje> obtenerPorId(@PathVariable Long id) {
        Optional<Personaje> personaje = personajeService.findById(id);
        return personaje
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<List<Personaje>> buscarPorNombre(@PathVariable String nombre) {
        List<Personaje> personajes = personajeService.findByNombre(nombre);
        return personajes.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(personajes);
    }

    @PostMapping
    public ResponseEntity<Personaje> crear(@RequestBody Personaje personaje) {
        Personaje nuevo = personajeService.savePersonaje(personaje);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevo);
    }

    /**
     * POST /api/personajes/filtrar
     * Filtra por clase y raza usando los nombres de las entidades anidadas.
     * Se espera un JSON como:
     * {
     *   "clase": { "nombre": "Guerrero" },
     *   "raza":  { "nombre": "Enano" }
     * }
     */


    @PostMapping("/filtrar")
    public ResponseEntity<List<Personaje>> filtrar(@RequestBody Personaje filtro) {
        String claseNombre = filtro.getClase()  != null ? filtro.getClase().getNombre() : "";
        String razaNombre  = filtro.getRaza()   != null ? filtro.getRaza().getNombre()   : "";
        List<Personaje> resultados = personajeService
                .filtrarPorClaseYRaza(claseNombre, razaNombre);
        return resultados.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(resultados);
    }

    /** PUT /api/personajes/{id} → actualizar (resuelve Raza y Clase) */
    @PutMapping("/{id}")
    public ResponseEntity<Personaje> actualizar(@PathVariable Long id,
                                                @RequestBody Personaje personaje) {
        if (!personajeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        personaje.setId(id);
        Personaje actualizado = personajeService.savePersonaje(personaje);
        return ResponseEntity.ok(actualizado);
    }

    /** DELETE /api/personajes/{id} → eliminar */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!personajeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        personajeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
