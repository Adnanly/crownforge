export type TeamSocial = {
  x?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  website?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  social?: TeamSocial;
};

export const teamMembers: TeamMember[] = [
  { name: "Anuj", role: "Founder" },
  { name: "Adnan", role: "Chief Operating Officer" },
  { name: "Ayush", role: "Chief Creative Officer" },
  { name: "Pratik", role: "Chief Technology Officer" },
  { name: "Anvir", role: "Chief Finance Officer" },
];

export function getTeamMembers(): TeamMember[] {
  return teamMembers;
}
