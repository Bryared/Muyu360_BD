package com.tramite.backend.controller;

import com.tramite.backend.entity.Derivacion;
import com.tramite.backend.entity.Documento;
import com.tramite.backend.entity.Empleado;
import com.tramite.backend.entity.EstadoDocumento;
import com.tramite.backend.repository.DerivacionRepository;
import com.tramite.backend.repository.DocumentoRepository;
import com.tramite.backend.repository.EmpleadoRepository;
import com.tramite.backend.repository.EstadoDocumentoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/derivaciones")
@CrossOrigin(origins = "*")
public class DerivacionController {

    private final DerivacionRepository derivacionRepository;
    private final DocumentoRepository documentoRepository;
    private final EmpleadoRepository empleadoRepository;
    private final EstadoDocumentoRepository estadoDocumentoRepository;

    public DerivacionController(DerivacionRepository derivacionRepository,
                                DocumentoRepository documentoRepository,
                                EmpleadoRepository empleadoRepository,
                                EstadoDocumentoRepository estadoDocumentoRepository) {
        this.derivacionRepository = derivacionRepository;
        this.documentoRepository = documentoRepository;
        this.empleadoRepository = empleadoRepository;
        this.estadoDocumentoRepository = estadoDocumentoRepository;
    }

    @GetMapping("/documento/{id}")
    public ResponseEntity<List<Derivacion>> listarPorDocumento(@PathVariable("id") Integer idDocumento) {
        return ResponseEntity.ok(derivacionRepository.findByDocumento_IdDocumento(idDocumento));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Derivacion> crearDerivacion(@RequestBody Map<String, Object> body) {
        Integer idDocumento = ((Number) body.get("idDocumento")).intValue();
        Integer emisorId = ((Number) body.get("emisorId")).intValue();
        Integer receptorId = ((Number) body.get("receptorId")).intValue();
        String instrucciones = (String) body.get("instrucciones");

        Documento documento = documentoRepository.findById(idDocumento)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado"));
        Empleado emisor = empleadoRepository.findById(emisorId)
                .orElseThrow(() -> new IllegalArgumentException("Empleado emisor no encontrado"));
        Empleado receptor = empleadoRepository.findById(receptorId)
                .orElseThrow(() -> new IllegalArgumentException("Empleado receptor no encontrado"));

        Derivacion derivacion = new Derivacion();
        derivacion.setDocumento(documento);
        derivacion.setEmisor(emisor);
        derivacion.setReceptor(receptor);
        derivacion.setInstrucciones(instrucciones);

        Derivacion nueva = derivacionRepository.save(derivacion);

        // Actualizar el estado del documento a "Derivado" (ID 2 según data.sql)
        EstadoDocumento estadoDerivado = estadoDocumentoRepository.findById(2)
                .orElseThrow(() -> new IllegalArgumentException("Estado 'Derivado' no encontrado"));
        documento.setEstadoDocumento(estadoDerivado);
        documentoRepository.save(documento);

        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }
}
