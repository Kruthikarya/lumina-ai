const colleges = [
  { name: "SJCIT", full: "SJC Institute of Technology", domain: "sjcit.ac.in" },
  { name: "SJBIT", full: "SJB Institute of Technology", domain: "sjbit.edu.in" },
  { name: "AIT", full: "Acharya Institute of Technology", domain: "acharya.ac.in" },
  { name: "BGSCE", full: "BGS College of Engineering", domain: "bgsce.edu.in" },
  { name: "NIE", full: "National Institute of Engineering", domain: "nie.ac.in" },
  { name: "VVCE", full: "Vidyavardhaka College of Engg.", domain: "vvce.ac.in" },
  { name: "JSS STU", full: "JSS Science & Technology University", domain: "jssstuniv.in" },
  { name: "PESCE", full: "PES College of Engineering", domain: "pesce.ac.in" },
  { name: "RVCE", full: "RV College of Engineering", domain: "rvce.edu.in" },
  { name: "MSRIT", full: "M.S. Ramaiah Institute of Technology", domain: "msrit.edu" },
];

function logoFor(domain: string) {
  // Google's S2 favicon service returns real, high-res icons reliably across .edu/.ac.in domains
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function CollegeChip({ name, full, domain }: { name: string; full: string; domain: string }) {
  return (
    <div className="mx-3 inline-flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-card/80 px-5 py-3 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant">
      <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-border">
        <img
          src={logoFor(domain)}
          alt={`${name} logo`}
          width={40}
          height={40}
          loading="lazy"
          className="h-9 w-9 object-contain"
        />
      </div>
      <div className="text-left">
        <p className="font-display text-sm font-bold leading-tight">{name}</p>
        <p className="text-[11px] text-muted-foreground">{full}</p>
      </div>
    </div>
  );
}

export function CollegeMarquee() {
  const row = [...colleges, ...colleges];
  return (
    <div
      className="group relative w-full overflow-hidden py-2"
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
      }}
    >
      <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
        {row.map((c, i) => (
          <CollegeChip key={c.name + i} {...c} />
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}
