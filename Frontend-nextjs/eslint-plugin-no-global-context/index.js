module.exports = {
  rules: {
    'no-global-context': {
      meta: { type: 'problem' },
      create(context) {
        return {
          ImportDeclaration(node) {
            const value = node.source.value;
            if (typeof value === 'string' && (value.includes('GlobalContextProvider') || value.includes('context/contexts'))) {
              context.report({ node, message: 'Global context aggregators are forbidden' });
            }
          }
        };
      }
    }
  }
};
