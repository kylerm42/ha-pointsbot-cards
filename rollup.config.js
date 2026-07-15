import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/pointsbot-person-card.ts",
  output: {
    file: "dist/pointsbot-cards.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      declarationMap: false,
    }),
  ],
};
