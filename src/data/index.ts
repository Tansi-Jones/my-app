// src/data/mockData.ts

import {
  User,
  Course,
  Assignment,
  Submission,
  Grade,
  TranscriptRequest,
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
