package com.tramite.backend.controller;

import com.tramite.backend.entity.Documento;
import com.tramite.backend.entity.Empleado;
import com.tramite.backend.entity.EstadoDocumento;
import com.tramite.backend.entity.Respuesta;
import com.tramite.backend.entity.TipoRespuesta;
import com.tramite.backend.repository.DocumentoRepository;
import com.tramite.backend.repository.EmpleadoRepository;
import com.tramite.backend.repository.EstadoDocumentoRepository;
import com.tramite.backend.repository.RespuestaRepository;
import com.tramite.backend.repository.TipoRespuestaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/respuestas")
@CrossOrigin(origins = "*")
public class RespuestaController {

    private final RespuestaRepository respuestaRepository;
    private final DocumentoRepository documentoRepository;
    private final TipoRespuestaRepository tipoRespuestaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final EstadoDocumentoRepository estadoDocumentoRepository;

    public RespuestaController(RespuestaRepository respuestaRepository,
                               DocumentoRepository documentoRepository,
                               TipoRespuestaRepository tipoRespuestaRepository,
                               EmpleadoRepository empleadoRepository,
                               EstadoDocumentoRepository estadoDocumentoRepository) {
        this.respuestaRepository = respuestaRepository;
        this.documentoRepository = documentoRepository;
        this.tipoRespuestaRepository = tipoRespuestaRepository;
        this.empleadoRepository = empleadoRepository;
        this.estadoDocumentoRepository = estadoDocumentoRepository;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Respuesta> crearRespuesta(@RequestBody Map<String, Object> body) {
        Integer idDocumento = ((Number) body.get("idDocumento")).intValue();
        Integer idTipoRespuesta = ((Number) body.get("idTipoRespuesta")).intValue();
        Integer idEmpleadoAutor = ((Number) body.get("idEmpleadoAutor")).intValue();
        String descripcion = (String) body.get("descripcion");

        Documento documento = documentoRepository.findById(idDocumento)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado"));
        TipoRespuesta tipoRespuesta = tipoRespuestaRepository.findById(idTipoRespuesta)
                .orElseThrow(() -> new IllegalArgumentException("Tipo de respuesta no encontrado"));
        Empleado autor = empleadoRepository.findById(idEmpleadoAutor)
                .orElseThrow(() -> new IllegalArgumentException("Empleado autor no encontrado"));

        Respuesta respuesta = new Respuesta();
        respuesta.setDocumento(documento);
        respuesta.setTipoRespuesta(tipoRespuesta);
        respuesta.setAutor(autor);
        respuesta.setDescripcion(descripcion);

        // 1. Guardar la respuesta
        Respuesta nueva = respuestaRepository.save(respuesta);

        // 2. Actualizar el estado del documento a "Respondido" (ID 4 según data.sql)
        EstadoDocumento estadoRespondido = estadoDocumentoRepository.findById(4)
                .orElseThrow(() -> new IllegalArgumentException("Estado 'Respondido' no encontrado"));
        documento.setEstadoDocumento(estadoRespondido);
        documentoRepository.save(documento);

        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }
}
