import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["backup/**", ".superpowers/**"],
  },
];

export default eslintConfig;
