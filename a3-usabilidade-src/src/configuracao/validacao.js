import { z } from 'zod';

// ===========================================
// Schemas compartilhados
// ===========================================

const regexNome = /^[a-zA-ZÀ-ÿ\s]+$/;

export const esquemaEmail = z.email('E-mail inválido');

export const esquemaSenha = z.string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .max(32, 'A senha deve ter no máximo 32 caracteres')
  .regex(/[A-Z]/, 'Pelo menos 1 letra maiúscula')
  .regex(/[a-z]/, 'Pelo menos 1 letra minúscula')
  .regex(/\d/,    'Pelo menos 1 número')
  .regex(/[@$!%*?&.]/, 'Pelo menos 1 caractere especial (@$!%*?&.)');

// ===========================================
// Login
// ===========================================

export const esquemaLogin = z.object({
  email: esquemaEmail,
  senha: z.string().trim().min(1, 'A senha é obrigatória'),
});

// ===========================================
// Recuperação de senha
// ===========================================

export const esquemaRecuperarSenha = z.object({
  email: esquemaEmail,
});

export const esquemaRedefinirSenha = z
  .object({
    senha: esquemaSenha,
    confirmarSenha: z.string(),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha'],
  });

// ===========================================
// Cadastro
// ===========================================

const regexDataDDMMAAAA = /^\d{2}\/\d{2}\/\d{4}$/;

function dataValidaDDMMAAAA(val) {
  const [d, m, a] = val.split('/').map(Number);
  const data = new Date(a, m - 1, d);
  return data.getDate() === d && data.getMonth() === m - 1 && data.getFullYear() === a;
}

function idadeMinima13AnosDDMMAAAA(val) {
  const [d, m, a] = val.split('/').map(Number);
  const minima = new Date();
  minima.setFullYear(minima.getFullYear() - 13);
  return new Date(a, m - 1, d) <= minima;
}

export const esquemaCadastro = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: esquemaEmail,
  dataNascimento: z
    .string()
    .regex(regexDataDDMMAAAA, 'Formato deve ser DD/MM/AAAA')
    .refine(dataValidaDDMMAAAA, 'Data inválida')
    .refine(idadeMinima13AnosDDMMAAAA, 'Você deve ter no mínimo 13 anos'),
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
    .date('Formato deve ser YYYY-MM-DD')
    .refine(idadeMinima13Anos, 'Você deve ter no mínimo 13 anos')
    .or(z.literal('')),
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

    newPassword: esquemaSenha,

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

// ===========================================
// Jogo
// ===========================================

function esquemaFk(msg) {
  return z.string()
    .min(1, msg)
    .refine((v) => !isNaN(Number(v)), 'Selecione um valor válido')
    .transform(Number);
}

function esquemaNumero(msg) {
  return z.string()
    .trim()
    .min(1, msg)
    .refine((v) => !isNaN(Number(v)), 'Deve ser um número válido')
    .transform(Number);
}

export const esquemaJogo = z.object({
  nome: z.string().trim().min(1, 'Nome do jogo é obrigatório'),
  fkEmpresa:       esquemaFk('Empresa é obrigatória'),
  fkCategoria:     esquemaFk('Categoria é obrigatória'),
  ano:             esquemaNumero('Ano de lançamento é obrigatório')
                     .refine((n) => n >= 1950 && n <= new Date().getFullYear() + 1,
                       'Ano fora do intervalo permitido'),
  preco:           esquemaNumero('Preço é obrigatório')
                     .refine((n) => n > 0, 'Preço deve ser maior que zero'),
  desconto: z.string().optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((n) => n === undefined || (n >= 0 && n <= 100),
      'Desconto deve ser entre 0 e 100'),
  descricao: z.string().optional(),
});

// ===========================================
// Empresa
// ===========================================

export const esquemaEmpresa = z.object({
  nome: z.string().trim().min(1, 'Nome da empresa é obrigatório'),
});

// ===========================================
// Pagamento (simulação no checkout)
// ===========================================

function validadeNaoExpirada(val) {
  const [mes, ano] = val.split('/').map(Number);
  if (!mes || mes < 1 || mes > 12) return false;
  // Cartão é válido até o último dia do mês informado.
  const ultimoInstante = new Date(2000 + ano, mes, 0, 23, 59, 59);
  return ultimoInstante >= new Date();
}

export const esquemaPagamento = z.object({
  numeroCartao: z
    .string()
    .transform((v) => v.replace(/\s/g, ''))
    .refine((v) => /^\d{16}$/.test(v), 'Número do cartão deve ter 16 dígitos'),

  nomeCartao: z
    .string()
    .trim()
    .min(3, 'Informe o nome impresso no cartão')
    .regex(regexNome, 'Nome deve conter apenas letras e espaços'),

  validade: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, 'Validade deve estar no formato MM/AA')
    .refine(validadeNaoExpirada, 'Validade inválida ou cartão expirado'),

  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV deve ter 3 ou 4 dígitos'),
});

// ===========================================
// Categoria
// ===========================================

export const esquemaCategoria = z.object({
  nome: z.string().trim().min(1, 'Nome da categoria é obrigatório'),
});
