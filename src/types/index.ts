// src/types/index.ts

export type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer";
};

export type Course = {
  id: string;
  title: string;
  description: string;
  lecturerId: string;
  studentIds: string[];
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
};

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  content: string;
  attachmentUrl?: string;
};

export type Grade = {
  id: string;
  submissionId: string;
  assignmentId: string;
  studentId: string;
  courseId: string;
  points: number;
  feedback?: string;
  gradedAt: string;
};

// Grade points calculation system
export const calculateGradePoint = (
  percentage: number
): { grade: string; points: number; description: string } => {
  if (percentage >= 97)
    return { grade: "A+", points: 4.0, description: "Exceptional" };
  if (percentage >= 93)
    return { grade: "A", points: 4.0, description: "Excellent" };
  if (percentage >= 90)
    return { grade: "A-", points: 3.7, description: "Outstanding" };
  if (percentage >= 87)
    return { grade: "B+", points: 3.3, description: "Very Good" };
  if (percentage >= 83) return { grade: "B", points: 3.0, description: "Good" };
  if (percentage >= 80)
    return { grade: "B-", points: 2.7, description: "Above Average" };
  if (percentage >= 77)
    return { grade: "C+", points: 2.3, description: "Average" };
  if (percentage >= 73)
    return { grade: "C", points: 2.0, description: "Satisfactory" };
  if (percentage >= 70)
    return { grade: "C-", points: 1.7, description: "Below Average" };
  if (percentage >= 67)
    return { grade: "D+", points: 1.3, description: "Poor" };
  if (percentage >= 63)
    return { grade: "D", points: 1.0, description: "Very Poor" };
  if (percentage >= 60)
    return { grade: "D-", points: 0.7, description: "Barely Passing" };
  return { grade: "F", points: 0.0, description: "Failing" };
};

export type TranscriptFormat = "detailed" | "summary";

export type TranscriptRequest = {
  id: string;
  studentId: string;
  requestDate: string;
  status: "pending" | "completed";
  format: TranscriptFormat;
};

export type TranscriptData = {
  student: User;
  courses: {
    course: Course;
    grades: Grade[];
    percentage: number;
    letterGrade: string;
    gradePoints: number;
  }[];
  overallGPA: number;
  semesterGPA: number;
  totalCredits: number;
  requestDate: string;
  generatedDate: string;
};

// src/types/grading.ts

// Types for the grading schema
export type GradeComponentType =
  | "midterm"
  | "final"
  | "assignment"
  | "quiz"
  | "project"
  | "lab"
  | "participation"
  | "presentation"
  | "other";

export type GradeComponent = {
  id: string;
  name: string;
  type: GradeComponentType;
  weight: number; // percentage weight in the final grade
  maxPoints: number;
  description?: string;
};

export type CourseGradingSchema = {
  id: string;
  courseId: string;
  components: GradeComponent[];
  createdAt: string;
  updatedAt: string;
};

export type StudentGradeEntry = {
  id: string;
  studentId: string;
  componentId: string;
  courseId: string;
  points: number;
  percentage: number;
  feedback?: string;
  gradedAt: string;
  gradedBy: string;
};

// Function to calculate the weighted grade
export const calculateWeightedGrade = (
  componentGrades: StudentGradeEntry[],
  gradingSchema: CourseGradingSchema
): number => {
  let totalWeightedPercentage = 0;
  let appliedWeightSum = 0;

  for (const grade of componentGrades) {
    const component = gradingSchema.components.find(
      (c) => c.id === grade.componentId
    );
    if (component) {
      totalWeightedPercentage += grade.percentage * component.weight;
      appliedWeightSum += component.weight;
    }
  }

  // If not all components are graded yet, calculate based on current weights
  if (appliedWeightSum > 0) {
    return (totalWeightedPercentage / appliedWeightSum) * 100;
  }

  return 0;
};
