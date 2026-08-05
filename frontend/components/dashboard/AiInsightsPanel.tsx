"use client";

/**
 * Recent Invoices / Activity Panel
 * Styled after reference bottom left panel (Recent invoices):
 * Minimalist dark list, sharp borders, clean font-poppins typography.
 */

const invoices = [
  {
    id: "INV-2026-0089",
    vendor: "PT Sinar Jaya",
    amount: "$4,250.00",
    status: "3-Way Mismatch",
    date: "Aug 5, 2026",
  },
  {
    id: "INV-2026-0088",
    vendor: "PT Logitrans Express",
    amount: "$1,820.00",
    status: "Approved",
    date: "Aug 5, 2026",
  },
  {
    id: "INV-2026-0087",
    vendor: "PT Astra Komponen",
    amount: "$12,400.00",
    status: "Approved",
    date: "Aug 4, 2026",
  },
];

export function AiInsightsPanel() {
  return (
    <div className="flex flex-col h-full bg-[#000000] border-b border-r border-white/10 p-6 rounded-none font-poppins">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-sm font-semibold font-poppins">
          Recent invoices
        </h3>
        <span className="text-white/40 text-xs font-poppins hover:text-white cursor-pointer transition-colors">
          View all
        </span>
      </div>

      <div className="divide-y divide-white/10 border-t border-b border-white/10">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between py-3 font-poppins text-xs"
          >
            <div className="flex flex-col">
              <span className="text-white font-medium">{inv.id}</span>
              <span className="text-white/40 text-[11px]">{inv.vendor}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-white/60 font-medium">{inv.amount}</span>
              <span
                className={`text-[10px] px-2 py-0.5 border ${
                  inv.status === "Approved"
                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                    : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                }`}
              >
                {inv.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
