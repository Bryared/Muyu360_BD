package com.tramite.backend.controller;

import com.tramite.backend.entity.TipoRespuesta;
import com.tramite.backend.repository.TipoRespuestaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-respuesta")
@CrossOrigin(origins = "*")
public class TipoRespuestaController {

    private final TipoRespuestaRepository tipoRespuestaRepository;

    public TipoRespuestaController(TipoRespuestaRepository tipoRespuestaRepository) {
        this.tipoRespuestaRepository = tipoRespuestaRepository;
    }

    @GetMapping
    public ResponseEntity<List<TipoRespuesta>> listarTiposRespuesta() {
        return ResponseEntity.ok(tipoRespuestaRepository.findAll());
    }
}
