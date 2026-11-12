"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";

const LOGO_LIGHT = "/logo-full.svg";
const LOGO_WHITE = "/logo-full-white.svg";
const LOGO_WIDE = "/logo-full-wide.svg";
const LOGO_WHITE_WIDE = "/logo-v2-white-wide.svg";

type QCTechLogoProps = {
  variant?: "hero" | "header";
  /** Dark-coloured mark for light chrome (home / progetti header). */
  onLight?: boolean;
  linkToHome?: boolean;
  className?: string;
};

export function QCTechLogo({
  variant = "hero",
  onLight = false,
  linkToHome = false,
  className = "",
}: QCTechLogoProps) {
  const isHero = variant === "hero";
  const logoSrc = isHero ? LOGO_LIGHT : onLight ? LOGO_WIDE : LOGO_WHITE_WIDE;
  const logoBox = isHero
    ? "h-20 w-[11.5rem] sm:h-24 sm:w-[14rem]"
    : "h-10 w-[10.5rem] lg:h-11 lg:w-[12.5rem]";

  const inner = (
    <span className={`inline-flex items-center ${className}`}>
      <span className={`relative block shrink-0 ${logoBox}`}>
        <Image
          src={logoSrc}
          alt="QC Tech"
          fill
          className="object-contain"
          sizes={isHero ? "(max-width:640px) 293px, (max-width:768px) 410px, 498px" : "(max-width:640px) 288px, 352px"}
          priority={isHero}
        />
      </span>
    </span>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-flex" aria-label="QC Tech — Home">
        {inner}
      </Link>
    );
  }

  return inner;
}
