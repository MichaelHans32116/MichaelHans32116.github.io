export type CardKind = 'ACE' | 'LINK' | 'SYNCHRO' | 'XYZ' | 'FUSION' | 'EFFECT'
export type CardAttribute = 'LIGHT' | 'DARK' | 'EARTH' | 'WATER' | 'WIND' | 'FIRE'
export type ArtMode = 'cutout-shadowbox' | 'logo-pedestal' | 'screenshot'
export type ProjectFilter = 'all' | 'author' | 'coauthor' | 'qa'

export interface CardLink {
  label: string
  url: string
  kind: 'live' | 'github' | 'mobile' | 'zip'
}

export interface ProjectCardData {
  id: string
  slug: string
  serial: string
  cardName: string
  projectTitle: string
  roleBadge: string
  filterGroup: 'author' | 'coauthor' | 'qa'
  isFlagship: boolean
  cardKind: CardKind
  attribute: CardAttribute
  typeLine: string
  levelOrRating: string
  stars: number
  atk: string
  def: string
  artSrc: string
  artMode: ArtMode
  pedestalTone?: 'cobalt-gold' | 'emerald-gold'
  effectText: string
  stack: string[]
  period: string
  caseStudy: {
    problem: string
    architecture: string
    outcome: string
    highlights: string[]
  }
  links: CardLink[]
  privateNote?: string
}

export interface ExperienceSpell {
  id: string
  cardCode: string
  title: string
  org: string
  location: string
  period: string
  tag: string
  summary: string
  bullets: string[]
}

export interface CredentialTrap {
  id: string
  cardCode: string
  title: string
  issuer: string
  metric: string
  date: string
  detail: string
}

export interface SkillGroup {
  id: string
  spellType: string
  title: string
  items: string[]
}

export interface SideDeckItem {
  id: string
  title: string
  role: string
  summary: string
  image: string
  links: CardLink[]
}

export const DUELIST_PROFILE = {
  fullName: 'Michael Hans G. Magbojos',
  shortName: 'Michael Hans',
  handle: 'hans@duel-disk',
  title: 'Full-Stack & Systems Developer',
  location: 'Calamba City, Laguna, Philippines',
  school: 'FAITH Colleges — BS Information Technology (4th Year)',
  ojtWindow: 'Available for 600-Hour OJT · Dec 2026 – Mar 2027',
  emailPersonal: 'magbojosmichaelhans@gmail.com',
  emailSchool: 's2023101036@firstasia.edu.ph',
  phone: '09947140891',
  githubMain: 'https://github.com/MichaelHans32116',
  githubAlt: 'https://github.com/hans32116',
  linkedin: 'https://www.linkedin.com/in/hans-magbojos/',
  resumeUrl: '/assets/Magbojos_MichaelHans_Resume_CV.pdf',
  lp: 8000,
  heroHeadline: 'Full-stack systems built under real constraints.',
  heroBio:
    'Fourth-year BSIT student and DOST-SEI Merit Scholar at FAITH Colleges. I design database-backed web apps, enforce security at the SQL layer, ship internal business systems, and debug full-stack production issues end to end.',
  proofPills: [
    'DOST-SEI Merit Scholar',
    'TOPCIT Level 3 (410/1000)',
    'HackForGov 5 Top Individual Scorer',
    'Moriroku Intern · Rated Outstanding',
    'ISITE-CodeChum Java · Top 6 (100%)',
  ],
}

export const ACE_CARD = {
  serial: 'MH-PH001',
  cardName: 'MICHAEL HANS, FULL-STACK ARCHITECT',
  cardKind: 'ACE' as CardKind,
  attribute: 'LIGHT' as CardAttribute,
  typeLine: 'CYBERSE / ARCHITECT / EFFECT',
  levelOrRating: 'LV 8',
  stars: 8,
  atk: '2600',
  def: '2100',
  artSrc: '/assets/cards/ace-michael-hans.png',
  artMode: 'cutout-shadowbox' as ArtMode,
  effectText:
    'Cannot be blocked by ambiguous requirements. Once per sprint: design the database schema, lock down Row Level Security, ship the API, and debug production without breaking the build.',
  backStats: [
    { label: 'Class', value: 'BSIT 4th Year · FAITH Colleges' },
    { label: 'Scholarship', value: 'DOST-SEI Merit · 5x President’s Lister' },
    { label: 'Internship', value: 'Moriroku PH (248h · Outstanding)' },
    { label: 'ICT Rating', value: 'TOPCIT Level 3 · 410 / 1000' },
    { label: 'CTF Rank', value: 'DICT HackForGov 5 Top Scorer' },
    { label: 'OJT Window', value: 'Dec 2026 – Mar 2027 (600 hrs)' },
  ],
}

export const PROJECT_CARDS: ProjectCardData[] = [
  {
    id: 'buildbid',
    slug: 'buildbid',
    serial: 'MH-EX01',
    cardName: 'BUILDBID — SEALED TENDER ENGINE',
    projectTitle: 'BuildBid (thebuildbid.com)',
    roleBadge: 'Lead UI/UX & Full-Stack Infra',
    filterGroup: 'author',
    isFlagship: true,
    cardKind: 'LINK',
    attribute: 'LIGHT',
    typeLine: 'CYBERSE / LINK / EFFECT',
    levelOrRating: 'LINK-4',
    stars: 4,
    atk: '2900',
    def: 'LINK-4',
    artSrc: '/assets/cards/buildbid-logo.png',
    artMode: 'logo-pedestal',
    pedestalTone: 'cobalt-gold',
    effectText:
      'Rival suppliers cannot read each other’s bids or contractor budgets. Enforces sealed-bid and PII invariants directly inside PostgreSQL RLS policies across 72+ shipped release phases.',
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'Supabase (Postgres / RLS / Realtime)',
      'Leaflet + PSGC',
      'SheetJS',
      'Claude Vision API',
      'Vercel',
      'Vitest + GitHub Actions',
    ],
    period: 'June 2026 – August 2026 · 458 Commits · Live Pilot',
    caseStudy: {
      problem:
        'Construction contractors lose margin to middlemen and opaque supplier pricing, while open bidding leaks competitor rates and business contact numbers.',
      architecture:
        'Built with Next.js 16 (App Router), TypeScript, and Supabase PostgreSQL. Sealed-bid privacy, split-line awards, audit logging, and PII isolation are enforced at the database layer via RLS policies, custom RPC functions, and automated SQL API security probes.',
      outcome:
        'Shipped across 458 commits and 72+ iterative Agile-Scrum phases to live pilot deployment on thebuildbid.com, gated by GitHub Actions CI (ESLint, tsc, Vitest quote-math tests, and build verification).',
      highlights: [
        'Sealed-bid & PII protection verified via direct PostgreSQL API probe scripts',
        'Proximity supplier search using Leaflet + Philippine PSGC geocoding',
        'Excel/CSV BOQ bulk import (SheetJS) and Claude Vision PDF/photo BOQ extraction',
        'Real-time contractor–supplier messaging, permit moderation, and admin audit trail',
      ],
    },
    links: [
      { label: 'Live Site', url: 'https://thebuildbid.com', kind: 'live' },
      { label: 'GitHub Repo', url: 'https://github.com/MichaelHans32116/BuildBid', kind: 'github' },
    ],
  },
  {
    id: 'gatepass',
    slug: 'gatepass',
    serial: 'MH-EX02',
    cardName: 'MORIROKU GATEPASS SENTINEL',
    projectTitle: 'GatePass Request & HRAD Monitoring System',
    roleBadge: 'IT Intern · Primary Author',
    filterGroup: 'author',
    isFlagship: true,
    cardKind: 'SYNCHRO',
    attribute: 'EARTH',
    typeLine: 'MACHINE / SYNCHRO / EFFECT',
    levelOrRating: 'LV 8',
    stars: 8,
    atk: '2700',
    def: '2500',
    artSrc: '/assets/projects/gatepass-system.png',
    artMode: 'screenshot',
    effectText:
      'Replaces manual paper gate slips with role-based multi-stage approval routing, digital signatures, A6 printable passes, and QR guard-house time-in/time-out auditing.',
    stack: ['C#', 'ASP.NET Core', '.NET 8', 'MariaDB', 'QR Tracking', 'Digital Signatures', 'Role-Based Auth'],
    period: 'June 2026 – August 2026 · 248-Hour Internship · Rated Outstanding',
    caseStudy: {
      problem:
        'Plant personnel and material exits relied on paper gate passes that slowed supervisor sign-offs and left guard-house logs hard to reconcile.',
      architecture:
        'Engineered an internal ASP.NET Core (.NET 8) and MariaDB web system handling person/material pass requests, multi-level approval visibility, digital signature capture, A6 print formatting, fleet scheduling, and QR scan timestamps.',
      outcome:
        'Delivered during a 248-hour IT internship at Moriroku Philippines, Inc. (Laguna Technopark) alongside HRAD Monitoring System maintenance and daily IT service desk support, earning an Outstanding supervisor evaluation.',
      highlights: [
        'Resolved real UAT bugs in approval routing, A6 slip layout, signature capture, and session cleanup',
        'Supported daily plant operations: local servers, Wi-Fi, printers, and workstation tickets',
        'Maintained secondary internal HRAD Monitoring System alongside office staff',
      ],
    },
    links: [],
    privateNote: 'Internal Moriroku Philippines deployment · Private enterprise repository',
  },
  {
    id: 'insectra',
    slug: 'insectra',
    serial: 'MH-EX03',
    cardName: 'INSECTRA — SOLAR CV SENTINEL',
    projectTitle: 'InsecTra (Capstone Lead)',
    roleBadge: 'Capstone Lead · AI / IoT / AWS',
    filterGroup: 'author',
    isFlagship: true,
    cardKind: 'XYZ',
    attribute: 'WIND',
    typeLine: 'INSECT / XYZ / EFFECT',
    levelOrRating: 'RANK 7',
    stars: 7,
    atk: '2650',
    def: '2300',
    artSrc: '/assets/cards/insectra-logo.png',
    artMode: 'logo-pedestal',
    pedestalTone: 'emerald-gold',
    effectText:
      'Deploys solar-powered Raspberry Pi hardware running YOLO11 computer vision to detect melon fruit flies in the field and stream telemetry into an auto-scaling AWS backend.',
    stack: ['Python', 'YOLO11', 'Raspberry Pi IoT', 'AWS EC2', 'AWS ALB & Auto Scaling', 'AWS RDS & S3', 'Mobile App'],
    period: '2025 – 2026 · 3-Member BSIT Capstone Project',
    caseStudy: {
      problem:
        'Melon fruit fly infestations destroy ampalaya and cucurbit yields before farmers notice spikes, yet manual trap inspection across fields is slow and inconsistent.',
      architecture:
        'Led our 3-member capstone building a solar-powered one-way physical trap equipped with a Raspberry Pi camera running YOLO11 object detection, syncing counts and captures to an AWS cloud stack (EC2, Application Load Balancer, Auto Scaling, RDS, S3) and companion mobile app.',
      outcome:
        'Passed multi-module hardware/software User Acceptance Testing covering solar power autonomy, camera illumination, one-way ingress mechanics, ML pest counting, and cloud connectivity.',
      highlights: [
        'Trained and integrated YOLO11 detection pipeline for melon fruit fly counting',
        'Configured multi-tier AWS cloud deployment with ALB, Auto Scaling, RDS, and S3',
        'End-to-end integration from solar enclosure and Raspberry Pi edge capture to mobile UI',
      ],
    },
    links: [],
    privateNote: 'Capstone IP · Full architecture walkthrough available in technical interviews',
  },
  {
    id: 'howconnect',
    slug: 'howconnect',
    serial: 'MH-EX04',
    cardName: 'HOWCONNECT — CROSS-STACK NEXUS',
    projectTitle: 'HowConnect Web & Mobile App',
    roleBadge: 'Author · Project Manager & Full-Stack',
    filterGroup: 'author',
    isFlagship: true,
    cardKind: 'FUSION',
    attribute: 'WATER',
    typeLine: 'CYBERSE / FUSION / EFFECT',
    levelOrRating: 'LV 7',
    stars: 7,
    atk: '2500',
    def: '2200',
    artSrc: '/assets/projects/howconnect-web.png',
    artMode: 'screenshot',
    effectText:
      'Fuses a C# (.NET 8) REST backend and SQL Server relational core with both a Vercel web client and an Expo React Native mobile build under one unified contract.',
    stack: ['C#', '.NET 8', 'SQL Server', 'React Native', 'Expo', 'JavaScript', 'Vercel'],
    period: '2025 – 2026 · Client & Academic Full-Stack Delivery',
    caseStudy: {
      problem:
        'Needed a coordinated web and mobile platform backed by a single reliable relational database and clear delivery milestones across a student engineering team.',
      architecture:
        'Owned project management, SQL Server schema design, C# (.NET 8) API endpoints, responsive web frontend on Vercel, and cross-platform mobile builds via React Native and Expo.',
      outcome:
        'Shipped both a live web deployment and installable Expo mobile build sharing one typed backend contract.',
      highlights: [
        'Dual-client delivery: live web portal + Expo React Native mobile app build',
        'Designed normalized SQL Server schema and .NET 8 backend infrastructure',
        'Led sprint coordination, integration testing, and issue triage as PM',
      ],
    },
    links: [
      { label: 'Live Website', url: 'https://how-connect-web.vercel.app/', kind: 'live' },
      {
        label: 'Expo App Build',
        url: 'https://expo.dev/accounts/hans32116/projects/how-connect-expo/builds/e995fbdd-1ec3-4ad2-9504-3b8e273fc271',
        kind: 'mobile',
      },
    ],
  },
  {
    id: 'salinlahi',
    slug: 'salinlahi',
    serial: 'MH-SP01',
    cardName: 'SALINLAHI — WORKFLOW PATCH',
    projectTitle: 'Salinlahi',
    roleBadge: 'Co-Author · Logic & Frontend Fixes',
    filterGroup: 'coauthor',
    isFlagship: false,
    cardKind: 'EFFECT',
    attribute: 'LIGHT',
    typeLine: 'SPELLCASTER / EFFECT',
    levelOrRating: 'LV 5',
    stars: 5,
    atk: '1900',
    def: '1700',
    artSrc: '/assets/projects/salinlahi.png',
    artMode: 'screenshot',
    effectText:
      'Targets broken UI flows and responsive layout regressions in an aid-tracking web application and resolves client-side logic faults cleanly.',
    stack: ['JavaScript', 'Responsive CSS', 'Frontend Debugging', 'Vercel'],
    period: 'Collaborative Web Build',
    caseStudy: {
      problem:
        'The aid-tracking workflow had client-side logic bugs and responsive layout breaks across mobile and desktop viewports.',
      architecture:
        'Audited existing components, stabilized workflow logic, and tightened responsive CSS rules without rewriting stable modules.',
      outcome: 'Deployed cleanly on Vercel with stable navigation and cross-screen layout behavior.',
      highlights: ['Targeted bug tracing and responsive UI fixes', 'Clean collaborative handover on live deployment'],
    },
    links: [{ label: 'Live Site', url: 'https://salinlahi-eight.vercel.app/', kind: 'live' }],
  },
  {
    id: 'gabay-halaman',
    slug: 'gabay-halaman',
    serial: 'MH-SP02',
    cardName: 'GABAY HALAMAN — CLOUD NURSERY',
    projectTitle: 'Gabay Halaman',
    roleBadge: 'Co-Author · Backend & Azure DB',
    filterGroup: 'coauthor',
    isFlagship: false,
    cardKind: 'EFFECT',
    attribute: 'EARTH',
    typeLine: 'PLANT / EFFECT',
    levelOrRating: 'LV 5',
    stars: 5,
    atk: '1950',
    def: '1850',
    artSrc: '/assets/projects/gabay-halam.png',
    artMode: 'screenshot',
    effectText:
      'Executes backend data persistence and Microsoft Azure cloud database configuration for a digital plant nursery platform.',
    stack: ['Backend APIs', 'SQL Database', 'Microsoft Azure', 'Vercel'],
    period: 'Collaborative Web Build',
    caseStudy: {
      problem:
        'The plant nursery site required dependable backend execution and hosted cloud database wiring for live catalog and user interactions.',
      architecture:
        'Handled backend integration, relational database setup, and Azure cloud configuration supporting the live Vercel frontend.',
      outcome: 'Stabilized database connectivity and deployed live for stakeholder review.',
      highlights: ['Azure cloud database setup and troubleshooting', 'Co-authored backend persistence layer'],
    },
    links: [{ label: 'Live Site', url: 'https://gabay-halam.vercel.app/', kind: 'live' }],
  },
  {
    id: 'starqueen',
    slug: 'starqueen',
    serial: 'MH-SP03',
    cardName: 'STARQUEEN — MAINTENANCE CORE',
    projectTitle: 'StarQueen Web',
    roleBadge: 'Co-Author · Backend & Azure DB',
    filterGroup: 'coauthor',
    isFlagship: false,
    cardKind: 'EFFECT',
    attribute: 'DARK',
    typeLine: 'MACHINE / EFFECT',
    levelOrRating: 'LV 5',
    stars: 5,
    atk: '2000',
    def: '1800',
    artSrc: '/assets/projects/starqueen-web.png',
    artMode: 'screenshot',
    effectText:
      'Powers planned maintenance and asset-tracking workflows with Azure-backed database execution and reliable query handling.',
    stack: ['Backend Execution', 'Relational DB', 'Microsoft Azure', 'Vercel'],
    period: 'Collaborative System Build',
    caseStudy: {
      problem:
        'Maintenance schedules and operational tracking needed structured relational storage and reliable cloud hosting.',
      architecture:
        'Contributed backend database execution and Microsoft Azure environment support for the tracking application.',
      outcome: 'Live deployment supporting structured maintenance tracking workflows.',
      highlights: ['Azure database provisioning and support', 'Backend execution and workflow verification'],
    },
    links: [{ label: 'Live Site', url: 'https://starqueen-web.vercel.app/', kind: 'live' }],
  },
  {
    id: 'hanaplokal',
    slug: 'hanaplokal',
    serial: 'MH-SP04',
    cardName: 'HANAPLOKAL — QA SCOUT',
    projectTitle: 'HanapLokal',
    roleBadge: 'QA / Bug Hunting Support',
    filterGroup: 'qa',
    isFlagship: false,
    cardKind: 'EFFECT',
    attribute: 'FIRE',
    typeLine: 'WARRIOR / EFFECT',
    levelOrRating: 'LV 4',
    stars: 4,
    atk: '1700',
    def: '1900',
    artSrc: '/assets/projects/hanaplokal.png',
    artMode: 'screenshot',
    effectText:
      'Scans mobile-first community marketplace flows to surface edge-case defects, broken interactions, and behavioral inconsistencies before release.',
    stack: ['Manual QA', 'Edge-Case Testing', 'Bug Reporting', 'Mobile Web UX'],
    period: 'Quality Assurance Contribution',
    caseStudy: {
      problem:
        'A mobile-style community marketplace needed structured external testing to catch behavioral bugs prior to demos.',
      architecture:
        'Performed end-to-end exploratory testing across core listing and browsing paths, documenting reproducible steps for the authors.',
      outcome: 'Helped surface usability and functional bugs early (explicitly scoped as QA support, not primary build).',
      highlights: ['Transparent role attribution (QA support only)', 'Structured reproduction steps and UX behavior checks'],
    },
    links: [{ label: 'Live App', url: 'https://hanaplokal.vercel.app/', kind: 'live' }],
  },
]

export const EXPERIENCE_SPELLS: ExperienceSpell[] = [
  {
    id: 'exp-moriroku',
    cardCode: 'FIELD SPELL · EXP-01',
    title: 'IT Intern (Full-Stack & Plant IT Support)',
    org: 'Moriroku Philippines, Inc.',
    location: 'Laguna Technopark, Biñan, Laguna',
    period: 'June 8 – August 8, 2026 · 248 Hours',
    tag: 'Supervisor Rating: Outstanding',
    summary:
      'Combined internal web system development with hands-on plant IT infrastructure and helpdesk operations.',
    bullets: [
      'Built the Gate Pass Request System in ASP.NET Core (.NET 8) and MariaDB with multi-stage approvals, digital signatures, A6 print slips, and QR gate tracking.',
      'Maintained and updated the internal HRAD Monitoring System alongside office staff.',
      'Resolved daily workstation, internet, Wi-Fi, printer, and local server service-desk tickets.',
    ],
  },
  {
    id: 'exp-buildbid',
    cardCode: 'FIELD SPELL · EXP-02',
    title: 'Software Developer / Full-Stack Lead',
    org: 'BuildBid (thebuildbid.com)',
    location: 'Calamba City, Laguna · Hybrid',
    period: 'June 2026 – August 2026 · 458 Commits',
    tag: 'Live Pilot · 72+ Phases',
    summary:
      'Led UI/UX direction and full-stack database security architecture for a sealed-bid construction marketplace.',
    bullets: [
      'Architected Next.js 16 + TypeScript + Supabase (PostgreSQL RLS, RPCs, Auth, Realtime, Storage) deployed on Vercel.',
      'Enforced sealed-bid confidentiality and PII protection at the SQL layer verified by automated direct-API probe scripts.',
      'Shipped Leaflet/PSGC proximity search, SheetJS BOQ Excel import, Claude Vision BOQ extraction, and GitHub Actions CI + Vitest testing.',
    ],
  },
]

export const SKILL_SPELLS: SkillGroup[] = [
  {
    id: 'lang',
    spellType: 'QUICK-PLAY SPELL',
    title: 'Languages & Core',
    items: ['C#', 'Java (100% National Score)', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'C++', 'HTML5 / CSS3', 'Bash / Batch'],
  },
  {
    id: 'backend',
    spellType: 'CONTINUOUS SPELL',
    title: 'Backend & Databases',
    items: [
      'ASP.NET Core / .NET 8',
      'Supabase (Postgres / RLS / RPC)',
      'PostgreSQL',
      'MariaDB / MySQL',
      'Microsoft SQL Server',
      'REST API Design',
      'Auth & Audit Logging',
    ],
  },
  {
    id: 'frontend',
    spellType: 'EQUIP SPELL',
    title: 'Frontend & Mobile',
    items: ['Next.js 16 (App Router)', 'React 19', 'Tailwind CSS v4', 'React Native', 'Expo', 'GSAP Motion', 'Leaflet / PSGC Maps', 'SheetJS (xlsx)'],
  },
  {
    id: 'cloud',
    spellType: 'RITUAL SPELL',
    title: 'Cloud, DevOps & Security',
    items: [
      'AWS (EC2, ALB, Auto Scaling, RDS, S3, Cognito, VPC)',
      'Microsoft Azure',
      'Docker & Nginx',
      'Vercel & GitHub Actions CI',
      'Vitest Testing',
      'YOLO11 / Raspberry Pi IoT',
      'CTF Security & RLS Hardening',
    ],
  },
]

export const CREDENTIAL_TRAPS: CredentialTrap[] = [
  {
    id: 'topcit',
    cardCode: 'COUNTER TRAP · CERT-01',
    title: 'TOPCIT Level 3 Certified',
    issuer: 'IITP, South Korea · Cert #TL2603001540',
    metric: '410 / 1000',
    date: 'July 23, 2026',
    detail: 'Practical ICT competency assessment covering software architecture, databases, networks, security, and project management.',
  },
  {
    id: 'hackforgov',
    cardCode: 'COUNTER TRAP · CTF-02',
    title: 'DICT HackForGov 5 CALABARZON',
    issuer: 'Department of Information & Communications Technology',
    metric: 'Top Individual Scorer',
    date: 'October 15, 2026',
    detail: 'Highest individual score in regional cybersecurity Capture-The-Flag; earned National Finals wildcard (7th place team).',
  },
  {
    id: 'isite',
    cardCode: 'COUNTER TRAP · ALGO-03',
    title: 'ISITE-CodeChum National Java',
    issuer: 'iSITE National Programming Competition',
    metric: 'Top 6 Overall · 100% Score',
    date: 'April 2026',
    detail: 'Achieved a perfect Java score under timed algorithmic competition constraints nationwide.',
  },
  {
    id: 'dost',
    cardCode: 'CONTINUOUS TRAP · ACAD-04',
    title: 'DOST-SEI Undergraduate Merit Scholar',
    issuer: 'FAITH Colleges · BSIT (2023 – 2027)',
    metric: '5x President’s Lister',
    date: '2023 – Present',
    detail: 'Consistent academic honors while shipping client web platforms, plant enterprise systems, and national ICT competitions.',
  },
]

export const SIDE_DECK_ARCHIVE: SideDeckItem[] = [
  {
    id: 'advstat',
    title: 'ADVSTAT Regression Tool',
    role: 'Author · Web Tool',
    summary: 'Interactive statistical regression calculator with live chart controls.',
    image: '/assets/projects/adv-stat-finals.png',
    links: [{ label: 'Live Tool', url: 'https://adv-stat-finals.vercel.app/', kind: 'live' }],
  },
  {
    id: 'calphy',
    title: 'Calphy Calculator',
    role: 'Co-Author · Physics 2 Web App',
    summary: 'Collaborative calculator and formula tool built for Physics 2.',
    image: '/assets/projects/calphy.png',
    links: [{ label: 'GitHub', url: 'https://github.com/divmendoza/CALPHY2_FinalProject', kind: 'github' }],
  },
  {
    id: 'gradeapp',
    title: 'GradeApp',
    role: 'Co-Author (Main: Axel0Tell)',
    summary: 'Academic grade tracking and calculation utility.',
    image: '/assets/projects/gradeapp-github.png',
    links: [
      { label: 'GitHub', url: 'https://github.com/Axel0Tell/GradeApp', kind: 'github' },
      { label: 'ZIP', url: 'https://github.com/Axel0Tell/GradeApp/archive/refs/heads/main.zip', kind: 'zip' },
    ],
  },
  {
    id: 'terrasync',
    title: 'TerraSync',
    role: 'Co-Author · Weather Dashboard',
    summary: 'Collaborative weather monitoring dashboard hosted on Vercel.',
    image: '/assets/projects/terrasync.png',
    links: [{ label: 'Live Site', url: 'https://terrasync-phi.vercel.app/', kind: 'live' }],
  },
  {
    id: 'rts-ai',
    title: 'Real-Time Strategy Game w/ AI Tools',
    role: 'Author · Browser Strategy Prototype',
    summary: 'HTML/JS real-time strategy prototype experimenting with AI-assisted workflows.',
    image: '/assets/projects/rts-ai-tools.png',
    links: [
      { label: 'GitHub', url: 'https://github.com/MichaelHans32116/Real-Time-Strategy-Game-w-AI-tools', kind: 'github' },
    ],
  },
  {
    id: 'rps-real',
    title: 'Rock Paper Scissor Real',
    role: 'Author · Browser Game',
    summary: 'Interactive browser game build exploring responsive mechanics.',
    image: '/assets/projects/rock-paper-scissor-real.png',
    links: [
      { label: 'GitHub', url: 'https://github.com/MichaelHans32116/Rock-Paper-Scissor-Real', kind: 'github' },
    ],
  },
  {
    id: 'jp-occ',
    title: 'Japanese Occupation',
    role: 'Author · Interactive History Site',
    summary: 'Structured historical web presentation deployed on Vercel.',
    image: '/assets/projects/japanese-occupation.png',
    links: [{ label: 'Live Site', url: 'https://japanese-occupation.vercel.app/', kind: 'live' }],
  },
]

export const TERMINAL_EASTER_EGGS: Record<string, string[]> = {
  whoami: [
    'DUELIST : Michael Hans G. Magbojos (BSIT 4th Year · FAITH Colleges)',
    'TITLES  : DOST-SEI Merit Scholar · 5x President’s Lister · TOPCIT L3 (410/1000)',
    'STATUS  : LP 8000 · Ready for 600-hour OJT (Dec 2026 – Mar 2027, Metro Manila / Laguna)',
  ],
  'pot of greed': [
    '[SPELL ACTIVATED] POT OF GREED — Draws 2 unprompted engineering facts:',
    '  1) BuildBid hit 458 commits and 72+ phases with SQL probes proving sealed-bid isolation.',
    '  2) Scored 100% in Java at ISITE-CodeChum National (6th overall) AND Top Individual Scorer at HackForGov 5.',
  ],
  exodia: [
    'Assembling the 5 Forbidden Pieces of the OJT Resume:',
    '  [1/5] Right Arm : Moriroku Philippines IT Intern (248 hrs · Rated Outstanding)',
    '  [2/5] Left Arm  : BuildBid Live Pilot (Next.js 16 + Supabase RLS · 458 commits)',
    '  [3/5] Right Leg : TOPCIT Level 3 Certified (410/1000 · IITP Korea)',
    '  [4/5] Left Leg  : DICT HackForGov 5 CALABARZON Top Individual Scorer',
    '  [5/5] Head      : DOST-SEI Merit Scholar + ISITE Java 100% Score -> OBLITERATE TECHNICAL SCREENING.',
  ],
  'heart of the cards': [
    '"You don’t need luck when you have PostgreSQL RLS policies, Vitest unit tests, and `tsc --noEmit` in CI."',
  ],
  trap: [
    '[COUNTER TRAP ACTIVATED] ROW LEVEL SECURITY BARRIER!',
    'An unauthenticated API request tried to harvest supplier quotes and phone numbers.',
    'Result: Blocked at the PostgreSQL layer. 0 rows returned. LP untouched.',
  ],
  'mirror force': [
    '[TRAP ACTIVATED] CI/CD MIRROR FORCE!',
    'Every unverified push to `main` gets bounced back by ESLint + TypeScript + Vitest before touching Vercel.',
  ],
  'sudo hire-me': [
    '[ACCESS GRANTED] Initializing 600-hour OJT Onboarding Sequence (Dec 2026 – Mar 2027)...',
    '  Direct Email : magbojosmichaelhans@gmail.com',
    '  Phone        : 09947140891 | Calamba, Laguna (Ready for Makati / BGC / Ortigas / Laguna)',
    '  Tip          : Run `open resume` or click Download Resume PDF in the header.',
  ],
}
