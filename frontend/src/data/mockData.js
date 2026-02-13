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
    pipeline: { sourcing: 24, recruitment: 12, interview: 6, offer: 2, joined: 1 },
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
      "Seeking a Product Manager to own the end-to-end product lifecycle for our AI-powered analytics platform.",
    skills: ["Product Strategy", "Data Analytics", "Agile", "SQL", "Figma"],
    pipeline: { sourcing: 18, recruitment: 9, interview: 4, offer: 1, joined: 0 },
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
      "Join us as a Frontend Engineer to build beautiful, performant user interfaces for our SaaS platform.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma"],
    pipeline: { sourcing: 32, recruitment: 15, interview: 8, offer: 3, joined: 2 },
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
      "We need a DevOps Engineer to build and maintain our CI/CD pipelines, manage cloud infrastructure.",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes", "Jenkins"],
    pipeline: { sourcing: 14, recruitment: 7, interview: 3, offer: 1, joined: 0 },
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
      "Looking for a Data Scientist to build ML models for our recommendation engine.",
    skills: ["Python", "TensorFlow", "NLP", "SQL", "Spark"],
    pipeline: { sourcing: 20, recruitment: 10, interview: 5, offer: 2, joined: 1 },
  },
];

const candidatePool = {
  talentMatch: [
    { id: "tm-001", name: "Arjun Krishnamurthy", currentRole: "Staff Engineer at Flipkart", experience: "7 years", matchScore: 94, skills: ["Go", "Kubernetes", "Distributed Systems"], source: "Internal DB", sourceType: "talent_match", lastActive: "2 days ago", status: "Available", matchReason: "Strong match due to 7 years in distributed systems at Flipkart. Led Kubernetes migration for 200+ microservices. Expertise in Go and gRPC aligns directly with core tech stack." },
    { id: "tm-002", name: "Priya Sharma", currentRole: "Senior SDE at Amazon", experience: "6 years", matchScore: 91, skills: ["Java", "AWS", "Microservices"], source: "Internal DB", sourceType: "talent_match", lastActive: "1 week ago", status: "Open to opportunities", matchReason: "Extensive AWS experience building scalable microservices at Amazon. Led a team of 8 engineers on a high-throughput payment system processing 10M+ transactions daily." },
    { id: "tm-003", name: "Rahul Menon", currentRole: "Tech Lead at Razorpay", experience: "8 years", matchScore: 88, skills: ["Go", "PostgreSQL", "gRPC"], source: "Internal DB", sourceType: "talent_match", lastActive: "3 days ago", status: "Available", matchReason: "Matches on Go and gRPC proficiency. Built Razorpay's core settlement engine handling 5M+ daily settlements. Strong PostgreSQL optimization skills." },
    { id: "tm-004", name: "Deepika Nair", currentRole: "Platform Engineer at Swiggy", experience: "5 years", matchScore: 85, skills: ["Python", "Kubernetes", "AWS"], source: "Internal DB", sourceType: "talent_match", lastActive: "5 days ago", status: "Passively looking", matchReason: "Kubernetes expertise from managing Swiggy's 500+ pod infrastructure. Python and AWS skills are transferable. Slightly below on Go experience but strong systems thinking." },
    { id: "tm-005", name: "Vikram Reddy", currentRole: "SDE-3 at Google", experience: "6 years", matchScore: 82, skills: ["C++", "Distributed Systems", "ML"], source: "Internal DB", sourceType: "talent_match", lastActive: "1 day ago", status: "Available", matchReason: "Google-level distributed systems experience. Built large-scale data pipelines. Primary language is C++ but has demonstrated ability to pick up new languages quickly." },
    { id: "tm-006", name: "Ananya Gupta", currentRole: "Backend Lead at Zerodha", experience: "7 years", matchScore: 79, skills: ["Go", "Redis", "PostgreSQL"], source: "Internal DB", sourceType: "talent_match", lastActive: "4 days ago", status: "Open to opportunities", matchReason: "Go and PostgreSQL match the stack. Built Zerodha's real-time trading backend. Missing Kubernetes experience but strong on database optimization and caching." },
  ],
  syndication: [
    { id: "sy-001", name: "Karthik Iyer", currentRole: "Senior Developer at Infosys", experience: "6 years", matchScore: 87, skills: ["Java", "Spring Boot", "AWS"], source: "Naukri", sourceType: "syndication", lastActive: "Applied 3 days ago", status: "Active applicant", matchReason: "Applied directly with a strong resume. 6 years building enterprise Java applications. AWS certified. Currently transitioning from services to product companies." },
    { id: "sy-002", name: "Sneha Patel", currentRole: "SDE-2 at TCS", experience: "5 years", matchScore: 83, skills: ["Python", "Docker", "Kubernetes"], source: "Indeed", sourceType: "syndication", lastActive: "Applied 1 day ago", status: "Active applicant", matchReason: "Docker and Kubernetes skills match infrastructure needs. Built CI/CD pipelines for 20+ teams at TCS Digital. Eager to move into a product engineering role." },
    { id: "sy-003", name: "Mohammed Ali", currentRole: "Full Stack Dev at Wipro", experience: "4 years", matchScore: 80, skills: ["React", "Node.js", "MongoDB"], source: "Naukri", sourceType: "syndication", lastActive: "Applied 5 days ago", status: "Active applicant", matchReason: "Full-stack background provides broad understanding. Has worked on standalone projects for US banking clients. Lower backend systems experience but fast learner." },
    { id: "sy-004", name: "Ritu Verma", currentRole: "Software Engineer at Mindtree", experience: "5 years", matchScore: 77, skills: ["Java", "Microservices", "AWS"], source: "LinkedIn Jobs", sourceType: "syndication", lastActive: "Applied 2 days ago", status: "Active applicant", matchReason: "Microservices architecture experience with Java and AWS. Worked on healthcare platform handling sensitive data. Good fit for compliance-aware engineering." },
    { id: "sy-005", name: "Aditya Kulkarni", currentRole: "DevOps at HCL", experience: "6 years", matchScore: 75, skills: ["Terraform", "AWS", "CI/CD"], source: "Indeed", sourceType: "syndication", lastActive: "Applied 4 days ago", status: "Active applicant", matchReason: "Strong DevOps background with Terraform and AWS. Can contribute to infrastructure automation. Less experience in application development." },
  ],
  autoSourcing: [
    { id: "as-001", name: "Meera Joshi", currentRole: "Principal Engineer at Microsoft", experience: "9 years", matchScore: 96, skills: ["Go", "Azure", "Distributed Systems"], source: "LinkedIn", sourceType: "linkedin", lastActive: "Active on LinkedIn", status: "Not actively looking", matchReason: "Top match: Principal-level distributed systems engineer at Microsoft. Led Go adoption across 3 teams. Architected a global-scale event processing system handling 1B+ events/day." },
    { id: "as-002", name: "Sanjay Hegde", currentRole: "Staff SWE at Uber", experience: "8 years", matchScore: 92, skills: ["Go", "Kubernetes", "gRPC"], source: "LinkedIn", sourceType: "linkedin", lastActive: "Active on LinkedIn", status: "Open to work", matchReason: "Perfect stack match: Go, Kubernetes, and gRPC at Uber scale. Built ride-matching infrastructure serving 20M+ rides daily. Open to new opportunities per LinkedIn signal." },
    { id: "as-003", name: "Nandini Rao", currentRole: "Tech Lead at Atlassian", experience: "7 years", matchScore: 89, skills: ["Java", "AWS", "PostgreSQL"], source: "LinkedIn", sourceType: "linkedin", lastActive: "Updated profile recently", status: "Not actively looking", matchReason: "Led Jira's backend re-architecture from monolith to microservices. PostgreSQL and AWS expertise. Recently updated profile suggesting potential interest in new roles." },
    { id: "as-004", name: "Rohan Das", currentRole: "Senior SDE at Oracle", experience: "6 years", matchScore: 84, skills: ["Java", "Cloud", "Microservices"], source: "LinkedIn", sourceType: "linkedin", lastActive: "Active on LinkedIn", status: "Open to work", matchReason: "Cloud-native microservices experience at Oracle Cloud. Worked on database-as-a-service product. Open to work badge on LinkedIn. Java primary but learning Go." },
    { id: "as-005", name: "Kavitha Subramaniam", currentRole: "Architect at ThoughtWorks", experience: "10 years", matchScore: 81, skills: ["Go", "Python", "System Design"], source: "LinkedIn", sourceType: "linkedin", lastActive: "Active on LinkedIn", status: "Not actively looking", matchReason: "Senior architect with system design expertise. Go and Python proficiency. Consulted for multiple fintech companies on distributed architecture patterns." },
    { id: "as-006", name: "Amit Banerjee", currentRole: "SDE-3 at Meta", experience: "7 years", matchScore: 78, skills: ["C++", "Python", "ML Infrastructure"], source: "LinkedIn", sourceType: "linkedin", lastActive: "Active on LinkedIn", status: "Open to work", matchReason: "ML Infrastructure experience at Meta scale. C++ and Python background. Looking for roles combining systems engineering with ML. Open to work signal." },
    { id: "as-007", name: "Lakshmi Venkatesh", currentRole: "Platform Lead at Stripe", experience: "8 years", matchScore: 76, skills: ["Ruby", "Go", "AWS"], source: "LinkedIn", sourceType: "linkedin", lastActive: "Updated profile recently", status: "Not actively looking", matchReason: "Platform engineering at Stripe with Go and AWS. Built payment processing infrastructure. Ruby primary but Go experience growing. Strong fintech domain knowledge." },
  ],
};

export const getCandidatesByJobAndSource = (jobId, source) => {
  return candidatePool[source] || [];
};

export const getAllCandidates = () => {
  return [
    ...candidatePool.talentMatch,
    ...candidatePool.syndication,
    ...candidatePool.autoSourcing,
  ].sort((a, b) => b.matchScore - a.matchScore);
};

export const getConsolidatedCandidates = (jobId) => {
  return getAllCandidates();
};

export const communications = [
  { id: "com-001", candidateId: "as-001", candidateName: "Meera Joshi", channel: "linkedin", messageType: "Initial Outreach", messageSummary: "Reached out about Senior Software Engineer role at 1Recruit Technologies, Bengaluru. Highlighted Go and distributed systems alignment.", dateSent: "2026-01-20", response: "Interested, asked for more details about the team", responseDate: "2026-01-21", status: "replied" },
  { id: "com-002", candidateId: "as-002", candidateName: "Sanjay Hegde", channel: "email", messageType: "Initial Outreach", messageSummary: "Sent detailed job description for Senior Software Engineer. Emphasized Kubernetes and gRPC stack match with compensation details.", dateSent: "2026-01-20", response: "No response yet", responseDate: null, status: "pending" },
  { id: "com-003", candidateId: "tm-001", candidateName: "Arjun Krishnamurthy", channel: "whatsapp", messageType: "Initial Outreach", messageSummary: "Quick WhatsApp message about the Senior SWE opening. Mentioned Flipkart-to-startup transition opportunity.", dateSent: "2026-01-19", response: "Will review and get back by Friday", responseDate: "2026-01-19", status: "replied" },
  { id: "com-004", candidateId: "tm-002", candidateName: "Priya Sharma", channel: "email", messageType: "Follow-up", messageSummary: "Follow-up email after initial outreach. Shared team structure and tech blog links. Reiterated compensation range.", dateSent: "2026-01-22", response: "Scheduled a call for next week", responseDate: "2026-01-23", status: "replied" },
  { id: "com-005", candidateId: "sy-001", candidateName: "Karthik Iyer", channel: "email", messageType: "Application Response", messageSummary: "Acknowledged application on Naukri. Shared next steps in the hiring process and expected timeline.", dateSent: "2026-01-21", response: "No response yet", responseDate: null, status: "pending" },
  { id: "com-006", candidateId: "as-003", candidateName: "Nandini Rao", channel: "linkedin", messageType: "Initial Outreach", messageSummary: "LinkedIn InMail about Senior SWE role. Highlighted microservices migration experience as key match.", dateSent: "2026-01-22", response: "Declined - happy at current role", responseDate: "2026-01-24", status: "declined" },
  { id: "com-007", candidateId: "tm-003", candidateName: "Rahul Menon", channel: "whatsapp", messageType: "Initial Outreach", messageSummary: "Reached out via WhatsApp about SWE role. Emphasized Go and gRPC stack alignment with Razorpay experience.", dateSent: "2026-01-23", response: "No response yet", responseDate: null, status: "pending" },
];

export const defaultRules = [
  { id: "rule-1", trigger: "No response in 24 hours", action: "Send a friendly reminder via the same channel", active: true },
  { id: "rule-2", trigger: "Positive response received", action: "Move candidate to Screening stage and notify hiring manager", active: true },
  { id: "rule-3", trigger: "Candidate declines", action: "Mark as declined and archive from active pipeline", active: true },
  { id: "rule-4", trigger: "No response after 2 follow-ups", action: "Deprioritize and add to nurture list for future roles", active: false },
];

export const initialChatMessages = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Hi! I'm your sourcing co-pilot. I've analyzed the job requirements and started matching candidates. Here's what I found so far:",
    timestamp: "10:00 AM",
  },
  {
    id: "msg-2",
    role: "assistant",
    content: "I found 6 strong matches in your internal database, 5 from job boards, and 7 passive candidates on LinkedIn. The top candidate has a 96% match score. Would you like to refine the search criteria?",
    timestamp: "10:00 AM",
  },
];
