package gestion_transport.server.controllers;

import java.util.stream.Stream;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gestion_transport.server.dto.EmployeDTO;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.enums.ProfilEmployeEnum;
import gestion_transport.server.exceptions.ProfileUnauthorisedException;
import gestion_transport.server.security.EmployeUserDetails;
import gestion_transport.server.services.EmployeService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping(path = "/employe", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class EmployeController {
    private EmployeService employeService;

    @PostMapping("/{matricule}/chauffeur")
    public EmployeDTO setChauffeur(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable String matricule) {
        if (!employeUserDetails.isAdmin())
            throw ProfileUnauthorisedException.ADMIN_ONLY;

        Employe employe = employeService.readEmployeMatricule(matricule);
        if(employe.getProfil() == ProfilEmployeEnum.CHAUFFEUR || employe.getProfil() == ProfilEmployeEnum.ADMINISTRATEUR)
            throw new RuntimeException("Cet employé est déjà un chauffeur");
        
        employe.setProfil(ProfilEmployeEnum.CHAUFFEUR);
        return employeService.updateEmploye(employe).toDTO();
    }

    @GetMapping
    public Stream<EmployeDTO> list(@AuthenticationPrincipal EmployeUserDetails employeUserDetails ) {
        return employeService.listChauffeurs().map(EmployeDTO::new);
    }

    @GetMapping(path = "{id}")
    public EmployeDTO get(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable int id) {
        return employeService.readEmploye(id).toDTO();
    }

}
