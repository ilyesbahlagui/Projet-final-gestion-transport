package gestion_transport.server.controllers;

import lombok.AllArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import gestion_transport.server.dto.AnnonceDTO;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.security.EmployeUserDetails;
import gestion_transport.server.services.AnnonceService;

import java.util.stream.Stream;

@RestController
@RequestMapping(path = "/annonces", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class AnnonceController {
    private AnnonceService annonceService;

    @GetMapping
    public Stream<AnnonceDTO> list(@AuthenticationPrincipal EmployeUserDetails employeUserDetails) {
        Employe employe = employeUserDetails.getEmploye();
        return annonceService.listAnnonces(employe).map(AnnonceDTO::new);
    }

    @PostMapping
    public AnnonceDTO add(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @RequestBody AnnonceDTO annonceDTO) {
        Employe employe = employeUserDetails.getEmploye();
        return annonceService.addAnnonce(employe, annonceDTO).toDTO();
    }

    @DeleteMapping(path = "{id}")
    public void delete(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable int id) {
        Employe employe = employeUserDetails.getEmploye();
        annonceService.deleteAnnonce(employe, id);
    }

    @PutMapping(path = "{id}")
    public AnnonceDTO update(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable int id,
            @RequestBody AnnonceDTO absenceDTO) {
        Employe employe = employeUserDetails.getEmploye();
        absenceDTO.setId(id);
        return annonceService.updateAnnonce(employe, absenceDTO).toDTO();
    }

    @GetMapping(path = "{id}")
    public AnnonceDTO get(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable int id) {
        Employe employe = employeUserDetails.getEmploye();

        return annonceService.readAnnonce(employe, id).toDTO();
    }

    @PostMapping("cancel/{id}")
    public AnnonceDTO cancel(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable int id)
    {
        Employe employe = employeUserDetails.getEmploye();
        return annonceService.cancel(employe, id).toDTO();
    }
}
