package gestion_transport.server.dto;

import gestion_transport.server.entities.Annonce;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationCovoiturage;
import gestion_transport.server.enums.StatutAnnonceEnum;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
public class ReservationCovoiturageDTO extends ReservationDTO {
    private int annonceID;

    public ReservationCovoiturageDTO(ReservationCovoiturage reservationCovoiturage) {
        super(reservationCovoiturage);
        this.annonceID = reservationCovoiturage.getAnnonce().getId();
    }

    public ReservationCovoiturage toEntity(Employe employe, Annonce annonce) {
        ReservationCovoiturage reservationCovoiturage = new ReservationCovoiturage();
        reservationCovoiturage.setId(this.getId());
        reservationCovoiturage.setEmploye(employe);
        reservationCovoiturage.setStatut(StatutAnnonceEnum.valueOf(this.getStatut()));
        reservationCovoiturage.setAnnonce(annonce);
        return reservationCovoiturage;
    }
}
