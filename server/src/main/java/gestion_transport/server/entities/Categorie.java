package gestion_transport.server.entities;

import javax.validation.constraints.NotNull;

import gestion_transport.server.dto.CategorieDTO;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Entity
@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class Categorie {
    public Categorie(String label) {
        this.label = label;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    @Column(length = 50, nullable = false)
    private String label;

    public CategorieDTO toDTO() {
        CategorieDTO categorieDTO = new CategorieDTO();
        categorieDTO.setId(this.id);
        categorieDTO.setLabel(this.label);
        return categorieDTO;
    }
}