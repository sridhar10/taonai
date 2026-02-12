const AVATAR_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
  "bg-lime-100 text-lime-700",
];

export const getAvatarColor = (name) => {
  const idx = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const jobs = [
  {
    id: "job-001",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Bengaluru",
    type: "Full-time",
    experience: "5-8 years",
    salary: "30-45 LPA",
    posted: "2025-12-15",
    status: "Active",
    openings: 3,
    applicants: 47,
    description:
      "We are looking for a Senior Software Engineer to join our core platform team. You will work on building scalable distributed systems, microservices architecture, and lead technical design for complex features.",
    skills: ["Go", "Kubernetes", "PostgreSQL", "gRPC", "AWS"],
    pipeline: {
      sourcing: 24,
      recruitment: 12,
      interview: 6,
      offer: 2,
      joined: 1,
    },
  },
  {
    id: "job-002",
    title: "Product Manager",
    department: "Product",
    location: "Hyderabad",
    type: "Full-time",
    experience: "4-7 years",
    salary: "25-40 LPA",
    posted: "2025-12-20",
    status: "Active",
    openings: 2,
    applicants: 38,
    description:
      "Seeking a Product Manager to own the end-to-end product lifecycle for our AI-powered analytics platform. You will work closely with engineering, design, and data science teams.",
    skills: ["Product Strategy", "Data Analytics", "Agile", "SQL", "Figma"],
    pipeline: {
      sourcing: 18,
      recruitment: 9,
      interview: 4,
      offer: 1,
      joined: 0,
    },
  },
  {
    id: "job-003",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Bengaluru",
    type: "Full-time",
    experience: "3-5 years",
    salary: "20-32 LPA",
    posted: "2026-01-02",
    status: "Active",
    openings: 4,
    applicants: 62,
    description:
      "Join us as a Frontend Engineer to build beautiful, performant user interfaces for our SaaS platform. You'll work with React, TypeScript, and modern design systems.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma"],
    pipeline: {
      sourcing: 32,
      recruitment: 15,
      interview: 8,
      offer: 3,
      joined: 2,
    },
  },
  {
    id: "job-004",
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Hyderabad",
    type: "Full-time",
    experience: "4-6 years",
    salary: "22-35 LPA",
    posted: "2026-01-05",
    status: "Active",
    openings: 2,
    applicants: 29,
    description:
      "We need a DevOps Engineer to build and maintain our CI/CD pipelines, manage cloud infrastructure, and ensure 99.99% uptime for our production systems.",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes", "Jenkins"],
    pipeline: {
      sourcing: 14,
      recruitment: 7,
      interview: 3,
      offer: 1,
      joined: 0,
    },
  },
  {
    id: "job-005",
    title: "Data Scientist",
    department: "Data Science",
    location: "Bengaluru",
    type: "Full-time",
    experience: "3-6 years",
    salary: "25-38 LPA",
    posted: "2026-01-10",
    status: "Active",
    openings: 2,
    applicants: 41,
    description:
      "Looking for a Data Scientist to build ML models for our recommendation engine. You'll work on NLP, deep learning, and real-time prediction systems at scale.",
    skills: ["Python", "TensorFlow", "NLP", "SQL", "Spark"],
    pipeline: {
      sourcing: 20,
      recruitment: 10,
      interview: 5,
      offer: 2,
      joined: 1,
    },
  },
];

const candidatePool = {
  talentMatch: [
    {
      id: "tm-001",
      name: "Arjun Krishnamurthy",
      currentRole: "Staff Engineer at Flipkart",
      experience: "7 years",
      matchScore: 94,
      skills: ["Go", "Kubernetes", "Distributed Systems"],
      source: "Internal DB",
      lastActive: "2 days ago",
      status: "Available",
    },
    {
      id: "tm-002",
      name: "Priya Sharma",
      currentRole: "Senior SDE at Amazon",
      experience: "6 years",
      matchScore: 91,
      skills: ["Java", "AWS", "Microservices"],
      source: "Internal DB",
      lastActive: "1 week ago",
      status: "Open to opportunities",
    },
    {
      id: "tm-003",
      name: "Rahul Menon",
      currentRole: "Tech Lead at Razorpay",
      experience: "8 years",
      matchScore: 88,
      skills: ["Go", "PostgreSQL", "gRPC"],
      source: "Internal DB",
      lastActive: "3 days ago",
      status: "Available",
    },
    {
      id: "tm-004",
      name: "Deepika Nair",
      currentRole: "Platform Engineer at Swiggy",
      experience: "5 years",
      matchScore: 85,
      skills: ["Python", "Kubernetes", "AWS"],
      source: "Internal DB",
      lastActive: "5 days ago",
      status: "Passively looking",
    },
    {
      id: "tm-005",
      name: "Vikram Reddy",
      currentRole: "SDE-3 at Google",
      experience: "6 years",
      matchScore: 82,
      skills: ["C++", "Distributed Systems", "ML"],
      source: "Internal DB",
      lastActive: "1 day ago",
      status: "Available",
    },
    {
      id: "tm-006",
      name: "Ananya Gupta",
      currentRole: "Backend Lead at Zerodha",
      experience: "7 years",
      matchScore: 79,
      skills: ["Go", "Redis", "PostgreSQL"],
      source: "Internal DB",
      lastActive: "4 days ago",
      status: "Open to opportunities",
    },
  ],
  syndication: [
    {
      id: "sy-001",
      name: "Karthik Iyer",
      currentRole: "Senior Developer at Infosys",
      experience: "6 years",
      matchScore: 87,
      skills: ["Java", "Spring Boot", "AWS"],
      source: "Naukri",
      lastActive: "Applied 3 days ago",
      status: "Active applicant",
    },
    {
      id: "sy-002",
      name: "Sneha Patel",
      currentRole: "SDE-2 at TCS",
      experience: "5 years",
      matchScore: 83,
      skills: ["Python", "Docker", "Kubernetes"],
      source: "Indeed",
      lastActive: "Applied 1 day ago",
      status: "Active applicant",
    },
    {
      id: "sy-003",
      name: "Mohammed Ali",
      currentRole: "Full Stack Dev at Wipro",
      experience: "4 years",
      matchScore: 80,
      skills: ["React", "Node.js", "MongoDB"],
      source: "Naukri",
      lastActive: "Applied 5 days ago",
      status: "Active applicant",
    },
    {
      id: "sy-004",
      name: "Ritu Verma",
      currentRole: "Software Engineer at Mindtree",
      experience: "5 years",
      matchScore: 77,
      skills: ["Java", "Microservices", "AWS"],
      source: "LinkedIn Jobs",
      lastActive: "Applied 2 days ago",
      status: "Active applicant",
    },
    {
      id: "sy-005",
      name: "Aditya Kulkarni",
      currentRole: "DevOps at HCL",
      experience: "6 years",
      matchScore: 75,
      skills: ["Terraform", "AWS", "CI/CD"],
      source: "Indeed",
      lastActive: "Applied 4 days ago",
      status: "Active applicant",
    },
  ],
  autoSourcing: [
    {
      id: "as-001",
      name: "Meera Joshi",
      currentRole: "Principal Engineer at Microsoft",
      experience: "9 years",
      matchScore: 96,
      skills: ["Go", "Azure", "Distributed Systems"],
      source: "LinkedIn",
      lastActive: "Active on LinkedIn",
      status: "Not actively looking",
    },
    {
      id: "as-002",
      name: "Sanjay Hegde",
      currentRole: "Staff SWE at Uber",
      experience: "8 years",
      matchScore: 92,
      skills: ["Go", "Kubernetes", "gRPC"],
      source: "LinkedIn",
      lastActive: "Active on LinkedIn",
      status: "Open to work",
    },
    {
      id: "as-003",
      name: "Nandini Rao",
      currentRole: "Tech Lead at Atlassian",
      experience: "7 years",
      matchScore: 89,
      skills: ["Java", "AWS", "PostgreSQL"],
      source: "LinkedIn",
      lastActive: "Updated profile recently",
      status: "Not actively looking",
    },
    {
      id: "as-004",
      name: "Rohan Das",
      currentRole: "Senior SDE at Oracle",
      experience: "6 years",
      matchScore: 84,
      skills: ["Java", "Cloud", "Microservices"],
      source: "LinkedIn",
      lastActive: "Active on LinkedIn",
      status: "Open to work",
    },
    {
      id: "as-005",
      name: "Kavitha Subramaniam",
      currentRole: "Architect at ThoughtWorks",
      experience: "10 years",
      matchScore: 81,
      skills: ["Go", "Python", "System Design"],
      source: "LinkedIn",
      lastActive: "Active on LinkedIn",
      status: "Not actively looking",
    },
    {
      id: "as-006",
      name: "Amit Banerjee",
      currentRole: "SDE-3 at Meta",
      experience: "7 years",
      matchScore: 78,
      skills: ["C++", "Python", "ML Infrastructure"],
      source: "LinkedIn",
      lastActive: "Active on LinkedIn",
      status: "Open to work",
    },
    {
      id: "as-007",
      name: "Lakshmi Venkatesh",
      currentRole: "Platform Lead at Stripe",
      experience: "8 years",
      matchScore: 76,
      skills: ["Ruby", "Go", "AWS"],
      source: "LinkedIn",
      lastActive: "Updated profile recently",
      status: "Not actively looking",
    },
  ],
};

export const getCandidatesByJobAndSource = (jobId, source) => {
  return candidatePool[source] || [];
};

export const getConsolidatedCandidates = (jobId) => {
  const all = [
    ...candidatePool.talentMatch,
    ...candidatePool.syndication,
    ...candidatePool.autoSourcing,
  ];
  return all.sort((a, b) => b.matchScore - a.matchScore);
};

export const chatSuggestions = [
  "What specific skills should I exclude from candidates?",
  "Which companies are you targeting for sourcing?",
  "What's the ideal notice period you're looking for?",
  "Should I prioritize candidates from product companies?",
  "Any preferred programming languages beyond the listed ones?",
];

export const initialChatMessages = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "Hi! I'm your sourcing co-pilot. I've analyzed the job requirements and started matching candidates. Here's what I found so far:",
    timestamp: "10:00 AM",
  },
  {
    id: "msg-2",
    role: "assistant",
    content:
      "I found 6 strong matches in your internal database, 5 from job boards, and 7 passive candidates on LinkedIn. The top candidate has a 96% match score. Would you like to refine the search criteria?",
    timestamp: "10:00 AM",
  },
];
