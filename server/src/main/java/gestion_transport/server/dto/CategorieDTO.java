package gestion_transport.server.dto;

import gestion_transport.server.entities.Categorie;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
public class CategorieDTO {
    private int id;
    private String label;
 
    public CategorieDTO(Categorie categorie) {
        this.id = categorie.getId();
        this.label = categorie.getLabel();
    }

    public Categorie toEntity(){
        Categorie categorie = new Categorie();
        categorie.setId(this.getId());
        categorie.setLabel(this.getLabel());
        return categorie;
    }
}
