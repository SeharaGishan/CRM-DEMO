import { Contact } from "@/lib/types";

const colors = [
  "#2563EB,#7C3AED",
  "#059669,#22C55E",
  "#EA580C,#F59E0B",
  "#DB2777,#EC4899",
  "#0891B2,#06B6D4",
  "#4F46E5,#818CF8",
  "#B45309,#F59E0B",
  "#0D9488,#2DD4BF",
];

function color(i: number) {
  return colors[i % colors.length];
}

export const contacts: Contact[] = [
  { id: "ct-1", name: "Ruwan Jayasuriya", title: "Head of Procurement", companyId: "co-1", email: "ruwan.j@ceylonspicetraders.lk", phone: "+94 77 210 4432", tags: ["Decision Maker"], avatarColor: color(0), source: "Referral", createdAt: "2026-04-02" },
  { id: "ct-2", name: "Amaya Wickramasinghe", title: "Operations Manager", companyId: "co-1", email: "amaya.w@ceylonspicetraders.lk", phone: "+94 71 552 8810", tags: ["Champion"], avatarColor: color(1), source: "Referral", createdAt: "2026-04-02" },
  { id: "ct-3", name: "Michael Da Silva", title: "VP of Supply Chain", companyId: "co-2", email: "m.dasilva@horizonapparel.com", phone: "+94 76 340 1198", tags: ["Decision Maker", "VIP"], avatarColor: color(2), source: "Trade Show", createdAt: "2026-03-18" },
  { id: "ct-4", name: "Priyanka Rathnayake", title: "IT Director", companyId: "co-2", email: "priyanka.r@horizonapparel.com", phone: "+94 70 118 2265", tags: ["Champion"], avatarColor: color(3), source: "Trade Show", createdAt: "2026-03-18" },
  { id: "ct-5", name: "Dinesh Abeywardena", title: "CEO", companyId: "co-3", email: "dinesh@bluewavelogistics.com", phone: "+94 77 902 6631", tags: ["Decision Maker", "Hot Lead"], avatarColor: color(4), source: "LinkedIn", createdAt: "2026-05-10" },
  { id: "ct-6", name: "Sarah Fernando", title: "Fleet Operations Lead", companyId: "co-3", email: "sarah.f@bluewavelogistics.com", phone: "+94 71 664 9982", tags: ["Champion"], avatarColor: color(5), source: "LinkedIn", createdAt: "2026-05-10" },
  { id: "ct-7", name: "Kasun Perera", title: "Retail Ops Director", companyId: "co-4", email: "kasun.p@nextgenretail.com", phone: "+94 76 553 0071", tags: ["Decision Maker"], avatarColor: color(6), source: "Website", createdAt: "2026-02-27" },
  { id: "ct-8", name: "Nadia Hassan", title: "IT Manager", companyId: "co-4", email: "nadia.h@nextgenretail.com", phone: "+94 77 449 2201", tags: ["Cold Lead"], avatarColor: color(7), source: "Website", createdAt: "2026-02-27" },
  { id: "ct-9", name: "Chathura Gunawardena", title: "CFO", companyId: "co-5", email: "chathura.g@vantagefs.com", phone: "+94 70 887 3345", tags: ["Decision Maker", "VIP"], avatarColor: color(0), source: "Partner", createdAt: "2026-01-14" },
  { id: "ct-10", name: "Lakshmi Menon", title: "Head of Digital", companyId: "co-5", email: "lakshmi.m@vantagefs.com", phone: "+94 71 220 7784", tags: ["Champion"], avatarColor: color(1), source: "Partner", createdAt: "2026-01-14" },
  { id: "ct-11", name: "Ishara Bandara", title: "General Manager", companyId: "co-6", email: "ishara.b@coralbayresorts.lk", phone: "+94 77 664 3320", tags: ["Decision Maker"], avatarColor: color(2), source: "Referral", createdAt: "2026-05-29" },
  { id: "ct-12", name: "Tom Whitfield", title: "Regional Director", companyId: "co-6", email: "tom.w@coralbayresorts.lk", phone: "+94 76 118 9945", tags: ["Hot Lead"], avatarColor: color(3), source: "Referral", createdAt: "2026-05-29" },
  { id: "ct-13", name: "Dr. Anushka Silva", title: "Medical Director", companyId: "co-7", email: "anushka.s@metrohealthdx.com", phone: "+94 71 774 5512", tags: ["Decision Maker"], avatarColor: color(4), source: "Cold Outreach", createdAt: "2026-04-21" },
  { id: "ct-14", name: "Rajiv Kumar", title: "IT Systems Lead", companyId: "co-7", email: "rajiv.k@metrohealthdx.com", phone: "+94 70 330 1187", tags: ["Champion"], avatarColor: color(5), source: "Cold Outreach", createdAt: "2026-04-21" },
  { id: "ct-15", name: "Hasitha Karunaratne", title: "COO", companyId: "co-8", email: "hasitha.k@orbittelecom.com", phone: "+94 77 556 2298", tags: ["Decision Maker", "VIP"], avatarColor: color(6), source: "LinkedIn", createdAt: "2026-03-05" },
  { id: "ct-16", name: "Fathima Rizvi", title: "Procurement Lead", companyId: "co-8", email: "fathima.r@orbittelecom.com", phone: "+94 76 883 4471", tags: ["Champion"], avatarColor: color(7), source: "LinkedIn", createdAt: "2026-03-05" },
  { id: "ct-17", name: "Nimal Rodrigo", title: "Founder", companyId: "co-9", email: "nimal@greenfieldagro.lk", phone: "+94 71 992 3345", tags: ["Decision Maker", "Hot Lead"], avatarColor: color(0), source: "Website", createdAt: "2026-06-02" },
  { id: "ct-18", name: "Chamari Wijesekara", title: "Operations Head", companyId: "co-10", email: "chamari.w@skylinecon.com", phone: "+94 70 664 7723", tags: ["Decision Maker"], avatarColor: color(1), source: "Trade Show", createdAt: "2026-02-11" },
  { id: "ct-19", name: "Roshan De Zoysa", title: "Project Director", companyId: "co-10", email: "roshan.d@skylinecon.com", phone: "+94 77 118 6654", tags: ["Champion"], avatarColor: color(2), source: "Trade Show", createdAt: "2026-02-11" },
  { id: "ct-20", name: "Emily Zhang", title: "VP Operations", companyId: "co-11", email: "emily.z@primefreight.com", phone: "+94 76 442 9987", tags: ["Decision Maker"], avatarColor: color(3), source: "Referral", createdAt: "2026-05-16" },
  { id: "ct-21", name: "Buddhika Senanayake", title: "Managing Director", companyId: "co-12", email: "buddhika.s@emeraldisle.lk", phone: "+94 71 335 8820", tags: ["Decision Maker", "VIP"], avatarColor: color(4), source: "Cold Outreach", createdAt: "2026-01-29" },
  { id: "ct-22", name: "Yasodha Peiris", title: "Head of Exports", companyId: "co-13", email: "yasodha.p@cinnamongrandtea.lk", phone: "+94 70 556 1123", tags: ["Champion"], avatarColor: color(5), source: "Referral", createdAt: "2026-04-08" },
  { id: "ct-23", name: "Isuru Madushanka", title: "Sales Director", companyId: "co-13", email: "isuru.m@cinnamongrandtea.lk", phone: "+94 77 220 6631", tags: ["Decision Maker"], avatarColor: color(6), source: "Referral", createdAt: "2026-04-08" },
  { id: "ct-24", name: "Aisha Patel", title: "Marketing Director", companyId: "co-14", email: "aisha.p@auroradigital.com", phone: "+94 76 664 2298", tags: ["Hot Lead"], avatarColor: color(7), source: "Website", createdAt: "2026-06-20" },
  { id: "ct-25", name: "Devon Clarke", title: "CEO", companyId: "co-14", email: "devon.c@auroradigital.com", phone: "+94 71 883 5567", tags: ["Decision Maker"], avatarColor: color(0), source: "Website", createdAt: "2026-06-20" },
  { id: "ct-26", name: "Sanduni Ekanayake", title: "Finance Manager", companyId: "co-9", email: "sanduni.e@greenfieldagro.lk", phone: "+94 70 449 8871", tags: ["Cold Lead"], avatarColor: color(1), source: "Website", createdAt: "2026-06-02" },
];
