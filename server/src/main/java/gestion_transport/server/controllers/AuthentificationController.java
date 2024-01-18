package gestion_transport.server.controllers;

import gestion_transport.server.dto.AuthenticationData;
import gestion_transport.server.dto.EmployeDTO;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.security.EmployeUserDetails;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class AuthentificationController {
    private AuthenticationManager authenticationManager;

    @PostMapping(path = "login")
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeDTO login(@RequestBody AuthenticationData authenticationData) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                authenticationData.getEmail(),
                authenticationData.getPassword());
        Authentication authentication = authenticationManager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        Employe employe = ((EmployeUserDetails) authentication.getPrincipal()).getEmploye();
        EmployeDTO employeDTO = new EmployeDTO(employe);
        return employeDTO;
    }
}