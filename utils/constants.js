const narratives = [
  {
    id: 1,
    name: '“Freezing Europe”',
    subtitle: "myths and propaganda about sanctions against Russia in connection with the invasion of Ukraine",
    slug: 'freezing-europe',
    disabled: false,
  },
  {
    id: 2,
    name: '“Protecting” the russian world',
    slug: 'protecting-russian-world',
    subtitle: "a populist idea of paternal concern for the nation",
    disabled: true
  },
  {
    id: 3,
    name: 'Mythical “Nazis”',
    subtitle: "constructing an enemy through the exploitation of historical memory",
    slug: 'mythical-nazis',
    disabled: false
  },
  {
    id: 4,
    name: '“Cold War II”',
    subtitle: "cultivating the fear of Western threat ",
    slug: 'cold-war-ii',
    disabled: false,
  },
  {
    id:5,
    name: "“No plans of any aggressive actions”",
    subtitle: "initial contradictions in the goal setting of the invasion",
    slug: "no-plans-of-any-aggressive-actions",
    keywords: ["цель","задача","миссия"],
    disabled: true
  },
  {
    id:6,
    name: "“Ukrainian crisis”",
    subtitle: "denial of the state's right to sovereignty",
    slug: "ukrainian-crisis",
    keywords: ["кризис","референдум","вхождение","признание","призна","присоедин","негосударство","днр","лнр","херсон","режим","агония","агонизир","конец"],
    disabled: true
  },
  {
    id:7,
    name: "“High-precision missiles vs. fakes”",
    subtitle: "isolating and contrasting the qualities of belligerents",
    slug: "high-precision-missiles-vs-fakes",
    keywords: ["^уничтож","всу","обстрел","расстрел","провокац","фейк","буча","бастрык","кременч","высокоточ","нацбат","роддом","гиперзв","ракет","расправ","^пленн","наёмник","военноплен"],
    disabled: true
  },
  {
    id:8,
    name: "“Internal contradictions of the West”",
    subtitle: "lack unanimity as proof of weakness.",
    slug: "internal-contradictions-of-the-west",
    keywords: ["вступле","членст","слабост","смочь"],
    disabled: true
  },
  {
    id:9,
    name: "“Traditional Values vs. Decadence”",
    slug: "traditional-values-vs-decadence",
    subtitle: "constructing an ideological confrontation between the West and Russia",
    disabled: true
  },
  {
    id:10,
    name: "“Self-cleansing from public enemies”",
    subtitle: "justifying the destruction of civil society by constant internal threats",
    slug: "self-cleansing-from-public-enemies",
    disabled: true
  },
]

const colorPalette = ['#FFBE41', '#A67BEA', '#66CE79', '#FF70B6']

const colors = {
  chartColor: '#666565'
}

export { narratives, colorPalette, colors }
