"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";

const LOGO_LIGHT = "/logo-full.svg";
const LOGO_HEADER = "/logo-header.svg";
const HEADER_VIEWBOX_WIDTH = 1849;
const HEADER_VIEWBOX_HEIGHT = 413;

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
  const logoSrc = isHero ? LOGO_LIGHT : LOGO_HEADER;

  const inner = (
    <span className={`inline-flex max-w-full items-center ${className}`}>
      {isHero ? (
        <span className="relative block h-20 w-[11.5rem] shrink-0 sm:h-24 sm:w-[14rem]">
          <Image
            src={logoSrc}
            alt="QC Tech"
            fill
            className="object-contain"
            sizes="(max-width:640px) 293px, (max-width:768px) 410px, 498px"
            priority
          />
        </span>
      ) : (
        <Image
          src={logoSrc}
          alt="QC Tech"
          width={HEADER_VIEWBOX_WIDTH}
          height={HEADER_VIEWBOX_HEIGHT}
          className="h-10 w-auto max-w-full object-contain lg:h-[46px]"
          sizes="(min-width: 1024px) 206px, 179px"
          priority
        />
      )}
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
