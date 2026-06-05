"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";

const LOGO_LIGHT = "/logo-full.svg";
const LOGO_WHITE = "/logo-full-white.svg";

type QCTechLogoProps = {
  variant?: "hero" | "header";
  linkToHome?: boolean;
  className?: string;
};

export function QCTechLogo({
  variant = "hero",
  linkToHome = false,
  className = "",
}: QCTechLogoProps) {
  const isHero = variant === "hero";
  const logoSrc = LOGO_LIGHT;
  const logoBox = isHero
    ? "h-[6rem] w-[16.8rem] sm:h-[8rem] sm:w-[22.4rem]"
    : "h-[3.2rem] w-[12rem] sm:h-[4rem] sm:w-[15rem]";

  const inner = (
    <span className={`inline-flex items-center ${className}`}>
      <span className={`relative block shrink-0 ${logoBox}`}>
        <Image
          src={logoSrc}
          alt="QC Tech"
          fill
          className="object-contain object-left"
          sizes={isHero ? "(max-width:640px) 314px, 426px" : "(max-width:640px) 192px, 240px"}
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
