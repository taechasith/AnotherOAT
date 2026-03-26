import fs from "node:fs";
import path from "node:path";

import { assetsConfig } from "@/src/config/assets";

function publicFileExists(publicPath: string) {
  return fs.existsSync(path.join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

export function getResolvedAssets() {
  const resolvedLogo = publicFileExists(assetsConfig.logoPath)
    ? assetsConfig.logoPath
    : publicFileExists(assetsConfig.logoPngPath)
      ? assetsConfig.logoPngPath
      : assetsConfig.fallbackLogoPath;

  return {
    avatar: publicFileExists(assetsConfig.avatarPath)
      ? assetsConfig.avatarPath
      : assetsConfig.fallbackAvatarPath,
    logo: resolvedLogo,
    heroNoise: publicFileExists(assetsConfig.heroNoisePath)
      ? assetsConfig.heroNoisePath
      : assetsConfig.heroNoiseFallbackPath,
    ambientGlow: publicFileExists(assetsConfig.ambientGlowPath)
      ? assetsConfig.ambientGlowPath
      : assetsConfig.ambientGlowFallbackPath,
  };
}
