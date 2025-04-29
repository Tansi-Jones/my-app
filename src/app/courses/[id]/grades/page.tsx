"use client";
// src/app/courses/[id]/grades/page.tsx

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { courses, users, gradingSchemas, studentGradeEntries } from "@/data";
import {
  CourseGradingSchema,
  GradeComponent,
  StudentGradeEntry,
  calculateWeightedGrade,
} from "@/types";
import { calculateGradePoint } from "@/types";

export default function CourseGradesPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState(() =>
    courses.find((c) => c.id === courseId)
  );
  const [lecturer, setLecturer] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [gradingSchema, setGradingSchema] =
    useState<CourseGradingSchema | null>(null);
  const [studentGrades, setStudentGrades] = useState<
    Record<string, StudentGradeEntry[]>
  >({});
  const [editMode, setEditMode] = useState(false);
  const [currentComponent, setCurrentComponent] =
    useState<GradeComponent | null>(null);
  const [editingGrades, setEditingGrades] = useState<Record<string, number>>(
    {}
  );
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  // Load course data
  useEffect(() => {
    if (courseId) {
      // Find course
      const courseData = courses.find((c) => c.id === courseId);
      if (courseData) {
        setCourse(courseData);

        // Find lecturer
        const lecturerData = users.find((u) => u.id === courseData.lecturerId);
        setLecturer(lecturerData);

        // Find students
        const courseStudents = users.filter((u) =>
          courseData.studentIds.includes(u.id)
        );
        setStudents(courseStudents);

        // Find grading schema
        const schema = gradingSchemas.find((s) => s.courseId === courseId);
        setGradingSchema(schema || null);

        // Load student grades
        const grades = studentGradeEntries.filter(
          (g) => g.courseId === courseId
        );

        // Group grades by student
        const gradesByStudent: Record<string, StudentGradeEntry[]> = {};
        for (const student of courseStudents) {
          gradesByStudent[student.id] = grades.filter(
            (g) => g.studentId === student.id
          );
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

    students.forEach((student) => {
      const studentId = student.id;
      const gradeEntry = studentGrades[studentId]?.find(
        (g) => g.componentId === component.id
      );

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

      setEditingGrades((prev) => ({
        ...prev,
        [studentId]: points,
      }));
    }
  };

  const handleFeedbackChange = (studentId: string, value: string) => {
    setFeedback((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSaveGrades = () => {
    if (!currentComponent) return;

    const componentId = currentComponent.id;
    const now = new Date().toISOString();
    const lecturerId = lecturer?.id || "";

    // Update grades
    const newStudentGrades = { ...studentGrades };

    students.forEach((student) => {
      const studentId = student.id;
      const points = editingGrades[studentId] || 0;
      const percentage = (points / currentComponent.maxPoints) * 100;

      // Find existing grade entry or create new one
      const existingGradeIndex = newStudentGrades[studentId]?.findIndex(
        (g) => g.componentId === componentId
      );

      const newGradeEntry: StudentGradeEntry = {
        id:
          existingGradeIndex >= 0
            ? newStudentGrades[studentId][existingGradeIndex].id
            : `sge${Date.now()}-${studentId}`,
        studentId,
        componentId,
        courseId,
        points,
        percentage,
        feedback: feedback[studentId] || "",
        gradedAt: now,
        gradedBy: lecturerId,
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

    if (studentGradeList.length === 0)
      return { percentage: 0, letterGrade: "N/A", points: 0 };

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
            <Link
              href={`/courses/${courseId}/grading-schema`}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit Grading Schema
            </Link>
            <Link
              href={`/courses/${courseId}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Course
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Course Info */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Course: {course.title}
            </h2>
            <p className="text-sm text-gray-500">
              Lecturer: {lecturer?.name || "Unknown"}
            </p>
            <p className="text-sm text-gray-500">Students: {students.length}</p>
          </div>

          {!gradingSchema && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-700">
                No grading schema defined for this course.{" "}
                <Link
                  href={`/courses/${courseId}/grading-schema`}
                  className="font-medium underline"
                >
                  Create one now
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Edit Mode */}
        {editMode && currentComponent && (
          <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Editing Grades: {currentComponent.name}
              </h2>
              <div className="text-sm text-gray-500">
                Max Points: {currentComponent.maxPoints} | Weight:{" "}
                {currentComponent.weight}%
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points (out of {currentComponent.maxPoints})
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const points = editingGrades[student.id] || 0;
                    const percentage =
                      (points / currentComponent.maxPoints) * 100;

                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            min="0"
                            max={currentComponent.maxPoints}
                            value={points}
                            onChange={(e) =>
                              handleGradeChange(
                                student.id,
                                Number(e.target.value)
                              )
                            }
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {percentage.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <textarea
                            rows={2}
                            value={feedback[student.id] || ""}
                            onChange={(e) =>
                              handleFeedbackChange(student.id, e.target.value)
                            }
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => {
                  setEditMode(false);
                  setCurrentComponent(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGrades}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Grades
              </button>
            </div>
          </div>
        )}

        {/* Grading Components */}
        {gradingSchema && !editMode && (
          <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Grading Components
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Component
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gradingSchema.components.map((component) => (
                    <tr key={component.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {component.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {component.type.charAt(0).toUpperCase() +
                          component.type.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {component.weight}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {component.maxPoints}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {component.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEditComponent(component)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit Grades
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student Grades */}
        {gradingSchema && !editMode && (
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Student Grades Summary
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    {gradingSchema.components.map((component) => (
                      <th
                        key={component.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {component.name} ({component.weight}%)
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Final Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GPA
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const finalGrade = calculateStudentFinalGrade(student.id);

                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
                        </td>

                        {gradingSchema.components.map((component) => {
                          const gradeEntry = studentGrades[student.id]?.find(
                            (g) => g.componentId === component.id
                          );

                          return (
                            <td
                              key={component.id}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {gradeEntry ? (
                                <div>
                                  <div>
                                    {gradeEntry.points}/{component.maxPoints}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {gradeEntry.percentage.toFixed(2)}%
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">
                                  Not graded
                                </span>
                              )}
                            </td>
                          );
                        })}

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {finalGrade.letterGrade}
                          </div>
                          <div className="text-xs text-gray-500">
                            {finalGrade.percentage.toFixed(2)}%
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {finalGrade.points.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
