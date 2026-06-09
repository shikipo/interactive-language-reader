## Useful Commands

- `pnpm run format`
- `pnpm knip` (finds unused files)

## Tech Stack

**UI:** [ShadcnUI](https://ui.shadcn.com)

**Build Tool:** [Vite](https://vitejs.dev/)

**Routing:** [TanStack Router](https://tanstack.com/router/latest)

**Type Checking:** [TypeScript](https://www.typescriptlang.org/)

**Linting/Formatting:** [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

**Icons:** [HugeIcons](https://hugeicons.com/)

## Run Locally

Clone the project

```bash
  git clone https://github.com/shikipo/interactive-language-reader.git
```

Go to the project directory

```bash
  cd interactive-language-reader
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Timestamp 04.06.2026 - 10.06.2026

- Built the main dashboard layout with a file upload zone (drag & drop, single PDF)
- Added animated upload progress bar that replaces the upload UI while loading
- Integrated `react-pdf` to render the uploaded PDF after progress completes
- Added word annotation overlay: each word from `words.ts` is highlighted with a border box on the PDF; hovering shows the word label