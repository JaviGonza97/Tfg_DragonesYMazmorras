package com.dyd.dungeonsydragonsv1.dto.usuario;

import com.dyd.dungeonsydragonsv1.constraints.PasswordIgual;
import com.dyd.dungeonsydragonsv1.entidades.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@PasswordIgual
public class UsuarioDto {

    private Long id;

    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no es válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @NotBlank(message = "Debes confirmar la contraseña")
    private String passwordConfirm;

    private Set<Rol> roles;

}
