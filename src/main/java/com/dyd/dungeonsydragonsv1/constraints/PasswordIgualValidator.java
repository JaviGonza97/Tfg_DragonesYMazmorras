package com.dyd.dungeonsydragonsv1.constraints;

import com.dyd.dungeonsydragonsv1.dto.usuario.UsuarioDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordIgualValidator implements ConstraintValidator<PasswordIgual, UsuarioDto> {

    @Override
    public boolean isValid(UsuarioDto dto, ConstraintValidatorContext context) {
        return dto.getPassword() != null
                && dto.getPasswordConfirm() != null
                && dto.getPassword().equals(dto.getPasswordConfirm());
    }
}
