package gestion_transport.server.controllers;

import lombok.AllArgsConstructor;

import java.util.stream.Stream;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import gestion_transport.server.dto.ReservationProfessionnelleDTO;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.enums.ProfilEmployeEnum;
import gestion_transport.server.exceptions.ProfileUnauthorisedException;
import gestion_transport.server.security.EmployeUserDetails;
import gestion_transport.server.services.ChauffeurReservationService;

@RestController
@RequestMapping(path = "/reservations/chauffeur", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class ChauffeurReservationController {
    private ChauffeurReservationService chauffeurReservationService;
    
    @GetMapping("assigned")
    public Stream<ReservationProfessionnelleDTO> listAssigned(@AuthenticationPrincipal EmployeUserDetails employeUserDetails)
    {
        if (!employeUserDetails.isChauffeur())
            throw new ProfileUnauthorisedException(ProfilEmployeEnum.CHAUFFEUR);

        Employe chauffeur = employeUserDetails.getEmploye();
        return chauffeurReservationService.listAssigned(chauffeur).map(r -> r.toDTO());
    }

    @GetMapping("unassigned")
    public Stream<ReservationProfessionnelleDTO> listUnassigned(@AuthenticationPrincipal EmployeUserDetails employeUserDetails)
    {
        if (!employeUserDetails.isChauffeur())
            throw new ProfileUnauthorisedException(ProfilEmployeEnum.CHAUFFEUR);

        return chauffeurReservationService.listUnassigned().map(r -> r.toDTO());
    }

    @PostMapping("accept/{reservationID}")
    public ReservationProfessionnelleDTO accept(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable int reservationID)
    {
        if (!employeUserDetails.isChauffeur())
            throw new ProfileUnauthorisedException(ProfilEmployeEnum.CHAUFFEUR);

        var chauffeur = employeUserDetails.getEmploye();

        return chauffeurReservationService.accept(chauffeur, reservationID).toDTO();
    }
}
