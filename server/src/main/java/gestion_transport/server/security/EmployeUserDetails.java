package gestion_transport.server.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import gestion_transport.server.entities.Employe;
import gestion_transport.server.enums.ProfilEmployeEnum;

import java.util.Collection;
import java.util.Collections;

public class EmployeUserDetails implements UserDetails {
    private Employe employe;

    public EmployeUserDetails(Employe employe) {
        this.employe = employe;
    }

    public Employe getEmploye() {
        return employe;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(employe.getClass().getTypeName()));
    }

    @Override
    public String getPassword() {
        return employe.getPassword();
    }

    @Override
    public String getUsername() {
        return employe.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public boolean hasProfile(ProfilEmployeEnum profile)
    {
        return this.getEmploye().getProfil().equals(profile);
    }

    public boolean isAdmin()
    {
        return hasProfile(ProfilEmployeEnum.ADMINISTRATEUR);
    }

    public boolean isChauffeur()
    {
        return hasProfile(ProfilEmployeEnum.CHAUFFEUR) || hasProfile(ProfilEmployeEnum.ADMINISTRATEUR);
    }
}
