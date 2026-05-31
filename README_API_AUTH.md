# Nexus Game Store — API e Autenticação

## Rodar a API

```bash
cd api-vendas-jogos-digitais
npm install
npm start
```

A API sobe em `http://localhost:3000`.

---

## Variáveis de Ambiente

Copie o `.env.example` para `.env`:

```bash
cp a3-usabilidade-src/.env.example a3-usabilidade-src/.env
```

O `.env.example` contém:

```
VITE_API_URL=http://localhost:3000/api/v1
```

É o único lugar onde a URL da API é definida. Nunca hard-code a URL no código — sempre use `import.meta.env.VITE_API_URL`.

---

## Consumir a API

**Base:** `http://localhost:3000/api/v1`

### Autenticação

| Método | Rota | Body |
|---|---|---|
| POST | `/auth/login` | `{ "email", "senha" }` |
| POST | `/auth/register` | `{ "nome", "email", "senha" }` |

Login retorna `{ token }`. Esse token deve ser enviado no header:

```
Authorization: Bearer <token>
```

O token expira em 1 hora.

**Contas pré-cadastradas:**
- Admin: `admin@avjd.com` / `admin123`
- Cliente: `cliente@avjd.com` / `cliente123`

### Endpoints (Requisitam `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/usuarios` | Listar usuários (admin) |
| GET | `/usuarios/:id` | Dados de um usuário |
| PUT | `/usuarios/:id` | Atualizar dados |
| GET | `/empresas` | Listar empresas |
| POST | `/empresas` | Criar empresa |
| GET | `/jogos` | Listar jogos |
| POST | `/jogos` | Criar jogo |
| GET | `/carrinho` | Ver carrinho |
| POST | `/carrinho` | Adicionar ao carrinho |

Endpoint completo no collection do Postman: `Digital Game Store API.postman_collection.json`

---

## Fazer Requisições (axios já configurado)

Nunca use `fetch` nem crie outra instância do axios. Use a instância já pronta:

```js
import api from '../servicos/api.js';
```

### O que ela faz automaticamente

- **Injeta o token** em toda requisição (lê de `localStorage` ou `sessionStorage`)
- **Redireciona para `/entrar`** se qualquer requisição retornar 401
- **URL base** definida no `.env` (nunca hard-coded)

### Exemplos

```js
// GET
const { data } = await api.get('/jogos');

// POST
const { data } = await api.post('/auth/login', { email, senha });

// PUT
const { data } = await api.put('/usuarios/1', { nome: 'Novo Nome' });

// DELETE
await api.delete('/jogos/5');
```

Headers, timeout, base URL — tudo já configurado. É só importar e chamar.

---

## Rota Protegida no Frontend

O componente `<RotaProtegida />` decide se o usuário pode acessar uma página:

- **Não autenticado** → redireciona para `/entrar`
- **Autenticado** → renderiza a página
- **Rota de admin + usuário não admin** → redireciona para `/`

Uso no React Router:

```jsx
<Route element={<RotaProtegida />}>
  <Route path="/loja" element={<Loja />} />
  <Route path="/perfil" element={<Perfil />} />
</Route>

<Route element={<RotaProtegida apenasAdmin />}>
  <Route path="/admin" element={<Admin />} />
</Route>
```

O axios já injeta o token automaticamente em toda requisição, e se der 401, redireciona para o login.
