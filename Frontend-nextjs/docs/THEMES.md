# 🎨 Themes

Gestione dei temi e personalizzazione.

---

## Temi disponibili

| Tema       | Sfondo (`--c-bg`)      | Testo (`--c-text`)      | Primario (`--c-primary`) |
|------------|-----------------------|-------------------------|--------------------------|
| `light`    | `hsl(220 20% 98%)`     | `hsl(220 17% 27%)`      | `hsl(120 34% 62%)`       |
| `dark`     | `hsl(235 15% 10%)`     | `hsl(220 60% 96%)`      | `hsl(159 68% 54%)`       |
| `emerald`  | `hsl(150 70% 97%)`     | `hsl(168 77% 26%)`      | `hsl(158 96% 24%)`       |
| `solarized`| `hsl(44 81% 94%)`      | `hsl(193 14% 40%)`      | `hsl(205 66% 49%)`       |

Le palette complete sono definite nei file `styles/themes/*.css` e importate da `styles/themes.css`.

## Variabili CSS
Configurate in `styles/themes.css` e richiamate in `tailwind.config.ts`.

## Override
```css
:root { --c-primary: #00ff00; }
```
