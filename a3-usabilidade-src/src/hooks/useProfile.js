import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';
import useAuth from './useAuth.js';

export default function useProfile() {
  const { usuario } = useAuth(); 
  const [dadosUsuario, setDadosUsuario] = useState({ nome: '', email: '', dataNascimento: '' });
  const [carregando, setCarregando] = useState(true);
  const [erroPerfil, setErroPerfil] = useState(null);
  const [erroSenha, setErroSenha] = useState(null);
  const [sucessoPerfil, setSucessoPerfil] = useState(false);
  const [sucessoSenha, setSucessoSenha] = useState(false);

   
  useEffect(() => {
    async function carregarPerfil() {
      if (!usuario?.id) return;
      
      try {
        setCarregando(true);
    
        const resposta = await api.get(`/usuarios/${usuario.id}`);
        
    
        let dataFormatada = '';
        if (resposta.data?.dataNascimento) {
          dataFormatada = resposta.data.dataNascimento.split('T')[0];
        }

        setDadosUsuario({
          nome: resposta.data?.nome || '',
          email: resposta.data?.email || '',
          dataNascimento: dataFormatada,
        });
      } catch (erro) {
        setErroPerfil('Não foi possível carregar os dados do perfil.');
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [usuario?.id]);


  const atualizarPerfil = useCallback(async (dadosAtualizados) => {
    setErroPerfil(null);
    setSucessoPerfil(false);
    try {
      await api.put(`/usuarios/${usuario.id}`, {
        nome: dadosAtualizados.nome,
        dataNascimento: dadosAtualizados.dataNascimento,
      });
      
      
      setDadosUsuario((prev) => ({ ...prev, ...dadosAtualizados }));
      setSucessoPerfil(true);
    } catch (erro) {
      const mensagem = erro.response?.data?.message || 'Erro ao atualizar o perfil.';
      setErroPerfil(mensagem);
      throw erro;
    }
  }, [usuario?.id]);

  const alterarSenha = useCallback(async (dadosSenha) => {
    setErroSenha(null);
    setSucessoSenha(false);
    try {
      await api.put('/auth/change-password', {
        currentPassword: dadosSenha.currentPassword,
        newPassword: dadosSenha.newPassword,
      });
      setSucessoSenha(true);
    } catch (erro) {
    
      const mensagem = erro.response?.data?.message || 'Erro ao alterar a senha.';
      setErroSenha(mensagem);
      throw erro;
    }
  }, []);

  return {
    dadosUsuario,
    carregando,
    erroPerfil,
    erroSenha,
    sucessoPerfil,
    sucessoSenha,
    atualizarPerfil,
    alterarSenha,
  };
}