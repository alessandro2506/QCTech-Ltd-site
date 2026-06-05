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
    ? "h-[5rem] w-[9.16rem] sm:h-[7rem] sm:w-[12.82rem] md:h-[8.5rem] md:w-[15.57rem]"
    : "h-[2.8rem] w-[5.13rem] sm:h-[3.5rem] sm:w-[6.41rem]";

  const inner = (
    <span className={`inline-flex items-center ${className}`}>
      <span className={`relative block shrink-0 ${logoBox}`}>
        <Image
          src={logoSrc}
          alt="QC Tech"
          fill
          className="object-contain"
          sizes={isHero ? "(max-width:640px) 146px, (max-width:768px) 205px, 249px" : "(max-width:640px) 82px, 103px"}
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
