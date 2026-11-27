import buildbidHomeImg from '../images/buildbid/01-home.png'
import hackforgovOfficialImg from '../images/web/hackforgov-official.jpg'
import ojtMorirokuTeamImg from '../images/web/ojt-moriroku-team.jpg'
import { StandoutHighlight } from './types'

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
