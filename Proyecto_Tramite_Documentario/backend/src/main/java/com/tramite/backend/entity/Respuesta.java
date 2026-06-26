package com.tramite.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "respuesta")
@Data
public class Respuesta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_respuesta")
    private Integer idRespuesta;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_documento", nullable = false, unique = true)
    private Documento documento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_respuesta", nullable = false)
    private TipoRespuesta tipoRespuesta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado_autor", nullable = false)
    private Empleado autor;

    @Column(name = "fecha_respuesta", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRespuesta;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "archivo_adjunto_url", length = 500)
    private String archivoAdjuntoUrl;
}