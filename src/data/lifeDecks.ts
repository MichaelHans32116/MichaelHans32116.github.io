import boseQcUltraImg from '../images/web/bose-qc-ultra.jpg'
import chessMatchImg from '../images/web/chess-match.jpg'
import evangelismDrawingImg from '../images/web/evangelism-drawing.jpg'
import evangelismKidsImg from '../images/web/evangelism-kids.jpg'
import evangelismVisitImg from '../images/web/evangelism-visit.jpg'
import favoriteArtImg from '../images/web/favorite-art.jpg'
import friendsCafeImg from '../images/web/friends-cafe.jpg'
import friendsGroupImg from '../images/web/friends-group.jpg'
import friendsPizzaImg from '../images/web/friends-pizza.jpg'
import genshinCoopImg from '../images/web/genshin-coop.jpg'
import howconnectGroupImg from '../images/web/howconnect-group.jpg'
import pickleballMjolnirImg from '../images/web/pickleball-mjolnir.jpg'
import yukiDressImg from '../images/web/yuki-dress.jpg'
import yukiWithArtImg from '../images/web/yuki-with-art.jpg'
import { LifeDeckItem } from './types'

export const LIFE_DECKS: LifeDeckItem[] = [
  {
    id: 'church',
    title: 'Church & Outreach',
    deckTypeLabel: 'FAITH DECK',
    boxCode: 'FAITH',
    countSummary: '4 Photos',
    tagline: 'House of Worship LB, Sat Masili & Sun Sucol',
    story:
      'I play piano at House of Worship Los Baños and help lead barangay outreach. Funny enough, they are also the real client behind my HoW Connect app. Every Saturday I am in Barangay Masili and every Sunday in Barangay Sucol for kids ministry and house-to-house visits.',
    coverSrc: evangelismKidsImg,
    coverMode: 'cover-top',
    accent: '#2563eb',
    photos: [
      {
        src: evangelismKidsImg,
        title: 'Barangay Kids Ministry',
        caption: 'Saturdays in Barangay Masili and Sundays in Barangay Sucol. Loud kids, nonstop energy.',
        objectMode: 'cover-top',
      },
      {
        src: evangelismDrawingImg,
        title: 'Coloring & Bible Stories',
        caption: 'Crayons on the floor while teaching the kids every weekend.',
        objectMode: 'cover-center',
      },
      {
        src: evangelismVisitImg,
        title: 'House-to-House Outreach',
        caption: 'Visiting nanays and families across the barangay for soul-winning outreach.',
        objectMode: 'cover-top',
      },
      {
        src: howconnectGroupImg,
        title: 'HoW Los Baños & HoW Connect',
        caption: 'Home church, barangay crew, and the actual client behind HoW Connect.',
        objectMode: 'cover-top',
      },
    ],
  },
  {
    id: 'friends',
    title: 'Friends & Food Trips',
    deckTypeLabel: 'SQUAD DECK',
    boxCode: 'SQUAD',
    countSummary: '3 Photos',
    tagline: 'Dinner runs, pizza nights & late cafes',
    story:
      'Most of my favorite memories happen around crowded dinner tables after surviving exams or defenses, sharing pizza boxes, and hanging out at cafes until late.',
    coverSrc: friendsGroupImg,
    coverMode: 'cover-top',
    accent: '#0f766e',
    photos: [
      {
        src: friendsGroupImg,
        title: 'Full Table Dinner Run',
        caption: 'Post-exam rule: nobody leaves the Pizza Hut table hungry.',
        objectMode: 'cover-top',
      },
      {
        src: friendsPizzaImg,
        title: 'After-Class Pizza',
        caption: 'Same squad, looser ties, no code talk for at least 20 minutes.',
        objectMode: 'cover-top',
      },
      {
        src: friendsCafeImg,
        title: 'Late-Night Cafe',
        caption: 'Started as a normal hangout, ended up sketching app ideas again.',
        objectMode: 'cover-top',
      },
    ],
  },
  {
    id: 'yuki',
    title: 'Yuki & Birthday Art',
    deckTypeLabel: 'COMPANION DECK',
    boxCode: 'YUKI',
    countSummary: '3 Photos',
    tagline: 'Favorite dog Yuki & 21st birthday drawing',
    story:
      'Yuki is my favorite dog and basically runs our house in her blue gingham dress. Right beside her is my favorite art piece: a 21st birthday drawing I commissioned from one of my favorite people, starring Yuki on top of the cake.',
    coverSrc: favoriteArtImg,
    coverMode: 'contain-art',
    accent: '#b45309',
    photos: [
      {
        src: favoriteArtImg,
        title: '21st Birthday Commission',
        caption: 'Commissioned from one of my favorite people, starring Yuki on the cake.',
        objectMode: 'contain-art',
      },
      {
        src: yukiWithArtImg,
        title: 'Yuki Meets Her Drawing',
        caption: 'Holding the printed birthday art right beside the actual model.',
        objectMode: 'cover-top',
      },
      {
        src: yukiDressImg,
        title: 'Yuki in Full Outfit',
        caption: '10/10 polite dog, zero coding skills, huge morale boost.',
        objectMode: 'cover-top',
      },
    ],
  },
  {
    id: 'hobbies',
    title: 'Gear & Hobbies',
    deckTypeLabel: 'HOBBY DECK',
    boxCode: 'GEAR',
    countSummary: '4 Photos',
    tagline: 'Bose QC Ultra, Mjolnir 16cm, Chess & Genshin',
    story:
      'Outside dev work I rotate between my Bose QuietComfort Ultra and Sony WH-1000XM5 headphones, my Mjolnir 16cm wide-frame pickleball paddle, weekend chess, and Genshin co-op with friends.',
    coverSrc: boseQcUltraImg,
    coverMode: 'cover-center',
    accent: '#6d28d9',
    photos: [
      {
        src: boseQcUltraImg,
        title: 'Bose QC Ultra & WH-1000XM5',
        caption: 'My two go-to headphones for deep coding sessions and blocking commute noise.',
        objectMode: 'cover-center',
      },
      {
        src: pickleballMjolnirImg,
        title: 'Mjolnir 16cm Wide-Frame',
        caption: 'Enflexy Mjolnir widebody pickleball paddle. Big sweet spot and a fun name.',
        objectMode: 'cover-center',
      },
      {
        src: chessMatchImg,
        title: 'Over-the-Board Chess',
        caption: 'Good practice for staying patient and spotting traps early.',
        objectMode: 'cover-top',
      },
      {
        src: genshinCoopImg,
        title: 'Genshin Co-Op',
        caption: 'Running domains and boss fights with friends after pushing updates.',
        objectMode: 'cover-center',
      },
    ],
  },
]
