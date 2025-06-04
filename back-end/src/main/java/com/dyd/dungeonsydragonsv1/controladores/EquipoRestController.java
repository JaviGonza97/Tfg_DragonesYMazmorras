package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.dto.personajes.EquipoBack;
import com.dyd.dungeonsydragonsv1.dto.personajes.EquipoFront;
import com.dyd.dungeonsydragonsv1.dto.personajes.EquipoMapper;
import com.dyd.dungeonsydragonsv1.entidades.Equipo;
import com.dyd.dungeonsydragonsv1.servicios.EquipoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@RequiredArgsConstructor
public class EquipoRestController {

    private final EquipoService equipoService;
    private final EquipoMapper equipoMapper;

    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<List<EquipoFront>> buscarPorNombre(@PathVariable String nombre) {
        List<Equipo> resultados = equipoService.buscarPorNombre(nombre);
        return resultados.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(equipoMapper.toFrontList(resultados));
    }

    @GetMapping
    public ResponseEntity<List<EquipoFront>> obtenerTodos() {
        List<Equipo> equipos = equipoService.getAllEquipos();
        return ResponseEntity.ok(equipoMapper.toFrontList(equipos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipoFront> obtenerPorId(@PathVariable Long id) {
        return equipoService.findById(id)
                .map(equipoMapper::toFront)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EquipoFront> crear(@Valid @RequestBody EquipoBack dto) {
        Equipo equipo = equipoMapper.toEntity(dto);
        Equipo creado = equipoService.guardarEquipo(equipo); // ahora funcionará correctamente
        return ResponseEntity.status(201).body(equipoMapper.toFront(creado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!equipoService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        equipoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/asignar-personaje/{personajeId}")
    public ResponseEntity<?> asignarPersonaje(
            @PathVariable Long id,
            @PathVariable Long personajeId) {
        equipoService.asignarAEquipoExistente(id, personajeId);
        return ResponseEntity.ok().build();
    }



}
