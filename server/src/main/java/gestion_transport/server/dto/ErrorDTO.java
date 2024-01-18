package gestion_transport.server.dto;

import lombok.Getter;

@Getter
public class ErrorDTO {
    private String message;

    public ErrorDTO(RuntimeException exception) {
        message = exception.getMessage();
    }
}
