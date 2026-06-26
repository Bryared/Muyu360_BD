package com.tramite.backend.controller;

import com.tramite.backend.entity.TipoDocumento;
import com.tramite.backend.repository.TipoDocumentoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-documento")
@CrossOrigin(origins = "*")
public class TipoDocumentoController {

    private final TipoDocumentoRepository tipoDocumentoRepository;

    public TipoDocumentoController(TipoDocumentoRepository tipoDocumentoRepository) {
        this.tipoDocumentoRepository = tipoDocumentoRepository;
    }

    @GetMapping
    public ResponseEntity<List<TipoDocumento>> listarTipos() {
        return ResponseEntity.ok(tipoDocumentoRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<TipoDocumento> crearTipo(@RequestBody TipoDocumento tipoDocumento) {
        TipoDocumento nuevo = tipoDocumentoRepository.save(tipoDocumento);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }
}
