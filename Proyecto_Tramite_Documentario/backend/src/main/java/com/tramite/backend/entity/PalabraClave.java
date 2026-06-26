package com.tramite.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "palabra_clave")
@Data
public class PalabraClave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_palabra")
    private Integer idPalabra;

    @Column(nullable = false, unique = true, length = 50)
    private String palabra;
}