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
    ? "h-[7rem] w-[12.82rem] sm:h-[10rem] sm:w-[18.32rem] md:h-[12rem] md:w-[21.98rem]"
    : "h-[3.5rem] w-[6.41rem] sm:h-[4.5rem] sm:w-[8.24rem]";

  const inner = (
    <span className={`inline-flex items-center ${className}`}>
      <span className={`relative block shrink-0 ${logoBox}`}>
        <Image
          src={logoSrc}
          alt="QC Tech"
          fill
          className="object-contain"
          sizes={isHero ? "(max-width:640px) 205px, (max-width:768px) 293px, 352px" : "(max-width:640px) 103px, 132px"}
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
