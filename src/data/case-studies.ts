export interface MetadataItem {
  text: string;
  linked: boolean;
}

export interface MetadataRow {
  label: string;
  items: MetadataItem[];
}

export interface CaseStudy {
  title: string;
  metadata: MetadataRow[];
  story: string[];
}

export const caseStudies: Record<string, CaseStudy> = {
  clarawave: {
    title: 'ClaraWave',
    metadata: [
      {
        label: 'Here are the project platforms',
        items: [
          { text: 'Android,', linked: true },
          { text: 'iOS', linked: true },
          { text: 'and', linked: false },
          { text: 'web application', linked: true },
        ],
      },
      {
        label: 'My skills during the project include',
        items: [
          { text: 'Product design', linked: true },
          { text: 'Interactive prototyping', linked: true },
        ],
      },
      {
        label: 'My role',
        items: [{ text: 'Design lead', linked: true }],
      },
      {
        label: 'Team',
        items: [
          { text: 'Elizabeth', linked: true },
          { text: 'Lanre', linked: true },
        ],
      },
      {
        label: 'Timeline',
        items: [{ text: 'Q2 2025 - Q4 2025', linked: true }],
      },
    ],
    story: [
      'Running a caregiving agency is harder than it looks. Before ClaraWave, most agencies were managing caregivers, patients, and schedules through spreadsheets and manual processes. Payments were inconsistent, matching caregivers to patients took time and guesswork, and nothing was connected in one place.',
      'ClaraWave changes that. It is a multi-sided platform built for the US home care and disability support market, connecting three groups through one connected system; agencies, caregivers, and patients.',
      'Agencies use a web app to onboard caregivers, register patients, and manage day-to-day operations. Two separate mobile apps serve caregivers and patients, each designed around their specific needs and workflows. An AI layer sits at the centre of the platform, helping agencies match the right caregiver to each patient based on preferences, availability, and compatibility. The platform also handles caregiver payments and payouts, calendar management, and real-time coordination across all three user groups.',
      'The goal was to replace the chaos of manual management with a system that feels simple for everyone using it, whether that is an agency administrator at a desk or a caregiver on the go.',
      'As the sole designer on the project, I was responsible for all three applications, the agency web app and both mobile apps. Over eight to nine months, I worked closely with the development team to design a product that handles real complexity without making users feel it.',
    ],
  },
  phpsandbox: {
    title: 'PHPSandbox',
    metadata: [
      {
        label: 'Here are the project platforms',
        items: [
          { text: 'Web application', linked: true },
        ],
      },
      {
        label: 'My skills during the project include',
        items: [
          { text: 'Product design', linked: true },
          { text: 'Interactive prototyping', linked: true },
        ],
      },
      {
        label: 'My role',
        items: [{ text: 'Founding product designer', linked: true }],
      },
      {
        label: 'Team',
        items: [
          { text: 'Bosun', linked: true },
          { text: 'Mercy', linked: true },
        ],
      },
      {
        label: 'Timeline',
        items: [{ text: 'Q2 2025 - Q4 2025', linked: true }],
      },
    ],
    story: [
      'Writing and testing PHP code usually means setting up a local development environment, installing software, managing dependencies, and dealing with configuration issues before writing a single line of code.',
      'PHPSandbox removes all of that. It is a web-based code editor and development environment where PHP developers can write, run, and share code directly in the browser, in real time.',
      'The platform supports syntax highlighting, popular PHP libraries and frameworks, and is built for developers who want to move fast without the overhead of a local setup.',
      'When I joined as lead designer, the product already worked well technically but had real problems with consistency and clarity. Design elements were mismatched across the product, typography was inconsistent, and the user experience had gaps that were slowing developers down. Most importantly, the platform was not communicating its value clearly, which meant developers were arriving and leaving without fully understanding what PHPSandbox could do for them.',
      'Over more than two years, I led a full redesign of the product with a user-centred approach. The work covered the complete interface, the onboarding flow, the landing page, and a scalable component library to bring consistency across the product. That component library later grew into a public design system, giving other designers and developers a foundation to build on.',
      'The impact was significant. After redesigning the onboarding flow and improving the storytelling on the landing page, user retention increased by around 40% and conversion rate improved by approximately 50%. Today, PHPSandbox serves more than 60,000 users.',
    ],
  },
  sendpackafrica: {
    title: 'SendpackAfrica',
    metadata: [
      {
        label: 'Here are the project platforms',
        items: [
          { text: 'Web application', linked: true },
          { text: 'Mobile application', linked: true },
        ],
      },
      {
        label: 'My skills during the project include',
        items: [
          { text: 'Product design', linked: true },
          { text: 'Interactive prototyping', linked: true },
        ],
      },
      {
        label: 'My role',
        items: [{ text: 'Product designer', linked: true }],
      },
      {
        label: 'Team',
        items: [
          { text: 'Joshua', linked: true },
          { text: 'Mercy', linked: true },
        ],
      },
      {
        label: 'Timeline',
        items: [{ text: 'Q2 2025 - Q4 2025', linked: true }],
      },
    ],
    story: [],
  },
  collectafrica: {
    title: 'CollectAfrica',
    metadata: [
      {
        label: 'Here are the project platforms',
        items: [
          { text: 'Web application', linked: true },
        ],
      },
      {
        label: 'My skills during the project include',
        items: [
          { text: 'Product design', linked: true },
          { text: 'Interactive prototyping', linked: true },
        ],
      },
      {
        label: 'My role',
        items: [{ text: 'Product designer', linked: true }],
      },
      {
        label: 'Team',
        items: [
          { text: 'Joshua', linked: true },
          { text: 'Mercy', linked: true },
        ],
      },
      {
        label: 'Timeline',
        items: [{ text: 'Q2 2025 - Q4 2025', linked: true }],
      },
    ],
    story: [
      'Nigeria has one of the fastest growing small business ecosystems in Africa. But behind that growth, most businesses were dealing with the same operational headaches; payments scattered across tools, contacts managed in spreadsheets, compliance obligations tracked manually, and no clean way to control who on the team had access to what.',
      'CollectAfrica was built to solve that. It was a fintech platform designed for Nigerian businesses of all sizes, bringing payments, operations, and team management into one place. Businesses could create payment links, manage contacts, send and receive transfers locally and internationally, manage their stores, set up workflows, and control user roles and permissions, all from a single dashboard. Compliance and tax management were also built in, removing one of the biggest sources of stress for business owners.',
      'As the sole designer on the project, I worked across every feature of the platform over more than two years. The work spanned user research, wireframing, and prototyping. Some of the most impactful work came from redesigning the onboarding experience and rethinking how user roles and permissions were structured, making it easier for businesses to get started and manage their teams with confidence.',
      'In 2025, Collect Africa pivoted and evolved into Autospend, reflecting a shift in the product\'s core direction toward stablecoin spending. The foundation built through Collect Africa carried forward, Autospend has since processed over one million dollars in transactions.',
    ],
  },
  autospend: {
    title: 'Autospend',
    metadata: [
      {
        label: 'Here are the project platforms',
        items: [
          { text: 'Web application', linked: true },
        ],
      },
      {
        label: 'My skills during the project include',
        items: [
          { text: 'Product design', linked: true },
          { text: 'Interactive prototyping', linked: true },
        ],
      },
      {
        label: 'My role',
        items: [{ text: 'Product designer', linked: true }],
      },
      {
        label: 'Team',
        items: [
          { text: 'Joshua', linked: true },
          { text: 'Mercy', linked: true },
        ],
      },
      {
        label: 'Timeline',
        items: [{ text: 'Q2 2025 - Q4 2025', linked: true }],
      },
    ],
    story: [
      'Nigeria has one of the fastest growing small business ecosystems in Africa. But behind that growth, most businesses were dealing with the same operational headaches; payments scattered across tools, contacts managed in spreadsheets, compliance obligations tracked manually, and no clean way to control who on the team had access to what.',
      'CollectAfrica was built to solve that. It was a fintech platform designed for Nigerian businesses of all sizes, bringing payments, operations, and team management into one place. Businesses could create payment links, manage contacts, send and receive transfers locally and internationally, manage their stores, set up workflows, and control user roles and permissions, all from a single dashboard. Compliance and tax management were also built in, removing one of the biggest sources of stress for business owners.',
      'As the sole designer on the project, I worked across every feature of the platform over more than two years. The work spanned user research, wireframing, and prototyping. Some of the most impactful work came from redesigning the onboarding experience and rethinking how user roles and permissions were structured, making it easier for businesses to get started and manage their teams with confidence.',
      'In 2025, Collect Africa pivoted and evolved into Autospend, reflecting a shift in the product\'s core direction toward stablecoin spending. The foundation built through Collect Africa carried forward, Autospend has since processed over one million dollars in transactions.',
    ],
  },
};
