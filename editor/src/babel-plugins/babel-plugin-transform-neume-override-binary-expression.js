const operators = {
  "+": "add",
  "-": "sub",
  "*": "mul",
  "/": "div",
  "<": "lt",
  "<=": "le",
  ">": "gt",
  ">=": "ge"
};

export default function transform_neume_override_binary_expression({ types }) {
  return {
    visitor: {
      BinaryExpression: (path) => {
        const { node } = path;

        if (operators[node.operator]) {
          path.replaceWith(
            types.callExpression(
              types.identifier(operators[node.operator]), [
                node.left, node.right
              ]
            )
          );
        }
      }
    }
  };
}
