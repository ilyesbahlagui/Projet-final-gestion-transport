package gestion_transport.server.controllers;

import lombok.AllArgsConstructor;

import java.util.stream.Stream;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import gestion_transport.server.dto.ReservationCovoiturageDTO;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.security.EmployeUserDetails;
import gestion_transport.server.services.ReservationCovoiturageService;

@RestController
@RequestMapping(path = "/reservations/covoiturage", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class ReservationCovoiturageController {
    private ReservationCovoiturageService reservationCovoiturageService;

    @GetMapping
    public Stream<ReservationCovoiturageDTO> list(@AuthenticationPrincipal EmployeUserDetails employeUserDetails) {
        Employe employe = employeUserDetails.getEmploye();
        return reservationCovoiturageService.listReservation(employe)
                .map(reservation -> reservation.toDTO());
    }

    @PostMapping
    public ReservationCovoiturageDTO add(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @RequestBody ReservationCovoiturageDTO reservationCovoiturageDTO) {
        Employe employe = employeUserDetails.getEmploye();
        return reservationCovoiturageService
                .addReservation(employe, reservationCovoiturageDTO)
                .toDTO();
    }

    @DeleteMapping(path = "{id}")
    public void delete(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable int id) {
        Employe employe = employeUserDetails.getEmploye();
        reservationCovoiturageService.deleteReservation(employe, id);
    }

    @GetMapping(path = "{id}")
    public ReservationCovoiturageDTO get(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @PathVariable int id) {
        Employe employe = employeUserDetails.getEmploye();
        return reservationCovoiturageService.readReservation(employe, id).toDTO();
    }

    @PostMapping("cancel/{id}")
    public ReservationCovoiturageDTO cancel(@AuthenticationPrincipal EmployeUserDetails employeUserDetails, @PathVariable int id)
    {
        Employe employe = employeUserDetails.getEmploye();
        return reservationCovoiturageService.cancel(employe, id).toDTO();
    }
}
