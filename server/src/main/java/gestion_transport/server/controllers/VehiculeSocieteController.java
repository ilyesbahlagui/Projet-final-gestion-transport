package gestion_transport.server.controllers;

import java.util.stream.Stream;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gestion_transport.server.dto.VehiculeSocieteDTO;
import gestion_transport.server.exceptions.ProfileUnauthorisedException;
import gestion_transport.server.security.EmployeUserDetails;
import gestion_transport.server.services.VehiculeSocieteService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping(path = "/vehicules", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class VehiculeSocieteController {
    private VehiculeSocieteService vehiculeSocieteService;

    @GetMapping
    public Stream<VehiculeSocieteDTO> list(@AuthenticationPrincipal EmployeUserDetails employeUserDetails) {
        return vehiculeSocieteService.listVehiculeSocietes().map(VehiculeSocieteDTO::new);
    }

    @PostMapping
    public VehiculeSocieteDTO add(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @RequestBody VehiculeSocieteDTO vehiculeSocieteDTO) {
        if (!employeUserDetails.isAdmin())
            throw ProfileUnauthorisedException.ADMIN_ONLY;

        return vehiculeSocieteService.addVehiculeSociete(vehiculeSocieteDTO).toDTO();
    }

    @DeleteMapping(path = "{id}")
    public void delete(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable int id) {
        if (!employeUserDetails.isAdmin())
            throw ProfileUnauthorisedException.ADMIN_ONLY;

        vehiculeSocieteService.deleteVehiculeSociete(id);
    }

    @PutMapping(path = "{id}")
    public VehiculeSocieteDTO update(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @PathVariable int id,
            @RequestBody VehiculeSocieteDTO vehiculeSocieteDTO) {
        if (!employeUserDetails.isAdmin())
            throw ProfileUnauthorisedException.ADMIN_ONLY;

        vehiculeSocieteDTO.setId(id);
        return vehiculeSocieteService.updateVehiculeSociete(vehiculeSocieteDTO).toDTO();
    }

    @GetMapping(path = "{id}")
    public VehiculeSocieteDTO get(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @PathVariable int id) {
        return vehiculeSocieteService.readVehiculeSociete(id).toDTO();
    }
}
