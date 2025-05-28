package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.dto.personajes.HechizoBack;
import com.dyd.dungeonsydragonsv1.dto.personajes.HechizoFront;
import com.dyd.dungeonsydragonsv1.dto.personajes.HechizoMapper;
import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import com.dyd.dungeonsydragonsv1.servicios.HechizoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hechizos")
@RequiredArgsConstructor
public class HechizoRestController {

    private final HechizoService hechizoService;
    private final HechizoMapper hechizoMapper;

    // busca hechizo por su nombre
    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<List<HechizoFront>> buscarPorNombre(@PathVariable String nombre) {
        List<Hechizo> resultados = hechizoService.buscarPorNombre(nombre);
        return resultados.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(hechizoMapper.toFrontList(resultados));
    }

    @GetMapping
    public ResponseEntity<List<HechizoFront>> obtenerTodos() {
        List<Hechizo> hechizos = hechizoService.getAllHechizos();
        return ResponseEntity.ok(hechizoMapper.toFrontList(hechizos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HechizoFront> obtenerPorId(@PathVariable Long id) {
        return hechizoService.findById(id)
                .map(hechizoMapper::toFront)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST nuevo hechizo (valida que no exista)
    @PostMapping
    public ResponseEntity<HechizoFront> crear(@Valid @RequestBody HechizoBack dto) {
        Hechizo hechizo = hechizoMapper.toEntity(dto);
        Hechizo guardado = hechizoService.guardarSiNoExiste(hechizo);
        return ResponseEntity.status(201).body(hechizoMapper.toFront(guardado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!hechizoService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        hechizoService.deleteById(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

}


