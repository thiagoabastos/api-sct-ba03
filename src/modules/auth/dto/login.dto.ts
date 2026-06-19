import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: "Email inválido." })
    @IsNotEmpty({ message: "Email não informado." })
    email: string;

    @IsString({ message: "Senha inválida." })
    @IsNotEmpty({ message: "Senha não informada." })
    senha: string;
}