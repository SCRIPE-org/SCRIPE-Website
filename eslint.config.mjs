import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    // .next-dev/** mirrors .gitignore: eslint-config-next's own default
    // ignores cover the stock ".next/**" build output, but this project
    // renames its dev-server distDir to ".next-dev" (next.config.ts), which
    // that default list has no way to know about — without this, a live
    // `next dev` process (this repo's own generated chunks under
    // .next-dev/dev/server/chunks/**) gets linted as source and fails the
    // gate on generated code, not anything anyone wrote.
    ignores: ["backup/**", ".superpowers/**", ".next-dev/**"],
  },
];

export default eslintConfig;
