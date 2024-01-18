package gestion_transport.server.entities;

import java.time.Instant;
import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import gestion_transport.server.dto.ReservationProfessionnelleDTO;

@Entity
@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class ReservationProfessionnelle extends Reservation {

    @NotNull
    @Column(nullable = false)
    private Instant dateDebut;

    @NotNull
    @Column(nullable = false)
    private Instant dateFin;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "vehicule_id")
    private VehiculeSociete vehicule;

    @ManyToOne
    @JoinColumn(name = "conducteur_id")
    private Employe conducteur;

    private boolean needsChauffeur;

    public ReservationProfessionnelleDTO toDTO() {
        ReservationProfessionnelleDTO dto = new ReservationProfessionnelleDTO();
        dto.setId(this.getId());
        dto.setEmployeID(this.getEmploye().getId());
        dto.setStatut(this.getStatut().name());
        dto.setDateDebut(this.getDateDebut());
        dto.setDateFin(this.getDateFin());
        if (this.getConducteur() != null) {
            dto.setConducteurID(Optional.of(this.getConducteur().getId()));
        }
        dto.setVehiculeID(this.getVehicule().getId());
        dto.setNeedsChauffeur(this.isNeedsChauffeur());
        return dto;
    }
}
