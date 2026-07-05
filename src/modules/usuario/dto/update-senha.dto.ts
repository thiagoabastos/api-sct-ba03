import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateSenhaDto {
  @IsString({ message: 'Senha atual deve ser uma string' })
  senhaAtual: string;

  @IsString({ message: 'Nova senha deve ser uma string' })
  @MinLength(8, { message: 'Nova senha deve ter no mínimo 8 caracteres' })
  @MaxLength(255, { message: 'Nova senha deve ter no máximo 255 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Nova senha deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
  })
  novaSenha: string;
}
