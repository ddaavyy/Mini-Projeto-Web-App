# Mini-Projeto Web App: Calculadora de IR Simplificada

Este repositório contém uma aplicação front-end em **React** com **TypeScript**, que permite registrar e acompanhar operações de compra e venda de ações, calcular o Imposto de Renda devido e visualizar resultados em tabela e gráfico interativo.

---

## 📂 Estrutura de Pastas

```
mini-projeto-web-app/
├─ public/                 # Arquivos estáticos 
├─ src/
│  ├─ assets/              # Imagens, logos, ícones
│  ├─ components/          # Componentes UI 
│  │  ├─ OperationsChart/
│  │  │  ├─ OperationsChart.tsx
│  │  │  └─ __tests__/OperationsChart.spec.tsx
│  │  └─ OperationsTable/
│  │     ├─ OperationsTable.tsx
│  │     └─ __tests__/OperationsTable.spec.tsx
│  ├─ hooks/               # Hooks customizados (useOperationsForm)
│  ├─ pages/               # Páginas do app
│  ├─ routes/              # Definição de rotas React Router
│  ├─ types/               # Definições de tipagens
│  ├─ App.tsx              # Componente raiz
│  └─ main.tsx             # Entrada do React + Vite
├─ .eslintrc.js            # Regras ESLint
├─ jest.config.ts          # Configuração Jest + ts-jest
├─ tsconfig.json           # Configuração TypeScript
├─ tailwind.config.js      # Configuração Tailwind CSS (se usado)
├─ vite.config.ts          # Configuração Vite
└─ package.json            # Scripts e dependências
```

---

## 🚀 Tecnologias

* **React 18** + **Vite**
* **TypeScript**
* **Ant Design** (UI) + **Tailwind CSS**
* **Recharts** (gráficos)
* **React Hook Form** + **Yup** (forms e validação)
* **Jest** + **@testing-library/react** (testes)
* **ESLint** (qualidade de código)
* **pnpm** (gerenciador de pacotes)

---

## 🛠 Pré-requisitos

* **Node.js** v16 ou superior
* **pnpm** v7 ou superior

---

## 📥 Instalação e Setup

1. **Clone** o repositório:

   ```bash
   git clone https://github.com/seu-usuario/mini-projeto-web-app.git
   cd mini-projeto-web-app
   ```

2. **Instale** dependências com pnpm:

   ```bash
   pnpm install
   ```

---

## ⚙️ Scripts Disponíveis

| Comando               | O que faz                                                                   |
| --------------------- | --------------------------------------------------------------------------- |
| `pnpm run dev`        | Inicia o servidor de desenvolvimento ([http://localhost](http://localhost)) |
| `pnpm run build`      | Compila para produção (`dist/`)                                             |
| `pnpm run preview`    | Serve o build de produção localmente                                        |
| `pnpm lint`       | Executa ESLint em todo o projeto                                            |
| `pnpm test`       | Roda todos os testes unitários com cobertura                                |
| `pnpm test:watch` | Roda testes em modo *watch* (re-executa ao salvar)                          |
| `pnpm coverage`   | Gera relatório de cobertura (`coverage/`)                                   |

---

## 📝 Como usar

1. Execute:

   ```bash
   pnpm run dev
   ```
2. Abra o navegador em `http://localhost:5173` (ou porta indicada no terminal).
3. Na página home, aperte o botão abaixo para ir para a página da calculadora, utilize **+ Adicionar Ação** para cadastrar uma operação.
4. A **tabela** lista as operações, com **sorters**, **filters** e ações de **editar/excluir**.
5. O **gráfico** exibe métricas de IR, PM, QM e PA ao longo do tempo.

---

## 🧪 Testes

* Testes de componentes e hooks estão em `src/components/**/__tests__/*.spec.tsx`.
* Para rodar cobertura basta apenas dar o comando:

  ```bash
  pnpm teste
  ```
  Ou:
  ```bash
  pnpm coverage
  ```
* O relatório aparecerá na pasta `coverage/`.

---

## 🤝 Contribuições

Pull requests são bem-vindos. Para alterações maiores, abra uma *issue* primeiro para discutirmos.

---
###
Espero que tenham gostado!!!!!
