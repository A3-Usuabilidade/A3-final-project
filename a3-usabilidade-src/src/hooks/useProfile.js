import { useState, useCallback } from 'react';
import api from '../servicos/api';
import useAuth from './useAuth';

export default function useProfile() {
  const { usuario } = useAuth();

  const [dadosUsuario,  setDadosUsuario]  = useState({ nome: '', email: '', dataNascimento: '' });
  const [carregando,    setCarregando]    = useState(true);
  const [erroPerfil,    setErroPerfil]    = useState(null);
  const [erroSenha,     setErroSenha]     = useState(null);
  const [sucessoPerfil, setSucessoPerfil] = useState(false);
  const [sucessoSenha,  setSucessoSenha]  = useState(false);

  const carregarPerfil = useCallback(async () => {
    if (!usuario?.id) return;
    setCarregando(true);
    try {
      const resposta = await api.get(`/usuarios/${usuario.id}`);

      let dataFormatada = '';
      if (resposta.data?.dataNascimento) {
        const partes = resposta.data.dataNascimento.split('/');
        if (partes.length === 3) {
          dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
        } else {
          dataFormatada = resposta.data.dataNascimento.split('T')[0];
        }
      }

      setDadosUsuario({
        id:             resposta.data?.id    || usuario.id,
        nome:           resposta.data?.nome  || '',
        email:          resposta.data?.email || '',
        dataNascimento: dataFormatada,
      });
    } catch {
      setErroPerfil('Não foi possível carregar os dados do perfil.');
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  return {
    dadosUsuario,
    carregando,
    erroPerfil,
    erroSenha,
    sucessoPerfil,
    sucessoSenha,
    setErroPerfil,
    setErroSenha,
    setSucessoPerfil,
    setSucessoSenha,
    carregarPerfil,
  };
}