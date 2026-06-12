"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";

const LOGO_LIGHT = "/logo-full.svg";
const LOGO_WHITE = "/logo-full-white.svg";
const LOGO_WIDE = "/logo-full-wide.svg";
const LOGO_WHITE_WIDE = "/logo-v2-white-wide.svg";

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
  const logoSrc = isHero ? LOGO_LIGHT : LOGO_WHITE_WIDE;
  const logoBox = isHero
    ? "h-[10rem] w-[18.32rem] sm:h-[14rem] sm:w-[25.65rem] md:h-[17rem] md:w-[31.14rem]"
    : "h-[2rem] w-[8rem] sm:h-[2.4rem] sm:w-[9.6rem]";

  const inner = (
    <span className={`inline-flex items-center ${className}`}>
      <span className={`relative block shrink-0 ${logoBox}`}>
        <Image
          src={logoSrc}
          alt="QC Tech"
          fill
          className="object-contain"
          sizes={isHero ? "(max-width:640px) 293px, (max-width:768px) 410px, 498px" : "(max-width:640px) 128px, 154px"}
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
