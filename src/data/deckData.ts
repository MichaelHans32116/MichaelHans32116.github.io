import buildbidHomeImg from '../images/buildbid/01-home.png'
import buildbidQuotesImg from '../images/buildbid/05-compare-quotes.png'
import gatepassLoginImg from '../images/gatepass/01-gatepass-login.jpg'
import gatepassScannerImg from '../images/gatepass/02-gatepass-qr-scanner.jpg'
import gatepassCalendarImg from '../images/gatepass/03-gatepass-calendar-clean.png'
import hradLoginImg from '../images/hrad/01-hrad-login.png'
import hradDashboardImg from '../images/hrad/02-hrad-admin-dashboard.png'
import hradTicketImg from '../images/hrad/03-hrad-submit-ticket.png'
import insectraAppImg from '../images/insectra-app/00-app-cardmaker-square.png'
import insectraLiveHeroImg from '../images/insectra-web/00-live-hero-final.jpg'
import insectraSplashImg from '../images/insectra-web/00-brand-splash.jpg'
import insectraMapImg from '../images/insectra-web/03-expert-portal-map.png'
import adAstraCampImg from '../images/web/ad-astra-camp.jpg'
import adAstraMeetImg from '../images/web/ad-astra-meet.jpg'
import codechumSirAdeImg from '../images/web/codechum-sir-ade.jpg'
import codechumVictoryImg from '../images/web/codechum-victory.jpg'
import hackforgovBeforeImg from '../images/web/hackforgov-before.jpg'
import hackforgovNameImg from '../images/web/hackforgov-name.jpg'
import hackforgovOfficialImg from '../images/web/hackforgov-official.jpg'
import hackforgovTeamImg from '../images/web/hackforgov-team.jpg'
import howconnectGroupImg from '../images/web/howconnect-group.jpg'
import howconnectSystemImg from '../images/web/howconnect-system.jpg'
import insectraAgriImg from '../images/web/insectra-agri.jpg'
import insectraDefendedImg from '../images/web/insectra-defended.jpg'
import insectraEntomologistImg from '../images/web/insectra-entomologist.jpg'
import insectraFarmImg from '../images/web/insectra-farm.jpg'
import insectraFarmerImg from '../images/web/insectra-farmer.jpg'
import ojtMorirokuTeamImg from '../images/web/ojt-moriroku-team.jpg'
import sirLyndonImg from '../images/web/sir-lyndon.jpg'
import topcitExamImg from '../images/web/topcit-exam.jpg'

export type DeckCategory = 'all' | 'projects' | 'achievements' | 'references' | 'side'
export type CardCategory = 'projects' | 'achievements' | 'references'
export type YgoCardFrame = 'trap' | 'spell' | 'monster'
export type VisualKind = 'logo' | 'screenshot' | 'badge-icon'

export interface DeckLink {
  label: string
  url: string
  kind: 'live' | 'github' | 'mobile' | 'zip'
}

export interface DeckPreviewImage {
  src: string
  label: string
}

export interface DeckCardItem {
  id: string
  category: CardCategory
  ygoFrame: YgoCardFrame
  ygoTypeLine: string
  ygoSubHeader: string
  ygoAttribute?: 'LIGHT' | 'EARTH'
  ygoStars?: number
  ygoAtk?: string
  ygoDef?: string
  ygoSetCode: string
  typeTag: string
  title: string
  subtitle: string
  cardEffect: string
  visualKind: VisualKind
  imageSrc?: string
  previewImages?: DeckPreviewImage[]
  supportingImage?: string
  supportingCaption?: string
  videoSrc?: string
  period: string
  roleOrIssuer: string
  metricBadge?: string
  stack?: string[]
  details: {
    headingA: string
    bodyA: string
    headingB: string
    bodyB: string
    bullets: string[]
  }
  links: DeckLink[]
  note?: string
}

export interface SideWorkItem {
  id: string
  title: string
  role: string
  summary: string
  image: string
  links: DeckLink[]
}

export interface ExperienceHighlight {
  id: string
  role: string
  company: string
  location: string
  period: string
  badge: string
  points: string[]
}

export interface StandoutHighlight {
  id: string
  cardId: string
  title: string
  metric: string
  issuer: string
}

export const DECK_BOX_COVERS = {
  projects: buildbidHomeImg,
  achievements: hackforgovOfficialImg,
  references: ojtMorirokuTeamImg,
  side: '/assets/projects/salinlahi.png',
} as const

export const PROFILE = {
  fullName: 'Michael Hans G. Magbojos',
  shortName: 'Michael Hans',
  role: 'Full-Stack & Systems Developer',
  location: 'Calamba City, Laguna, Philippines',
  school: 'FAITH Colleges, BS Information Technology (4th Year)',
  ojtWindow: 'Available for 600-hour OJT (Dec 2026 – Mar 2027)',
  emailPersonal: 'magbojosmichaelhans@gmail.com',
  emailSchool: 's2023101036@firstasia.edu.ph',
  phone: '09947140891',
  phoneTel: '+639947140891',
  githubMain: 'https://github.com/MichaelHans32116',
  githubAlt: 'https://github.com/hans32116',
  linkedin: 'https://www.linkedin.com/in/hans-magbojos/',
  resumeUrl: '/assets/Magbojos_MichaelHans_Resume_CV.pdf',
  heroHeadline: 'Michael Hans Magbojos',
  heroBio:
    "Hi, I'm Hans, a 4th-year BSIT student and DOST-SEI Scholar at FAITH Colleges. I spend most of my time building database-heavy web apps, writing SQL security rules, and shipping internal tools.",
}

export const STANDOUT_HIGHLIGHTS: StandoutHighlight[] = [
  {
    id: 'st-topcit',
    cardId: 'topcit',
    title: 'TOPCIT Level 3 Certified',
    metric: '410 / 1000',
    issuer: 'IITP, Republic of Korea (Jul 2026)',
  },
  {
    id: 'st-hackforgov',
    cardId: 'hackforgov',
    title: 'DICT HackForGov 5 CTF: Top Individual Scorer',
    metric: 'CALABARZON #1, Finals Wildcard',
    issuer: 'DICT Region IV-A (Oct 2026)',
  },
  {
    id: 'st-isite',
    cardId: 'isite-java',
    title: 'ISITE–CodeChum National Java Competition',
    metric: '100% Score (65/65), 6th Overall',
    issuer: 'iSITE National (Apr 2026)',
  },
  {
    id: 'st-dost',
    cardId: 'dost-scholar',
    title: 'DOST-SEI Undergraduate Merit Scholar',
    metric: 'Batch 2023 Qualifier',
    issuer: 'Department of Science and Technology',
  },
  {
    id: 'st-adastra',
    cardId: 'ad-astra',
    title: 'Ad Astra Manuel Quezon Scholar',
    metric: '100% Tuition, 5x President’s Lister',
    issuer: 'FAITH Colleges (Since Sep 2023)',
  },
]

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

export const EDUCATION_INFO = {
  institution: 'FAITH Colleges (First Asia Institute of Technology and Humanities)',
  location: 'Tanauan City, Batangas',
  degree: 'Bachelor of Science in Information Technology, 4th Year (Aug 2023 – Present)',
  honors: [
    'DOST-SEI Undergraduate Merit Scholar (Batch 2023)',
    'Ad Astra Manuel Quezon Scholar (FAITH Colleges)',
    'Consistent President’s Lister (5x)',
  ],
}

export const DECK_CARDS: DeckCardItem[] = [
  // PROJECTS -> TRAP CARDS (6 Cards)
  {
    id: 'buildbid',
    category: 'projects',
    ygoFrame: 'trap',
    ygoSubHeader: '[Continuous Trap Card]',
    ygoTypeLine: 'Continuous Trap Card',
    ygoSetCode: 'PROJ-001',
    typeTag: 'Trap Card',
    title: 'BuildBid',
    subtitle: 'thebuildbid.com',
    cardEffect:
      'Sealed-bid construction marketplace (thebuildbid.com) connecting contractors and suppliers directly, keeping rival quotes and private business contacts locked inside PostgreSQL RLS.',
    visualKind: 'logo',
    imageSrc: '/assets/cards/buildbid-logo.png',
    previewImages: [
      { src: buildbidHomeImg, label: 'Role Gateway' },
      { src: buildbidQuotesImg, label: 'Compare Quotes' },
    ],
    period: 'June – August 2026',
    roleOrIssuer: 'Lead UI/UX & Full-Stack Developer',
    metricBadge: 'Live Pilot',
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind v4',
      'Supabase (Postgres / RLS)',
      'Leaflet + PSGC',
      'SheetJS',
      'Claude Vision',
      'Vercel',
      'Vitest + GitHub Actions',
    ],
    details: {
      headingA: 'Problem Solved',
      bodyA:
        'Contractors lose margin to middlemen and opaque pricing, while open bidding leaks rival supplier quotes and private business numbers.',
      headingB: 'Architecture & Execution',
      bodyB:
        'Built with Next.js 16, TypeScript, and Supabase PostgreSQL. Sealed-bid privacy, split awards, and PII guards run at the SQL RLS layer verified by direct API probes.',
      bullets: [
        'Shipped from initial architecture through live pilot deployment on Vercel',
        'Leaflet + Philippine PSGC supplier geolocation proximity search',
        'Excel/CSV BOQ bulk import (SheetJS) & Claude Vision BOQ extraction',
        'GitHub Actions CI running ESLint, tsc --noEmit, Vitest quote tests, and build verification',
      ],
    },
    links: [
      { label: 'thebuildbid.com', url: 'https://thebuildbid.com', kind: 'live' },
      { label: 'GitHub', url: 'https://github.com/MichaelHans32116/BuildBid', kind: 'github' },
    ],
  },
  {
    id: 'insectra',
    category: 'projects',
    ygoFrame: 'trap',
    ygoSubHeader: '[Counter Trap Card]',
    ygoTypeLine: 'Counter Trap Card',
    ygoSetCode: 'PROJ-002',
    typeTag: 'Trap Card',
    title: 'InsecTra',
    subtitle: 'insectra.app',
    cardEffect:
      'Solar-powered Raspberry Pi trap running YOLO11 computer vision to count melon fruit flies in the field and stream telemetry to AWS EC2, ALB, Auto Scaling, RDS & S3 (insectra.app).',
    visualKind: 'logo',
    imageSrc: '/assets/cards/insectra-logo.png',
    previewImages: [
      { src: insectraLiveHeroImg, label: 'Live Website' },
      { src: insectraSplashImg, label: 'Brand Splash' },
      { src: insectraMapImg, label: 'Expert Map' },
      { src: insectraAppImg, label: 'Mobile App' },
      { src: insectraDefendedImg, label: 'Capstone Defended' },
      { src: insectraFarmImg, label: 'Field Farm Test' },
      { src: insectraAgriImg, label: 'City Agriculture' },
      { src: insectraEntomologistImg, label: 'Entomologist Review' },
      { src: insectraFarmerImg, label: 'Farmer Interview' },
    ],
    period: 'Jan – Nov 2026 (Defended)',
    roleOrIssuer: 'Capstone Team Lead',
    metricBadge: 'AWS + YOLO11',
    stack: ['Python', 'YOLO11', 'Raspberry Pi', 'AWS EC2', 'AWS ALB & Auto Scaling', 'AWS RDS & S3', 'React Native'],
    details: {
      headingA: 'Problem Solved',
      bodyA:
        'Melon fruit flies damage bitter gourd farms before manual checks catch population spikes.',
      headingB: 'Architecture & Execution',
      bodyB:
        'Led our 3-member capstone team building a solar-powered IoT trap running trained YOLO11 models, syncing trap counts, weather logs, and field history to AWS and a companion mobile app.',
      bullets: [
        'Defended Nov 2026 after multi-module hardware & software UAT verification',
        'Multi-tier AWS backend with Application Load Balancer, Auto Scaling, RDS & S3',
      ],
    },
    links: [{ label: 'insectra.app', url: 'https://insectra.app', kind: 'live' }],
    note: 'AWS cloud backend active',
  },
  {
    id: 'gatepass',
    category: 'projects',
    ygoFrame: 'trap',
    ygoSubHeader: '[Counter Trap Card]',
    ygoTypeLine: 'Counter Trap Card',
    ygoSetCode: 'PROJ-003',
    typeTag: 'Trap Card',
    title: 'Moriroku GatePass',
    subtitle: 'ASP.NET Core (.NET 8) & MariaDB',
    cardEffect:
      'Replaces manual plant gate slips with multi-stage supervisor approvals, digital signatures, A6 printables, fleet scheduling & QR guard-house scans in ASP.NET Core (.NET 8) and MariaDB.',
    visualKind: 'screenshot',
    imageSrc: '/assets/projects/gatepass-system.png',
    previewImages: [
      { src: gatepassCalendarImg, label: 'Fleet Calendar' },
      { src: gatepassScannerImg, label: 'QR Guard Scanner' },
      { src: gatepassLoginImg, label: 'Sign-In Portal' },
    ],
    period: 'June – August 2026',
    roleOrIssuer: 'IT Intern at Moriroku Philippines, Inc.',
    metricBadge: 'Outstanding',
    stack: ['C#', 'ASP.NET Core', '.NET 8', 'MariaDB', 'Docker', 'QR Tracking', 'Digital Signatures'],
    details: {
      headingA: 'Problem Solved',
      bodyA:
        'Paper gate slips slowed down supervisor sign-offs and complicated plant guard-house audit reconciliation.',
      headingB: 'Architecture & Execution',
      bodyB:
        'Containerized ASP.NET Core (.NET 8) REST API and web client backed by MariaDB, paired with a Python signature-compression service and QR scan logs.',
      bullets: [
        'Multi-stage approval routing, digital signatures, and A6 print slips',
        'Resolved UAT bugs across approval visibility, signature capture, and session cleanup',
      ],
    },
    links: [],
    note: 'Sanitized demo preparing for AWS deploy',
  },
  {
    id: 'hrad',
    category: 'projects',
    ygoFrame: 'trap',
    ygoSubHeader: '[Continuous Trap Card]',
    ygoTypeLine: 'Continuous Trap Card',
    ygoSetCode: 'PROJ-004',
    typeTag: 'Trap Card',
    title: 'Moriroku HRAD Ticketing',
    subtitle: 'Internal HR & Admin Service Desk',
    cardEffect:
      'Internal HR & Administration monitoring and ticketing platform routing employee requests across departments with JWT access, stored procedures & MariaDB audit logs.',
    visualKind: 'screenshot',
    imageSrc: hradDashboardImg,
    previewImages: [
      { src: hradDashboardImg, label: 'Admin Dashboard' },
      { src: hradTicketImg, label: 'Ticket Form' },
      { src: hradLoginImg, label: 'Login Gate' },
    ],
    period: 'June – August 2026',
    roleOrIssuer: 'Co-Builder at Moriroku Philippines, Inc.',
    metricBadge: '.NET 8 + MariaDB',
    stack: ['C#', 'ASP.NET Core', '.NET 8', 'MariaDB', 'Docker', 'JWT Auth', 'Stored Procedures'],
    details: {
      headingA: 'Problem Solved',
      bodyA:
        'Internal HR and Admin service requests needed centralized status tracking, file uploads, and role-scoped routing.',
      headingB: 'Architecture & Execution',
      bodyB:
        'Built with ASP.NET Core (.NET 8) API, MariaDB stored procedures and views, JWT authentication, and Docker containers.',
      bullets: [
        'Department-level ticket routing, status tracking, and attachment uploads',
        'Developed alongside IT/HRAD staff during internship',
      ],
    },
    links: [],
    note: 'Sanitized demo preparing for AWS deploy',
  },
  {
    id: 'howconnect',
    category: 'projects',
    ygoFrame: 'trap',
    ygoSubHeader: '[Trap Card]',
    ygoTypeLine: 'Normal Trap Card',
    ygoSetCode: 'PROJ-005',
    typeTag: 'Trap Card',
    title: 'HowConnect',
    subtitle: 'React Native (Expo) + .NET 8 + SQL Server',
    cardEffect:
      'Connects a Vercel web client and Expo React Native mobile app to one C# (.NET 8) REST backend and normalized SQL Server core for House of Worship Los Baños.',
    visualKind: 'screenshot',
    imageSrc: '/assets/projects/howconnect-web.png',
    previewImages: [
      { src: howconnectSystemImg, label: 'Events & Calendar' },
      { src: '/assets/projects/howconnect-web.png', label: 'Web Portal' },
      { src: howconnectGroupImg, label: 'HoW Connect Team' },
    ],
    period: 'Dec 2025 – Apr 2026',
    roleOrIssuer: 'Project Manager & Full-Stack Developer',
    metricBadge: 'Web + Expo',
    stack: ['C#', '.NET 8', 'SQL Server', 'React Native', 'Expo', 'JavaScript', 'Vercel'],
    details: {
      headingA: 'Problem Solved',
      bodyA:
        'Coordinated web and mobile client applications for House of Worship Los Baños sharing a consistent SQL Server database and API contract.',
      headingB: 'Architecture & Execution',
      bodyB:
        'Owned sprint management across three collaborated courses, SQL Server schema design, C# API endpoints, Vercel web portal, and Expo React Native mobile builds.',
      bullets: [
        'Unified REST backend serving both web and mobile clients',
        'Led sprint coordination and integration debugging',
      ],
    },
    links: [
      { label: 'Live Site', url: 'https://how-connect-web.vercel.app/', kind: 'live' },
      {
        label: 'Expo Build',
        url: 'https://expo.dev/accounts/hans32116/projects/how-connect-expo/builds/e995fbdd-1ec3-4ad2-9504-3b8e273fc271',
        kind: 'mobile',
      },
    ],
  },
  {
    id: 'collabs',
    category: 'projects',
    ygoFrame: 'trap',
    ygoSubHeader: '[Trap Card]',
    ygoTypeLine: 'Normal Trap Card',
    ygoSetCode: 'PROJ-006',
    typeTag: 'Trap Card',
    title: 'Cloud & QA Collabs',
    subtitle: 'Salinlahi, Gabay, StarQueen & HanapLokal',
    cardEffect:
      'Azure/SQL database wiring, responsive UI bug fixes, and exploratory QA triage across four live collaborative Vercel web apps: Salinlahi, Gabay Halaman, StarQueen PMTS & HanapLokal.',
    visualKind: 'screenshot',
    imageSrc: '/assets/projects/salinlahi.png',
    previewImages: [
      { src: '/assets/projects/salinlahi.png', label: 'Salinlahi' },
      { src: '/assets/projects/gabay-halam.png', label: 'Gabay Halaman' },
      { src: '/assets/projects/starqueen-web.png', label: 'StarQueen' },
      { src: '/assets/projects/hanaplokal.png', label: 'HanapLokal' },
    ],
    period: '2025 – 2026',
    roleOrIssuer: 'Co-Author, Cloud DB & QA Support',
    metricBadge: '4 Live Sites',
    stack: ['Microsoft Azure', 'SQL Server', 'JavaScript', 'Responsive CSS', 'Manual QA', 'Vercel'],
    details: {
      headingA: 'Transparent Role Attribution',
      bodyA:
        'Co-authored Azure/SQL deployments for Gabay Halaman & StarQueen PMTS, responsive UI fixes on Salinlahi, and QA bug hunting on HanapLokal.',
      headingB: 'Live Deployments',
      bodyB: 'All four collaborative apps remain deployed live on Vercel for review.',
      bullets: [
        'Salinlahi: client-side logic and responsive CSS fixes',
        'Gabay Halaman & StarQueen PMTS: Azure DB setup and server deployment',
        'HanapLokal: manual QA and bug hunting',
      ],
    },
    links: [
      { label: 'Salinlahi', url: 'https://salinlahi-eight.vercel.app/', kind: 'live' },
      { label: 'Gabay Halaman', url: 'https://gabay-halam.vercel.app/', kind: 'live' },
      { label: 'StarQueen', url: 'https://starqueen-web.vercel.app/', kind: 'live' },
      { label: 'HanapLokal', url: 'https://hanaplokal.vercel.app/', kind: 'live' },
    ],
  },

  // ACHIEVEMENTS -> SPELL CARDS (5 Cards)
  {
    id: 'topcit',
    category: 'achievements',
    ygoFrame: 'spell',
    ygoSubHeader: '[Continuous Spell Card]',
    ygoTypeLine: 'Continuous Spell Card',
    ygoSetCode: 'ACHV-001',
    typeTag: 'Spell Card',
    title: 'TOPCIT Level 3',
    subtitle: 'Score 410 / 1000 (#TL2603001540)',
    cardEffect:
      'IITP South Korea practical ICT certification (Score: 410/1000) verifying software architecture, SQL data management, networking, ethics & security.',
    visualKind: 'screenshot',
    imageSrc: '/assets/achievements/topcit-certificate.png',
    previewImages: [
      { src: '/assets/achievements/topcit-certificate.png', label: 'Official Certificate' },
      { src: topcitExamImg, label: 'Exam Day' },
    ],
    period: 'July 23, 2026',
    roleOrIssuer: 'IITP, Republic of Korea (Level 3)',
    metricBadge: '410 / 1000',
    details: {
      headingA: 'Assessment Scope',
      bodyA:
        'Test of Practical Competency in ICT administered under IITP Korea evaluating software coding, data management, architecture, security, and project management.',
      headingB: 'Verified Score',
      bodyB: 'Achieved Level 3 certification (410 / 1000, Certificate #TL2603001540).',
      bullets: [
        'Evaluated across practical coding and systems architecture tasks',
        'Official certificate attached for direct recruiter inspection',
      ],
    },
    links: [],
  },
  {
    id: 'hackforgov',
    category: 'achievements',
    ygoFrame: 'spell',
    ygoSubHeader: '[Quick-Play Spell Card]',
    ygoTypeLine: 'Quick-Play Spell Card',
    ygoSetCode: 'ACHV-002',
    typeTag: 'Spell Card',
    title: 'DICT HackForGov 5 CTF',
    subtitle: 'CALABARZON Top Individual Scorer',
    cardEffect:
      'Named CALABARZON Top Individual Scorer in the Region IV-A Capture-The-Flag cybersecurity competition (Tagaytay, Cavite), earning a National Finals wildcard.',
    visualKind: 'screenshot',
    imageSrc: '/assets/achievements/hackforgov.jpg',
    previewImages: [
      { src: hackforgovOfficialImg, label: 'Competition Action' },
      { src: hackforgovTeamImg, label: 'Team Table' },
      { src: hackforgovBeforeImg, label: 'Before Round' },
      { src: hackforgovNameImg, label: 'Team Nameplate' },
      { src: '/assets/achievements/hackforgov.jpg', label: 'Certificates' },
      { src: '/assets/achievements/hackforgov-stage.jpg', label: 'Awarding Stage' },
    ],
    period: 'October 15, 2026',
    roleOrIssuer: 'DICT Cybersecurity Bureau (Region IV-A)',
    metricBadge: 'Top Individual',
    details: {
      headingA: 'Competition Overview',
      bodyA:
        'Regional Capture-The-Flag contest testing web exploitation, forensics, cryptography, and reverse engineering under timed conditions at Splendido Tagaytay.',
      headingB: 'Result',
      bodyB: 'Named Top Individual Scorer in CALABARZON (earning National Finals wildcard) and 7th overall as a team.',
      bullets: [
        'Top Individual CTF Scorer in Region IV-A',
        'Security mindset applied directly to SQL RLS & API hardening',
      ],
    },
    links: [],
  },
  {
    id: 'isite-java',
    category: 'achievements',
    ygoFrame: 'spell',
    ygoSubHeader: '[Quick-Play Spell Card]',
    ygoTypeLine: 'Quick-Play Spell Card',
    ygoSetCode: 'ACHV-003',
    typeTag: 'Spell Card',
    title: 'ISITE-CodeChum Java',
    subtitle: 'Top 6 Overall, Perfect Score (65/65)',
    cardEffect:
      'Placed 6th overall nationwide with a 100% perfect score in Java programming, representing FAITH Colleges under national competition rules.',
    visualKind: 'screenshot',
    imageSrc: '/assets/achievements/isite-java.png',
    previewImages: [
      { src: '/assets/achievements/isite-java.png', label: '6th Overall (65/65)' },
      { src: codechumVictoryImg, label: 'Victory Chickenjoy' },
      { src: codechumSirAdeImg, label: 'Briefing w/ Sir Ade' },
    ],
    period: 'April 2026',
    roleOrIssuer: 'iSITE National Programming Competition',
    metricBadge: 'Top 6 (65/65)',
    details: {
      headingA: 'Competition Overview',
      bodyA:
        'Nationwide timed Java programming competition measuring algorithmic accuracy, time complexity discipline, and edge-case handling.',
      headingB: 'Result',
      bodyB: 'Earned a 100% perfect score (65/65 in 56:17) across all test cases and placed 6th overall nationwide.',
      bullets: ['100% perfect test-case pass rate (65/65)', '6th place overall nationwide'],
    },
    links: [],
  },
  {
    id: 'dost-scholar',
    category: 'achievements',
    ygoFrame: 'spell',
    ygoSubHeader: '[Field Spell Card]',
    ygoTypeLine: 'Field Spell Card',
    ygoSetCode: 'ACHV-004',
    typeTag: 'Spell Card',
    title: 'DOST-SEI Merit Scholar',
    subtitle: 'Batch 2023 Qualifier',
    cardEffect:
      'Batch 2023 DOST-SEI Undergraduate Merit Scholar (9,776 qualifiers / 79,585 examinees, List H-O: Magbojos, Michael Hans Gonzales).',
    visualKind: 'logo',
    imageSrc: '/assets/achievements/dost-seal.webp',
    supportingImage: '/assets/achievements/dost-seal.webp',
    supportingCaption: 'DOST-SEI Undergraduate Merit Scholarship (Batch 2023, List H–O)',
    period: '2023 – Present',
    roleOrIssuer: 'Department of Science and Technology (DOST-SEI)',
    metricBadge: 'Batch 2023 Merit',
    details: {
      headingA: 'Batch 2023 Official Qualifier',
      bodyA:
        'Qualified under the 2023 DOST-SEI Undergraduate S&T Scholarship Program (released June 25, 2023; listed under H-O: Magbojos, Michael Hans Gonzales, Merit Scholarship Program, 4,215 Merit qualifiers out of 79,585 examinees nationwide).',
      headingB: 'Sustained Academic Standing',
      bodyB:
        'Maintained full scholarship standing throughout BS Information Technology at FAITH Colleges while shipping enterprise internship systems.',
      bullets: [
        'Official Batch 2023 Merit Qualifier (Magbojos, Michael Hans Gonzales)',
        'BSIT 4th Year, Class of 2027',
      ],
    },
    links: [{ label: 'DOST-SEI Portal', url: 'https://www.sei.dost.gov.ph/', kind: 'live' }],
    note: 'Batch 2023 Passers List (H–O): Magbojos, Michael Hans Gonzales',
  },
  {
    id: 'ad-astra',
    category: 'achievements',
    ygoFrame: 'spell',
    ygoSubHeader: '[Field Spell Card]',
    ygoTypeLine: 'Field Spell Card',
    ygoSetCode: 'ACHV-004b',
    typeTag: 'Spell Card',
    title: 'AD-Astra Manuel Quezon',
    subtitle: '100% Tuition, 5x President’s Lister',
    cardEffect:
      'Scholarship granted by FAITH Colleges for academically competent qualifiers: 100% off tuition fees and 50% off miscellaneous fees while maintaining a GPA above 85.0%.',
    visualKind: 'screenshot',
    imageSrc: '/assets/achievements/ad-astra.png',
    previewImages: [
      { src: '/assets/achievements/ad-astra.png', label: 'Official Certificate' },
      { src: adAstraCampImg, label: 'Ad Astra Scholar Camp' },
      { src: adAstraMeetImg, label: 'Scholar Assembly' },
    ],
    period: 'September 2023 – Present',
    roleOrIssuer: 'FAITH Colleges (Class of 2027)',
    metricBadge: '100% Tuition Grant',
    details: {
      headingA: 'Scholarship Grant',
      bodyA:
        'Awarded the Ad Astra Manuel Quezon Scholarship by FAITH Colleges on September 9, 2023 after passing the institutional scholarship evaluation.',
      headingB: 'Academic Consistency & Scholar Community',
      bodyB:
        'Covers 100% of tuition fees and 50% of miscellaneous fees by keeping a GPA above 85.0%, with 5x President’s Lister honors and active scholar camp events.',
      bullets: [
        '100% tuition grant + 50% miscellaneous fee grant',
        '5x President’s Lister at FAITH Colleges',
        'Joined the Ad Astra scholar camp and assembly with fellow FAITH scholars',
      ],
    },
    links: [],
  },

  // REFERENCES -> MONSTER CARDS (3 Cards)
  {
    id: 'ref-lyndon',
    category: 'references',
    ygoFrame: 'monster',
    ygoSubHeader: '[Machine / Effect]',
    ygoTypeLine: 'Industry Supervisor / Effect',
    ygoAttribute: 'LIGHT',
    ygoStars: 8,
    ygoAtk: '2800',
    ygoDef: '2600',
    ygoSetCode: 'REF-001',
    typeTag: 'Monster Card',
    title: 'Lyndon Lauren A. Balois',
    subtitle: 'IT Senior Supervisor, Moriroku PH',
    cardEffect:
      'IT Senior Supervisor at Moriroku Philippines, Inc. (Laguna Technopark). Verified 248-hour Outstanding internship rating, GatePass & HRAD delivery. Contact: l.balois@moriroku.com.ph',
    visualKind: 'screenshot',
    imageSrc: '/assets/achievements/moriroku-ojt.png',
    previewImages: [
      { src: sirLyndonImg, label: 'Sir Lyndon' },
      { src: ojtMorirokuTeamImg, label: 'Moriroku Team' },
      { src: '/assets/achievements/moriroku-ojt.png', label: 'OJT Completion' },
    ],
    period: 'June – August 2026',
    roleOrIssuer: 'IT Senior Supervisor, Moriroku Philippines, Inc.',
    metricBadge: 'Supervisor',
    details: {
      headingA: 'Relationship & Verification Scope',
      bodyA:
        'Direct IT Senior Supervisor during Hans’s 248-hour internship at Moriroku Philippines, Inc. in Laguna Technopark, Biñan.',
      headingB: 'Contact Information',
      bodyB: 'Official work email listed on resume: l.balois@moriroku.com.ph.',
      bullets: [
        'Can verify ASP.NET Core GatePass & HRAD builds and daily plant IT support',
        'Can verify official Outstanding performance rating',
      ],
    },
    links: [{ label: 'l.balois@moriroku.com.ph', url: 'mailto:l.balois@moriroku.com.ph', kind: 'live' }],
  },
  {
    id: 'ref-ade',
    category: 'references',
    ygoFrame: 'monster',
    ygoSubHeader: '[Cyberse / Effect]',
    ygoTypeLine: 'Coach & Panelist / Effect',
    ygoAttribute: 'LIGHT',
    ygoStars: 8,
    ygoAtk: '2700',
    ygoDef: '1800',
    ygoSetCode: 'REF-002',
    typeTag: 'Monster Card',
    title: 'Ade Salsona',
    subtitle: 'CodeChum–ISITE Coach & InsecTra Panelist',
    cardEffect:
      'CodeChum–ISITE Java Competition Coach and InsecTra Capstone Panelist at FAITH Colleges. Can verify Top 6 national Java placement and full-stack IoT/AWS capstone defense.',
    visualKind: 'screenshot',
    imageSrc: '/assets/achievements/ref-ade-photo.png',
    previewImages: [
      { src: codechumSirAdeImg, label: 'CodeChum Coaching' },
      { src: '/assets/achievements/ref-ade-photo.png', label: 'Faculty Profile' },
    ],
    period: 'Academic Coaching & InsecTra Defense',
    roleOrIssuer: 'CodeChum–ISITE Coach & Capstone Panelist, FAITH Colleges',
    metricBadge: 'Coach & Panelist',
    details: {
      headingA: 'Relationship & Verification Scope',
      bodyA:
        'Served as CodeChum–ISITE Java National Competition Coach and InsecTra Capstone Defense Panelist at FAITH Colleges, Tanauan City, Batangas.',
      headingB: 'Contact Information',
      bodyB: 'Faculty email listed on resume: cssalsona@firstasia.edu.ph.',
      bullets: [
        'Can verify Top 6 National placement and 100% perfect Java competition score',
        'Evaluated the InsecTra IoT/YOLO11/AWS capstone defense as an official panelist',
      ],
    },
    links: [{ label: 'cssalsona@firstasia.edu.ph', url: 'mailto:cssalsona@firstasia.edu.ph', kind: 'live' }],
  },
  {
    id: 'ref-angelica',
    category: 'references',
    ygoFrame: 'monster',
    ygoSubHeader: '[Cybersecurity / Effect]',
    ygoTypeLine: 'Cybersecurity Specialist / Effect',
    ygoAttribute: 'LIGHT',
    ygoStars: 8,
    ygoAtk: '3000',
    ygoDef: '2600',
    ygoSetCode: 'REF-003',
    typeTag: 'Monster Card',
    title: 'Angelica Evangelista',
    subtitle: 'Cybersecurity Specialist & HackForGov Coach',
    cardEffect:
      'Cybersecurity Specialist, HackForGov 5 (2026) Coach, and InsecTra Capstone Panelist at FAITH Colleges. Can verify Region IV-A Top Individual CTF performance and capstone defense.',
    visualKind: 'screenshot',
    imageSrc: '/assets/achievements/hackforgov-stage.jpg',
    supportingImage: '/assets/achievements/hackforgov-stage.jpg',
    supportingCaption: 'With Coach Angelica Evangelista at HackForGov 5 CALABARZON',
    period: 'HackForGov 5 (2026) & InsecTra Defense',
    roleOrIssuer: 'Cybersecurity Specialist, HackForGov 5 Coach & Panelist',
    metricBadge: 'CyberSec Coach',
    details: {
      headingA: 'Relationship & Verification Scope',
      bodyA:
        'Cybersecurity Specialist who coached Hans for DICT HackForGov 5 (2026) CTF and served as an InsecTra Capstone Defense Panelist at FAITH Colleges.',
      headingB: 'Contact Details',
      bodyB: 'Direct faculty/coach email available upon recruiter verification request.',
      bullets: [
        'Can verify Region IV-A HackForGov 5 (2026) Top Individual Scorer performance',
        'Evaluated the InsecTra IoT/YOLO11/AWS capstone defense as an official panelist',
      ],
    },
    links: [
      {
        label: 'Request Contact via Email',
        url: 'mailto:magbojosmichaelhans@gmail.com?subject=Reference%20Contact%20-%20Miss%20Angelica%20Evangelista',
        kind: 'live',
      },
    ],
    note: 'Direct contact available upon request',
  },
]

export const SIDE_WORK_ARCHIVE: SideWorkItem[] = [
  {
    id: 'advstat',
    title: 'ADVSTAT Regression Tool',
    role: 'Author, Web Utility',
    summary: 'Interactive linear regression calculator with plotted data controls.',
    image: '/assets/projects/adv-stat-finals.png',
    links: [{ label: 'Live Tool', url: 'https://adv-stat-finals.vercel.app/', kind: 'live' }],
  },
  {
    id: 'calphy',
    title: 'Calphy Calculator',
    role: 'Co-Author, Physics 2 Web App',
    summary: 'Collaborative Physics 2 calculator and formula helper.',
    image: '/assets/projects/calphy.png',
    links: [{ label: 'GitHub', url: 'https://github.com/divmendoza/CALPHY2_FinalProject', kind: 'github' }],
  },
  {
    id: 'gradeapp',
    title: 'GradeApp',
    role: 'Co-Author (Main: Axel0Tell)',
    summary: 'Grade computation and academic tracking utility.',
    image: '/assets/projects/gradeapp-github.png',
    links: [
      { label: 'GitHub', url: 'https://github.com/Axel0Tell/GradeApp', kind: 'github' },
      { label: 'ZIP', url: 'https://github.com/Axel0Tell/GradeApp/archive/refs/heads/main.zip', kind: 'zip' },
    ],
  },
  {
    id: 'terrasync',
    title: 'TerraSync',
    role: 'Co-Author, Weather Dashboard',
    summary: 'Collaborative weather monitoring site deployed on Vercel.',
    image: '/assets/projects/terrasync.png',
    links: [{ label: 'Live Site', url: 'https://terrasync-phi.vercel.app/', kind: 'live' }],
  },
  {
    id: 'rts-ai',
    title: 'Real-Time Strategy Game w/ AI Tools',
    role: 'Author, Browser Prototype',
    summary: 'HTML/JS strategy game prototype.',
    image: '/assets/projects/rts-ai-tools.png',
    links: [{ label: 'GitHub', url: 'https://github.com/MichaelHans32116/Real-Time-Strategy-Game-w-AI-tools', kind: 'github' }],
  },
  {
    id: 'rps-real',
    title: 'Rock Paper Scissor Real',
    role: 'Author, Browser Game',
    summary: 'Interactive browser game build.',
    image: '/assets/projects/rock-paper-scissor-real.png',
    links: [{ label: 'GitHub', url: 'https://github.com/MichaelHans32116/Rock-Paper-Scissor-Real', kind: 'github' }],
  },
  {
    id: 'jp-occ',
    title: 'Japanese Occupation',
    role: 'Author, History Web Project',
    summary: 'Structured historical web site hosted on Vercel.',
    image: '/assets/projects/japanese-occupation.png',
    links: [{ label: 'Live Site', url: 'https://japanese-occupation.vercel.app/', kind: 'live' }],
  },
]

export interface ExperiencePhotoHighlight {
  id: string
  src: string
  label: string
  caption: string
  cardId: string
}

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
