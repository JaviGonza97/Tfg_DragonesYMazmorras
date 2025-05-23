package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.dto.personajes.*;
import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.servicios.ClaseService;
import com.dyd.dungeonsydragonsv1.servicios.HechizoService;
import com.dyd.dungeonsydragonsv1.servicios.PersonajeService;
import com.dyd.dungeonsydragonsv1.servicios.RazaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personajes")
@RequiredArgsConstructor
public class PersonajeRestController {

    private final PersonajeService personajeService;
    private final PersonajeMapper personajeMapper;
    private final ClaseService claseService;
    private final RazaService razaService;
    private final HechizoMapper hechizoMapper;

    @GetMapping
    public ResponseEntity<List<PersonajeFront>> obtenerTodos() {
        List<Personaje> personajes = personajeService.getAllPersonajes();
        return ResponseEntity.ok(personajeMapper.toFrontList(personajes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonajeFront> obtenerPorId(@PathVariable Long id) {
        return personajeService.findById(id)
                .map(personajeMapper::toFront)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<List<PersonajeFront>> buscarPorNombre(@PathVariable String nombre) {
        List<Personaje> personajes = personajeService.findByNombre(nombre);
        return personajes.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(personajeMapper.toFrontList(personajes));
    }

    @PostMapping
    public ResponseEntity<PersonajeFront> crear(@Valid @RequestBody PersonajeBack dto) {
        Personaje personaje = personajeMapper.toEntity(dto);
        Personaje creado = personajeService.savePersonaje(personaje);
        return ResponseEntity.status(201).body(personajeMapper.toFront(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonajeFront> actualizar(@PathVariable Long id,
                                                     @Valid @RequestBody PersonajeBack dto) {
        if (!personajeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Personaje personaje = personajeMapper.toEntity(dto);
        personaje.setId(id);
        Personaje actualizado = personajeService.savePersonaje(personaje);
        return ResponseEntity.ok(personajeMapper.toFront(actualizado));
    }

    @PostMapping("/filtrar")
    public ResponseEntity<List<PersonajeFront>> filtrar(@RequestBody PersonajeBack filtro) {
        String claseNombre = filtro.getClaseId() != null ? claseService.findById(filtro.getClaseId()).map(c -> c.getNombre()).orElse("") : "";
        String razaNombre  = filtro.getRazaId() != null  ? razaService.findById(filtro.getRazaId()).map(r -> r.getNombre()).orElse("")  : "";

        List<Personaje> resultados = personajeService.filtrarPorClaseYRaza(claseNombre, razaNombre);
        return resultados.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(personajeMapper.toFrontList(resultados));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!personajeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        personajeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/hechizos/nuevo")
    public ResponseEntity<PersonajeFront> agregarHechizoNuevo(@PathVariable Long id,
                                                              @Valid @RequestBody HechizoBack dto) {
        Hechizo hechizo = hechizoMapper.toEntity(dto); // Conversión del DTO a entidad
        Personaje personaje = personajeService.agregarHechizo(id, hechizo);
        return ResponseEntity.ok(personajeMapper.toFront(personaje));
    }

    @PostMapping("/{id}/hechizos/{hechizoId}")
    public ResponseEntity<PersonajeFront> agregarHechizoExistente(@PathVariable Long id,
                                                                  @PathVariable Long hechizoId) {
        Personaje personaje = personajeService.agregarHechizoExistente(id, hechizoId);
        return ResponseEntity.ok(personajeMapper.toFront(personaje));
    }

    // Elimina un hechizo específico de un personaje

    @DeleteMapping("/{id}/hechizos/{hechizoId}")
    public ResponseEntity<PersonajeFront> eliminarHechizoDePersonaje(@PathVariable Long id,
                                                                     @PathVariable Long hechizoId) {
        Personaje personaje = personajeService.eliminarHechizoDePersonaje(id, hechizoId);
        return ResponseEntity.ok(personajeMapper.toFront(personaje));
    }

    // Elimina todos los hechizos de un personaje

    @DeleteMapping("/{id}/hechizos")
    public ResponseEntity<PersonajeFront> eliminarTodosLosHechizos(@PathVariable Long id) {
        Personaje personaje = personajeService.eliminarTodosHechizos(id);
        return ResponseEntity.ok(personajeMapper.toFront(personaje));
    }


}
