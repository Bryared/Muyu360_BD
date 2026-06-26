package com.tramite.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DocumentoDTO {
    private Integer idDocumento;
    private String correlativo;
    private Integer idRemitente;
    private String nombreRemitente;
    private Integer idTipoDocumento;
    private String nombreTipoDocumento;
    private Integer idEstadoDocumento;
    private String nombreEstadoDocumento;
    private LocalDateTime fechaRecepcion;
    private String motivo;
    private String asunto;
    private Boolean requiereRespuesta;
    private String observaciones;
    private String archivoUrl;
    private List<String> palabrasClave;
}
