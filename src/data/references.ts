import codechumSirAdeImg from '../images/web/codechum-sir-ade.jpg'
import ojtMorirokuTeamImg from '../images/web/ojt-moriroku-team.jpg'
import sirLyndonImg from '../images/web/sir-lyndon.jpg'
import { DeckCardItem } from './types'

export const REFERENCE_CARDS: DeckCardItem[] = [
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
