package com.tramite.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
public class DocumentoRequestDTO {
    @NotNull(message = "El remitente es obligatorio")
    private Integer idRemitente;

    @NotNull(message = "El tipo de documento es obligatorio")
    private Integer idTipoDocumento;

    @NotNull(message = "El motivo es obligatorio")
    @Size(min = 3, max = 255, message = "El motivo debe tener entre 3 y 255 caracteres")
    private String motivo;

    private String asunto;
    private Boolean requiereRespuesta;
    private String observaciones;
    private String archivoUrl;
    
    private List<Integer> idsPalabrasClave;
}
