export default function transform_neume_sloppy_named_parameters({ types }) {
  function isNamedParameter(node) {
    return types.isAssignmentExpression(node) && types.isIdentifier(node.left);
  }

  return {
    visitor: {
      CallExpression: (path) => {
        const { node } = path;
        const args = node.arguments;
        const firstNamedIndex = args.findIndex(isNamedParameter);

        if (firstNamedIndex === -1) {
          return;
        }

        if (!args.slice(firstNamedIndex + 1).every(isNamedParameter)) {
          throw path.buildCodeFrameError(`
            Sloppy named parameter must be last formal parameter
          `.trim(), SyntaxError);
        }

        path.replaceWith(
          types.callExpression(
            node.callee, args.slice(0, firstNamedIndex).concat(
              types.objectExpression(args.slice(firstNamedIndex).map((node) => {
                return types.objectProperty(node.left, node.right);
              }))
            )
          )
        );
      }
    }
  };
}
