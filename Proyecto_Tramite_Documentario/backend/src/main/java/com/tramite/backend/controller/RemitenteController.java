package com.tramite.backend.controller;

import com.tramite.backend.entity.Remitente;
import com.tramite.backend.repository.RemitenteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/remitentes")
@CrossOrigin(origins = "*")
public class RemitenteController {

    private final RemitenteRepository remitenteRepository;

    public RemitenteController(RemitenteRepository remitenteRepository) {
        this.remitenteRepository = remitenteRepository;
    }

    @GetMapping
    public ResponseEntity<List<Remitente>> listarRemitentes() {
        return ResponseEntity.ok(remitenteRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Remitente> crearRemitente(@RequestBody Remitente remitente) {
        Remitente nuevo = remitenteRepository.save(remitente);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }
}
