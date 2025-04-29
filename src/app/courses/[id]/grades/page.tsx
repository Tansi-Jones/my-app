"use client";
// src/app/courses/[id]/grades/page.tsx

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { courses, users,  gradingSchemas, 
    studentGradeEntries, } from "@/data";
import { 
  CourseGradingSchema, 
  GradeComponent, 
  StudentGradeEntry, 

  calculateWeightedGrade
} from "@/types";
import { calculateGradePoint } from "@/types";

export default function CourseGradesPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState(() => courses.find(c => c.id === courseId));
  const [lecturer, setLecturer] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [gradingSchema, setGradingSchema] = useState<CourseGradingSchema | null>(null);
  const [studentGrades, setStudentGrades] = useState<Record<string, StudentGradeEntry[]>>({});
  const [editMode, setEditMode] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<GradeComponent | null>(null);
  const [editingGrades, setEditingGrades] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  // Load course data
  useEffect(() => {
    if (courseId) {
      // Find course
      const courseData = courses.find(c => c.id === courseId);
      if (courseData) {
        setCourse(courseData);
        
        // Find lecturer
        const lecturerData = users.find(u => u.id === courseData.lecturerId);
        setLecturer(lecturerData);
        
        // Find students
        const courseStudents = users.filter(u => courseData.studentIds.includes(u.id));
        setStudents(courseStudents);
        
        // Find grading schema
        const schema = gradingSchemas.find(s => s.courseId === courseId);
        setGradingSchema(schema || null);
        
        // Load student grades
        const grades = studentGradeEntries.filter(g => g.courseId === courseId);
        
        // Group grades by student
        const gradesByStudent: Record<string, StudentGradeEntry[]> = {};
        for (const student of courseStudents) {
          gradesByStudent[student.id] = grades.filter(g => g.studentId === student.id);
        }
        
        setStudentGrades(gradesByStudent);
      }
    }
  }, [courseId]);

  const handleEditComponent = (component: GradeComponent) => {
    setCurrentComponent(component);
    setEditMode(true);
    
    // Initialize editing grades and feedback
    const newEditingGrades: Record<string, number> = {};
    const newFeedback: Record<string, string> = {};
    
    students.forEach(student => {
      const studentId = student.id;
      const gradeEntry = studentGrades[studentId]?.find(g => g.componentId === component.id);
      
      if (gradeEntry) {
        newEditingGrades[studentId] = gradeEntry.points;
        newFeedback[studentId] = gradeEntry.feedback || "";
      } else {
        newEditingGrades[studentId] = 0;
        newFeedback[studentId] = "";
      }
    });
    
    setEditingGrades(newEditingGrades);
    setFeedback(newFeedback);
  };

  const handleGradeChange = (studentId: string, value: number) => {
    if (currentComponent) {
      const maxPoints = currentComponent.maxPoints;
      // Ensure value is within range
      let points = Math.min(Math.max(0, value), maxPoints);
      
      setEditingGrades(prev => ({
        ...prev,
        [studentId]: points
      }));
    }
  };

  const handleFeedbackChange = (studentId: string, value: string) => {
    setFeedback(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSaveGrades = () => {
    if (!currentComponent) return;
    
    const componentId = currentComponent.id;
    const now = new Date().toISOString();
    const lecturerId = lecturer?.id || "";
    
    // Update grades
    const newStudentGrades = { ...studentGrades };
    
    students.forEach(student => {
      const studentId = student.id;
      const points = editingGrades[studentId] || 0;
      const percentage = (points / currentComponent.maxPoints) * 100;
      
      // Find existing grade entry or create new one
      const existingGradeIndex = newStudentGrades[studentId]?.findIndex(g => g.componentId === componentId);
      
      const newGradeEntry: StudentGradeEntry = {
        id: existingGradeIndex >= 0 ? newStudentGrades[studentId][existingGradeIndex].id : `sge${Date.now()}-${studentId}`,
        studentId,
        componentId,
        courseId,
        points,
        percentage,
        feedback: feedback[studentId] || "",
        gradedAt: now,
        gradedBy: lecturerId
      };
      
      if (existingGradeIndex >= 0) {
        newStudentGrades[studentId][existingGradeIndex] = newGradeEntry;
      } else {
        if (!newStudentGrades[studentId]) {
          newStudentGrades[studentId] = [];
        }
        newStudentGrades[studentId].push(newGradeEntry);
      }
    });
    
    setStudentGrades(newStudentGrades);
    setEditMode(false);
    setCurrentComponent(null);
    
    // In a real app, this would save to a database
    console.log("Saved grades:", newStudentGrades);
  };

  const calculateStudentFinalGrade = (studentId: string) => {
    if (!gradingSchema) return { percentage: 0, letterGrade: "N/A", points: 0 };
    
    const studentGradeList = studentGrades[studentId] || [];
    
    if (studentGradeList.length === 0) return { percentage: 0, letterGrade: "N/A", points: 0 };
    
    const percentage = calculateWeightedGrade(studentGradeList, gradingSchema);
    const { grade: letterGrade, points } = calculateGradePoint(percentage);
    
    return { percentage, letterGrade, points };
  };

  if (!course) {
    return <div className="p-4">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Grades for {course.title}
          </h1>
          <div className="flex space-x-4">
            <Link href={`/courses/${courseId}/grading-schema`} className="text-blue-600 hover:text-blue-800">
              Edit Grading Schema
            </Link>
            <Link href={`/courses/${courseId}`} className="text-blue-600 hover:text-blue-800">
              Back to Course