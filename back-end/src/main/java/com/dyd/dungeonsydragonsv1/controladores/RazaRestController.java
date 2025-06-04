package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.dto.personajes.RazaFront;
import com.dyd.dungeonsydragonsv1.dto.personajes.RazaMapper;
import com.dyd.dungeonsydragonsv1.servicios.RazaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/razas")
@RequiredArgsConstructor
public class RazaRestController {

    private final RazaService razaService;
    private final RazaMapper razaMapper;

    @GetMapping
    public ResponseEntity<List<RazaFront>> obtenerTodas() {
        return ResponseEntity.ok(
                razaMapper.toFrontList(razaService.getAllRazas())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RazaFront> obtenerPorId(@PathVariable Long id) {
        return razaService.findById(id)
                .map(razaMapper::toFront)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
