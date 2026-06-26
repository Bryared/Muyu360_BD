package com.tramite.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "documento")
@Data
public class Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Integer idDocumento;

    @Column(nullable = false, unique = true, length = 30)
    private String correlativo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_remitente", nullable = false)
    private Remitente remitente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_documento", nullable = false)
    private TipoDocumento tipoDocumento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado_documento", nullable = false)
    private EstadoDocumento estadoDocumento;

    @Column(name = "fecha_recepcion", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRecepcion;

    @Column(nullable = false, length = 255)
    private String motivo;

    @Column(columnDefinition = "TEXT")
    private String asunto;

    @Column(name = "requiere_respuesta", nullable = false)
    private Boolean requiereRespuesta = true;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "archivo_url", length = 500)
    private String archivoUrl;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "documento_palabra_clave",
        joinColumns = @JoinColumn(name = "id_documento"),
        inverseJoinColumns = @JoinColumn(name = "id_palabra")
    )
    private Set<PalabraClave> palabrasClave;
}