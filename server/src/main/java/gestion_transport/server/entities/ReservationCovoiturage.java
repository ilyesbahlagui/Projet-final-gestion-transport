package gestion_transport.server.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import gestion_transport.server.dto.ReservationCovoiturageDTO;

@Entity
@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class ReservationCovoiturage extends Reservation {

    @NotNull
    @ManyToOne
    @JoinColumn(name = "annonce_id")
    private Annonce annonce;

    public ReservationCovoiturageDTO toDTO() {
        ReservationCovoiturageDTO dto = new ReservationCovoiturageDTO();
        dto.setId(this.getId());
        dto.setEmployeID(this.getEmploye().getId());
        dto.setStatut(this.getStatut().name());
        dto.setAnnonceID(this.getAnnonce().getId());
        return dto;
    }
}