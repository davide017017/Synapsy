let themes: string[] = [];
if (typeof window === 'undefined') {
  try {
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(process.cwd(), 'styles', 'themes');
    themes = fs.readdirSync(dir)
      .filter((f: string) => f.endsWith('.css'))
      .map((f: string) => path.parse(f).name);
  } catch {
    themes = ['light', 'dark'];
  }
}

export const availableThemes = themes;
