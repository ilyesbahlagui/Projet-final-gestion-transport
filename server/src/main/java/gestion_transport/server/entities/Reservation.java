package gestion_transport.server.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import gestion_transport.server.enums.StatutAnnonceEnum;
import gestion_transport.server.dto.ReservationDTO;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public abstract class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private int id;
    
    @NotNull
    @Column(nullable = false)
    private StatutAnnonceEnum statut = StatutAnnonceEnum.CONFIRME;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "employe_id")
    private Employe employe;

    public abstract ReservationDTO toDTO();
}
