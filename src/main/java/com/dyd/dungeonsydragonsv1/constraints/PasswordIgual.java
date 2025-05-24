package com.dyd.dungeonsydragonsv1.constraints;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordIgualValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordIgual {
    String message() default "Las contraseñas no coinciden";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
