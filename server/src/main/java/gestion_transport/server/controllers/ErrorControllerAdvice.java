package gestion_transport.server.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import gestion_transport.server.dto.ErrorDTO;
import gestion_transport.server.dto.errors.ProfileUnauthorisedErrorDTO;
import gestion_transport.server.exceptions.ProfileUnauthorisedException;

@ControllerAdvice
public class ErrorControllerAdvice {
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public @ResponseBody ErrorDTO handleException(RuntimeException exception) {
        exception.printStackTrace();
        return new ErrorDTO(exception);
    }

    /*
     * This is a global handler that returns a custom DTO.
     * We can specifically handle error DTOs per controller to have more control over the error type. We'll see if this advice interferes with per-controller handlers, in which case these handlers in here would have to go.
     */
    @ExceptionHandler(ProfileUnauthorisedException.class)
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public @ResponseBody ProfileUnauthorisedErrorDTO handleException(ProfileUnauthorisedException exception) {
        exception.printStackTrace();
        return new ProfileUnauthorisedErrorDTO(exception);
    }
}
