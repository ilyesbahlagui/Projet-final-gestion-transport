package gestion_transport.server.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import gestion_transport.server.services.EmployeUserDetailsService;

/**
 * Spring Security is a mess, but basically:
 * You create a service that implements UserDetailsService. This service is
 * responsible for looking up users into its database given a "username". The
 * resulting UserDetails object is created from the application user's type,
 * where the overridden methods return values from the underlying user.
 * The authentication manager/provider will then take the configured user
 * service and password encoder for handling authorisation on protected routes.
 * On a secured route, it will ask the user-agent for credentials (creating a
 * token, such as UsernamePasswordAuthenticationToken if using HTTP Basic auth),
 * then AuthenticationManager asks the UserDetailsService for UserDetails for
 * the given username, encodes the request password using the auth provider's
 * password encoder to compare the password stored in the UserDetails,
 * proceeding if they match.
 *
 * Related: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
 */
@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfiguration {
    private EmployeUserDetailsService employeUserDetailsService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        var provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(employeUserDetailsService);
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf().disable().cors().and() // Was causing issues with non-GET methods.
                                               // https://docs.spring.io/spring-security/site/docs/5.0.x/reference/html/csrf.html
                .authorizeHttpRequests(requests -> requests.mvcMatchers("/login").permitAll().anyRequest().authenticated())
                .sessionManagement(t -> t.sessionCreationPolicy(SessionCreationPolicy.ALWAYS));

        return httpSecurity.build();
    }

}
