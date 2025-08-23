#!/usr/bin/env bash
set -euo pipefail

# Backend
echo "=== Backend: lint/typecheck/build/test ==="
(
  cd Backend
  if [ -f vendor/bin/pint ]; then vendor/bin/pint --test; fi
  if [ -f vendor/bin/phpstan ]; then vendor/bin/phpstan analyse; fi
  npm run build --if-present
  composer test
)

# Frontend
echo "=== Frontend: lint/typecheck/build/test ==="
(
  cd Frontend-nextjs
  npm run lint
  npm run typecheck
  npm run build
  npm test --if-present
)

# ML
echo "=== ML: lint/typecheck/build/test ==="
(
  cd ml_category_suggester
  python -m py_compile category_suggester_service.py
  if [ -d tests ]; then pytest; fi
)

echo "Audit completed"
