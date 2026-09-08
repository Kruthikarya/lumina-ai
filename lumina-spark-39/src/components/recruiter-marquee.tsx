const companies = [
  { name: "Google", domain: "google.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Adobe", domain: "adobe.com" },
  { name: "Cisco", domain: "cisco.com" },
  { name: "IBM", domain: "ibm.com" },
  { name: "Infosys", domain: "infosys.com" },
  { name: "TCS", domain: "tcs.com" },
  { name: "Accenture", domain: "accenture.com" },
  { name: "Capgemini", domain: "capgemini.com" },
  { name: "Wipro", domain: "wipro.com" },
  { name: "Oracle", domain: "oracle.com" },
  { name: "Deloitte", domain: "deloitte.com" },
  { name: "Samsung", domain: "samsung.com" },
  { name: "Intel", domain: "intel.com" },
];

function clearbit(domain: string) {
  return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
}

export function RecruiterGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {companies.map((c) => (
        <div
          key={c.name}
          className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
        >
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-border">
            <img
              src={clearbit(c.domain)}
              alt={`${c.name} logo`}
              width={36}
              height={36}
              loading="lazy"
              className="h-8 w-8 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`;
              }}
            />
          </div>
          <span className="text-sm font-semibold tracking-tight">{c.name}</span>
        </div>
      ))}
    </div>
  );
}
