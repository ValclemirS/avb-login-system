# AVB Login System

Sistema de autenticação moderno e seguro.

## 🚀 Sobre o Projeto

Sistema completo de autenticação desenvolvido com Next.js 14, TypeScript, MongoDB e Tailwind CSS, implementando as melhores práticas de segurança e UX.

## ✨ Funcionalidades

### 🔐 Autenticação
- **Login seguro** com JWT
- **Registro de usuários** com validação
- **Recuperação de senha** com token seguro
- **Logout** com limpeza de tokens

### 🛡️ Segurança
- **Proteção contra força bruta** com rate limiting
- **Senhas criptografadas** com bcrypt
- **Tokens JWT** com expiração
- **Validação de inputs** no frontend e backend
- **Headers de segurança** implementados
- **Bloqueio automático** após múltiplas tentativas

### 📊 Dashboard
- **Estatísticas em tempo real** de usuários
- **Gráficos interativos** com Chart.js
- **KPIs** do sistema
- **Design responsivo**

### 🎨 Interface
- **Design moderno** com Tailwind CSS
- **Componentes reutilizáveis**
- **Animações suaves**
- **Totalmente responsivo**
- **Tema corporativo AVB**

## 🛠️ Tecnologias

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Banco de Dados:** MongoDB
- **Autenticação:** JWT, bcrypt
- **Gráficos:** Chart.js
- **Deploy:** Pronta para Vercel

## 📦 Estrutura do Projeto

```
avb-login-system/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── dashboard/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── dashboard/
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── dashboardChart.tsx
│   └── lib/
│       ├── mongodb.ts
│       ├── auth.ts
│       └── rateLimit.ts
├── public/
│   └── images/
├── package.json
└── tailwind.config.js
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- MongoDB
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/avb-login-system.git
cd avb-login-system
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
MONGODB_URI=mongodb://localhost:27017/avb-login
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
NEXTAUTH_URL=http://localhost:3000
```

### 4. Execute o projeto
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

## 🗄️ Configuração do Banco de Dados

### MongoDB
O sistema usa MongoDB para armazenamento. Certifique-se de ter:

1. MongoDB instalado e rodando
2. Database `avb-login` criado
3. Collection `users` para armazenamento

### Estrutura do User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // Hash bcrypt
  createdAt: Date,
  failedAttempts: Number,
  lockedUntil: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

## 🔒 Recursos de Segurança

### Rate Limiting
- **5 tentativas** por IP a cada 15 minutos
- **Bloqueio automático** por 30 minutos após exceder
- **Reset** após login bem-sucedido

### Proteção de Conta
- **Bloqueio automático** após 5 tentativas falhas
- **Tokens temporários** para recuperação de senha
- **Validação de email** obrigatória

### Segurança de Dados
- **Senhas hash** com bcrypt (salt 12)
- **Tokens JWT** com expiração de 24h
- **CORS** configurado
- **Headers de segurança** implementados

## 📱 Páginas e Rotas

### Públicas
- `/` - Landing page
- `/login` - Página de login
- `/register` - Página de registro
- `/forgot-password` - Recuperação de senha

### Protegidas
- `/dashboard` - Painel administrativo (requer autenticação)

### API Routes
- `POST /api/auth/login` - Autenticação
- `POST /api/auth/register` - Registro
- `POST /api/auth/forgot-password` - Recuperação de senha
- `GET /api/user/profile` - Perfil do usuário
- `GET /api/dashboard/stats` - Estatísticas do dashboard

## 🎨 Personalização

### Cores Corporativas
```css
--avb-green: #5B9C72;    /* Verde AVB */
--avb-dark: #1a3b23;     /* Verde escuro */
--avb-light: #8bc34a;    /* Verde claro */
```

### Componentes
- **Header** com menu responsivo
- **Footer** com links corporativos
- **Formulários** com validação
- **Gráficos** responsivos

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel deploy
```


## 👥 Time de Desenvolvimento

- **Desenvolvimento:** Valclemir soares
- **Curso:** Análise e desenvolvimento de sistemas 


## 🔄 Changelog

### v1.0.0 (2024)
- ✅ Sistema de autenticação completo
- ✅ Dashboard administrativo
- ✅ Proteção contra força bruta
- ✅ Design responsivo corporativo

---

**Pequeno passo todos os dias** ♻️  
