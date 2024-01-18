package gestion_transport.server.annotations;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = DizaineMinutesValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidDizaineMinutes {
    String message() default "Les minutes doivent être des dizaines (10, 20, 30, etc.)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}