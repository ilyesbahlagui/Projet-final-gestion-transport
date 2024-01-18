package gestion_transport.server.dto;

import java.time.Instant;
import java.util.Optional;

import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationProfessionnelle;
import gestion_transport.server.entities.VehiculeSociete;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
public class ReservationProfessionnelleDTO extends ReservationDTO {
    private Instant dateDebut;
    private Instant dateFin;
    private Optional<Integer> conducteurID;
    private int vehiculeID;
    private boolean needsChauffeur;

    public ReservationProfessionnelleDTO(ReservationProfessionnelle reservationProfessionnelle) {
        super(reservationProfessionnelle);
        this.dateDebut = reservationProfessionnelle.getDateDebut();
        this.dateFin = reservationProfessionnelle.getDateFin();

        if (reservationProfessionnelle.getConducteur() != null)
            this.conducteurID = Optional.of(reservationProfessionnelle.getConducteur().getId());

        this.vehiculeID = reservationProfessionnelle.getVehicule().getId();
    }

    public ReservationProfessionnelle toEntity(Employe employe,
            VehiculeSociete vehiculeSociete,
            Employe conducteur) {
        ReservationProfessionnelle reservationProfessionnelle = new ReservationProfessionnelle();
        reservationProfessionnelle.setId(this.getId());
        reservationProfessionnelle.setEmploye(employe);
        reservationProfessionnelle.setDateDebut(this.getDateDebut());
        reservationProfessionnelle.setDateFin(this.getDateFin());
        reservationProfessionnelle.setConducteur(conducteur);
        reservationProfessionnelle.setVehicule(vehiculeSociete);
        reservationProfessionnelle.setNeedsChauffeur(needsChauffeur);
        return reservationProfessionnelle;
    }
}
