# EasyRemind - Lembretes Inteligentes

SaaS de produtividade focado em lembretes inteligentes via linguagem natural, com uma estética inspirada na identidade visual da evolvestecnologia.com.br.

## 🚀 Funcionalidades

### ✨ Core Features
- **Barra de Comando Híbrida**: Input centralizado que aceita texto e voz (Web Speech API)
- **Live Parser**: Feedback em tempo real enquanto o usuário digita
- **DatePicker Customizado**: Popover com calendário e seletor de horas
- **Lista Responsiva**: Grid em desktop, lista vertical em mobile
- **PWA Instalável**: Funciona como app nativo no desktop e mobile

### 🧠 Inteligência Artificial
- **Parsing Avançado**: OpenAI GPT-3.5 para entender linguagem natural
- **Fallback Regex**: Parsing local quando a IA não está disponível
- **Confidence Score**: Indica quão confidente o sistema está no parsing

### 💰 Monetização
- **Plano FREE**: 10 lembretes ativos
- **Plano PRO**: Lembretes ilimitados + recursos avançados
- **Modal de Upgrade**: Design persuasivo com glassmorphism
- **Stripe Integration**: Estrutura pronta para pagamentos

### 🎨 Design & UX
- **Dark/Light Mode**: Temas completos com Tailwind CSS
- **Responsive Design**: Mobile-first com breakpoints otimizados
- **Micro-interações**: Animações suaves com Framer Motion
- **Zen UI**: Minimalista focado na produtividade

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15**: App Router com Server Components
- **React 19**: Última versão com otimizações
- **TypeScript**: Type safety em todo o projeto
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Componentes acessíveis e customizáveis
- **Framer Motion**: Animações declarativas

### Backend & Database
- **Supabase**: PostgreSQL + Auth em tempo real
- **Prisma ORM**: Type-safe database access
- **Vercel AI SDK**: Integração com OpenAI
- **OpenAI GPT-3.5**: Parsing de linguagem natural

### DevOps & Deploy
- **Vercel**: Deploy automático com zero-config
- **next-pwa**: Progressive Web App features
- **GitHub Actions**: CI/CD automático

## 📁 Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── actions/            # Server Actions
│   ├── api/               # API Routes
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/             # React Components
│   ├── ui/               # Shadcn/UI components
│   ├── command-bar.tsx    # Barra de comando principal
│   ├── dashboard.tsx      # Dashboard principal
│   ├── date-picker.tsx    # DatePicker customizado
│   ├── reminder-list.tsx  # Lista de lembretes
│   ├── theme-toggle.tsx    # Toggle dark/light
│   └── upgrade-modal.tsx  # Modal de upgrade
├── lib/                   # Utilitários
│   ├── ai-parser.ts       # Parser com OpenAI
│   ├── prisma.ts         # Client Prisma
│   ├── supabase.ts       # Client Supabase
│   └── utils.ts          # Utilitários gerais
├── prisma/               # Schema e migrations
│   └── schema.prisma     # Modelo de dados
└── public/               # Assets estáticos
    ├── manifest.json      # PWA manifest
    └── *.svg            # Ícones e imagens
```

## 🚀 Getting Started

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase
- API Key OpenAI (opcional)

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd easyremind
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.local.example .env.local
# Configure:
# DATABASE_URL
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# OPENAI_API_KEY
```

4. **Configure o banco de dados**
```bash
npm run db:push
npm run db:generate
```

5. **Inicie o desenvolvimento**
```bash
npm run dev
```

Acesse `http://localhost:3000`

## 📊 Modelos de Dados

### User
```typescript
interface User {
  id: string
  email: string
  plan: 'FREE' | 'PRO'
  stripeCustomerId?: string
  subscriptionStatus?: string
  createdAt: Date
  updatedAt: Date
  reminders: Reminder[]
}
```

### Reminder
```typescript
interface Reminder {
  id: string
  userId: string
  content: string
  rawText: string
  isRecurring: boolean
  frequency?: 'WEEKLY' | 'DAILY' | 'MONTHLY'
  daysOfWeek?: number[]
  nextRunAt: Date
  status: 'PENDING' | 'SENT' | 'CANCELED'
  createdAt: Date
  updatedAt: Date
}
```

## 🎯 Exemplos de Uso

### Linguagem Natural
- `"academia toda segunda e quarta às 7h"`
- `"reunião amanhã às 14h"`
- `"pagar aluguel todo dia 10"`
- `"consulta médica sexta às 15:30"`

### Voz (Web Speech API)
- Clique no ícone do microfone
- Fale o lembrete naturalmente
- Sistema transcreve e processa automaticamente

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Lint com ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as environment variables
3. Deploy automático em cada push

### Manual
```bash
npm run build
npm run start
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para o branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License.

## 🙏 Agradecimentos

- [Vercel](https://vercel.com) - Platform & hosting
- [Supabase](https://supabase.com) - Database & auth
- [OpenAI](https://openai.com) - AI capabilities
- [Shadcn/UI](https://ui.shadcn.com) - Component library
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Framer Motion](https://framer.com/motion) - Animation library

---

**EasyRemind** - Produtividade inteligente para o seu dia a dia 🚀
