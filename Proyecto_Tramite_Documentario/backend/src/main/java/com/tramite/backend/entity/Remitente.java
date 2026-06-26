package com.tramite.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "remitente")
@Data
public class Remitente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_remitente")
    private Integer idRemitente;

    @Column(name = "nombre_institucion", nullable = false, length = 200)
    private String nombreInstitucion;

    @Column(name = "tipo_entidad", nullable = false, length = 50)
    private String tipoEntidad;

    @Column(name = "ruc_dni", unique = true, length = 20)
    private String rucDni;

    @Column(name = "correo_contacto", length = 150)
    private String correoContacto;

    @Column(length = 50)
    private String telefono;
}