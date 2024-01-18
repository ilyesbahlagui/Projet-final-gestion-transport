package gestion_transport.server.controllers;

import lombok.AllArgsConstructor;

import java.util.stream.Stream;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import gestion_transport.server.dto.ReservationProfessionnelleDTO;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.security.EmployeUserDetails;
import gestion_transport.server.services.ReservationProfessionnelleService;

@RestController
@RequestMapping(path = "/reservations/professionnelle", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class ReservationProfessionnelleController {
    private ReservationProfessionnelleService reservationProfessionnelleService;

    @GetMapping
    public Stream<ReservationProfessionnelleDTO> list(@AuthenticationPrincipal EmployeUserDetails employeUserDetails) {
        Employe employe = employeUserDetails.getEmploye();
        return reservationProfessionnelleService.listReservations(employe)
                .map(reservation -> reservation.toDTO());
    }

    @GetMapping(path = "/vehicule/{id}")
    public Stream<ReservationProfessionnelleDTO> listVehicule(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @PathVariable int id) {
        return reservationProfessionnelleService.listReservationsVehicule(id)
                .map(reservation -> reservation.toDTO());
    }
    
    @PostMapping
    public ReservationProfessionnelleDTO add(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @RequestBody ReservationProfessionnelleDTO reservationProfessionnelleDTO) {
        Employe employe = employeUserDetails.getEmploye();
        return reservationProfessionnelleService
                .addReservation(employe, reservationProfessionnelleDTO)
                .toDTO();
    }

    @DeleteMapping(path = "{id}")
    public void delete(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable int id) {
        Employe employe = employeUserDetails.getEmploye();
        reservationProfessionnelleService.deleteReservation(employe, id);
    }

    @PutMapping(path = "{id}")
    public ReservationProfessionnelleDTO update(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @PathVariable int id,
            @RequestBody ReservationProfessionnelleDTO reservationProfessionnelleDTO) {
        Employe employe = employeUserDetails.getEmploye();
        reservationProfessionnelleDTO.setId(id);
        return reservationProfessionnelleService
            .updateReservation(employe,reservationProfessionnelleDTO)
            .toDTO();
    }

    @GetMapping(path = "{id}")
    public ReservationProfessionnelleDTO get(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @PathVariable int id) {
        Employe employe = employeUserDetails.getEmploye();
        return reservationProfessionnelleService.readReservation(employe, id).toDTO();
    }
}
