import type { Question } from '../types'

const q = (
  id: string,
  n: number,
  type: string,
  prompt: string,
  answer: string | string[] | undefined,
  explanation: string,
  options?: string[],
  part?: number,
): Question => {
  const item: Question = { id, n, type, prompt, explanation, options, part }
  if (answer !== undefined && answer !== '') item.answer = answer
  return item
}

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]
const r = (a: number, b: number) => Math.round(a + Math.random() * (b - a))

export interface ListenPack {
  id: string
  build: () => { title: string; topic: string; script: { text: string; pause?: number }[]; questions: Question[] }
}

export interface ReadPassage {
  id: string
  short: string
  topic: string
  title: string
  text: string
  questions: Question[]
}

export interface SpeakPack {
  id: string
  theme: string
  topic: string
  cue: string
  questions: Question[]
}

export const LISTEN_PACKS: ListenPack[] = [
  { id: 'lib', build: listenLibrary },
  { id: 'clinic', build: listenClinic },
  { id: 'field', build: listenField },
  { id: 'airport', build: listenAirport },
  { id: 'halls', build: listenHalls },
]

function listenLibrary() {
  const surname = pick(['Moreau', 'Kapoor', 'Okafor', 'Lindgren', 'Santos'])
  const first = pick(['Amelia', 'Jonas', 'Priya', 'Mateo', 'Hana'])
  const spell = surname.toUpperCase().split('').join('-')
  const phone = `07${r(700, 899)} ${r(100, 999)} ${r(100, 999)}`
  const date = pick(['3 March', '14 May', '22 October', '8 January'])
  const course = pick(['architecture', 'marine biology', 'law', 'data science'])
  const floor = pick(['second', 'third', 'fourth'])
  const fee = pick(['12', '15', '18'])
  const sid = `${pick(['AR', 'MB', 'LW', 'DS'])}${r(10000, 89999)}`
  const email = `${first.toLowerCase()}.${surname.toLowerCase()}@campus.ac.uk`
  const card = pick(['blue', 'green', 'red'])
  return {
    title: 'Library induction',
    topic: 'education',
    script: [
      { text: `Good morning, university library. I need to register. Yes. Surname ${surname}, that’s ${spell}. First name ${first}.` },
      { text: `Mobile number ${phone}. Student email ${email}. Course ${course}. Student ID ${sid}. Start date ${date}.` },
      { text: `I’d like a reserved desk on the ${floor} floor. Inter-library loans cost ${fee} pounds. The membership card is ${card}.` },
      { text: `If a book is late, email the helpdesk. Do not use the night box — it is only for returns on time. Workshops are on Wednesdays at five.` },
      { text: `Section 2. Welcome to the city museum. Please enter by the west door, not the main steps — those are closed for repair. The cloakroom is opposite the shop.` },
      { text: `The Roman gallery is upstairs. The café is in the courtyard. If the fire alarm sounds, leave by the exit behind the mosaic wall.` },
      { text: `Toilets are beside the lift. The gift shop closes at four, half an hour before the galleries. Photography is allowed except in the jewellery room.` },
      { text: `Today’s talk on coins starts at two in Room B. Audio guides cost three pounds. Children under twelve go free.` },
      { text: `Section 3. Mei, Dr Cole, river restoration. Mei: I still want more field sites. Dr Cole: Two sites are enough for a ten-week module. We haven’t the staff.` },
      { text: `Mei: What about the questionnaire? Dr Cole: Drop it. Interviews only — forty residents, not a paper survey. Deadline Friday, not next Monday.` },
      { text: `Mei: Can we film the weir? Dr Cole: Only if we get the council permit. Tom will draft the ethics form. Mei will book the van. I’ll write the risk assessment.` },
      { text: `They agree to present findings in a poster, not a twenty-minute talk, because the conference slot is short.` },
      { text: `Section 4. Tonight’s lecture is night-shift sleep. Melatonin falls under blue light from screens. Short naps under twenty minutes help; longer naps cause grogginess.` },
      { text: `Caffeine after 3 pm harms the next sleep. Employers should rotate shifts forward — morning to evening to night — not backward.` },
      { text: `Dark rooms and an eye mask improve daytime sleep. Heavy meals before a shift increase errors. The 2019 review found forward rotation cut accidents by about a fifth.` },
      { text: `Finally, workers over fifty need longer recovery between night blocks. Hospitals that ignored this had higher sick leave.` },
    ],
    questions: [
      q('a1', 1, 'form', 'Surname', surname, 'Spelled out.', undefined, 1),
      q('a2', 2, 'form', 'First name', first, 'Given after the surname.', undefined, 1),
      q('a3', 3, 'form', 'Mobile', [phone, phone.replace(/\s/g, '')], 'As spoken.', undefined, 1),
      q('a4', 4, 'form', 'Email', email, 'Student email.', undefined, 1),
      q('a5', 5, 'form', 'Course', course, 'Course named.', undefined, 1),
      q('a6', 6, 'form', 'Student ID', sid, 'Letters plus numbers.', undefined, 1),
      q('a7', 7, 'form', 'Start date', date, 'Date given.', undefined, 1),
      q('a8', 8, 'form', 'Reserved desk floor', floor, 'Floor of the desk.', undefined, 1),
      q('a9', 9, 'form', 'Inter-library fee (£)', fee, 'Pounds.', undefined, 1),
      q('a10', 10, 'form', 'Card colour', card, 'Membership card colour.', undefined, 1),
      q('b1', 11, 'map', 'Enter by the ________ door', 'west', 'West door; main steps closed.', undefined, 2),
      q('b2', 12, 'map', 'Cloakroom is opposite the ________', 'shop', 'Opposite the shop.', undefined, 2),
      q('b3', 13, 'map', 'Roman gallery is ________', 'upstairs', 'Upstairs.', undefined, 2),
      q('b4', 14, 'map', 'Café is in the ________', 'courtyard', 'Courtyard.', undefined, 2),
      q('b5', 15, 'map', 'Fire exit is behind the ________ wall', 'mosaic', 'Mosaic wall.', undefined, 2),
      q('b6', 16, 'notes', 'Toilets are beside the ________', 'lift', 'Beside the lift.', undefined, 2),
      q('b7', 17, 'form', 'Gift shop closes at', ['4', '4 pm', 'four'], 'Four; galleries later.', undefined, 2),
      q('b8', 18, 'mcq', 'Photography is not allowed in the', 'C', 'Jewellery room.', ['A Roman gallery', 'B courtyard', 'C jewellery room'], 2),
      q('b9', 19, 'form', 'Coins talk: Room', 'B', 'Room B.', undefined, 2),
      q('b10', 20, 'form', 'Audio guide price (£)', ['3', 'three'], 'Three pounds.', undefined, 2),
      q('c1', 21, 'mcq', 'Dr Cole thinks the number of field sites should be', 'A', 'Two is enough.', ['A two', 'B more than two', 'C none'], 3),
      q('c2', 22, 'mcq', 'Data collection will be', 'B', 'Interviews only.', ['A questionnaires', 'B interviews only', 'C both'], 3),
      q('c3', 23, 'form', 'Number of residents to interview', '40', 'Forty residents.', undefined, 3),
      q('c4', 24, 'form', 'Deadline day', 'Friday', 'Friday, not Monday.', undefined, 3),
      q('c5', 25, 'mcq', 'Filming the weir requires', 'B', 'A council permit.', ['A extra staff', 'B a council permit', 'C weekend access'], 3),
      q('c6', 26, 'match', 'Who will draft the ethics form?', 'A', 'Tom.', ['A Tom', 'B Mei', 'C Dr Cole'], 3),
      q('c7', 27, 'match', 'Who will book the van?', 'B', 'Mei.', ['A Tom', 'B Mei', 'C Dr Cole'], 3),
      q('c8', 28, 'match', 'Who will write the risk assessment?', 'C', 'Dr Cole.', ['A Tom', 'B Mei', 'C Dr Cole'], 3),
      q('c9', 29, 'mcq', 'They will present findings as a', 'A', 'Poster, not a talk.', ['A poster', 'B twenty-minute talk', 'C film'], 3),
      q('c10', 30, 'mcq', 'The reason for that format is', 'C', 'The conference slot is short.', ['A cost', 'B Dr Cole dislikes talks', 'C a short conference slot'], 3),
      q('d1', 31, 'notes', 'Blue light reduces ________', 'melatonin', 'Melatonin.', undefined, 4),
      q('d2', 32, 'notes', 'Helpful naps last under ________ minutes', '20', 'Under 20.', undefined, 4),
      q('d3', 33, 'notes', 'Longer naps cause ________', 'grogginess', 'Grogginess.', undefined, 4),
      q('d4', 34, 'notes', 'Avoid caffeine after ________ pm', ['3', '3 pm'], 'After 3 pm.', undefined, 4),
      q('d5', 35, 'notes', 'Rotate shifts ________, not backward', 'forward', 'Forward rotation.', undefined, 4),
      q('d6', 36, 'notes', 'Daytime sleep: use a dark room and an ________', ['eye mask', 'eyemask'], 'Eye mask.', undefined, 4),
      q('d7', 37, 'notes', 'Heavy meals before a shift increase ________', 'errors', 'Errors.', undefined, 4),
      q('d8', 38, 'notes', '2019 review: forward rotation cut accidents by about a ________', 'fifth', 'About a fifth.', undefined, 4),
      q('d9', 39, 'notes', 'Workers over ________ need longer recovery', ['50', 'fifty'], 'Over fifty.', undefined, 4),
      q('d10', 40, 'notes', 'Ignoring this raised ________ leave in hospitals', 'sick', 'Sick leave.', undefined, 4),
    ],
  }
}

function listenClinic() {
  const name = pick(['Elena Voss', 'Priya Shah', 'Tom Ike'])
  const dob = pick(['12.04.1999', '03.11.2001', '28.07.1996'])
  const allergy = pick(['penicillin', 'latex', 'peanuts'])
  const time = pick(['9.20', '10.40', '14.15'])
  const dest = pick(['Portugal', 'Kenya', 'Vietnam'])
  const fever = dest === 'Portugal' ? 'not required' : 'required'
  return {
    title: 'Health centre booking',
    topic: 'health',
    script: [
      { text: `Travel clinic, please. Patient name ${name}. Date of birth ${dob}. Allergy ${allergy}.` },
      { text: `Destination ${dest}. Appointment at ${time}. Bring your passport and a list of current medicines.` },
      { text: `Yellow fever is ${fever} for ${dest}. Hepatitis A is still recommended. Pay at reception, not online.` },
      { text: `If you feel faint after the jab, sit for fifteen minutes. The nurse is in Room 4.` },
      { text: `Section 2. Sports centre. The pool is closed on Monday for cleaning. Gym induction is free this month.` },
      { text: `Spin class is in Studio B. Yoga has moved to Studio A. Lockers need a two-pound coin. The café opens at seven.` },
      { text: `Members may book two classes a day. Guests pay eight pounds. The climbing wall is for over-sixteens only.` },
      { text: `Lost property is behind reception. Next week a physiotherapist visits on Thursday mornings.` },
      { text: `Section 3. Design students. The prototype failed in rain. They will change the hinge, not the fabric.` },
      { text: `Survey forty users, half of them cyclists. Present on Tuesday. Anna writes the abstract; Leo builds the slides.` },
      { text: `They drop the metal frame because it rusted. The tutor wants a cost table, not a mood board.` },
      { text: `Ethics: no photos of faces. They will test on campus paths, not the main road.` },
      { text: `Section 4. Lecture on peatlands. Peat stores carbon. Drainage releases methane.` },
      { text: `Restoration starts by blocking ditches. Sphagnum moss is replanted last, after the water table rises.` },
      { text: `Grazing cattle compact wet soil. Boardwalks reduce visitor damage. A 2021 Irish study found blocked drains cut methane within two years.` },
      { text: `The speaker warns that planting trees on peat can dry the bog and undo the gain.` },
    ],
    questions: [
      q('c1', 1, 'form', 'Patient name', name, 'As spoken.', undefined, 1),
      q('c2', 2, 'form', 'Date of birth', dob, 'DOB.', undefined, 1),
      q('c3', 3, 'form', 'Allergy', allergy, 'Allergy.', undefined, 1),
      q('c4', 4, 'form', 'Destination', dest, 'Country named.', undefined, 1),
      q('c5', 5, 'form', 'Appointment time', time, 'Time.', undefined, 1),
      q('c6', 6, 'mcq', 'Bring to the appointment', 'B', 'Passport and medicine list.', ['A only a passport', 'B passport and a medicine list', 'C insurance card only'], 1),
      q('c7', 7, 'form', 'Yellow fever for this destination', fever, 'Required or not, as spoken.', undefined, 1),
      q('c8', 8, 'mcq', 'Hepatitis A is', 'A', 'Still recommended.', ['A recommended', 'B not needed', 'C given only to children'], 1),
      q('c9', 9, 'mcq', 'Pay', 'C', 'At reception, not online.', ['A online only', 'B by phone', 'C at reception'], 1),
      q('c10', 10, 'form', 'Nurse room number', '4', 'Room 4.', undefined, 1),
      q('s1', 11, 'mcq', 'Pool is closed on', 'A', 'Monday.', ['A Monday', 'B Tuesday', 'C Sunday'], 2),
      q('s2', 12, 'mcq', 'Gym induction this month is', 'B', 'Free.', ['A £10', 'B free', 'C for members only'], 2),
      q('s3', 13, 'form', 'Spin class studio', 'B', 'Studio B.', undefined, 2),
      q('s4', 14, 'form', 'Yoga studio', 'A', 'Moved to Studio A.', undefined, 2),
      q('s5', 15, 'form', 'Locker coin (£)', ['2', 'two'], 'Two-pound coin.', undefined, 2),
      q('s6', 16, 'form', 'Café opens at', ['7', '7 am', 'seven'], 'Seven.', undefined, 2),
      q('s7', 17, 'form', 'Maximum classes a member may book per day', '2', 'Two classes.', undefined, 2),
      q('s8', 18, 'form', 'Guest fee (£)', ['8', 'eight'], 'Eight pounds.', undefined, 2),
      q('s9', 19, 'mcq', 'The climbing wall is for', 'C', 'Over-sixteens.', ['A all ages', 'B under-twelves', 'C over-sixteens only'], 2),
      q('s10', 20, 'form', 'Physiotherapist visits on', 'Thursday', 'Thursday mornings.', undefined, 2),
      q('d1', 21, 'mcq', 'They will change the', 'A', 'Hinge, not fabric.', ['A hinge', 'B fabric', 'C colour'], 3),
      q('d2', 22, 'form', 'Number of users in the survey', '40', '40 users.', undefined, 3),
      q('d3', 23, 'mcq', 'Half of the users should be', 'B', 'Cyclists.', ['A drivers', 'B cyclists', 'C children'], 3),
      q('d4', 24, 'form', 'Presentation day', 'Tuesday', 'Tuesday.', undefined, 3),
      q('d5', 25, 'match', 'Who writes the abstract?', 'A', 'Anna.', ['A Anna', 'B Leo', 'C the tutor'], 3),
      q('d6', 26, 'match', 'Who builds the slides?', 'B', 'Leo.', ['A Anna', 'B Leo', 'C the tutor'], 3),
      q('d7', 27, 'mcq', 'They drop the metal frame because it', 'A', 'Rusted.', ['A rusted', 'B was too heavy', 'C failed ethics'], 3),
      q('d8', 28, 'mcq', 'The tutor wants a', 'B', 'Cost table, not a mood board.', ['A mood board', 'B cost table', 'C video'], 3),
      q('d9', 29, 'mcq', 'Ethics rule on photos', 'C', 'No photos of faces.', ['A no photos at all', 'B faces are fine', 'C no photos of faces'], 3),
      q('d10', 30, 'mcq', 'They will test on', 'A', 'Campus paths, not the main road.', ['A campus paths', 'B the main road', 'C a laboratory only'], 3),
      q('p1', 31, 'notes', 'Peat stores ________', 'carbon', 'Carbon.', undefined, 4),
      q('p2', 32, 'notes', 'Drainage releases ________', 'methane', 'Methane.', undefined, 4),
      q('p3', 33, 'notes', 'First restoration step: blocking ________', 'ditches', 'Ditches.', undefined, 4),
      q('p4', 34, 'notes', 'Last plant: ________ moss', 'sphagnum', 'Sphagnum.', undefined, 4),
      q('p5', 35, 'notes', 'Replant moss after the ________ table rises', ['water', 'water table'], 'Water table.', undefined, 4),
      q('p6', 36, 'notes', 'Cattle compact wet ________', 'soil', 'Soil.', undefined, 4),
      q('p7', 37, 'notes', '________ reduce visitor damage', 'boardwalks', 'Boardwalks.', undefined, 4),
      q('p8', 38, 'notes', 'Irish study year', '2021', '2021.', undefined, 4),
      q('p9', 39, 'notes', 'Blocked drains cut methane within ________ years', '2', 'Two years.', undefined, 4),
      q('p10', 40, 'notes', 'Trees on peat can ________ the bog', 'dry', 'Dry the bog.', undefined, 4),
    ],
  }
}

function listenField() {
  const site = pick(['Holme Fen', 'Blackwater', 'Skomer'])
  const meet = pick(['car park', 'visitor hut', 'south gate'])
  const boots = pick(['waterproof', 'ankle'])
  return {
    title: 'Field-trip briefing',
    topic: 'science',
    script: [
      { text: `Field-trip briefing for ${site}. Meet at the ${meet} at eight. Wear ${boots} boots and a high-visibility jacket.` },
      { text: `Bring a packed lunch. The canteen is closed. Tide times matter after 3 pm. If it rains hard, we cancel the shore walk.` },
      { text: `Sign the risk sheet. Emergency number is on the back of your badge. No solo walking.` },
      { text: `Minibus leaves the library, not the halls. Return by six unless the tide delays us.` },
      { text: `Section 2. Town-hall talk. The market moves to King Street. Parking is free after 6. The library will open on Sundays from June.` },
      { text: `The playground by the canal is closing for two months. A new bus stop will face the post office.` },
      { text: `Recycling glass goes to the supermarket, not the civic hall. Noise after eleven will be fined.` },
      { text: `The mayor’s surgery is the first Friday of the month. Comments on the plan close on the 30th.` },
      { text: `Section 3. Two students on a podcast. They cut the intro music. The guest is a midwife, not a surgeon.` },
      { text: `Record in the booth, not the flat. Edit out the coughs. Keep the episode under twenty-five minutes.` },
      { text: `Sam writes the questions. Rina books the guest. They will publish on Wednesday.` },
      { text: `The tutor said avoid medical advice; stick to the guest’s training story.` },
      { text: `Section 4. Lecture on urban bats. Street lights delay emergence. Warm roofs are nurseries.` },
      { text: `Planting moth-rich hedges helps. Surveys use acoustic loggers, not torch counts, in rain.` },
      { text: `White light is worse than amber. New builds should leave a dark corridor to the river.` },
      { text: `A 2018 city audit found loft conversions destroyed more roosts than new roads.` },
    ],
    questions: [
      q('f1', 1, 'form', 'Site name', site, 'Site.', undefined, 1),
      q('f2', 2, 'form', 'Meet at the', meet, 'Meeting point.', undefined, 1),
      q('f3', 3, 'form', 'Meet at (time)', ['8', '8 am', 'eight'], 'Eight.', undefined, 1),
      q('f4', 4, 'form', 'Boot type', boots, 'Boots.', undefined, 1),
      q('f5', 5, 'notes', 'Also wear a high-visibility ________', 'jacket', 'Jacket.', undefined, 1),
      q('f6', 6, 'mcq', 'Lunch', 'B', 'Packed; canteen closed.', ['A buy on site', 'B packed lunch', 'C hotel breakfast'], 1),
      q('f7', 7, 'mcq', 'Hard rain means they cancel the', 'A', 'Shore walk.', ['A shore walk', 'B whole trip', 'C minibus'], 1),
      q('f8', 8, 'mcq', 'Walking rule', 'C', 'No solo walking.', ['A pairs optional', 'B staff only', 'C no solo walking'], 1),
      q('f9', 9, 'mcq', 'Minibus leaves from the', 'A', 'Library, not halls.', ['A library', 'B halls', 'C car park in town'], 1),
      q('f10', 10, 'form', 'Planned return time', ['6', '6 pm', 'six'], 'Six, unless tide delays.', undefined, 1),
      q('t1', 11, 'form', 'Market moves to ________ Street', 'King', 'King Street.', undefined, 2),
      q('t2', 12, 'form', 'Free parking after', ['6', '6 pm'], 'After 6.', undefined, 2),
      q('t3', 13, 'form', 'Library Sundays from', 'June', 'June.', undefined, 2),
      q('t4', 14, 'form', 'Playground by the canal closed for ________ months', '2', 'Two months.', undefined, 2),
      q('t5', 15, 'map', 'New bus stop will face the ________', ['post office', 'postoffice'], 'Post office.', undefined, 2),
      q('t6', 16, 'mcq', 'Glass recycling goes to the', 'B', 'Supermarket.', ['A civic hall', 'B supermarket', 'C school'], 2),
      q('t7', 17, 'form', 'Noise fines after', ['11', '11 pm', 'eleven'], 'After eleven.', undefined, 2),
      q('t8', 18, 'form', 'Mayor’s surgery: first ________ of the month', 'Friday', 'First Friday.', undefined, 2),
      q('t9', 19, 'form', 'Comments close on the', ['30th', '30'], 'The 30th.', undefined, 2),
      q('t10', 20, 'mcq', 'This talk is mainly about', 'A', 'Local civic changes.', ['A town changes', 'B national tax', 'C school exams'], 2),
      q('k1', 21, 'mcq', 'They cut the', 'A', 'Intro music.', ['A intro music', 'B interview', 'C credits'], 3),
      q('k2', 22, 'mcq', 'Guest is a', 'B', 'Midwife.', ['A surgeon', 'B midwife', 'C teacher'], 3),
      q('k3', 23, 'mcq', 'They will record in the', 'A', 'Booth.', ['A booth', 'B flat', 'C cafe'], 3),
      q('k4', 24, 'notes', 'Edit out the ________', 'coughs', 'Coughs.', undefined, 3),
      q('k5', 25, 'form', 'Keep the episode under ________ minutes', '25', 'Twenty-five.', undefined, 3),
      q('k6', 26, 'match', 'Who writes the questions?', 'A', 'Sam.', ['A Sam', 'B Rina', 'C the tutor'], 3),
      q('k7', 27, 'match', 'Who books the guest?', 'B', 'Rina.', ['A Sam', 'B Rina', 'C the tutor'], 3),
      q('k8', 28, 'form', 'Publish day', 'Wednesday', 'Wednesday.', undefined, 3),
      q('k9', 29, 'mcq', 'The tutor said avoid', 'C', 'Medical advice.', ['A stories', 'B questions', 'C medical advice'], 3),
      q('k10', 30, 'mcq', 'Stick to the guest’s', 'A', 'Training story.', ['A training story', 'B political views', 'C clinic prices'], 3),
      q('u1', 31, 'notes', 'Lights delay bat ________', 'emergence', 'Emergence.', undefined, 4),
      q('u2', 32, 'notes', 'Warm roofs are ________', 'nurseries', 'Nurseries.', undefined, 4),
      q('u3', 33, 'notes', 'Plant hedges rich in ________', 'moths', 'Moths.', undefined, 4),
      q('u4', 34, 'notes', 'Surveys use acoustic ________', 'loggers', 'Loggers.', undefined, 4),
      q('u5', 35, 'mcq', 'In rain, do not use', 'B', 'Torch counts.', ['A loggers', 'B torch counts', 'C maps'], 4),
      q('u6', 36, 'notes', '________ light is worse than amber', 'white', 'White light.', undefined, 4),
      q('u7', 37, 'notes', 'New builds: leave a dark corridor to the ________', 'river', 'River.', undefined, 4),
      q('u8', 38, 'form', 'City audit year', '2018', '2018.', undefined, 4),
      q('u9', 39, 'notes', 'Loft conversions destroyed more ________ than new roads', 'roosts', 'Roosts.', undefined, 4),
      q('u10', 40, 'mcq', 'The lecture is mainly about', 'A', 'Urban bats and lighting.', ['A urban bats', 'B farm birds', 'C river fish'], 4),
    ],
  }
}

function listenAirport() {
  const flight = `${pick(['BA', 'EK', 'QF'])}${r(100, 899)}`
  const bag = pick(['black suitcase', 'green rucksack', 'blue holdall'])
  const tag = `${pick(['LN', 'DX', 'SY'])}${r(100000, 899999)}`
  const phone = `07${r(700, 899)} ${r(200, 899)} ${r(100, 999)}`
  return {
    title: 'Lost-luggage desk',
    topic: 'travel',
    script: [
      { text: `Lost luggage. Flight ${flight}. The bag is a ${bag}. Tag number ${tag}.` },
      { text: `Contact number ${phone}. Deliver to 14 Hill Road, not the hotel. The lock is broken.` },
      { text: `It contains a laptop and a wool coat. No liquids. I need it before Thursday.` },
      { text: `Fill the pink form. The desk closes at nine. You will get an SMS, not an email.` },
      { text: `Section 2. Airport orientation. From this hall, walk past the currency desk to Gate 12 talks.` },
      { text: `Toilets are behind the bookshop. The prayer room is next to Gate 9. Water fountains are after security only.` },
      { text: `The train, not the bus, is fastest to the city. Taxis wait on Level 2. Do not accept rides in the arrivals hall.` },
      { text: `If you lose a child, go to the information desk under the yellow clock. First aid is opposite.` },
      { text: `Section 3. Students planning a survey at the airport. They wanted to interview pilots. The supervisor said no — too busy.` },
      { text: `They will interview departing passengers aged over eighteen. Sample size sixty. Avoid duty-free queues.` },
      { text: `Nia designs the consent sheet. Omar codes the answers. They must finish by 5 pm because the hall gets noisy.` },
      { text: `They dropped the question on income. Keep questions on delay and signage.` },
      { text: `Section 4. Lecture on bird strikes at airports. Most strikes happen below three thousand feet, on take-off or landing.` },
      { text: `Grass between runways attracts geese if it is cut short. Longer grass, surprisingly, reduces feeding.` },
      { text: `Radar can track flocks. Distress-call speakers work for gulls, less well for starlings.` },
      { text: `A 2016 review said habitat, not just sirens, cut strikes most. Night flights still hit migrating birds.` },
    ],
    questions: [
      q('l1', 1, 'form', 'Flight number', flight, 'Airline code plus number.', undefined, 1),
      q('l2', 2, 'form', 'Bag type', bag, 'Colour and type.', undefined, 1),
      q('l3', 3, 'form', 'Tag number', tag, 'As spoken.', undefined, 1),
      q('l4', 4, 'form', 'Mobile', [phone, phone.replace(/\s/g, '')], 'Contact number.', undefined, 1),
      q('l5', 5, 'form', 'Deliver to ________ Hill Road', '14', '14 Hill Road, not the hotel.', undefined, 1),
      q('l6', 6, 'mcq', 'The lock is', 'A', 'Broken.', ['A broken', 'B missing', 'C new'], 1),
      q('l7', 7, 'notes', 'Contains a laptop and a wool ________', 'coat', 'Wool coat.', undefined, 1),
      q('l8', 8, 'mcq', 'Needed before', 'B', 'Thursday.', ['A Wednesday', 'B Thursday', 'C Sunday'], 1),
      q('l9', 9, 'form', 'Form colour', 'pink', 'Pink form.', undefined, 1),
      q('l10', 10, 'mcq', 'Updates will arrive by', 'C', 'SMS, not email.', ['A email', 'B phone call', 'C SMS'], 1),
      q('m1', 11, 'map', 'Walk past the ________ desk to Gate 12', 'currency', 'Currency desk.', undefined, 2),
      q('m2', 12, 'map', 'Toilets are behind the ________', 'bookshop', 'Bookshop.', undefined, 2),
      q('m3', 13, 'map', 'Prayer room is next to Gate ________', '9', 'Gate 9.', undefined, 2),
      q('m4', 14, 'mcq', 'Water fountains are', 'B', 'After security only.', ['A in this hall', 'B after security only', 'C on the train'], 2),
      q('m5', 15, 'mcq', 'Fastest to the city', 'A', 'The train, not the bus.', ['A train', 'B bus', 'C taxi'], 2),
      q('m6', 16, 'form', 'Taxis wait on Level', '2', 'Level 2.', undefined, 2),
      q('m7', 17, 'mcq', 'Do not accept rides', 'C', 'In the arrivals hall.', ['A at Level 2', 'B at the station', 'C in the arrivals hall'], 2),
      q('m8', 18, 'map', 'Lost child: information desk under the yellow ________', 'clock', 'Yellow clock.', undefined, 2),
      q('m9', 19, 'map', 'First aid is ________ the information desk', 'opposite', 'Opposite.', undefined, 2),
      q('m10', 20, 'mcq', 'This talk is', 'A', 'Airport orientation.', ['A a building orientation', 'B a security interview', 'C a flight delay list'], 2),
      q('n1', 21, 'mcq', 'They may not interview', 'A', 'Pilots — too busy.', ['A pilots', 'B passengers', 'C supervisors'], 3),
      q('n2', 22, 'mcq', 'Passengers must be', 'B', 'Over eighteen.', ['A under sixteen', 'B over eighteen', 'C staff only'], 3),
      q('n3', 23, 'form', 'Sample size', '60', 'Sixty.', undefined, 3),
      q('n4', 24, 'mcq', 'Avoid queues at', 'C', 'Duty-free.', ['A security', 'B gates', 'C duty-free'], 3),
      q('n5', 25, 'match', 'Who designs the consent sheet?', 'A', 'Nia.', ['A Nia', 'B Omar', 'C the supervisor'], 3),
      q('n6', 26, 'match', 'Who codes the answers?', 'B', 'Omar.', ['A Nia', 'B Omar', 'C the supervisor'], 3),
      q('n7', 27, 'form', 'Finish by', ['5', '5 pm'], '5 pm — hall gets noisy.', undefined, 3),
      q('n8', 28, 'mcq', 'They dropped the question on', 'A', 'Income.', ['A income', 'B delay', 'C signage'], 3),
      q('n9', 29, 'mcq', 'Keep questions on delay and', 'B', 'Signage.', ['A prices', 'B signage', 'C passports'], 3),
      q('n10', 30, 'mcq', 'The supervisor’s role in the audio is to', 'C', 'Refuse the pilot idea.', ['A code data', 'B design consent', 'C block the pilot interviews'], 3),
      q('o1', 31, 'notes', 'Most strikes happen below ________ thousand feet', '3', 'Three thousand.', undefined, 4),
      q('o2', 32, 'notes', 'They occur on take-off or ________', 'landing', 'Landing.', undefined, 4),
      q('o3', 33, 'notes', 'Short grass attracts ________', 'geese', 'Geese.', undefined, 4),
      q('o4', 34, 'notes', '________ grass reduces feeding', 'longer', 'Longer grass.', undefined, 4),
      q('o5', 35, 'notes', '________ can track flocks', 'radar', 'Radar.', undefined, 4),
      q('o6', 36, 'notes', 'Distress-call speakers work for ________', 'gulls', 'Gulls.', undefined, 4),
      q('o7', 37, 'notes', 'They work less well for ________', 'starlings', 'Starlings.', undefined, 4),
      q('o8', 38, 'form', 'Review year', '2016', '2016.', undefined, 4),
      q('o9', 39, 'notes', '________, not just sirens, cut strikes most', 'habitat', 'Habitat.', undefined, 4),
      q('o10', 40, 'notes', 'Night flights still hit ________ birds', 'migrating', 'Migrating birds.', undefined, 4),
    ],
  }
}

function listenHalls() {
  const block = pick(['Cedar', 'Maple', 'Oak'])
  const room = `${r(12, 38)}${pick(['A', 'B', 'C'])}`
  const rent = pick(['145', '160', '175'])
  const deposit = pick(['200', '250'])
  return {
    title: 'Halls of residence',
    topic: 'education',
    script: [
      { text: `Housing office. Block ${block}, room ${room}. Weekly rent ${rent} pounds. Deposit ${deposit}.` },
      { text: `Move-in is Saturday from ten. Kitchen is shared with five others. No candles. Quiet hours from eleven.` },
      { text: `Internet is included. Bedding is not. The laundry token is two pounds. Post is collected from the lobby.` },
      { text: `Guests may stay two nights. Register them at reception. The warden lives in Flat 1.` },
      { text: `Section 2. Campus tour. From the halls, the science labs are across the footbridge.` },
      { text: `The sports hall is behind the canteen. Bike sheds are to the left of the library. The medical centre is next to the bus stop.` },
      { text: `Do not cut through the service yard. The lake path is closed after dusk. The ATM is inside the union.` },
      { text: `ID cards are printed in the admin block, ground floor, not upstairs.` },
      { text: `Section 3. Seminar on a group poster. They chose urban heat, not flooding. Sample: three streets.` },
      { text: `Liz takes temperatures. Khalid writes the method. They will use a bar chart, not a pie chart.` },
      { text: `The tutor said cite two journals, not blogs. Deadline is the 17th. Print in colour.` },
      { text: `They rejected a survey because the ethics form would take too long.` },
      { text: `Section 4. Lecture on microplastics in rivers. Fibres from washing machines are a major source.` },
      { text: `Waste-water plants catch some, not all. Tyre dust enters via road drains. Storms raise concentrations overnight.` },
      { text: `Sampling should be at mid-depth, not the surface film only. A 2020 Dutch paper used Raman spectroscopy.` },
      { text: `Banning microbeads helped cosmetics but not textiles. Filters on machines are a newer fix.` },
    ],
    questions: [
      q('h1', 1, 'form', 'Block name', block, 'Cedar / Maple / Oak.', undefined, 1),
      q('h2', 2, 'form', 'Room', room, 'Number plus letter.', undefined, 1),
      q('h3', 3, 'form', 'Weekly rent (£)', rent, 'Pounds.', undefined, 1),
      q('h4', 4, 'form', 'Deposit (£)', deposit, 'Deposit.', undefined, 1),
      q('h5', 5, 'form', 'Move-in day', 'Saturday', 'Saturday from ten.', undefined, 1),
      q('h6', 6, 'form', 'Kitchen shared with ________ others', '5', 'Five others.', undefined, 1),
      q('h7', 7, 'mcq', 'Candles are', 'C', 'No candles.', ['A allowed', 'B allowed in winter', 'C not allowed'], 1),
      q('h8', 8, 'form', 'Quiet hours from', ['11', '11 pm', 'eleven'], 'Eleven.', undefined, 1),
      q('h9', 9, 'mcq', 'Bedding is', 'B', 'Not included.', ['A included', 'B not included', 'C optional rental only'], 1),
      q('h10', 10, 'form', 'Laundry token (£)', ['2', 'two'], 'Two pounds.', undefined, 1),
      q('v1', 11, 'map', 'Science labs are across the ________', 'footbridge', 'Footbridge.', undefined, 2),
      q('v2', 12, 'map', 'Sports hall is behind the ________', 'canteen', 'Canteen.', undefined, 2),
      q('v3', 13, 'map', 'Bike sheds are to the left of the ________', 'library', 'Library.', undefined, 2),
      q('v4', 14, 'map', 'Medical centre is next to the ________', ['bus stop', 'busstop'], 'Bus stop.', undefined, 2),
      q('v5', 15, 'mcq', 'Do not cut through the', 'A', 'Service yard.', ['A service yard', 'B footbridge', 'C union'], 2),
      q('v6', 16, 'mcq', 'The lake path is closed', 'B', 'After dusk.', ['A at noon', 'B after dusk', 'C on Mondays'], 2),
      q('v7', 17, 'map', 'ATM is inside the ________', 'union', 'Union.', undefined, 2),
      q('v8', 18, 'mcq', 'ID cards are printed', 'C', 'Admin block, ground floor.', ['A upstairs in admin', 'B in the library', 'C admin block, ground floor'], 2),
      q('v9', 19, 'mcq', 'This campus tour starts from the', 'A', 'From the halls.', ['A halls', 'B train station', 'C city museum'], 2),
      q('v10', 20, 'mcq', 'This section is mainly a', 'A', 'Campus tour / map talk.', ['A campus map talk', 'B rent dispute', 'C exam briefing'], 2),
      q('g1', 21, 'mcq', 'Poster topic they chose', 'A', 'Urban heat, not flooding.', ['A urban heat', 'B flooding', 'C traffic'], 3),
      q('g2', 22, 'form', 'Number of streets in the sample', '3', 'Three streets.', undefined, 3),
      q('g3', 23, 'match', 'Who takes temperatures?', 'A', 'Liz.', ['A Liz', 'B Khalid', 'C the tutor'], 3),
      q('g4', 24, 'match', 'Who writes the method?', 'B', 'Khalid.', ['A Liz', 'B Khalid', 'C the tutor'], 3),
      q('g5', 25, 'mcq', 'They will use a', 'A', 'Bar chart, not pie.', ['A bar chart', 'B pie chart', 'C map only'], 3),
      q('g6', 26, 'mcq', 'Cite', 'B', 'Two journals, not blogs.', ['A blogs', 'B two journals', 'C newspapers only'], 3),
      q('g7', 27, 'form', 'Deadline date (the ________)', ['17th', '17'], 'The 17th.', undefined, 3),
      q('g8', 28, 'mcq', 'Print', 'C', 'In colour.', ['A black and white', 'B A3 only', 'C in colour'], 3),
      q('g9', 29, 'mcq', 'They rejected a survey because', 'A', 'Ethics would take too long.', ['A ethics would take too long', 'B the tutor forbade it', 'C they had no printer'], 3),
      q('g10', 30, 'mcq', 'This conversation is a', 'B', 'Student–student seminar plan.', ['A lecture', 'B group-work meeting', 'C housing complaint'], 3),
      q('x1', 31, 'notes', 'A major source: fibres from ________ machines', 'washing', 'Washing machines.', undefined, 4),
      q('x2', 32, 'notes', 'Waste-water plants catch some, not ________', 'all', 'Not all.', undefined, 4),
      q('x3', 33, 'notes', 'Tyre dust enters via road ________', 'drains', 'Drains.', undefined, 4),
      q('x4', 34, 'notes', 'Storms raise concentrations ________', 'overnight', 'Overnight.', undefined, 4),
      q('x5', 35, 'notes', 'Sample at ________-depth, not the surface film only', 'mid', 'Mid-depth.', undefined, 4),
      q('x6', 36, 'form', 'Dutch paper year', '2020', '2020.', undefined, 4),
      q('x7', 37, 'notes', 'That paper used ________ spectroscopy', 'Raman', 'Raman.', undefined, 4),
      q('x8', 38, 'notes', 'Banning microbeads helped ________', 'cosmetics', 'Cosmetics.', undefined, 4),
      q('x9', 39, 'notes', 'It did not help ________', 'textiles', 'Textiles.', undefined, 4),
      q('x10', 40, 'notes', 'A newer fix: ________ on machines', 'filters', 'Filters.', undefined, 4),
    ],
  }
}

export const READ_PASSAGES: ReadPassage[] = [
  {
    id: 'coral',
    short: 'Coral',
    topic: 'environment',
    title: 'Mass bleaching and reef recovery',
    text: `A  Coral bleaching occurs when heat stress forces corals to expel the symbiotic algae that feed them. Without that colour and that food source, the animal can starve. Reefs can recover if cooler water returns quickly, but repeated marine heatwaves leave less time for that recovery. The 2016–17 bleaching on the Great Barrier Reef killed a large share of shallow corals in the north. Writers in popular media sometimes claim bleaching is always fatal. The research literature is more careful: some colonies survive, and some reefs shift toward heat-tolerant species.

B  Restoration projects that plant coral fragments can help on a local scale. They cannot replace cuts in global greenhouse-gas emissions. A 2022 review argued that tourism fees earmarked for “reef rescue” are a weak tool if farm run-off still clouds the water. Sediment and excess nutrients make bleaching more lethal even when the temperature spike is moderate. Managers therefore treat water quality and climate policy as a pair, not as rival slogans.

C  Heat-tolerant corals are not a free gift. Breeding them in nurseries is slow, and releasing them onto a reef that still overheats every summer is like replanting a forest in a drought. Some biologists warn that public enthusiasm for nurseries can distract from the less photogenic work of sewage treatment and fishing limits. Others reply that local action still buys years while international talks stall.

D  Tourism complicates the picture. Divers pay to see colour; a white reef photographs as a crisis and bookings fall. Operators then lobby for shade cloths, cooling pumps, or more nurseries — visible fixes — rather than for farm regulation inland. The 2022 review treated that political economy as part of the science, not as a footnote.

E  None of this implies that restoration is pointless. Fragment planting has rebuilt small patches after cyclones, and those patches matter to the fishers who work them. The passage’s claim is narrower: restoration without cooler water and cleaner catchments will not restore a continental reef. That is a statement about scale, not a dismissal of volunteers who grow corals on frames.`,
    questions: [
      q('p1', 1, 'heading', 'Paragraph A', 'ii', 'Definition and the 2016–17 event.', ['i Tourism fees as a complete solution', 'ii What bleaching is, and that it is not always fatal', 'iii How to breed heat-tolerant corals', 'iv Why divers prefer white reefs', 'v Sewage plants in Europe']),
      q('p2', 2, 'heading', 'Paragraph B', 'i', 'Water quality plus climate, not fees alone.', ['i Why fees and planting are not enough alone', 'ii A history of the Great Barrier Reef', 'iii Night diving rules', 'iv Insurance for operators', 'v Coral genetics in detail']),
      q('p3', 3, 'heading', 'Paragraph C', 'iii', 'Nurseries are slow; local vs photogenic work.', ['i Ticket prices', 'ii Always-fatal bleaching', 'iii Limits of nursery programmes', 'iv Cyclone insurance', 'v Deep-sea mining']),
      q('p4', 4, 'tfng', 'Bleaching happens when corals expel their algae.', 'TRUE', 'Opening definition.'),
      q('p5', 5, 'tfng', 'The writer says bleaching is always fatal.', 'FALSE', 'Popular writers claim that; this text is more careful.'),
      q('p6', 6, 'tfng', 'The 2016–17 event affected the northern Great Barrier Reef.', 'TRUE', 'North mentioned.'),
      q('p7', 7, 'tfng', 'Fragment planting can replace emission cuts.', 'FALSE', 'Cannot replace cuts.'),
      q('p8', 8, 'yng', 'The 2022 review treats tourism fees as sufficient on their own.', 'NO', 'Weak if water quality ignored.'),
      q('p9', 9, 'yng', 'The writer thinks restoration without cooler water can restore a whole continental reef.', 'NO', 'Will not restore a continental reef.'),
      q('p10', 10, 'yng', 'The writer dismisses volunteers who grow corals on frames.', 'NO', 'Not a dismissal of volunteers.'),
      q('p11', 11, 'short', 'Algae ________ the coral (ONE WORD)', 'feed', 'Algae that feed them.'),
      q('p12', 12, 'short', 'Sediment and excess ________ make bleaching more lethal (ONE WORD)', 'nutrients', 'Nutrients.'),
      q('p13', 13, 'mcq', 'Local restoration is described as', 'B', 'Local scale only.', ['A a global solution', 'B helpful locally', 'C useless']),
      q('p14', 14, 'mcq', 'Operators often prefer', 'A', 'Visible fixes.', ['A visible fixes such as nurseries', 'B inland farm regulation', 'C closing all tourism']),
    ],
  },
  {
    id: 'rail',
    short: 'Rail',
    topic: 'transport',
    title: 'Why high-speed rail succeeds or fails',
    text: `A  High-speed rail is often sold as a climate policy. In Japan and France, dense cities and existing feeder trains made fast lines commercially viable. In other countries, lines have been built between cities that are too close for air to feel slow and too far for cars to feel painful — or between cities with little connecting transit. Time savings printed in brochures ignore access time to stations on the urban fringe.

B  A Spanish study found that some new lines mainly shifted passengers from conventional rail, not from planes. If the environmental case depends on replacing flights, that finding matters. Night trains, which this writer prefers for many medium distances, received less subsidy in the 2010s as governments chased headline speeds.

C  Cost overruns are not an accident of one culture. Tunnels, land purchase, and political redesign of routes after elections all inflate budgets. Supporters answer that roads and airports also enjoy hidden subsidies. The honest comparison is corridor-specific: a line that links two hubs already full of trains is not the same project as a line across sparse country built to win a regional vote.

D  Station location is a quiet killer of ridership. A “high-speed” stop twenty kilometres from the old centre can lose the time the train just saved. Japan’s urban stations and France’s mixed record — some TGV stops in fields — illustrate the point. Feeder buses advertised in year one often shrink by year five.

E  None of this is an argument never to build. It is an argument against slogans. The climate benefit appears when a line takes people out of planes and cars and keeps them out, year after year. That requires cities at both ends, tickets people can afford, and a timetable that survives the first budget cut. The honest case for high-speed rail is corridor-specific, not a poster.`,
    questions: [
      q('r1', 1, 'heading', 'Paragraph A', 'i', 'When HSR works, and access time.', ['i Conditions that make fast rail viable', 'ii Night-train history only', 'iii Airport design', 'iv Ticket printing', 'v Cycling policy']),
      q('r2', 2, 'heading', 'Paragraph B', 'iv', 'Shift from conventional rail; night trains.', ['i Japanese stations', 'ii Tunnel engineering', 'iii Never build rail', 'iv Who actually switches mode', 'v Electric cars']),
      q('r3', 3, 'yng', 'The writer thinks high-speed rail is always good climate policy.', 'NO', 'Corridor-specific, not a slogan.'),
      q('r4', 4, 'tfng', 'Japan and France are cited as places where feeder trains exist.', 'TRUE', 'Existing feeder trains.'),
      q('r5', 5, 'tfng', 'Access time to stations is ignored in some paper time-savings.', 'TRUE', 'Access time on the fringe.'),
      q('r6', 6, 'tfng', 'The Spanish study found most new passengers came from cars.', 'FALSE', 'From conventional rail, not planes.'),
      q('r7', 7, 'yng', 'The writer prefers night trains for some medium distances.', 'YES', 'The writer prefers.'),
      q('r8', 8, 'tfng', 'Night trains received more subsidy in the 2010s than high-speed projects.', 'FALSE', 'They received less subsidy.'),
      q('r9', 9, 'yng', 'The writer argues that no high-speed line should ever be built.', 'NO', 'Not an argument never to build.'),
      q('r10', 10, 'short', 'Night trains got less ________ in the 2010s (ONE WORD)', 'subsidy', 'Less subsidy.'),
      q('r11', 11, 'short', 'A quiet killer of ridership is station ________ (ONE WORD)', 'location', 'Station location.'),
      q('r12', 12, 'mcq', 'The honest case is', 'C', 'Corridor-specific.', ['A always build', 'B never build', 'C corridor-specific']),
      q('r13', 13, 'mcq', 'Feeder buses, the writer says, often', 'B', 'Shrink by year five.', ['A double each year', 'B shrink after the first years', 'C replace the train']),
      q('r14', 14, 'match', 'Which paragraph discusses cost overruns?', 'C', 'Paragraph C.', ['A A', 'B B', 'C C', 'D D', 'E E']),
    ],
  },
  {
    id: 'sleep',
    short: 'Sleep',
    topic: 'health',
    title: 'Sleep, memory and the school start',
    text: `A  Teenagers’ body clocks shift later in adolescence. Early school bells therefore cut REM-rich morning sleep, which laboratory studies link to memory consolidation. The biology is not a moral failure: melatonin rises later in the evening for this age group than for younger children or most adults.

B  Districts that delayed start times have reported better attendance, not always higher test scores. That distinction matters for politicians who sell later starts as an exam-grade reform. Attendance is still a real gain. Sleepy students crash cars on the way to campus; later bells have cut those crashes in several US evaluations.

C  Critics say buses and after-school jobs make delays expensive. The writer accepts the cost argument but notes that later starts are cheaper than many tutoring programmes with weaker evidence. Caffeine and phones in bed are mentioned as amplifiers, not the root cause. A 2018 consensus statement from sleep societies recommended 8–10 hours for adolescents; few weekday schedules allow it.

D  Employers who hire evening staff among seventeen-year-olds also shape the clock. A student who stacks shelves until 11 pm cannot “just sleep earlier”. Policy that only moves the school bell, and ignores labour rules for minors, will under-deliver.

E  The research is stronger on sleep duration and safety than on a guaranteed rise in mathematics scores. Schools that treat later starts as one tool among several — later bells, darker bedrooms, and limits on 6 am sports — see more consistent benefits than schools that change only the timetable and then declare the experiment a failure.`,
    questions: [
      q('s1', 1, 'tfng', 'Adolescent body clocks shift later.', 'TRUE', 'Opening.'),
      q('s2', 2, 'tfng', 'Delayed starts always raise test scores.', 'FALSE', 'Not always higher test scores.'),
      q('s3', 3, 'yng', 'The writer treats phone use as the main cause of lost sleep.', 'NO', 'Amplifiers, not the root cause.'),
      q('s4', 4, 'tfng', 'Sleep societies recommended 8–10 hours in 2018.', 'TRUE', 'Consensus statement.'),
      q('s5', 5, 'yng', 'The writer thinks later starts can be better value than some tutoring.', 'YES', 'Cheaper than many tutoring programmes.'),
      q('s6', 6, 'tfng', 'Melatonin rises later in the evening for teenagers than for most adults.', 'TRUE', 'Paragraph A.'),
      q('s7', 7, 'yng', 'The writer says changing only the timetable is enough.', 'NO', 'One tool among several; timetable-only can fail.'),
      q('s8', 8, 'short', 'Morning sleep is rich in ________ (ONE WORD / ACRONYM)', 'REM', 'REM-rich.'),
      q('s9', 9, 'short', 'Later bells have cut student ________ in several US evaluations (ONE WORD)', 'crashes', 'Crashes.'),
      q('s10', 10, 'mcq', 'Critics worry about', 'A', 'Buses and jobs.', ['A buses and jobs', 'B exam boards', 'C vitamins']),
      q('s11', 11, 'mcq', 'A student who works until 11 pm', 'B', 'Cannot simply sleep earlier.', ['A should sleep at 8 pm anyway', 'B cannot simply sleep earlier', 'C needs more caffeine']),
      q('s12', 12, 'heading', 'Paragraph D', 'iii', 'Labour / evening jobs.', ['i Exam marking', 'ii Bus engineering', 'iii Work hours also set the clock', 'iv Vitamin D', 'v University fees']),
      q('s13', 13, 'match', 'Which paragraph mentions a 2018 consensus?', 'C', 'Paragraph C.', ['A A', 'B B', 'C C', 'D D']),
      q('s14', 14, 'yng', 'The writer treats attendance gains as worthless if scores stay flat.', 'NO', 'Attendance is still a real gain.'),
    ],
  },
  {
    id: 'tea',
    short: 'Tea',
    topic: 'history',
    title: 'Tea, empire and advertising',
    text: `A  Tea became a mass drink in Britain only after the nineteenth century cut prices and advertising invented a domestic ritual. Earlier, it was a luxury associated with import duties and china cups that signalled rank. The Opium Wars are part of that price story, a fact school textbooks often isolate from the teacup.

B  Companies later sold “purity” and “empire-grown” blends. Historians disagree on whether advertising created demand or followed falling costs. This article takes the second view: wages and supply mattered more than slogans, but slogans decided which brand sat on the shelf.

C  Ceramic cups and afternoon “tea” as a meal were later additions, not ancient English custom. The working-day break that factories called “tea” was a pause with a hot drink; the middle-class ceremony with cake arrived as a status performance. Confusing the two lets heritage marketing rewrite the timeline.

D  Sugar and tea rose together. Cheap calories from Caribbean plantations sweetened a bitter leaf and made the habit affordable. Any history that treats the British teapot as innocent folklore, and slavery as a separate chapter, is telling a convenient story.

E  After 1945, tea still outsold coffee in Britain for decades. Instant coffee and espresso bars then reversed the trend among younger buyers. The advertising machine that had built “a nice cup of tea” could not freeze taste. That, too, supports the article’s view: slogans ride economic change; they rarely create it from nothing.`,
    questions: [
      q('t1', 1, 'tfng', 'Tea was always a mass drink in Britain.', 'FALSE', 'Only after the 19th century.'),
      q('t2', 2, 'tfng', 'The writer links the Opium Wars to tea prices.', 'TRUE', 'Part of that price story.'),
      q('t3', 3, 'yng', 'The writer thinks slogans created most of the demand.', 'NO', 'Wages and supply mattered more.'),
      q('t4', 4, 'tfng', 'Afternoon tea as a meal is an ancient English custom according to the passage.', 'FALSE', 'Later additions, not ancient.'),
      q('t5', 5, 'tfng', 'Sugar and tea are described as rising together.', 'TRUE', 'Paragraph D.'),
      q('t6', 6, 'yng', 'Historians all agree advertising created demand.', 'NO', 'They disagree.'),
      q('t7', 7, 'yng', 'The writer treats the British teapot as innocent folklore.', 'NO', 'Warns against that story.'),
      q('t8', 8, 'short', 'Companies sold “empire-grown” ________ (ONE WORD)', 'blends', 'Blends.'),
      q('t9', 9, 'short', 'After 1945 tea still outsold ________ for decades (ONE WORD)', 'coffee', 'Coffee.'),
      q('t10', 10, 'mcq', 'Slogans mainly decided', 'B', 'Which brand.', ['A the global price', 'B which brand was bought', 'C opium policy']),
      q('t11', 11, 'mcq', 'Instant coffee and espresso bars', 'A', 'Reversed the trend among younger buyers.', ['A reversed tea’s lead among younger buyers', 'B were illegal', 'C only sold tea']),
      q('t12', 12, 'heading', 'Paragraph C', 'ii', 'Two different “teas”.', ['i Opium chemistry', 'ii Factory break versus middle-class ceremony', 'iii Coffee futures', 'iv China porcelain techniques', 'v Railway tea stalls']),
      q('t13', 13, 'match', 'Which paragraph discusses slavery and sugar?', 'D', 'Paragraph D.', ['A A', 'B B', 'C C', 'D D', 'E E']),
      q('t14', 14, 'yng', 'The writer believes advertising can freeze taste forever.', 'NO', 'Could not freeze taste.'),
    ],
  },
  {
    id: 'bees',
    short: 'Bees',
    topic: 'environment',
    title: 'The urban honeybee fashion',
    text: `A  City rooftop hives became fashionable after news of rural bee decline. Ecologists later warned that honeybees, a managed livestock species, can outcompete wild bees already using urban parks. Several European cities paused new hive licences.

B  The writer is not against beekeeping; the target is the idea that a hive on a roof is automatically “conservation”. Planting native flowers and cutting pesticide use help a wider set of pollinators. Honey yields in polluted cities are often lower, a practical point the hobby literature underplays.

C  A London survey found more hives than the forage could support in some boroughs. Beekeepers then fed sugar syrup — which keeps colonies alive but does not feed wild bees. The fashion can therefore look green while tightening competition.

D  Rural decline has many causes: mites, monoculture, and insecticides among them. Urban hives do not repair a prairie. They may even pull attention and grant money toward a photogenic species and away from solitary bees that nest in soil and dead wood.

E  Policy that works is dull: flower-rich verges, less spraying in parks, and a cap on hives where forage maps are already red. Cities that kept issuing licences as a climate stunt now publish those maps. The passage’s advice is to read them before buying a nucleus colony.`,
    questions: [
      q('b1', 1, 'tfng', 'Honeybees are described as managed livestock.', 'TRUE', 'Managed livestock species.'),
      q('b2', 2, 'tfng', 'The writer wants a total ban on urban beekeeping.', 'FALSE', 'Not against beekeeping.'),
      q('b3', 3, 'yng', 'A roof hive is automatically conservation, according to the writer.', 'NO', 'That idea is the target.'),
      q('b4', 4, 'tfng', 'Some European cities paused new hive licences.', 'TRUE', 'Several cities.'),
      q('b5', 5, 'tfng', 'City honey yields are described as often lower.', 'TRUE', 'Often lower.'),
      q('b6', 6, 'tfng', 'Sugar syrup also feeds wild bees, according to the passage.', 'FALSE', 'Does not feed wild bees.'),
      q('b7', 7, 'yng', 'The writer thinks urban hives repair rural prairies.', 'NO', 'They do not repair a prairie.'),
      q('b8', 8, 'short', 'A London survey found too many hives for the ________ (ONE WORD)', 'forage', 'Forage.'),
      q('b9', 9, 'short', 'Solitary bees may nest in soil and dead ________ (ONE WORD)', 'wood', 'Dead wood.'),
      q('b10', 10, 'mcq', 'Better conservation moves include', 'C', 'Flowers and less pesticide.', ['A more hives only', 'B importing queens', 'C native flowers and less pesticide']),
      q('b11', 11, 'mcq', 'Cities that issued licences as a climate stunt now', 'B', 'Publish forage maps.', ['A ban all flowers', 'B publish forage maps', 'C import rural bees']),
      q('b12', 12, 'heading', 'Paragraph D', 'i', 'Rural causes; photogenic species.', ['i Rural decline and misplaced attention', 'ii How to extract honey', 'iii Airport bees', 'iv Sugar chemistry', 'v Queen breeding']),
      q('b13', 13, 'match', 'Which paragraph mentions a London survey?', 'C', 'Paragraph C.', ['A A', 'B B', 'C C', 'D D']),
      q('b14', 14, 'mcq', 'The passage’s advice before buying a colony is to', 'A', 'Read forage maps.', ['A read forage maps', 'B ignore licences', 'C spray parks']),
    ],
  },
  {
    id: 'glass',
    short: 'Glass',
    topic: 'architecture',
    title: 'The all-glass office and its costs',
    text: `A  Curtain-wall glass offices promised lightness and transparency. In sunny climates they became expensive to cool. Early models used single glazing; later ones added coatings that still leak heat at the edges. The aesthetic won awards; the energy bills did not.

B  The writer does not call for a ban on glass. The argument is that “modern” became a synonym for one material. Brick and timber mid-rises in Berlin and Vancouver show lower operational energy in several published comparisons. Occupants also report glare and a lack of openable windows.

C  Retrofit is possible — external shades, better glass, even a second skin. Demolition is often chosen instead because land values reward a new floor plate, not a kinder facade. Carbon locked in the existing frame is then thrown away for a marketing refresh.

D  Planning rules that only measure insulation in walls, and ignore summer cooling, still bless glass boxes in hot cities. A rule written for a grey winter does not travel. The passage treats that mismatch as a failure of regulation, not of physics.

E  None of this romanticises brick as automatically green. A poorly detailed masonry wall can fail too. The claim is narrower: material fashion should not outrank climate and comfort. Where glass is used, shade and openable lights should be in the first drawing, not added after tenants complain.`,
    questions: [
      q('g1', 1, 'tfng', 'All-glass offices are cheap to cool in sunny climates.', 'FALSE', 'Expensive to cool.'),
      q('g2', 2, 'yng', 'The writer wants glass banned.', 'NO', 'Does not call for a ban.'),
      q('g3', 3, 'tfng', 'Berlin and Vancouver examples are said to use less operational energy.', 'TRUE', 'Lower operational energy.'),
      q('g4', 4, 'tfng', 'Occupants complain about glare.', 'TRUE', 'Glare and windows.'),
      q('g5', 5, 'tfng', 'Early models used double glazing as standard.', 'FALSE', 'Single glazing.'),
      q('g6', 6, 'yng', 'The writer says “modern” was treated as one material.', 'YES', 'Synonym for one material.'),
      q('g7', 7, 'yng', 'The writer romanticises brick as automatically green.', 'NO', 'Does not romanticise brick.'),
      q('g8', 8, 'short', 'Early models used ________ glazing (ONE WORD)', 'single', 'Single glazing.'),
      q('g9', 9, 'short', 'Demolition often happens because of ________ values (ONE WORD)', 'land', 'Land values.'),
      q('g10', 10, 'mcq', 'Demolition is often chosen because of', 'B', 'Land values.', ['A fashion only', 'B land values', 'C timber shortages']),
      q('g11', 11, 'mcq', 'Planning rules that ignore summer cooling', 'A', 'Still bless glass boxes in hot cities.', ['A still approve glass boxes in hot cities', 'B ban glass', 'C only apply in Vancouver']),
      q('g12', 12, 'heading', 'Paragraph C', 'ii', 'Retrofit vs demolition.', ['i Award ceremonies', 'ii Retrofit versus demolition and embodied carbon', 'iii Winter fashion', 'iv School design', 'v Lift speeds']),
      q('g13', 13, 'match', 'Which paragraph mentions shade in the first drawing?', 'E', 'Paragraph E.', ['A A', 'B B', 'C C', 'D D', 'E E']),
      q('g14', 14, 'mcq', 'Where glass is used, the writer wants shade and openable lights', 'C', 'In the first drawing.', ['A never', 'B after complaints only', 'C in the first drawing']),
    ],
  },
]

export const SPEAK_PACKS: SpeakPack[] = [
  {
    id: 'sp-place',
    theme: 'places that changed',
    topic: 'urban',
    cue: 'Describe a place in your city that has changed.\nYou should say:\n• where it is\n• what it used to be like\n• what it is like now\nand explain whether you think the change is positive.',
    questions: [
      q('sp1', 1, 'speak', 'Part 1 — Hometown: Do you enjoy walking in your neighbourhood? Why?', '', 'Extend with a constraint.', undefined, 1),
      q('sp2', 2, 'speak', 'Part 1 — Hometown: Has your area become noisier or quieter in recent years?', '', 'Compare time.', undefined, 1),
      q('sp3', 3, 'speak', 'Part 1 — Home: What do you like most about the building you live in?', '', 'Be specific.', undefined, 1),
      q('sp4', 4, 'speak', 'Part 1 — Home: Would you like to move in the future?', '', 'Give a condition.', undefined, 1),
      q('sp5', 5, 'speak', 'Part 2 — Long turn: Use the cue card. You have 1 minute to prepare and should speak for 1–2 minutes.', '', 'Story, not a list.', undefined, 2),
      q('sp6', 6, 'speak', 'Part 3 — Should cities freeze historic centres or let them evolve?', '', 'Evaluate.', undefined, 3),
      q('sp7', 7, 'speak', 'Part 3 — Who should decide how public space is used: residents, firms, or the mayor?', '', 'Weigh groups.', undefined, 3),
      q('sp8', 8, 'speak', 'Part 3 — Do new buildings in your country copy international styles too much?', '', 'Compare.', undefined, 3),
    ],
  },
  {
    id: 'sp-skill',
    theme: 'a useful skill',
    topic: 'education',
    cue: 'Describe a useful skill you learned.\nYou should say:\n• what it is\n• how you learned it\n• how often you use it\nand explain why it is useful.',
    questions: [
      q('sk1', 1, 'speak', 'Part 1 — Study: What do you do to relax after study or work?', '', 'Specific, not “sleep”.', undefined, 1),
      q('sk2', 2, 'speak', 'Part 1 — Study: Do you prefer to study in the morning or at night?', '', 'Give a reason.', undefined, 1),
      q('sk3', 3, 'speak', 'Part 1 — Work skills: Are you good at organising your time?', '', 'Example.', undefined, 1),
      q('sk4', 4, 'speak', 'Part 1 — Work skills: What skill do colleagues or classmates ask you for?', '', 'One skill.', undefined, 1),
      q('sk5', 5, 'speak', 'Part 2 — Long turn: A useful skill (use the cue). 1 minute prepare, 1–2 minutes speak.', '', 'Story + difficulty.', undefined, 2),
      q('sk6', 6, 'speak', 'Part 3 — Should schools teach more practical skills than academic subjects?', '', 'Define practical.', undefined, 3),
      q('sk7', 7, 'speak', 'Part 3 — How will automation change the skills young people need?', '', 'Speculate.', undefined, 3),
      q('sk8', 8, 'speak', 'Part 3 — Is it better to master one skill deeply or many skills thinly?', '', 'Evaluate.', undefined, 3),
    ],
  },
  {
    id: 'sp-book',
    theme: 'something you read',
    topic: 'media',
    cue: 'Describe a book or article that influenced you.\nYou should say:\n• what it was\n• when you read it\n• what it was about\nand explain why it influenced you.',
    questions: [
      q('bk1', 1, 'speak', 'Part 1 — Reading: Do you prefer paper books or screens?', '', 'Give a reason.', undefined, 1),
      q('bk2', 2, 'speak', 'Part 1 — Reading: When do you usually read?', '', 'Time of day.', undefined, 1),
      q('bk3', 3, 'speak', 'Part 1 — News: How do you usually get the news?', '', 'Name a source.', undefined, 1),
      q('bk4', 4, 'speak', 'Part 1 — News: Do you discuss the news with other people?', '', 'Who.', undefined, 1),
      q('bk5', 5, 'speak', 'Part 2 — Long turn: A text that influenced you. 1 minute prepare, 1–2 minutes speak.', '', 'Avoid a plot dump.', undefined, 2),
      q('bk6', 6, 'speak', 'Part 3 — Are people reading less, or reading differently?', '', 'Compare.', undefined, 3),
      q('bk7', 7, 'speak', 'Part 3 — Should governments fund public libraries?', '', 'Public-good argument.', undefined, 3),
      q('bk8', 8, 'speak', 'Part 3 — Can a short article change someone’s mind as much as a book?', '', 'Evaluate.', undefined, 3),
    ],
  },
  {
    id: 'sp-food',
    theme: 'a memorable meal',
    topic: 'food',
    cue: 'Describe a memorable meal.\nYou should say:\n• where you ate it\n• who was there\n• what you ate\nand explain why it was memorable.',
    questions: [
      q('fd1', 1, 'speak', 'Part 1 — Food: Do you cook, or does someone cook for you?', '', 'Tense accuracy.', undefined, 1),
      q('fd2', 2, 'speak', 'Part 1 — Food: Is there a meal you eat almost every week?', '', 'Name it.', undefined, 1),
      q('fd3', 3, 'speak', 'Part 1 — Restaurants: How often do you eat out?', '', 'Frequency.', undefined, 1),
      q('fd4', 4, 'speak', 'Part 1 — Restaurants: What makes a restaurant worth the money?', '', 'One criterion.', undefined, 1),
      q('fd5', 5, 'speak', 'Part 2 — Long turn: A memorable meal. 1 minute prepare, 1–2 minutes speak.', '', 'Senses + people.', undefined, 2),
      q('fd6', 6, 'speak', 'Part 3 — Why do traditional diets change when people move to cities?', '', 'Time, shops, status.', undefined, 3),
      q('fd7', 7, 'speak', 'Part 3 — Should advertising of junk food to children be banned?', '', 'Principle + limit.', undefined, 3),
      q('fd8', 8, 'speak', 'Part 3 — Is cooking at home always healthier than eating out?', '', 'Hedge.', undefined, 3),
    ],
  },
  {
    id: 'sp-travel',
    theme: 'a journey',
    topic: 'travel',
    cue: 'Describe a journey you remember well.\nYou should say:\n• where you went\n• how you travelled\n• who you were with\nand explain why you remember it.',
    questions: [
      q('tr1', 1, 'speak', 'Part 1 — Transport: How do you usually travel to work or school?', '', 'Mode + drawback.', undefined, 1),
      q('tr2', 2, 'speak', 'Part 1 — Transport: Do you like long train or bus trips?', '', 'Why / why not.', undefined, 1),
      q('tr3', 3, 'speak', 'Part 1 — Holidays: Do you prefer the coast or the mountains?', '', 'One reason.', undefined, 1),
      q('tr4', 4, 'speak', 'Part 1 — Holidays: Is it easy to travel around your country?', '', 'Infrastructure.', undefined, 1),
      q('tr5', 5, 'speak', 'Part 2 — Long turn: A journey you remember. 1 minute prepare, 1–2 minutes speak.', '', 'Sequence + feeling.', undefined, 2),
      q('tr6', 6, 'speak', 'Part 3 — Does cheap air travel do more harm than good?', '', 'Weigh.', undefined, 3),
      q('tr7', 7, 'speak', 'Part 3 — Should governments spend more on trains than on airports?', '', 'Public goods.', undefined, 3),
      q('tr8', 8, 'speak', 'Part 3 — Why do some people never want to leave their hometown?', '', 'Speculate.', undefined, 3),
    ],
  },
  {
    id: 'sp-help',
    theme: 'someone who helped you',
    topic: 'people',
    cue: 'Describe a time someone helped you.\nYou should say:\n• who the person was\n• what they did\n• why you needed help\nand explain how you felt afterwards.',
    questions: [
      q('hp1', 1, 'speak', 'Part 1 — Friends: How often do you meet your friends in person?', '', 'Frequency.', undefined, 1),
      q('hp2', 2, 'speak', 'Part 1 — Friends: What do you usually do together?', '', 'One activity.', undefined, 1),
      q('hp3', 3, 'speak', 'Part 1 — Help: Do you find it easy to ask for help?', '', 'Personality.', undefined, 1),
      q('hp4', 4, 'speak', 'Part 1 — Help: Have you helped a neighbour recently?', '', 'Small story.', undefined, 1),
      q('hp5', 5, 'speak', 'Part 2 — Long turn: A time someone helped you. 1 minute prepare, 1–2 minutes speak.', '', 'Feelings last.', undefined, 2),
      q('hp6', 6, 'speak', 'Part 3 — Should people rely more on family or on the state when they need help?', '', 'Evaluate.', undefined, 3),
      q('hp7', 7, 'speak', 'Part 3 — Has technology made people more or less willing to help strangers?', '', 'Compare.', undefined, 3),
      q('hp8', 8, 'speak', 'Part 3 — In your country, is volunteering common among young people?', '', 'Society.', undefined, 3),
    ],
  },
]
