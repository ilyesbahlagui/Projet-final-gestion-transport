package gestion_transport.server.services;

import lombok.AllArgsConstructor;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gestion_transport.server.entities.Employe;
import gestion_transport.server.repositories.EmployeRepository;
import gestion_transport.server.security.EmployeUserDetails;

@Service
@Transactional
@AllArgsConstructor
public class EmployeUserDetailsService implements UserDetailsService {
    private EmployeRepository employeRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Employe> employe = employeRepository.findByEmail(email);
        return new EmployeUserDetails(
                employe.orElseThrow(() -> new UsernameNotFoundException("Could not find the user.")));
    }
}
