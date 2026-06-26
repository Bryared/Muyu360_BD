package com.tramite.backend.service;

import com.tramite.backend.dto.DocumentoDTO;
import com.tramite.backend.dto.DocumentoRequestDTO;
import com.tramite.backend.entity.*;
import com.tramite.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final RemitenteRepository remitenteRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final EstadoDocumentoRepository estadoDocumentoRepository;
    private final PalabraClaveRepository palabraClaveRepository;

    public DocumentoService(DocumentoRepository documentoRepository,
                            RemitenteRepository remitenteRepository,
                            TipoDocumentoRepository tipoDocumentoRepository,
                            EstadoDocumentoRepository estadoDocumentoRepository,
                            PalabraClaveRepository palabraClaveRepository) {
        this.documentoRepository = documentoRepository;
        this.remitenteRepository = remitenteRepository;
        this.tipoDocumentoRepository = tipoDocumentoRepository;
        this.estadoDocumentoRepository = estadoDocumentoRepository;
        this.palabraClaveRepository = palabraClaveRepository;
    }

    @Transactional(readOnly = true)
    public Page<DocumentoDTO> listarDocumentos(Pageable pageable) {
        return documentoRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Transactional
    public DocumentoDTO registrarDocumento(DocumentoRequestDTO request) {
        Documento documento = new Documento();
        
        // Generar correlativo (Lógica simple para demostración: DOC-AÑO-ID)
        long count = documentoRepository.count() + 1;
        String correlativo = "DOC-" + LocalDateTime.now().getYear() + "-" + String.format("%04d", count);
        documento.setCorrelativo(correlativo);

        Remitente remitente = remitenteRepository.findById(request.getIdRemitente())
                .orElseThrow(() -> new IllegalArgumentException("Remitente no encontrado"));
        TipoDocumento tipoDoc = tipoDocumentoRepository.findById(request.getIdTipoDocumento())
                .orElseThrow(() -> new IllegalArgumentException("Tipo de documento no encontrado"));
        
        // Estado inicial = 1 (Pendiente) asumiendo que 1 es Pendiente según data.sql
        EstadoDocumento estadoDoc = estadoDocumentoRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("Estado inicial no encontrado"));

        documento.setRemitente(remitente);
        documento.setTipoDocumento(tipoDoc);
        documento.setEstadoDocumento(estadoDoc);
        documento.setMotivo(request.getMotivo());
        documento.setAsunto(request.getAsunto());
        documento.setRequiereRespuesta(request.getRequiereRespuesta() != null ? request.getRequiereRespuesta() : true);
        documento.setObservaciones(request.getObservaciones());
        documento.setArchivoUrl(request.getArchivoUrl());
        documento.setFechaRecepcion(LocalDateTime.now()); // Set manually since default is DB side

        if (request.getIdsPalabrasClave() != null && !request.getIdsPalabrasClave().isEmpty()) {
            Set<PalabraClave> palabras = new HashSet<>(palabraClaveRepository.findAllById(request.getIdsPalabrasClave()));
            documento.setPalabrasClave(palabras);
        }

        Documento saved = documentoRepository.save(documento);
        return mapToDTO(saved);
    }

    private DocumentoDTO mapToDTO(Documento documento) {
        DocumentoDTO dto = new DocumentoDTO();
        dto.setIdDocumento(documento.getIdDocumento());
        dto.setCorrelativo(documento.getCorrelativo());
        if(documento.getRemitente() != null) {
            dto.setIdRemitente(documento.getRemitente().getIdRemitente());
            dto.setNombreRemitente(documento.getRemitente().getNombreInstitucion());
        }
        if(documento.getTipoDocumento() != null) {
            dto.setIdTipoDocumento(documento.getTipoDocumento().getIdTipoDocumento());
            dto.setNombreTipoDocumento(documento.getTipoDocumento().getNombre());
        }
        if(documento.getEstadoDocumento() != null) {
            dto.setIdEstadoDocumento(documento.getEstadoDocumento().getIdEstadoDocumento());
            dto.setNombreEstadoDocumento(documento.getEstadoDocumento().getNombre());
        }
        dto.setFechaRecepcion(documento.getFechaRecepcion());
        dto.setMotivo(documento.getMotivo());
        dto.setAsunto(documento.getAsunto());
        dto.setRequiereRespuesta(documento.getRequiereRespuesta());
        dto.setObservaciones(documento.getObservaciones());
        dto.setArchivoUrl(documento.getArchivoUrl());
        
        if (documento.getPalabrasClave() != null) {
            List<String> palabras = documento.getPalabrasClave().stream()
                    .map(PalabraClave::getPalabra)
                    .collect(Collectors.toList());
            dto.setPalabrasClave(palabras);
        }
        return dto;
    }
}
