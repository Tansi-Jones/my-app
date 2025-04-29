// src/data/mockData.ts

import {
  User,
  Course,
  Assignment,
  Submission,
  Grade,
  TranscriptRequest,
  CourseGradingSchema,
  StudentGradeEntry,
  AttendanceSession,
  AttendanceRecord,
} from "../types";

export const users: User[] = [
  {
    id: "l1",
    name: "Dr. Smith",
    email: "smith@university.edu",
    role: "lecturer",
  },
  {
    id: "l2",
    name: "Prof. Johnson",
    email: "johnson@university.edu",
    role: "lecturer",
  },
  { id: "s1", name: "John Doe", email: "john@university.edu", role: "student" },
  {
    id: "s2",
    name: "Jane Smith",
    email: "jane@university.edu",
    role: "student",
  },
  { id: "s3", name: "Bob Brown", email: "bob@university.edu", role: "student" },
];

export const courses: Course[] = [
  {
    id: "c1",
    title: "Introduction to Computer Science",
    description: "Basic concepts of computer science and programming",
    lecturerId: "l1",
    studentIds: ["s1", "s2", "s3"],
  },
  {
    id: "c2",
    title: "Web Development",
    description: "Learn frontend and backend web development",
    lecturerId: "l2",
    studentIds: ["s1", "s2"],
  },
];

export const assignments: Assignment[] = [
  {
    id: "a1",
    courseId: "c1",
    title: "Algorithm Analysis",
    description: "Analyze the time and space complexity of given algorithms",
    dueDate: "2025-05-15",
    maxPoints: 100,
  },
  {
    id: "a2",
    courseId: "c1",
    title: "Data Structures Implementation",
    description: "Implement a linked list and binary search tree",
    dueDate: "2025-05-25",
    maxPoints: 100,
  },
  {
    id: "a3",
    courseId: "c2",
    title: "Personal Portfolio Website",
    description: "Build a personal portfolio using HTML, CSS, and JavaScript",
    dueDate: "2025-05-20",
    maxPoints: 100,
  },
];

export const submissions: Submission[] = [
  {
    id: "sub1",
    assignmentId: "a1",
    studentId: "s1",
    submittedAt: "2025-05-12T14:30:00Z",
    content: "Algorithm analysis submission content here",
    attachmentUrl: "/attachments/sub1.pdf",
  },
  {
    id: "sub2",
    assignmentId: "a1",
    studentId: "s2",
    submittedAt: "2025-05-13T09:15:00Z",
    content: "My algorithm analysis submission",
    attachmentUrl: "/attachments/sub2.pdf",
  },
  {
    id: "sub3",
    assignmentId: "a3",
    studentId: "s1",
    submittedAt: "2025-05-19T16:45:00Z",
    content: "Portfolio website submission with GitHub link",
    attachmentUrl: "/attachments/sub3.pdf",
  },
];

export const grades: Grade[] = [
  {
    id: "g1",
    submissionId: "sub1",
    assignmentId: "a1",
    studentId: "s1",
    courseId: "c1",
    points: 85,
    feedback: "Good analysis but missed some edge cases",
    gradedAt: "2025-05-16T10:30:00Z",
  },
  {
    id: "g2",
    submissionId: "sub2",
    assignmentId: "a1",
    studentId: "s2",
    courseId: "c1",
    points: 92,
    feedback: "Excellent work!",
    gradedAt: "2025-05-16T11:15:00Z",
  },
];

export const transcriptRequests: TranscriptRequest[] = [
  {
    id: "tr1",
    studentId: "s1",
    requestDate: "2025-04-15T10:30:00Z",
    status: "completed",
    format: "detailed",
  },
  {
    id: "tr2",
    studentId: "s2",
    requestDate: "2025-04-20T14:45:00Z",
    status: "pending",
    format: "summary",
  },
];

// Add additional course information for transcript purposes
export const courseCredits: Record<string, number> = {
  c1: 3, // Introduction to Computer Science - 3 credit hours
  c2: 4, // Web Development - 4 credit hours
};

// Add semester information for courses
export const courseSemesters: Record<string, string> = {
  c1: "Spring 2025",
  c2: "Spring 2025",
};

// Add mock data for grade schemas
export const gradingSchemas: CourseGradingSchema[] = [
  {
    id: "gs1",
    courseId: "c1",
    components: [
      {
        id: "comp1",
        name: "Midterm Exam",
        type: "midterm",
        weight: 30,
        maxPoints: 100,
        description: "Covers first half of the course",
      },
      {
        id: "comp2",
        name: "Final Exam",
        type: "final",
        weight: 40,
        maxPoints: 100,
        description: "Comprehensive exam covering all material",
      },
      {
        id: "comp3",
        name: "Programming Assignments",
        type: "assignment",
        weight: 20,
        maxPoints: 100,
        description: "Average of all programming assignments",
      },
      {
        id: "comp4",
        name: "Participation",
        type: "participation",
        weight: 10,
        maxPoints: 100,
        description: "In-class participation and discussion",
      },
    ],
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "gs2",
    courseId: "c2",
    components: [
      {
        id: "comp5",
        name: "Midterm Project",
        type: "midterm",
        weight: 25,
        maxPoints: 100,
        description: "Individual project for the first half",
      },
      {
        id: "comp6",
        name: "Final Project",
        type: "final",
        weight: 35,
        maxPoints: 100,
        description: "Comprehensive team project",
      },
      {
        id: "comp7",
        name: "Weekly Labs",
        type: "lab",
        weight: 25,
        maxPoints: 100,
        description: "Average of all weekly lab assignments",
      },
      {
        id: "comp8",
        name: "Quizzes",
        type: "quiz",
        weight: 15,
        maxPoints: 100,
        description: "Average of pop quizzes throughout semester",
      },
    ],
    createdAt: "2025-01-16T10:00:00Z",
    updatedAt: "2025-01-16T10:00:00Z",
  },
];

export const studentGradeEntries: StudentGradeEntry[] = [
  {
    id: "sge1",
    studentId: "s1",
    componentId: "comp1",
    courseId: "c1",
    points: 85,
    percentage: 85,
    feedback:
      "Good understanding of concepts, could improve on algorithm analysis",
    gradedAt: "2025-03-15T14:30:00Z",
    gradedBy: "l1",
  },
  {
    id: "sge2",
    studentId: "s1",
    componentId: "comp3",
    courseId: "c1",
    points: 92,
    percentage: 92,
    feedback: "Excellent work on programming assignments",
    gradedAt: "2025-03-20T11:15:00Z",
    gradedBy: "l1",
  },
  {
    id: "sge3",
    studentId: "s2",
    componentId: "comp1",
    courseId: "c1",
    points: 78,
    percentage: 78,
    feedback: "Good effort, needs to improve on time complexity analysis",
    gradedAt: "2025-03-15T15:00:00Z",
    gradedBy: "l1",
  },
];

export const attendanceSessions: AttendanceSession[] = [
  {
    id: "as1",
    courseId: "c1",
    title: "Week 1 Lecture",
    date: "2025-01-15",
    startTime: "09:00",
    endTime: "10:30",
    description: "Introduction to Computer Science Concepts",
    createdBy: "l1",
  },
  {
    id: "as2",
    courseId: "c1",
    title: "Week 2 Lecture",
    date: "2025-01-22",
    startTime: "09:00",
    endTime: "10:30",
    description: "Algorithms and Data Structures",
    createdBy: "l1",
  },
  {
    id: "as3",
    courseId: "c2",
    title: "Web Dev Workshop",
    date: "2025-01-16",
    startTime: "13:00",
    endTime: "15:00",
    description: "Frontend Development Introduction",
    createdBy: "l2",
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "ar1",
    sessionId: "as1",
    studentId: "s1",
    status: "present",
    timestamp: "2025-01-15T09:05:00Z",
  },
  {
    id: "ar2",
    sessionId: "as1",
    studentId: "s2",
    status: "present",
    timestamp: "2025-01-15T08:55:00Z",
  },
  {
    id: "ar3",
    sessionId: "as1",
    studentId: "s3",
    status: "late",
    timestamp: "2025-01-15T09:20:00Z",
    notes: "Traffic delay",
  },
  {
    id: "ar4",
    sessionId: "as2",
    studentId: "s1",
    status: "absent",
    notes: "No notification provided",
  },
  {
    id: "ar5",
    sessionId: "as2",
    studentId: "s2",
    status: "present",
    timestamp: "2025-01-22T08:50:00Z",
  },
  {
    id: "ar6",
    sessionId: "as3",
    studentId: "s1",
    status: "present",
    timestamp: "2025-01-16T12:55:00Z",
  },
  {
    id: "ar7",
    sessionId: "as3",
    studentId: "s2",
    status: "excused",
    notes: "Medical appointment",
  },
];
