import ojtMorirokuTeamImg from '../images/web/ojt-moriroku-team.jpg'
import sirLyndonImg from '../images/web/sir-lyndon.jpg'
import { ExperienceHighlight, ExperiencePhotoHighlight } from './types'

export const EXPERIENCE_HIGHLIGHTS: ExperienceHighlight[] = [
  {
    id: 'exp-moriroku',
    role: 'Information Technology Intern / Software Developer',
    company: 'Moriroku Philippines, Inc.',
    location: 'Laguna Technopark, Biñan, Laguna',
    period: 'June 8 – August 8, 2026 (248 Hours)',
    badge: 'Rated Outstanding',
    points: [
      'Built the Gate Pass Request System in ASP.NET Core and MariaDB for employee and material passes, approval routing, digital signatures, A6 slips, and QR gate tracking.',
      'Developed the HRAD Monitoring System and supported the internal IT ticketing workflow.',
      'Resolved daily office and manufacturing IT helpdesk tickets covering internet, Wi-Fi, printers, local servers, and workstation setups.',
    ],
  },
  {
    id: 'exp-buildbid',
    role: 'Lead UI/UX & Full-Stack Infrastructure Developer',
    company: 'BuildBid (thebuildbid.com)',
    location: 'Calamba City, Laguna (Hybrid)',
    period: 'June – August 2026',
    badge: 'Live Pilot',
    points: [
      'Architected a sealed-bid construction marketplace with Next.js 16, React 19, TypeScript, Tailwind v4, and Supabase PostgreSQL.',
      'Enforced rival bid secrecy and PII protection directly in SQL Row Level Security policies verified by automated probe scripts.',
      'Delivered Leaflet/PSGC proximity search, Excel BOQ import (SheetJS), AI BOQ extraction, and GitHub Actions CI + Vitest.',
    ],
  },
]

export const OJT_EXPERIENCE_PHOTOS: ExperiencePhotoHighlight[] = [
  {
    id: 'ojt-team',
    src: ojtMorirokuTeamImg,
    label: 'Moriroku IT Crew',
    caption: 'Quick coffee break with Sir Lyndon & Moriroku IT teammates in Laguna',
    cardId: 'ref-lyndon',
  },
  {
    id: 'ojt-cert',
    src: '/assets/achievements/moriroku-ojt.png',
    label: '248-Hour Certificate',
    caption: 'Moriroku Philippines, Inc. internship completion (Rated Outstanding)',
    cardId: 'gatepass',
  },
  {
    id: 'ojt-lyndon',
    src: sirLyndonImg,
    label: 'Sir Lyndon Balois',
    caption: 'IT Senior Supervisor who reviewed GatePass & HRAD sprints',
    cardId: 'ref-lyndon',
  },
]
