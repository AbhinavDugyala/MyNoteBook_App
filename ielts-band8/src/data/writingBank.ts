import type { ChartSpec } from '../types'

export interface Task2Prompt {
  id: string
  type: 'opinion' | 'discussion' | 'problem-solution' | 'advantages' | 'two-part'
  topic: string
  question: string
  tips: string[]
}

export interface Task1Built {
  visual: string
  overviewHint: string
  instructions: string
  chart: ChartSpec
}

export interface Task1Template {
  id: string
  kind: 'line' | 'bar' | 'pie' | 'table' | 'process' | 'map' | 'mixed'
  topic: string
  title: string
  build: () => Task1Built
}

const r = (a: number, b: number) => Math.round(a + Math.random() * (b - a))
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]

function series(n: number, start: number, step: number, wobble: number) {
  const out: number[] = []
  let v = start
  for (let i = 0; i < n; i++) {
    v = Math.max(1, Math.min(98, v + r(-wobble, wobble) + step))
    out.push(Math.round(v))
  }
  return out
}

export const TASK2: Task2Prompt[] = [
  { id: 't2-01', type: 'opinion', topic: 'environment', question: 'Some people believe that climate change is too large a problem for individuals, and that only governments and large companies can make a real difference. To what extent do you agree or disagree?', tips: ['Take a precise position.', 'Name a policy instrument, not “raise awareness” only.'] },
  { id: 't2-02', type: 'discussion', topic: 'education', question: 'Some people think university students should be assessed only by written examinations. Others believe coursework is a better method. Discuss both views and give your own opinion.', tips: ['Steelman both sides.', 'Say how you would mix them if you prefer a blend.'] },
  { id: 't2-03', type: 'problem-solution', topic: 'transport', question: 'Traffic congestion is a growing problem in many cities. What are the causes of this problem, and what measures can be taken to solve it?', tips: ['Pair each cause with a matching solution.', 'Mention induced demand if you suggest new roads.'] },
  { id: 't2-04', type: 'advantages', topic: 'technology', question: 'More people are working from home using modern technology. Do the advantages of this development outweigh the disadvantages?', tips: ['You must choose which side outweighs.', 'Cover both sides before the verdict.'] },
  { id: 't2-05', type: 'two-part', topic: 'health', question: 'In many countries, people are eating more processed food and less fresh food. Why is this happening? What effects does this have on individuals and society?', tips: ['Answer both questions equally.', 'Effects can be health and economic.'] },
  { id: 't2-06', type: 'opinion', topic: 'media', question: 'Some people say that advertising directed at children should be banned. To what extent do you agree or disagree?', tips: ['Define the harm.', 'A total ban vs age limits is a useful distinction.'] },
  { id: 't2-07', type: 'discussion', topic: 'crime', question: 'Some people believe that the best way to reduce crime is to give longer prison sentences. Others think education and job training are more effective. Discuss both views and give your opinion.', tips: ['Use recidivism language carefully.', 'Your opinion cannot be a one-line PS.'] },
  { id: 't2-08', type: 'problem-solution', topic: 'environment', question: 'Plastic pollution is increasing in oceans and rivers. Why is this happening, and what can be done to reduce it?', tips: ['Causes: packaging, fishing gear, weak collection.', 'Solutions must match those causes.'] },
  { id: 't2-09', type: 'advantages', topic: 'global', question: 'International tourism has increased rapidly. Do the advantages of this trend outweigh the disadvantages for local communities?', tips: ['Do not invent a country you cannot describe.', 'Jobs vs homogenisation / prices is a clean pair.'] },
  { id: 't2-10', type: 'two-part', topic: 'work', question: 'In some countries, young people are leaving rural areas to live in cities. Why is this happening? What problems can this cause?', tips: ['Push and pull factors.', 'Problems for villages AND cities.'] },
  { id: 't2-11', type: 'opinion', topic: 'education', question: 'Some people think that children should start school as early as possible. Others believe they should not start until the age of seven. Discuss both views and give your opinion.', tips: ['This is discussion+opinion — cover both.', 'Avoid “in this contemporary era”.'] },
  { id: 't2-12', type: 'opinion', topic: 'government', question: 'Governments should spend more money on public transport than on roads for private cars. To what extent do you agree or disagree?', tips: ['Public goods vs political popularity.', 'One developed paragraph per reason.'] },
  { id: 't2-13', type: 'discussion', topic: 'culture', question: 'Some people think governments should fund the arts. Others think artists should find their own money. Discuss both views and give your opinion.', tips: ['Intrinsic vs instrumental value of art.', 'Avoid listing famous painters.'] },
  { id: 't2-14', type: 'problem-solution', topic: 'health', question: 'Obesity is becoming more common among children. What are the reasons for this, and how can the problem be solved?', tips: ['Food environment + activity + marketing.', 'School, parents, and regulation each have a role.'] },
  { id: 't2-15', type: 'advantages', topic: 'education', question: 'Many students choose to study abroad. Do the advantages of this outweigh the disadvantages?', tips: ['Cost, language, and isolation are real disadvantages.', 'Do not write a travel brochure.'] },
  { id: 't2-16', type: 'two-part', topic: 'technology', question: 'People today spend a lot of time on their smartphones. Why is this the case? Is this a positive or a negative development?', tips: ['Second question needs a clear verdict.', 'Separate work use from leisure use.'] },
  { id: 't2-17', type: 'opinion', topic: 'animals', question: 'Some people think zoos should be closed because it is cruel to keep animals in captivity. To what extent do you agree or disagree?', tips: ['Conservation vs welfare.', 'Distinguish good and bad zoos if you take a middle line.'] },
  { id: 't2-18', type: 'discussion', topic: 'work', question: 'Some people think job satisfaction is more important than a high salary. Others believe money is the key to a happy working life. Discuss both views and give your opinion.', tips: ['Sector matters (nursing vs finance).', 'Avoid “happiness is a choice”.'] },
  { id: 't2-19', type: 'problem-solution', topic: 'water', question: 'Fresh water is becoming scarce in many parts of the world. What are the causes of this shortage, and what solutions can you suggest?', tips: ['Agriculture uses most water.', 'Desalination has an energy cost.'] },
  { id: 't2-20', type: 'advantages', topic: 'energy', question: 'Nuclear power is a controversial source of electricity. Do the advantages of nuclear power outweigh the disadvantages?', tips: ['Waste and accidents vs low-carbon baseload.', 'You must outweigh, not sit on the fence.'] },
  { id: 't2-21', type: 'two-part', topic: 'family', question: 'In many countries, people are having children later in life. Why is this happening? What effects does this have on society?', tips: ['Education, housing, careers.', 'Effects: smaller families, ageing, wealth.'] },
  { id: 't2-22', type: 'opinion', topic: 'language', question: 'Some people think that a single global language would benefit the world. To what extent do you agree or disagree?', tips: ['Trade vs language death.', 'English already plays this role unevenly.'] },
  { id: 't2-23', type: 'discussion', topic: 'sports', question: 'Some people think that international sporting events such as the Olympics are a waste of money. Others believe they are beneficial. Discuss both views and give your opinion.', tips: ['Opportunity cost vs soft power / sport.', 'Use one concrete Games if you know it.'] },
  { id: 't2-24', type: 'problem-solution', topic: 'urban', question: 'Housing in large cities is becoming too expensive for ordinary people. What are the reasons for this, and what can be done to solve the problem?', tips: ['Supply, speculation, wages.', 'Zoning and social housing are instruments.'] },
  { id: 't2-25', type: 'advantages', topic: 'science', question: 'Space exploration is extremely expensive. Do the advantages of spending money on space research outweigh the disadvantages?', tips: ['Opportunity cost vs spin-off science.', 'Unmanned vs manned is a useful split.'] },
  { id: 't2-26', type: 'two-part', topic: 'media', question: 'Many people get their news from social media rather than from traditional newspapers. Why is this? Is this a positive or a negative development?', tips: ['Speed and cost vs verification.', 'Take a clear second-question stance.'] },
  { id: 't2-27', type: 'opinion', topic: 'ethics', question: 'Some people believe that animal testing for medical research is necessary. Others think it is never acceptable. To what extent do you agree or disagree?', tips: ['Medical vs cosmetic if you draw a line.', 'Avoid slogans.'] },
  { id: 't2-28', type: 'discussion', topic: 'government', question: 'Some people think that unpaid community service should be a compulsory part of high-school education. Others disagree. Discuss both views and give your opinion.', tips: ['Civic habit vs coercion.', 'Quality of placement matters.'] },
  { id: 't2-29', type: 'problem-solution', topic: 'work', question: 'In some countries, people work very long hours. Why does this happen, and what effects does it have on individuals and families?', tips: ['This is why + effects, not solutions — read the task.', 'If it asks only why and effects, do not invent a solutions paragraph as the whole essay.'] },
  { id: 't2-30', type: 'two-part', topic: 'work', question: 'In some countries, people work very long hours. Why does this happen? What effects does this have on individuals and families?', tips: ['Culture, cost of living, weak labour law.', 'Health and children.'] },
  { id: 't2-31', type: 'advantages', topic: 'urban', question: 'More people are living in high-rise apartment buildings. Do the advantages of this type of housing outweigh the disadvantages?', tips: ['Land efficiency vs community and light.', 'Context: megacity vs small town.'] },
  { id: 't2-32', type: 'opinion', topic: 'education', question: 'Teachers should be paid as much as doctors because they do a job that is equally important. To what extent do you agree or disagree?', tips: ['Importance ≠ labour-market price.', 'Shortage and training length.'] },
  { id: 't2-33', type: 'discussion', topic: 'food', question: 'Some people think everyone should become vegetarian for the sake of the environment. Others believe people should be free to eat meat. Discuss both views and give your opinion.', tips: ['Emissions vs culture and nutrition.', 'A reduction is not the same as a ban.'] },
  { id: 't2-34', type: 'problem-solution', topic: 'demographics', question: 'The populations of many countries are ageing. What problems does this cause, and what solutions can you suggest?', tips: ['Pensions, care, workforce.', 'Immigration and retirement age are policy tools.'] },
  { id: 't2-35', type: 'two-part', topic: 'culture', question: 'Traditional festivals and customs are disappearing in some countries. Why is this happening? Is this a positive or a negative development?', tips: ['Urbanisation and media.', 'Second question needs a verdict.'] },
  { id: 't2-36', type: 'opinion', topic: 'technology', question: 'Some people think that artificial intelligence will do more harm than good. To what extent do you agree or disagree?', tips: ['Specify domains: work, war, medicine.', 'Hedge where evidence is thin.'] },
  { id: 't2-37', type: 'discussion', topic: 'history', question: 'Some people think we should preserve old historic buildings. Others think we should replace them with modern ones. Discuss both views and give your opinion.', tips: ['Safety and cost vs identity.', 'Adaptive reuse is a Band-ready middle if argued.'] },
  { id: 't2-38', type: 'advantages', topic: 'global', question: 'An increasing number of people are using English as a global language. Do the advantages of this outweigh the disadvantages?', tips: ['Lingua franca vs minority-language shift.', 'Must outweigh.'] },
  { id: 't2-39', type: 'two-part', topic: 'psychology', question: 'People in many countries are becoming less happy even though they are richer. Why is this? What can be done about it?', tips: ['Comparison, time poverty, isolation.', 'Second part is solutions — match the causes.'] },
  { id: 't2-40', type: 'opinion', topic: 'crime', question: 'The death penalty is the best way to reduce serious crime. To what extent do you agree or disagree?', tips: ['Deterrence evidence is contested.', 'Stay formal and non-graphic.'] },
  { id: 't2-41', type: 'problem-solution', topic: 'education', question: 'Many university graduates cannot find a job in their field of study. Why does this happen, and what can be done to solve this problem?', tips: ['Oversupply, signalling, weak links to employers.', 'Internships and course design.'] },
  { id: 't2-42', type: 'discussion', topic: 'family', question: 'Some people think parents should control what their children watch on the internet. Others think children should be free to decide. Discuss both views and give your opinion.', tips: ['Age and capacity.', 'Skills vs surveillance.'] },
  { id: 't2-43', type: 'advantages', topic: 'transport', question: 'Some cities have made public transport free. Do the advantages of this policy outweigh the disadvantages?', tips: ['Ridership vs cost and crowding.', 'Who pays.'] },
  { id: 't2-44', type: 'two-part', topic: 'business', question: 'Large shopping centres are replacing small local shops in many towns. Why is this happening? Is this a positive or negative development?', tips: ['Price and convenience.', 'High-street social role.'] },
  { id: 't2-45', type: 'opinion', topic: 'gender', question: 'Companies should be required to have an equal number of men and women in senior positions. To what extent do you agree or disagree?', tips: ['Quota vs pipeline.', 'Stay precise, not sloganising.'] },
  { id: 't2-46', type: 'discussion', topic: 'science', question: 'Some people think scientific research should be funded only if it has a clear practical use. Others think governments should also fund theoretical research. Discuss both views and give your opinion.', tips: ['Applied vs basic science.', 'Long lag from theory to product.'] },
  { id: 't2-47', type: 'problem-solution', topic: 'media', question: 'False information spreads quickly online. What problems does this cause, and what solutions can you suggest?', tips: ['Elections, health, trust.', 'Platforms, schools, and law.'] },
  { id: 't2-48', type: 'advantages', topic: 'work', question: 'A four-day working week is being tested in some countries. Do the advantages of this outweigh the disadvantages?', tips: ['Productivity vs coverage in hospitals.', 'Must choose.'] },
  { id: 't2-49', type: 'two-part', topic: 'architecture', question: 'Modern buildings in cities often look similar. Why is this? Is this a positive or a negative development?', tips: ['Global firms, materials, cost.', 'Identity vs efficiency.'] },
  { id: 't2-50', type: 'opinion', topic: 'time', question: 'People today do not have enough free time. To what extent do you agree or disagree, and what can be done about this?', tips: ['This mixes opinion and solutions — cover both if asked.', 'If only “to what extent”, do not force a solutions essay.'] },
  { id: 't2-51', type: 'opinion', topic: 'time', question: 'People today do not have enough leisure time. To what extent do you agree or disagree?', tips: ['Compare groups (parents vs retirees).', 'Technology saves and steals time.'] },
  { id: 't2-52', type: 'discussion', topic: 'health', question: 'Some people think healthcare should be free for everyone. Others think people should pay for medical services. Discuss both views and give your opinion.', tips: ['Public goods and moral hazard.', 'One country example is enough.'] },
  { id: 't2-53', type: 'problem-solution', topic: 'energy', question: 'Many countries still rely on fossil fuels. Why is this, and how can they move to cleaner energy?', tips: ['Intermittency, jobs, existing plants.', 'Grid and storage, not slogans.'] },
  { id: 't2-54', type: 'two-part', topic: 'sports', question: 'Fewer young people play sport regularly. Why is this? What can be done to encourage them to be more active?', tips: ['Screens, cost, PE cuts.', 'Solutions must be practical.'] },
  { id: 't2-55', type: 'advantages', topic: 'technology', question: 'Online education has become more common. Do the advantages of studying online outweigh the disadvantages?', tips: ['Access vs isolation and cheating.', 'Subject matters (lab science vs theory).'] },
]

function years(start = 1995) {
  const step = pick([5, 10])
  const n = pick([4, 5])
  return Array.from({ length: n }, (_, i) => start + i * step)
}

export const TASK1: Task1Template[] = [
  {
    id: 't1-line-energy',
    kind: 'line',
    topic: 'energy',
    title: 'Electricity generation by source',
    build() {
      const ys = years(1990)
      const coal = series(ys.length, r(50, 70), -8, 4)
      const gas = series(ys.length, r(10, 22), 5, 3)
      const ren = series(ys.length, r(3, 10), 6, 3)
      const nuc = series(ys.length, r(12, 18), 0, 2)
      const visual = `Share of electricity generation (%)\nYears: ${ys.join(', ')}\nCoal: ${coal.join(', ')}\nGas: ${gas.join(', ')}\nRenewables: ${ren.join(', ')}\nNuclear: ${nuc.join(', ')}\nUnits: percent of total generation.`
      return {
        visual,
        overviewHint: 'Coal falls; gas and renewables rise; nuclear is relatively stable.',
        instructions: `The graph below shows the share of electricity generation from four sources in a country between ${ys[0]} and ${ys[ys.length - 1]}. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.`,
        chart: {
          type: 'line',
          title: 'Share of electricity generation (%)',
          unit: '%',
          labels: ys.map(String),
          series: [
            { name: 'Coal', values: coal },
            { name: 'Gas', values: gas },
            { name: 'Renewables', values: ren },
            { name: 'Nuclear', values: nuc },
          ],
        },
      }
    },
  },
  {
    id: 't1-bar-travel',
    kind: 'bar',
    topic: 'global',
    title: 'International visitors by purpose',
    build() {
      const countries = pick([
        ['France', 'Japan', 'Brazil', 'Kenya'],
        ['Canada', 'India', 'Spain', 'Egypt'],
        ['Mexico', 'Germany', 'Thailand', 'Nigeria'],
      ])
      const holiday = countries.map(() => r(35, 72))
      const business = countries.map(() => r(8, 28))
      const other = countries.map((_, i) => Math.max(4, 100 - holiday[i] - business[i]))
      const visual = `Purpose of visit (% of arrivals), one year\nCountry | Holiday | Business | Other\n${countries.map((c, i) => `${c} | ${holiday[i]} | ${business[i]} | ${other[i]}`).join('\n')}`
      return {
        visual,
        overviewHint: 'Holiday dominates in most countries; business is a minority.',
        instructions: 'The chart below compares the purpose of visit of international arrivals in four countries in a single year. Summarise the information. Write at least 150 words.',
        chart: {
          type: 'bar',
          title: 'Purpose of visit (% of arrivals)',
          unit: '%',
          labels: countries,
          series: [
            { name: 'Holiday', values: holiday },
            { name: 'Business', values: business },
            { name: 'Other', values: other },
          ],
        },
      }
    },
  },
  {
    id: 't1-pie-waste',
    kind: 'pie',
    topic: 'environment',
    title: 'Household waste composition',
    build() {
      const y1 = r(2000, 2008)
      const y2 = y1 + 15
      const a = [r(28, 40), r(18, 28), r(12, 20), r(8, 16)]
      a.push(100 - a.reduce((x, y) => x + y, 0))
      const b = [r(18, 28), r(22, 32), r(10, 18), r(14, 22)]
      b.push(100 - b.reduce((x, y) => x + y, 0))
      const labels = ['Food', 'Paper', 'Plastic', 'Glass', 'Other']
      const visual = `Household waste composition (%)\n${y1}: ${labels.map((l, i) => `${l} ${a[i]}%`).join(', ')}\n${y2}: ${labels.map((l, i) => `${l} ${b[i]}%`).join(', ')}`
      return {
        visual,
        overviewHint: 'Compare the largest slice in each year and the biggest change.',
        instructions: `The pie charts below show the composition of household waste in a city in ${y1} and ${y2}. Summarise the information. Write at least 150 words.`,
        chart: {
          type: 'pie',
          title: `Household waste ${y1}`,
          slices: labels.map((name, i) => ({ name, value: a[i] })),
          compare: { title: `Household waste ${y2}`, slices: labels.map((name, i) => ({ name, value: b[i] })) },
        },
      }
    },
  },
  {
    id: 't1-table-internet',
    kind: 'table',
    topic: 'technology',
    title: 'Internet use by age',
    build() {
      const ys = [2010, 2015, 2020, 2025]
      const groups = ['16–24', '25–44', '45–64', '65+']
      const data = groups.map((g, i) => {
        const start = [78, 62, 41, 12][i] + r(-4, 6)
        return series(4, start, 8 - i, 3).map((v) => Math.min(99, v))
      })
      const visual = `Percentage of people using the internet daily\nYears: ${ys.join(', ')}\n${groups.map((g, i) => `${g}: ${data[i].join(', ')}`).join('\n')}`
      return {
        visual,
        overviewHint: 'All groups rise; the oldest group rises fastest from a low base.',
        instructions: 'The table below shows the percentage of people in different age groups who used the internet daily. Summarise the information. Write at least 150 words.',
        chart: {
          type: 'table',
          title: 'Daily internet use (%)',
          headers: ['Age', ...ys.map(String)],
          rows: groups.map((g, i) => [g, ...data[i]]),
        },
      }
    },
  },
  {
    id: 't1-process-water',
    kind: 'process',
    topic: 'water',
    title: 'Drinking-water treatment',
    build() {
      const visual = `Process: river water → drinking water
1. Screening (leaves and debris removed)
2. Coagulation tank (chemicals added)
3. Settlement tank (solids sink)
4. Sand filter
5. Chlorine added
6. Storage reservoir → pipes to homes
Optional extra stage this version: ${pick(['UV treatment after chlorine', 'fluoride added in storage', 'ozone before the sand filter'])}`
      const extra = visual.includes('UV') ? 'UV treatment' : visual.includes('fluoride') ? 'Fluoride added' : 'Ozone treatment'
      return {
        visual,
        overviewHint: 'A linear process with six or seven stages from raw water to taps.',
        instructions: 'The diagram below shows how drinking water is produced from a river. Summarise the information. Write at least 150 words.',
        chart: {
          type: 'process',
          title: 'River water to drinking water',
          stages: ['Screening', 'Coagulation', 'Settlement', 'Sand filter', 'Chlorine', extra, 'Storage / pipes'],
        },
      }
    },
  },
  {
    id: 't1-process-brick',
    kind: 'process',
    topic: 'architecture',
    title: 'Brick manufacturing',
    build() {
      const visual = `Process: clay → bricks
1. Clay dug from the ground
2. Mixed with sand and water; extruded
3. Cut into bricks with a wire cutter
4. Dried ${r(24, 72)} hours
5. Fired in a kiln at about ${r(900, 1200)}°C
6. Cooled, packaged, delivered
Waste heat is ${pick(['recycled to the dryer', 'released through a chimney', 'used to pre-heat incoming air'])}`
      return {
        visual,
        overviewHint: 'A manufacturing cycle from extraction to delivery; mention firing and drying.',
        instructions: 'The diagram below shows how bricks are manufactured. Summarise the information. Write at least 150 words.',
        chart: {
          type: 'process',
          title: 'Brick manufacture',
          stages: ['Clay dug', 'Mixed / extruded', 'Wire-cut', `Dried ${r(24, 72)} h`, `Kiln ${r(900, 1200)}°C`, 'Cooled / packed'],
          note: visual.split('\n').pop(),
        },
      }
    },
  },
  {
    id: 't1-map-village',
    kind: 'map',
    topic: 'urban',
    title: 'Village change over time',
    build() {
      const y1 = pick([1960, 1975, 1985])
      const y2 = y1 + 40
      const shop = pick(['was converted into a supermarket', 'was demolished and replaced by a car park'])
      const farm = pick(['became a housing estate', 'became a sports field'])
      const visual = `Maps of a village in ${y1} and ${y2}
${y1}: river on the east; bridge in the centre; farmland north of the river; small shop south of the bridge; woods in the west; school next to the woods.
${y2}: farmland ${farm}; shop ${shop}; a new road runs west–east north of the river; woods reduced by half; a bus station appears south of the school.`
      return {
        visual,
        overviewHint: 'The village became more built-up; the biggest change is the loss of farmland.',
        instructions: `The maps below show a village in ${y1} and ${y2}. Summarise the information by selecting and reporting the main features. Write at least 150 words.`,
        chart: {
          type: 'map',
          title: `Village ${y1} and ${y2}`,
          leftTitle: String(y1),
          rightTitle: String(y2),
          left: [
            { id: 'w', label: 'Woods', x: 40, y: 50, kind: 'green' },
            { id: 's', label: 'School', x: 70, y: 80, kind: 'build' },
            { id: 'r', label: 'River', x: 160, y: 90, kind: 'water' },
            { id: 'b', label: 'Bridge', x: 110, y: 90, kind: 'note' },
            { id: 'f', label: 'Farmland', x: 150, y: 40, kind: 'green' },
            { id: 'sh', label: 'Shop', x: 100, y: 130, kind: 'build' },
          ],
          right: [
            { id: 'w2', label: 'Woods (half)', x: 36, y: 48, kind: 'green' },
            { id: 's2', label: 'School', x: 70, y: 80, kind: 'build' },
            { id: 'bus', label: 'Bus station', x: 70, y: 120, kind: 'build' },
            { id: 'r2', label: 'River', x: 160, y: 90, kind: 'water' },
            { id: 'rd', label: 'New road', x: 50, y: 28, kind: 'road' },
            { id: 'h', label: farm.includes('housing') ? 'Housing' : 'Sports field', x: 150, y: 40, kind: 'build' },
            { id: 'sh2', label: shop.includes('supermarket') ? 'Supermarket' : 'Car park', x: 100, y: 130, kind: 'build' },
          ],
        },
      }
    },
  },
  {
    id: 't1-map-island',
    kind: 'map',
    topic: 'global',
    title: 'Island before and after tourism',
    build() {
      const visual = `Island development
Before: undeveloped, beach on the west, trees in the centre, pier absent.
After: hotel on the west beach; ${r(10, 24)} holiday cottages in the centre where trees were; a pier and reception on the south; a footpath ring; swimming area marked off the west beach; no airport.`
      const cottages = r(10, 24)
      return {
        visual,
        overviewHint: 'The island was transformed for tourism; trees were replaced by accommodation.',
        instructions: 'The maps below show an island before and after the construction of some tourist facilities. Summarise the information. Write at least 150 words.',
        chart: {
          type: 'map',
          title: 'Island before and after tourism',
          leftTitle: 'Before',
          rightTitle: 'After',
          left: [
            { id: 'b', label: 'Beach', x: 40, y: 90, kind: 'water' },
            { id: 't', label: 'Trees', x: 110, y: 80, kind: 'green' },
          ],
          right: [
            { id: 'b2', label: 'Beach / swim', x: 40, y: 90, kind: 'water' },
            { id: 'h', label: 'Hotel', x: 48, y: 70, kind: 'build' },
            { id: 'c', label: `${cottages} cottages`, x: 110, y: 80, kind: 'build' },
            { id: 'p', label: 'Pier', x: 110, y: 140, kind: 'road' },
            { id: 're', label: 'Reception', x: 150, y: 140, kind: 'build' },
          ],
        },
      }
    },
  },
  {
    id: 't1-mixed-energy-pop',
    kind: 'mixed',
    topic: 'energy',
    title: 'Population and energy use',
    build() {
      const y1 = 2000
      const y2 = 2020
      const pop1 = r(18, 28)
      const pop2 = pop1 + r(6, 14)
      const e1 = r(40, 55)
      const e2 = e1 + r(10, 25)
      const ind = r(30, 45)
      const tr = r(20, 32)
      const hom = r(18, 28)
      const oth = Math.max(4, 100 - ind - tr - hom)
      const visual = `Two figures for the same country
Table — population (millions): ${y1} ${pop1}; ${y2} ${pop2}
Bar chart — total energy use (units): ${y1} ${e1}; ${y2} ${e2}
Breakdown in ${y2}: industry ${ind}%, transport ${tr}%, homes ${hom}%, other ${oth}%.`
      return {
        visual,
        overviewHint: 'Cover both visuals. Do not invent a causal link the figures do not state.',
        instructions: `The table and chart below give information about population and energy use in a country in ${y1} and ${y2}. Summarise the information. Write at least 150 words.`,
        chart: {
          type: 'mixed',
          title: 'Population and energy',
          charts: [
            { type: 'table', title: 'Population (millions)', headers: ['Year', 'Population'], rows: [[y1, pop1], [y2, pop2]] },
            { type: 'bar', title: 'Energy use (units)', unit: '', labels: [String(y1), String(y2)], series: [{ name: 'Total energy', values: [e1, e2] }] },
            { type: 'pie', title: `Energy use ${y2}`, slices: [
              { name: 'Industry', value: ind },
              { name: 'Transport', value: tr },
              { name: 'Homes', value: hom },
              { name: 'Other', value: oth },
            ] },
          ],
        },
      }
    },
  },
  {
    id: 't1-line-health',
    kind: 'line',
    topic: 'health',
    title: 'Life expectancy',
    build() {
      const ys = years(1970)
      const m = series(ys.length, r(62, 68), 2, 1)
      const w = series(ys.length, r(68, 74), 2, 1)
      const visual = `Life expectancy at birth (years)\nYears: ${ys.join(', ')}\nMen: ${m.join(', ')}\nWomen: ${w.join(', ')}`
      return {
        visual,
        overviewHint: 'Both rise; women remain higher throughout.',
        instructions: 'The graph below shows life expectancy for men and women in a country. Summarise the information. Write at least 150 words.',
        chart: {
          type: 'line',
          title: 'Life expectancy at birth (years)',
          unit: 'years',
          labels: ys.map(String),
          series: [
            { name: 'Men', values: m },
            { name: 'Women', values: w },
          ],
        },
      }
    },
  },
  {
    id: 't1-bar-edu',
    kind: 'bar',
    topic: 'education',
    title: 'Graduates by subject',
    build() {
      const subjects = ['Engineering', 'Business', 'Arts', 'Medicine', 'Law']
      const y1 = subjects.map(() => r(8, 28))
      const y2 = subjects.map((_, i) => Math.max(5, y1[i] + r(-8, 12)))
      const visual = `University graduates (thousands)\nSubject | ${2005} | ${2020}\n${subjects.map((s, i) => `${s} | ${y1[i]} | ${y2[i]}`).join('\n')}`
      return {
        visual,
        overviewHint: 'Pick the largest category and the biggest rise or fall. Ignore tiny differences.',
        instructions: 'The chart below compares the number of university graduates in five subjects in 2005 and 2020. Summarise the information. Write at least 150 words.',
        chart: {
          type: 'bar',
          title: 'University graduates (thousands)',
          unit: '000s',
          labels: subjects,
          series: [
            { name: '2005', values: y1 },
            { name: '2020', values: y2 },
          ],
        },
      }
    },
  },
  {
    id: 't1-table-exports',
    kind: 'table',
    topic: 'business',
    title: 'Export values',
    build() {
      const goods = ['Coffee', 'Textiles', 'Machinery', 'Oil', 'Fruit']
      const rows = goods.map((g) => [g, r(20, 90), r(20, 110), r(25, 130)] as (string | number)[])
      const visual = `Exports (million dollars)\n2012 / 2016 / 2020\n${rows.map((row) => row.join(', ')).join('\n')}`
      return {
        visual,
        overviewHint: 'Name the leading export and whether the ranking changed.',
        instructions: 'The table below shows the value of a country’s main exports in three years. Summarise the information. Write at least 150 words.',
        chart: { type: 'table', title: 'Exports (million dollars)', headers: ['Goods', '2012', '2016', '2020'], rows },
      }
    },
  },
  {
    id: 't1-process-chocolate',
    kind: 'process',
    topic: 'food',
    title: 'Chocolate production',
    build() {
      const visual = `Process: cacao pods → chocolate bars
1. Pods harvested and beans removed
2. Beans fermented ${r(3, 7)} days, then dried
3. Shipped to a factory; roasted
4. Shells removed; nibs ground into mass
5. Sugar and ${pick(['milk powder', 'vanilla', 'cocoa butter'])} added
6. Conched, tempered, moulded into bars`
      return {
        visual,
        overviewHint: 'Several agricultural then industrial stages; end with the bar.',
        instructions: 'The diagram below shows how chocolate is produced. Summarise the information. Write at least 150 words.',
        chart: {
          type: 'process',
          title: 'Cacao to chocolate',
          stages: ['Harvest pods', 'Ferment / dry', 'Roast', 'Grind nibs', 'Add sugar / extras', 'Conche / mould'],
        },
      }
    },
  },
  {
    id: 't1-pie-time',
    kind: 'pie',
    topic: 'time',
    title: 'How employed adults spend a weekday',
    build() {
      const labels = ['Work', 'Sleep', 'Leisure', 'Travel', 'Other']
      const a = [r(28, 38), r(28, 34), r(12, 18), r(6, 12)]
      a.push(100 - a.reduce((x, y) => x + y, 0))
      const visual = `Average weekday time use (%) for employed adults\n${labels.map((l, i) => `${l}: ${a[i]}%`).join('\n')}`
      return {
        visual,
        overviewHint: 'Work and sleep dominate; travel is a small slice.',
        instructions: 'The chart below shows how employed adults in a country spend an average weekday. Summarise the information. Write at least 150 words.',
        chart: {
          type: 'pie',
          title: 'Weekday time use (%)',
          slices: labels.map((name, i) => ({ name, value: a[i] })),
        },
      }
    },
  },
]
