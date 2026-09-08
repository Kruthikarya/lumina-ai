import logoUrl from "@/assets/lumina-logo.png";

type Props = {
  className?: string;
  size?: number;
  alt?: string;
};

/** Local brand asset — always available, never 404s. */
export const LUMINA_LOGO_URL = logoUrl;

export function LuminaLogo({ className = "", size = 36, alt = "LUMINA AI" }: Props) {
  return (
    <img
      src={logoUrl}
      width={size}
      height={size}
      alt={alt}
      className={"rounded-xl object-cover shadow-elegant ring-1 ring-border " + className}
      loading="eager"
      decoding="async"
    />
  );
}
