export interface Project {
  type: string
  description: string
  sourceUrl: string
  estimatedValue?: number
  startDate?: string
  endDate?: string
}

export interface CompetitorData {
  name: string
  hasRelationship: boolean
  projects: Project[]
}

// List of all project types for filtering
export const projectTypes = [
  "Digital Transformation",
  "Cloud Migration",
  "IT Services",
  "Customer Experience",
  "Data Analytics",
  "Network Optimization",
  "AI Implementation",
  "Application Development",
  "Business Consulting",
  "Cybersecurity",
  "Infrastructure Management",
]

export const competitorData: CompetitorData[] = [
  {
    name: "Accenture",
    hasRelationship: true,
    projects: [
      {
        type: "Digital Transformation",
        description:
          "Accenture partnered with Virgin Media to implement a digital transformation program focused on improving customer experience across digital channels.",
        sourceUrl: "https://www.accenture.com/case-studies/communications-media/virgin-media-digital-transformation",
        estimatedValue: 4500000,
        startDate: "2022-03-15",
        endDate: "2023-09-30",
      },
      {
        type: "Cloud Migration",
        description:
          "Helped Virgin Media migrate their legacy systems to cloud infrastructure, improving scalability and reducing operational costs.",
        sourceUrl: "https://www.accenture.com/case-studies/communications-media/virgin-media-cloud",
        estimatedValue: 3200000,
        startDate: "2021-08-10",
        endDate: "2022-11-20",
      },
    ],
  },
  {
    name: "TCS",
    hasRelationship: true,
    projects: [
      {
        type: "IT Services",
        description:
          "TCS provides managed IT services for Virgin Media, handling infrastructure management and application support.",
        sourceUrl: "https://www.tcs.com/success-stories/virgin-media-it-services",
        estimatedValue: 2800000,
        startDate: "2020-05-01",
        endDate: "2025-04-30",
      },
      {
        type: "Infrastructure Management",
        description:
          "Ongoing infrastructure management services including network monitoring, server management, and help desk support.",
        sourceUrl: "https://www.tcs.com/success-stories/virgin-media-infrastructure",
        estimatedValue: 1500000,
        startDate: "2020-06-15",
        endDate: "2025-06-14",
      },
    ],
  },
  {
    name: "Wipro",
    hasRelationship: false,
    projects: [],
  },
  {
    name: "Cognizant",
    hasRelationship: true,
    projects: [
      {
        type: "Customer Experience",
        description:
          "Cognizant implemented a new customer service platform for Virgin Media to improve response times and customer satisfaction.",
        sourceUrl: "https://www.cognizant.com/us/en/case-studies/telecommunications/virgin-media-customer-experience",
        estimatedValue: 2100000,
        startDate: "2022-01-10",
        endDate: "2023-03-15",
      },
      {
        type: "Cybersecurity",
        description:
          "Implementation of advanced security solutions to protect customer data and network infrastructure.",
        sourceUrl: "https://www.cognizant.com/us/en/case-studies/telecommunications/virgin-media-security",
        estimatedValue: 1800000,
        startDate: "2023-04-01",
        endDate: "2024-03-31",
      },
    ],
  },
  {
    name: "Capgemini",
    hasRelationship: true,
    projects: [
      {
        type: "Data Analytics",
        description:
          "Capgemini developed a data analytics platform for Virgin Media to gain insights into customer behavior and network performance.",
        sourceUrl: "https://www.capgemini.com/client-story/virgin-media-data-analytics",
        estimatedValue: 3500000,
        startDate: "2021-11-01",
        endDate: "2023-02-28",
      },
      {
        type: "Network Optimization",
        description: "Implemented network optimization solutions to improve service quality and reduce downtime.",
        sourceUrl: "https://www.capgemini.com/client-story/virgin-media-network-optimization",
        estimatedValue: 2700000,
        startDate: "2022-06-15",
        endDate: "2023-12-31",
      },
    ],
  },
  {
    name: "IBM",
    hasRelationship: true,
    projects: [
      {
        type: "AI Implementation",
        description:
          "IBM worked with Virgin Media to implement AI-powered chatbots and virtual assistants for customer service.",
        sourceUrl: "https://www.ibm.com/case-studies/virgin-media-ai",
        estimatedValue: 2900000,
        startDate: "2023-01-15",
        endDate: "2024-06-30",
      },
      {
        type: "Cloud Migration",
        description: "Migration of critical business applications to IBM Cloud to improve performance and reliability.",
        sourceUrl: "https://www.ibm.com/case-studies/virgin-media-cloud-migration",
        estimatedValue: 3100000,
        startDate: "2022-03-01",
        endDate: "2023-08-31",
      },
    ],
  },
  {
    name: "HCLTech",
    hasRelationship: true,
    projects: [
      {
        type: "Application Development",
        description:
          "HCLTech developed custom applications for Virgin Media's internal operations and customer-facing services.",
        sourceUrl: "https://www.hcltech.com/success-stories/virgin-media-application-development",
        estimatedValue: 1900000,
        startDate: "2021-09-01",
        endDate: "2022-12-15",
      },
    ],
  },
  {
    name: "Tech Mahindra",
    hasRelationship: false,
    projects: [],
  },
  {
    name: "Deloitte",
    hasRelationship: true,
    projects: [
      {
        type: "Business Consulting",
        description:
          "Deloitte provided business consulting services to Virgin Media during their merger with O2, focusing on organizational structure and process optimization.",
        sourceUrl: "https://www2.deloitte.com/case-studies/virgin-media-o2-merger",
        estimatedValue: 4200000,
        startDate: "2022-08-15",
        endDate: "2023-05-30",
      },
    ],
  },
  {
    name: "L&T Infotech",
    hasRelationship: false,
    projects: [],
  },
]
