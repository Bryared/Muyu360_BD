package com.tramite.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "estado_documento")
@Data
public class EstadoDocumento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_documento")
    private Integer idEstadoDocumento;

    @Column(nullable = false, length = 50)
    private String nombre;
}