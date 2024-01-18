package gestion_transport.server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationData {
    private String email;
    private String password;
}
