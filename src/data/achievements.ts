import adAstraCampImg from '../images/web/ad-astra-camp.jpg'
import adAstraMeetImg from '../images/web/ad-astra-meet.jpg'
import codechumSirAdeImg from '../images/web/codechum-sir-ade.jpg'
import codechumVictoryImg from '../images/web/codechum-victory.jpg'
import hackforgovBeforeImg from '../images/web/hackforgov-before.jpg'
import hackforgovNameImg from '../images/web/hackforgov-name.jpg'
import hackforgovOfficialImg from '../images/web/hackforgov-official.jpg'
import hackforgovTeamImg from '../images/web/hackforgov-team.jpg'
import topcitExamImg from '../images/web/topcit-exam.jpg'
import { DeckCardItem } from './types'

export const ACHIEVEMENT_CARDS: DeckCardItem[] = [
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
]
