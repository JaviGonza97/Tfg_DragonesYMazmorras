package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.dto.personajes.*;
import com.dyd.dungeonsydragonsv1.entidades.*;
import com.dyd.dungeonsydragonsv1.seguridad.UsuarioDetails;
import com.dyd.dungeonsydragonsv1.servicios.ClaseService;
import com.dyd.dungeonsydragonsv1.servicios.HechizoService;
import com.dyd.dungeonsydragonsv1.servicios.PersonajeService;
import com.dyd.dungeonsydragonsv1.servicios.RazaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<PersonajeFront> crear(@Valid @RequestBody PersonajeBack dto,
                                                @AuthenticationPrincipal UsuarioDetails userDetails) {
        Personaje p = new Personaje();
        p.setNombre(dto.getNombre());
        p.setRaza(Raza.builder().id(dto.getRazaId()).build());
        p.setClase(Clase.builder().id(dto.getClaseId()).build());
        p.setUsuario(userDetails.getUsuario());

        p.setRaza(Raza.builder().id(dto.getRazaId()).build());
        p.setClase(Clase.builder().id(dto.getClaseId()).build());

        if (dto.getHechizoIds() != null) {
            List<Hechizo> hz = dto.getHechizoIds().stream()
                    .map(id -> Hechizo.builder().id(id).build())
                    .toList();
            p.setHechizos(hz);
        }

        Personaje creado = personajeService.savePersonaje(p);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(personajeMapper.toFront(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonajeFront> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody PersonajeBack dto
    ) {
        if (!personajeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Personaje p = new Personaje();
        p.setId(id);
        p.setNombre(dto.getNombre());
        p.setRaza(Raza.builder().id(dto.getRazaId()).build());
        p.setClase(Clase.builder().id(dto.getClaseId()).build());
        if (dto.getEquipoIds() != null) {
            List<Equipo> eq = dto.getEquipoIds().stream()
                    .map(i -> Equipo.builder().id(i).build())
                    .toList();
            p.setEquipo(eq);
        }
        if (dto.getHechizoIds() != null) {
            List<Hechizo> hz = dto.getHechizoIds().stream()
                    .map(i -> Hechizo.builder().id(i).build())
                    .toList();
            p.setHechizos(hz);
        }

        Personaje actualizado = personajeService.savePersonaje(p);
        return ResponseEntity.ok(personajeMapper.toFront(actualizado));
    }

    @PostMapping("/filtrar")
    public ResponseEntity<List<PersonajeFront>> filtrar(@RequestBody PersonajeBack filtro) {
        String claseNombre = filtro.getClaseId() != null
                ? claseService.findById(filtro.getClaseId()).map(Clase::getNombre).orElse("")
                : "";
        String razaNombre = filtro.getRazaId() != null
                ? razaService.findById(filtro.getRazaId()).map(Raza::getNombre).orElse("")
                : "";

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

    //Para galeria de personajes

    @GetMapping("/mios")
    public ResponseEntity<List<PersonajeGaleriaDto>> obtenerMisPersonajes(Authentication authentication) {
        String username = authentication.getName();
        List<Personaje> personajesDelUsuario = personajeService.getPersonajesDelUsuario(username);
        return ResponseEntity.ok(personajeMapper.toGaleriaList(personajesDelUsuario));
    }

    @PutMapping("/{id}/equipo")
    public ResponseEntity<?> actualizarEquipo(
            @PathVariable Long id,
            @RequestBody List<EquipoBack> equipos,
            EquipoMapper equipoMapper
    ) {

        var personajeOpt = personajeService.findById(id);
        if (personajeOpt.isEmpty()) return ResponseEntity.notFound().build();
        Personaje personaje = personajeOpt.get();

        List<Equipo> nuevosEquipos = equipos.stream()
                .map(equipoMapper::toEntity)
                .toList();
        personaje.setEquipo(nuevosEquipos);
        personajeService.savePersonaje(personaje);

        return ResponseEntity.ok().build();
    }




}