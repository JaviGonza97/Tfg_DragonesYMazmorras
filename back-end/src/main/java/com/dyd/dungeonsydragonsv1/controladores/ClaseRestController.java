package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.dto.personajes.ClaseFront;
import com.dyd.dungeonsydragonsv1.dto.personajes.ClaseMapper;
import com.dyd.dungeonsydragonsv1.servicios.ClaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clases")
@RequiredArgsConstructor
public class ClaseRestController {

    private final ClaseService claseService;
    private final ClaseMapper claseMapper;

    @GetMapping
    public ResponseEntity<List<ClaseFront>> obtenerTodas() {
        return ResponseEntity.ok(
                claseMapper.toFrontList(claseService.getAllClases())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaseFront> obtenerPorId(@PathVariable Long id) {
        return claseService.findById(id)
                .map(claseMapper::toFront)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
