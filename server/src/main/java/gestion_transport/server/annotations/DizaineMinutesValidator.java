package gestion_transport.server.annotations;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class DizaineMinutesValidator implements ConstraintValidator<ValidDizaineMinutes, Instant> {

    @Override
    public void initialize(ValidDizaineMinutes constraintAnnotation) {
    }

    @Override
    public boolean isValid(Instant value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        LocalDateTime localDateTime = LocalDateTime.ofInstant(value, ZoneId.systemDefault());
        int minutes = localDateTime.getMinute();
        return minutes % 10 == 0;
    }
}