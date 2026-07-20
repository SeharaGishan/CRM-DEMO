import { Employee } from "@/lib/types";

const colors = [
  "#2563EB,#7C3AED",
  "#059669,#22C55E",
  "#EA580C,#F59E0B",
  "#DB2777,#EC4899",
  "#0891B2,#06B6D4",
  "#4F46E5,#818CF8",
];

export const employees: Employee[] = [
  { id: "em-1", name: "Sanjaya Wickrama", role: "Senior Sales Executive", department: "Sales", email: "sanjaya.w@sharkonix.com", phone: "+94 77 112 4456", avatarColor: colors[0], status: "active", joinedAt: "2025-02-10" },
  { id: "em-2", name: "Ashan Fernando", role: "Sales Executive", department: "Sales", email: "ashan.f@sharkonix.com", phone: "+94 71 334 7789", avatarColor: colors[1], status: "active", joinedAt: "2025-06-01" },
  { id: "em-3", name: "Mihiri Jayawardena", role: "Account Manager", department: "Sales", email: "mihiri.j@sharkonix.com", phone: "+94 76 220 9981", avatarColor: colors[2], status: "active", joinedAt: "2025-03-18" },
  { id: "em-4", name: "Ruvindu Costa", role: "Business Development Rep", department: "Sales", email: "ruvindu.c@sharkonix.com", phone: "+94 70 556 3312", avatarColor: colors[3], status: "active", joinedAt: "2025-09-05" },
  { id: "em-5", name: "Nadeesha Rajapaksha", role: "Customer Support Lead", department: "Support", email: "nadeesha.r@sharkonix.com", phone: "+94 77 884 2231", avatarColor: colors[4], status: "active", joinedAt: "2025-01-22" },
  { id: "em-6", name: "Chamodi Silva", role: "Sales Manager", department: "Management", email: "chamodi.s@sharkonix.com", phone: "+94 71 449 8865", avatarColor: colors[5], status: "inactive", joinedAt: "2024-11-12" },
];
