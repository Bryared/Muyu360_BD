package com.tramite.backend.controller;

import com.tramite.backend.dto.DocumentoDTO;
import com.tramite.backend.dto.DocumentoRequestDTO;
import com.tramite.backend.service.DocumentoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*") // Permitir peticiones desde el frontend (React)
public class DocumentoController {

    private final DocumentoService documentoService;

    public DocumentoController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    @GetMapping
    public ResponseEntity<Page<DocumentoDTO>> listarDocumentos(Pageable pageable) {
        Page<DocumentoDTO> documentos = documentoService.listarDocumentos(pageable);
        return ResponseEntity.ok(documentos);
    }

    @PostMapping
    public ResponseEntity<DocumentoDTO> registrarDocumento(@Valid @RequestBody DocumentoRequestDTO request) {
        DocumentoDTO nuevoDocumento = documentoService.registrarDocumento(request);
        return new ResponseEntity<>(nuevoDocumento, HttpStatus.CREATED);
    }
}
