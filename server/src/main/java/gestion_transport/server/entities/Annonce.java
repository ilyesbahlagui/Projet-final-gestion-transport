package gestion_transport.server.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.Instant;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.Future;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import gestion_transport.server.annotations.ValidDizaineMinutes;
import gestion_transport.server.dto.AnnonceDTO;
import gestion_transport.server.enums.StatutAnnonceEnum;

@Entity
@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class Annonce {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    @Column(nullable = false)
    private String adresseDepart;

    @NotNull
    @Column(nullable = false)
    private String adresseDestination;

    @NotNull
    @Column(length = 10, nullable = false)
    private String immatriculation;

    @NotNull
    @Column(length = 50, nullable = false)
    private String marque;

    @NotNull
    @Column(length = 50, nullable = false)
    private String modele;

    @NotNull
    @Min(value = 1, message = "Le nombre de places disponibles doit être supérieur à zéro")
    @Max(value = 20, message = "Le nombre de places disponibles doit être inferieur ou égal à 20")
    @Column(nullable = false)
    private int placeDisponible;

    @NotNull
    @Column(nullable = false)
    @ValidDizaineMinutes
    @Future(message = "La date et l'heure ne peuvent être antérieure à aujourd'hui.")
    private Instant date;

    @NotNull
    @Column(nullable = false)
    private StatutAnnonceEnum statut;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "employe_id")
    private Employe employe;

    @OneToMany(mappedBy = "annonce", fetch = FetchType.EAGER)
    private Set<ReservationCovoiturage> reservations;

    public AnnonceDTO toDTO() {
        AnnonceDTO dto = new AnnonceDTO();
        dto.setId(this.getId());
        dto.setAdresseDepart(this.getAdresseDepart());
        dto.setAdresseDestination(this.getAdresseDestination());
        dto.setImmatriculation(this.getImmatriculation());
        dto.setMarque(this.getMarque());
        dto.setModele(this.getModele());
        dto.setPlaceDisponible(this.getPlaceDisponible());
        dto.setDate(this.getDate());
        dto.setStatut(this.getStatut().name());
        dto.setEmployeID(this.getEmploye().getId());
        return dto;
    }
}
