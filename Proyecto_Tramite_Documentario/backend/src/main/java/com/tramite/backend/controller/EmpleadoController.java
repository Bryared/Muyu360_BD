package com.tramite.backend.controller;

import com.tramite.backend.entity.Area;
import com.tramite.backend.entity.Cargo;
import com.tramite.backend.entity.Empleado;
import com.tramite.backend.repository.AreaRepository;
import com.tramite.backend.repository.CargoRepository;
import com.tramite.backend.repository.EmpleadoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = "*")
public class EmpleadoController {

    private final EmpleadoRepository empleadoRepository;
    private final AreaRepository areaRepository;
    private final CargoRepository cargoRepository;

    public EmpleadoController(EmpleadoRepository empleadoRepository,
                              AreaRepository areaRepository,
                              CargoRepository cargoRepository) {
        this.empleadoRepository = empleadoRepository;
        this.areaRepository = areaRepository;
        this.cargoRepository = cargoRepository;
    }

    @GetMapping
    public ResponseEntity<List<Empleado>> listarEmpleados() {
        return ResponseEntity.ok(empleadoRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Empleado> crearEmpleado(@RequestBody Map<String, Object> body) {
        Empleado empleado = new Empleado();
        empleado.setNombre((String) body.get("nombre"));
        empleado.setApellidos((String) body.get("apellidos"));
        empleado.setEmail((String) body.get("email"));

        if (body.get("idArea") != null) {
            Integer idArea = ((Number) body.get("idArea")).intValue();
            Area area = areaRepository.findById(idArea).orElse(null);
            empleado.setArea(area);
        }

        if (body.get("idCargo") != null) {
            Integer idCargo = ((Number) body.get("idCargo")).intValue();
            Cargo cargo = cargoRepository.findById(idCargo).orElse(null);
            empleado.setCargo(cargo);
        }

        Empleado nuevo = empleadoRepository.save(empleado);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }
}
