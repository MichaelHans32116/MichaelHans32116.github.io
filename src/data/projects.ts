import buildbidHomeImg from '../images/buildbid/01-home.png'
import buildbidQuotesImg from '../images/buildbid/05-compare-quotes.png'
import gatepassCalendarImg from '../images/gatepass/03-gatepass-calendar-clean.png'
import gatepassLoginImg from '../images/gatepass/01-gatepass-login.jpg'
import gatepassScannerImg from '../images/gatepass/02-gatepass-qr-scanner.jpg'
import hradDashboardImg from '../images/hrad/02-hrad-admin-dashboard.png'
import hradLoginImg from '../images/hrad/01-hrad-login.png'
import hradTicketImg from '../images/hrad/03-hrad-submit-ticket.png'
import insectraAppImg from '../images/insectra-app/00-app-cardmaker-square.png'
import insectraLiveHeroImg from '../images/insectra-web/00-live-hero-final.jpg'
import insectraMapImg from '../images/insectra-web/03-expert-portal-map.png'
import insectraSplashImg from '../images/insectra-web/00-brand-splash.jpg'
import howconnectGroupImg from '../images/web/howconnect-group.jpg'
import howconnectSystemImg from '../images/web/howconnect-system.jpg'
import insectraAgriImg from '../images/web/insectra-agri.jpg'
import insectraDefendedImg from '../images/web/insectra-defended.jpg'
import insectraEntomologistImg from '../images/web/insectra-entomologist.jpg'
import insectraFarmImg from '../images/web/insectra-farm.jpg'
import insectraFarmerImg from '../images/web/insectra-farmer.jpg'
import { DeckCardItem, SideWorkItem } from './types'

export const PROJECT_CARDS: DeckCardItem[] = [
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
