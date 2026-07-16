import {
  PenTool,
  Box,
  Cpu,
  Snowflake,
  Settings,
  Code2,
} from "lucide-react";

export const courses = [
  {
     slug: "autocad-mastery",
  title: "AutoCAD Mastery",
  description: "2D & 3D drafting from beginner to advanced.",
  category: "CAD",
  level: "Beginner",
  duration: "6 Weeks",
  rating: "4.9",
  price: "₹999",
  icon: PenTool,

  instructor: "K.K.Ranjan & Team",
  lessons: 42,
  students: 1,
  language: "English, Hindi & Hinglish",
  certificate: true,

  whatYouWillLearn: [
    "Create professional 2D drawings",
    "Develop 3D models",
    "Use layers effectively",
    "Apply dimensions and annotations",
    "Prepare layouts for printing",
    "Work on real engineering projects",
  ],

  requirements: [
    "Basic computer knowledge",
    "No prior AutoCAD experience required",
  ],

  liveProjects: [
  "Residential Floor Plan",
  "Machine Component Drawing",
  "Industrial Layout Design",
],

  },
  {
    slug: "solidworks-complete",
    title: "SolidWorks Complete",
    description: "Part, Assembly, Drawing & Simulation.",
    category: "CAD",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "4.8",
    price: "₹1499",
    icon: Box,

    instructor: "K.K.Ranjan & Team",
  lessons: 42,
  students: 1,
  language: "English, Hindi & Hinglish",
  certificate: true,

  whatYouWillLearn: [
  "Create parametric 3D part models",
  "Build complex assemblies",
  "Generate engineering drawings",
  "Apply sheet metal and weldment tools",
  "Perform basic motion studies",
  "Complete industry-based CAD projects",
],

requirements: [
  "Basic engineering drawing knowledge",
  "No prior SolidWorks experience required",
],

liveProjects: [
  "Gearbox Assembly",
  "Robotic Arm Design",
  "Sheet Metal Enclosure",
],
  },
  {
    slug: "ansys-simulation",
    title: "ANSYS Simulation",
    description: "Structural, Thermal & CFD Analysis.",
    category: "Mechanical",
    level: "Advanced",
    duration: "10 Weeks",
    rating: "4.9",
    price: "₹1999",
    icon: Cpu,

    instructor: "K.K.Ranjan & Team",
  lessons: 42,
  students: 1,
  language: "English, Hindi & Hinglish",
  certificate: true,

  whatYouWillLearn: [
  "Perform structural finite element analysis (FEA)",
  "Set up CFD simulations",
  "Generate high-quality meshes",
  "Apply loads and boundary conditions",
  "Interpret stress, strain and deformation results",
  "Solve real industrial simulation projects",
],

requirements: [
  "Basic Mechanics of Materials",
  "Basic engineering mathematics",
],

liveProjects: [
  "Pressure Vessel Analysis",
  "Heat Exchanger CFD",
  "Beam Structural Analysis",
],
  },
  {
    slug: "industrial-refrigeration",
    title: "Industrial Refrigeration",
    description: "Refrigeration, Cryogenics & HVAC.",
    category: "Cryogenics",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "4.8",
    price: "₹1799",
    icon: Snowflake,

    instructor: "K.K.Ranjan & Team",
  lessons: 42,
  students: 1,
  language: "English, Hindi & Hinglish",
  certificate: true,

  whatYouWillLearn: [
  "Understand industrial refrigeration systems",
  "Study compressors, condensers and evaporators",
  "Analyze refrigeration cycles",
  "Learn cryogenic fundamentals",
  "Design cold storage and refrigeration plants",
  "Work on industrial refrigeration case studies",
],

requirements: [
  "Basic thermodynamics knowledge",
  "Basic heat transfer concepts",
],

liveProjects: [
  "Cold Storage Design",
  "Refrigeration Load Calculation",
  "Cryogenic Plant Analysis",
],
  },
  {
    slug: "cnc-programming",
    title: "CNC Programming",
    description: "CAM, G-Code & Manufacturing.",
    category: "Mechanical",
    level: "Intermediate",
    duration: "6 Weeks",
    rating: "4.7",
    price: "₹1299",
    icon: Settings,

    instructor: "K.K.Ranjan & Team",
  lessons: 42,
  students: 1,
  language: "English, Hindi & Hinglish",
  certificate: true,

  whatYouWillLearn: [
  "Understand CNC machine operations",
  "Write G-Code and M-Code programs",
  "Create machining tool paths",
  "Perform milling and turning operations",
  "Optimize machining cycles",
  "Develop industrial CNC manufacturing projects",
],

requirements: [
  "Basic manufacturing knowledge",
  "No CNC programming experience required",
],

liveProjects: [
  "Milling Component Programming",
  "Lathe Machining Project",
  "Industrial Fixture Manufacturing",
],
  },
  {
    slug: "python-for-engineers",
    title: "Python for Engineers",
    description: "Automation, Data Analysis & AI.",
    category: "Programming",
    level: "Beginner",
    duration: "6 Weeks",
    rating: "4.9",
    price: "₹999",
    icon: Code2,

    instructor: "K.K.Ranjan & Team",
  lessons: 42,
  students: 1,
  language: "English, Hindi & Hinglish",
  certificate: true,

  whatYouWillLearn: [
  "Learn Python programming fundamentals",
  "Automate engineering calculations",
  "Work with NumPy and Pandas",
  "Visualize engineering data using Matplotlib",
  "Build mini engineering automation projects",
  "Develop problem-solving skills using Python",
],

requirements: [
  "Basic computer knowledge",
  "No programming experience required",
],

liveProjects: [
  "Engineering Calculator",
  "Data Visualization Dashboard",
  "Automation Script Development",
],
  },
];