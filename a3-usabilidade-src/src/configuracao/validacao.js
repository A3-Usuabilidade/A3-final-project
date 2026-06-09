import { z } from 'zod';

// ===========================================
// Schemas compartilhados
// ===========================================

const regexNome = /^[a-zA-ZÀ-ÿ\s]+$/;

export const esquemaEmail = z.email('E-mail inválido');
export const esquemaSenha = z.string().min(6, 'A senha deve ter no mínimo 6 caracteres');

// ===========================================
// Login
// ===========================================

export const esquemaLogin = z.object({
  email: esquemaEmail,
  senha: esquemaSenha,
});

// ===========================================
// Cadastro
// ===========================================

export function validarDataNascimento(valor) {
  if (!valor) return { valido: true, valor };
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(valor)) return { valido: false, mensagem: 'Formato deve ser DD/MM/AAAA' };
  const [dia, mes, ano] = valor.split('/').map(Number);
  const data = new Date(ano, mes - 1, dia);
  if (data.getDate() !== dia || data.getMonth() !== mes - 1 || data.getFullYear() !== ano) {
    return { valido: false, mensagem: 'Data inválida' };
  }
  return { valido: true, valor };
}

export const esquemaCadastro = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: esquemaEmail,
  senha: esquemaSenha,
  confirmarSenha: z.string(),
}).refine((dados) => dados.senha === dados.confirmarSenha, {
  message: 'As senhas não conferem',
  path: ['confirmarSenha'],
});

// ===========================================
// Editar Perfil
// ===========================================

function idadeMinima13Anos(val) {
  const minima = new Date();
  minima.setFullYear(minima.getFullYear() - 13);
  return new Date(val) <= minima;
}

export const esquemaEditarPerfil = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .regex(regexNome, 'Nome deve conter apenas letras e espaços'),

  dataNascimento: z
    .string()
    .min(1, 'Data de nascimento é obrigatória')
    .iso.date('Formato deve ser YYYY-MM-DD')
    .refine(idadeMinima13Anos, 'Você deve ter no mínimo 13 anos'),
});

// ===========================================
// Alterar Senha
// ===========================================

function senhasConferem(d) {
  return d.newPassword === d.confirmPassword;
}

function senhaDiferenteDaAtual(d) {
  return d.newPassword !== d.currentPassword;
}

export const esquemaAlterarSenha = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Senha atual é obrigatória'),

    newPassword: z
      .string()
      .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
      .max(32, 'Nova senha deve ter no máximo 32 caracteres')
      .regex(/[A-Z]/, 'Nova senha deve ter pelo menos 1 letra maiúscula')
      .regex(/[a-z]/, 'Nova senha deve ter pelo menos 1 letra minúscula')
      .regex(/\d/,    'Nova senha deve ter pelo menos 1 número')
      .regex(/[@$!%*?&.]/, 'Nova senha deve ter pelo menos 1 caractere especial (@$!%*?&.)'),

    confirmPassword: z
      .string()
      .min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine(senhasConferem, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine(senhaDiferenteDaAtual, {
    message: 'A nova senha não pode ser igual à senha atual',
    path: ['newPassword'],
  });
