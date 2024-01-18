package gestion_transport.server.dto;

import gestion_transport.server.entities.Reservation;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
public class ReservationDTO {

    private int id;
    private String statut;
    private int employeID;

    public ReservationDTO(Reservation reservation) {
        this.id = reservation.getId();
        this.statut = reservation.getStatut().name();
        this.employeID = reservation.getEmploye().getId();
    }
}
