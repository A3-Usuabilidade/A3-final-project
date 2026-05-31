import { z } from 'zod';

export const esquemaEmail = z.string().email('E-mail inválido');

export const esquemaSenha = z.string()
  .min(6, 'A senha deve ter no mínimo 6 caracteres');

export const esquemaLogin = z.object({
  email: esquemaEmail,
  senha: esquemaSenha,
});

export const esquemaCadastro = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: esquemaEmail,
  senha: esquemaSenha,
  confirmarSenha: z.string(),
}).refine((dados) => dados.senha === dados.confirmarSenha, {
  message: 'As senhas não conferem',
  path: ['confirmarSenha'],
});

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
