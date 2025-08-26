// ─────────────────────────────────────────────
// Regola locale: vieta import aggregatori context
// ─────────────────────────────────────────────
module.exports = {
  meta: { type: 'problem' },
  create(context) {
    return {
      ImportDeclaration(node) {
        const from = node.source.value;
        const names = (node.specifiers || [])
          .filter(s => s.type === 'ImportSpecifier')
          .map(s => s.imported.name);

        const badPath = typeof from === 'string' && from.includes('context/contexts');
        const badName = names.includes('GlobalContextProvider');

        if (badPath || badName) {
          context.report({ node, message: 'Global context aggregators are forbidden' });
        }
      }
    };
  }
};
