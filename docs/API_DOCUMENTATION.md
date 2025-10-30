# Swepee Backend API - Documentação

**Versão:** 1.0.0

**Descrição:** API REST para plataforma de troca e doação de itens

**Base URL:** http://192.168.10.210:3000  
**Prefixo da API:** /api

## Índice

- [Autenticação](#autenticação)
- [Health Check](#health)
- [Autenticação e Autorização](#auth)
- [Usuários](#users)
- [Itens](#items)
- [Descoberta e Matching](#discovery)
- [Conversas](#conversations)
- [Doações](#donations)
- [Gamificação](#gamification)
- [Busca](#search)
- [Notificações](#notifications)
- [Premium](#premium)
- [Cleanup](#cleanup)

---

## Autenticação

A API utiliza autenticação JWT (JSON Web Token). A maioria dos endpoints requer autenticação.

### Como obter o token:

1. **Registro/Login:** Faça uma requisição para `/api/auth/register` ou `/api/auth/login`
2. **Token no Header:** Inclua o token no header `Authorization`:
   ```
   Authorization: Bearer <seu-token-jwt>
   ```

### Exemplo de requisição autenticada:

```bash
curl -X GET http://192.168.10.210:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Renovação de Token:

Use o endpoint `/api/auth/refresh` com o `refreshToken` para obter um novo `accessToken`.

---

## health

Health check endpoints

### GET /api/health

**Resumo:** Get overall health status

**Respostas:**

- **200**: The Health Check is successful
- **503**: The Health Check is not successful

---

### GET /api/health/database

**Resumo:** Get database health status

**Respostas:**

- **200**: The Health Check is successful
- **503**: The Health Check is not successful

---

### GET /api/health/redis

**Resumo:** Get Redis health status

**Respostas:**

- **200**: The Health Check is successful
- **503**: The Health Check is not successful

---

### GET /api/health/memory

**Resumo:** Get memory health status

**Respostas:**

- **200**: The Health Check is successful
- **503**: The Health Check is not successful

---

### GET /api/health/disk

**Resumo:** Get disk health status

**Respostas:**

- **200**: The Health Check is successful
- **503**: The Health Check is not successful

---

### GET /api/health/info

**Resumo:** Get application information

**Respostas:**

- **200**: Application information retrieved successfully

---

## auth

Authentication and authorization endpoints

### POST /api/auth/register

**Resumo:** Registra um novo usuário

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **201**: Usuário criado com sucesso
- **400**: Dados inválidos
- **409**: Email já está em uso

---

### POST /api/auth/login

**Resumo:** Autentica um usuário

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **200**: Login realizado com sucesso
- **401**: Credenciais inválidas

---

### POST /api/auth/forgot-password

**Resumo:** Solicita reset de senha

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **200**: Email de reset enviado (se o email existir)

---

### POST /api/auth/reset-password

**Resumo:** Redefine a senha

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **200**: Senha redefinida com sucesso
- **400**: Token inválido ou expirado

---

### POST /api/auth/refresh

**Resumo:** Renova o access token

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **200**: Token renovado com sucesso
- **401**: Refresh token inválido ou expirado

---

### POST /api/auth/logout

**Resumo:** Realiza logout

**Respostas:**

- **200**: Logout realizado com sucesso
- **401**: Não autorizado

🔒 **Autenticação:** JWT Token necessário

---

### GET /api/auth/me

**Resumo:** Obtém dados do usuário autenticado

**Respostas:**

- **200**: Dados do usuário
- **401**: Não autorizado

🔒 **Autenticação:** JWT Token necessário

---

### GET /api/auth/google

**Resumo:** Inicia autenticação Google OAuth

**Respostas:**

- **302**: Redireciona para Google OAuth

---

### GET /api/auth/google/callback

**Resumo:** Callback Google OAuth

**Respostas:**

- **200**: Login OAuth realizado com sucesso
- **401**: Falha na autenticação OAuth

---

### GET /api/auth/apple

**Resumo:** Inicia autenticação Apple OAuth

**Respostas:**

- **302**: Redireciona para Apple OAuth

---

### GET /api/auth/apple/callback

**Resumo:** Callback Apple OAuth

**Respostas:**

- **200**: Login OAuth realizado com sucesso
- **401**: Falha na autenticação OAuth

---

### POST /api/auth/link-oauth

**Resumo:** Vincula conta OAuth a conta existente

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **200**: Conta OAuth vinculada com sucesso
- **400**: Dados inválidos
- **401**: Não autorizado
- **409**: Usuário já possui conta OAuth vinculada

🔒 **Autenticação:** JWT Token necessário

---

## users

User management endpoints

### GET /api/users/{id}

**Resumo:** Buscar perfil de usuário por ID

**Parâmetros:**

- id (path): ID do usuário *(obrigatório)* - tipo: string

**Respostas:**

- **200**: Perfil do usuário encontrado
- **404**: Usuário não encontrado

🔒 **Autenticação:** JWT Token necessário

---

### PUT /api/users/{id}

**Resumo:** Atualizar perfil do usuário

**Parâmetros:**

- id (path): ID do usuário *(obrigatório)* - tipo: string

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **200**: Perfil atualizado com sucesso
- **404**: Usuário não encontrado
- **409**: Email já está em uso

🔒 **Autenticação:** JWT Token necessário

---

### DELETE /api/users/{id}

**Resumo:** Deletar conta do usuário (soft delete)

**Parâmetros:**

- id (path): ID do usuário *(obrigatório)* - tipo: string

**Respostas:**

- **204**: Conta deletada com sucesso
- **404**: Usuário não encontrado

🔒 **Autenticação:** JWT Token necessário

---

### PUT /api/users/{id}/password

**Resumo:** Alterar senha do usuário

**Parâmetros:**

- id (path): ID do usuário *(obrigatório)* - tipo: string

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **204**: Senha alterada com sucesso
- **401**: Senha atual incorreta
- **404**: Usuário não encontrado

🔒 **Autenticação:** JWT Token necessário

---

### GET /api/users/{id}/settings

**Resumo:** Buscar configurações do usuário

**Parâmetros:**

- id (path): ID do usuário *(obrigatório)* - tipo: string

**Respostas:**

- **200**: Configurações encontradas
- **404**: Usuário não encontrado

🔒 **Autenticação:** JWT Token necessário

---

### PUT /api/users/{id}/settings

**Resumo:** Atualizar configurações do usuário

**Parâmetros:**

- id (path): ID do usuário *(obrigatório)* - tipo: string

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **200**: Configurações atualizadas
- **404**: Usuário não encontrado

🔒 **Autenticação:** JWT Token necessário

---

### POST /api/users/avatar

**Resumo:** Upload de avatar do usuário

**Respostas:**

- **200**: Avatar carregado com sucesso
- **400**: Arquivo inválido ou formato não suportado

🔒 **Autenticação:** JWT Token necessário

---

### POST /api/users/{id}/ratings

**Resumo:** Avaliar usuário

**Parâmetros:**

- id (path): ID do usuário a ser avaliado *(obrigatório)* - tipo: string

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **201**: Avaliação criada com sucesso
- **400**: Não é possível avaliar a si mesmo
- **404**: Usuário não encontrado

🔒 **Autenticação:** JWT Token necessário

---

### GET /api/users/{id}/ratings

**Resumo:** Obter avaliações do usuário

**Parâmetros:**

- id (path): ID do usuário *(obrigatório)* - tipo: string
- page (query): Página (padrão: 1) - tipo: number
- limit (query): Itens por página (padrão: 10) - tipo: number

**Respostas:**

- **200**: Lista de avaliações

🔒 **Autenticação:** JWT Token necessário

---

### GET /api/users/{id}/avatar

**Resumo:** Obter URL do avatar do usuário

**Parâmetros:**

- id (path): ID do usuário *(obrigatório)* - tipo: string

**Respostas:**

- **200**: URL do avatar
- **404**: Usuário não encontrado

🔒 **Autenticação:** JWT Token necessário

---

## items

Item management endpoints

### POST /api/items

**Resumo:** Criar novo item

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **201**: Item criado com sucesso

🔒 **Autenticação:** JWT Token necessário

---

### GET /api/items

**Resumo:** Listar itens com filtros

**Parâmetros:**

- page (query): Página atual - tipo: number
- limit (query): Itens por página - tipo: number
- search (query): Pesquisa por texto no título e descrição - tipo: string
- categoria (query): Filtrar por categoria - tipo: string
- subcategoria (query): Filtrar por subcategoria - tipo: string
- tipo (query): Filtrar por tipo de transação - tipo: string
- condicao (query): Filtrar por condição - tipo: string
- status (query): Filtrar por status - tipo: string
- precoMin (query): Preço mínimo - tipo: number
- precoMax (query): Preço máximo - tipo: number
- localizacao (query): Filtrar por localização - tipo: string
- latitude (query): Latitude para busca por proximidade - tipo: number
- longitude (query): Longitude para busca por proximidade - tipo: number
- radius (query): Raio de busca em quilômetros - tipo: number
- destacado (query): Apenas itens destacados - tipo: boolean
- tags (query): Filtrar por tags - tipo: array
- sortBy (query): Campo para ordenação - tipo: string
- sortOrder (query): Ordem da classificação - tipo: string

**Respostas:**

- **200**: Lista de itens recuperada com sucesso

---

### GET /api/items/user/{userId}

**Resumo:** Listar itens de um usuário específico

**Parâmetros:**

- userId (path):  *(obrigatório)* - tipo: string
- page (query): Página atual - tipo: number
- limit (query): Itens por página - tipo: number
- search (query): Pesquisa por texto no título e descrição - tipo: string
- categoria (query): Filtrar por categoria - tipo: string
- subcategoria (query): Filtrar por subcategoria - tipo: string
- tipo (query): Filtrar por tipo de transação - tipo: string
- condicao (query): Filtrar por condição - tipo: string
- status (query): Filtrar por status - tipo: string
- precoMin (query): Preço mínimo - tipo: number
- precoMax (query): Preço máximo - tipo: number
- localizacao (query): Filtrar por localização - tipo: string
- latitude (query): Latitude para busca por proximidade - tipo: number
- longitude (query): Longitude para busca por proximidade - tipo: number
- radius (query): Raio de busca em quilômetros - tipo: number
- destacado (query): Apenas itens destacados - tipo: boolean
- tags (query): Filtrar por tags - tipo: array
- sortBy (query): Campo para ordenação - tipo: string
- sortOrder (query): Ordem da classificação - tipo: string

**Respostas:**

- **200**: Lista de itens do usuário recuperada com sucesso

---

### GET /api/items/{id}

**Resumo:** Buscar item por ID

**Parâmetros:**

- id (path):  *(obrigatório)* - tipo: string
- incrementView (query): Incrementar contador de visualizações - tipo: boolean

**Respostas:**

- **200**: Item encontrado

---

### PATCH /api/items/{id}

**Resumo:** Atualizar item

**Parâmetros:**

- id (path):  *(obrigatório)* - tipo: string

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **200**: Item atualizado com sucesso

🔒 **Autenticação:** JWT Token necessário

---

### DELETE /api/items/{id}

**Resumo:** Remover item (soft delete)

**Parâmetros:**

- id (path):  *(obrigatório)* - tipo: string

**Respostas:**

- **200**: Item removido com sucesso

🔒 **Autenticação:** JWT Token necessário

---

### POST /api/items/{id}/images

**Resumo:** Adicionar imagens ao item

**Parâmetros:**

- id (path):  *(obrigatório)* - tipo: string

**Respostas:**

- **201**: Imagens adicionadas com sucesso

🔒 **Autenticação:** JWT Token necessário

---

### DELETE /api/items/{id}/images/{imageIndex}

**Resumo:** Remover imagem do item

**Parâmetros:**

- id (path):  *(obrigatório)* - tipo: string
- imageIndex (path):  *(obrigatório)* - tipo: string

**Respostas:**

- **200**: Imagem removida com sucesso

🔒 **Autenticação:** JWT Token necessário

---

### POST /api/items/{id}/views

**Resumo:** Incrementar contador de visualizações

**Parâmetros:**

- id (path):  *(obrigatório)* - tipo: string

**Respostas:**

- **201**: Visualização registrada com sucesso

---

### GET /api/items/{id}/stats

**Resumo:** Obter estatísticas do item

**Parâmetros:**

- id (path):  *(obrigatório)* - tipo: string

**Respostas:**

- **200**: Estatísticas do item

🔒 **Autenticação:** JWT Token necessário

---

### PATCH /api/items/{id}/status

**Resumo:** Atualizar status do item

**Parâmetros:**

- id (path):  *(obrigatório)* - tipo: string

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **200**: Status do item atualizado com sucesso

🔒 **Autenticação:** JWT Token necessário

---

## discovery

Discovery and matching endpoints

### GET /api/discovery/feed

**Resumo:** Obter feed de descoberta

**Descrição:** Retorna itens personalizados com base em localização, preferências e filtros. Exclui itens próprios e já interagidos. Suporta filtros avançados e cache de 2 minutos.

**Parâmetros:**

- page (query): Página atual - tipo: number
- limit (query): Itens por página - tipo: number
- latitude (query): Latitude para busca por proximidade - tipo: number
- longitude (query): Longitude para busca por proximidade - tipo: number
- radius (query): Raio de busca em quilômetros - tipo: number
- categoria (query): Filtrar por categoria - tipo: string
- tipo (query): Filtrar por tipo de transação - tipo: string
- condicao (query): Filtrar por condição - tipo: string
- precoMin (query): Preço mínimo - tipo: number
- precoMax (query): Preço máximo - tipo: number
- tags (query): Filtrar por tags - tipo: array

**Respostas:**

- **200**: Feed de itens recuperado com sucesso
- **401**: Não autorizado

🔒 **Autenticação:** JWT Token necessário

---

### POST /api/discovery/like/{itemId}

**Resumo:** Curtir um item (swipe right)

**Descrição:** Registra um like em um item. Se houver match mútuo, cria automaticamente uma conversa. Suporta likes normais e superlikes.

**Parâmetros:**

- itemId (path): ID do item a ser curtido *(obrigatório)* - tipo: string

**Body:**

Ver schema de requisição correspondente.

**Respostas:**

- **201**: Like registrado com sucesso
- **400**: Item já foi curtido ou é seu próprio item
- **404**: Item não encontrado

🔒 **Autenticação:** JWT Token necessário

---

### POST /api/discovery/pass/{itemId}

**Resumo:** Passar um item (swipe left)

**Descrição:** Marca um item como visto/descartado. O item não aparecerá mais no feed.

**Parâmetros:**

- itemId (path): ID do item a ser descartado *(obrigatório)* - tipo: string

**Respostas:**

- **201**: Item descartado com sucesso
- **400**: Item já foi interagido ou é seu próprio item
- **404**: Item não encontrado

🔒 **Autenticação:** JWT Token necessário

---

### GET /api/discovery/liked-items

**Resumo:** Listar itens curtidos

**Descrição:** Retorna todos os itens que o usuário curtiu, com indicação de match. Suporta paginação.

**Parâmetros:**

- page (query): Página atual - tipo: number
- limit (query): Itens por página - tipo: number

**Respostas:**

- **200**: Lista de itens curtidos recuperada com sucesso

🔒 **Autenticação:** JWT Token necessário

---

### DELETE /api/discovery/liked-items/{itemId}

**Resumo:** Remover like de um item

**Descrição:** Remove o like de um item. Não desfaz matches já criados.

**Parâmetros:**

- itemId (path): ID do item para remover o like *(obrigatório)* - tipo: string

**Respostas:**

- **200**: Like removido com sucesso
- **404**: Like não encontrado

🔒 **Autenticação:** JWT Token necessário

---

### GET /api/discovery/matches

**Resumo:** Listar todos os matches

**Descrição:** Retorna todos os matches do usuário, incluindo informações da conversa criada. Ordenado por data de match (mais recentes primeiro).

**Respostas:**

- **200**: Lista de matches recuperada com sucesso

🔒 **Autenticação:** JWT Token necessário

---

## donations

Donation verification endpoints

## gamification

Coins and rewards endpoints

## search

Search and filtering endpoints

## notifications

Notification endpoints

## premium

Premium subscription endpoints

