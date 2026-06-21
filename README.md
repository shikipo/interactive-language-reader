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

TODO:  
Backend:
- Implement actual PDF parsing to extract words and their positions instead of using static data

Frontend:
- react-pdf error handling should be direct in ProgressBar component, not as a separate state in Dashboard

## Timestamp 11.06.2026 - 24.06.2026

- Wired the `/pdf/translate` response into `PdfViewer`: word overlays now come from real OCR results instead of the static `words.ts` placeholder data (file removed)
- Replaced the static `DE <-> EN` label with a `DropdownMenu` radio group to pick translation direction (DE → EN / EN → DE)
- Tesseract now receives the correct source language (`deu`/`eng`) based on the selected direction, instead of always defaulting to English
- Hovering a word now calls `/translate/hover` and shows the **DeepL translation**, caching the result per word so repeated hovers don't re-request it
- Progress bar shows real upload-byte progress (via XHR); once the upload completes the bar pulses with "Running OCR…" instead of inventing a percentage, since the backend has no way to report progress for that phase yet
- Added an error state + retry on upload failure; react-pdf load failures are caught and shown, and the default `Loading PDF…` flash is suppressed
- PDF viewer width is now responsive (measured via `ResizeObserver`) instead of a hardcoded 700px, with word overlay positions recalculated to match
- Added new Folder `examples/` with two sample tales (on english and german)
- Removed the unused `target_language` param from `/pdf/translate` (it never did anything there) and dropped the now-redundant defaults on `source_language`/`target_language` in `HoverRequest`, `/pdf/translate`, and `OCRService.extract_text_regions`

TODO:  
Backend:
- `TranslationService` in `translation.py` is defined twice (duplicate class, should be cleaned up)
- `page_cache`/`ocr_cache` (keyed by `session_id`) are never evicted, so memory grows for as long as the server runs
- OCR groups every word sharing a Tesseract `block_num` into one merged `TextRegion` per line (see `_group_by_block` in `ocr.py`), so hovering anywhere over a sentence treats it as a single word/phrase. `pytesseract.image_to_data` already returns per-word `left`/`top`/`width`/`height` — drop the block-merge and emit one `TextRegion` per word (keep the confidence filter) to get per-word hover targets
- Real OCR progress reporting (the reverted `BackgroundTasks`/`/pdf/status` approach, or similar) is worth revisiting if pages are large/slow enough that `Running OCR…` alone feels too vague

Frontend:
- The hover tooltip in `WordRegion` (`pdf-viewer.tsx`) make bigger. While `loading` is true it shows a literal `'…'` string; replace it with an actual spinner ([example](https://anylang.net/en/books/de/alices-adventures-wonderland/read))