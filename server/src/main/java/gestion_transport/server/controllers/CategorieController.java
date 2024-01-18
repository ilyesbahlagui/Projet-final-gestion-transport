package gestion_transport.server.controllers;

import java.util.stream.Stream;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gestion_transport.server.dto.CategorieDTO;
import gestion_transport.server.security.EmployeUserDetails;
import gestion_transport.server.services.CategorieService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping(path = "/categories", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class CategorieController {
    private CategorieService categorieService;

    @GetMapping
    public Stream<CategorieDTO> list(@AuthenticationPrincipal EmployeUserDetails employeUserDetails) {
        return categorieService.listCategories().map(CategorieDTO::new);
    }
    
    @GetMapping(path = "{id}")
    public CategorieDTO get(@AuthenticationPrincipal EmployeUserDetails employeUserDetails,
            @PathVariable int id) {
        return categorieService.readCategorie(id).toDTO();
    }
}
