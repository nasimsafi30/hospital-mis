import { existsSync } from "fs";

const files = [
  "src/app/page.tsx", "src/app/layout.tsx", "src/app/not-found.tsx", "src/app/error.tsx",
  "src/app/login/page.tsx", "src/app/forgot-password/page.tsx", "src/app/reset-password/page.tsx",
  "src/app/dashboard/layout.tsx", "src/app/dashboard/page.tsx",
  "src/app/dashboard/patients/page.tsx", "src/app/dashboard/doctors/page.tsx",
  "src/app/dashboard/appointments/page.tsx", "src/app/dashboard/billing/page.tsx",
  "src/app/dashboard/pharmacy/page.tsx", "src/app/dashboard/laboratory/page.tsx",
  "src/app/dashboard/inventory/page.tsx", "src/app/dashboard/settings/page.tsx",
];

let missing = 0;
files.forEach(f => {
  if (existsSync(f)) console.log(`✅ ${f}`);
  else { console.log(`❌ MISSING: ${f}`); missing++; }
});

console.log(`\n${missing === 0 ? "🎉 ALL FILES PRESENT!" : `⚠️ ${missing} files missing`}`);
process.exit(missing > 0 ? 1 : 0);
