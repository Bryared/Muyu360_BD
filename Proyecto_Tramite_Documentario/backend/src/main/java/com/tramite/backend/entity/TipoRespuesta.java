package com.tramite.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tipo_respuesta")
@Data
public class TipoRespuesta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_respuesta")
    private Integer idTipoRespuesta;

    @Column(nullable = false, length = 100)
    private String nombre;
}