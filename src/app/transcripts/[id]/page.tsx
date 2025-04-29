// src/app/transcripts/[id]/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  transcriptRequests,
  users,
  grades,
  courses,
  assignments,
  courseCredits,
  courseSemesters,
} from "@/data";
import { calculateGradePoint } from "@/types";

export default function TranscriptPage({ params }: { params: { id: string } }) {
  const [isPrinting, setIsPrinting] = useState(false);
  const transcriptId = params.id;
  const request = transcriptRequests.find((r) => r.id === transcriptId);

  if (!request || request.status !== "completed") {
    notFound();
  }

  const student = users.find((u) => u.id === request.studentId);

  if (!student || student.role !== "student") {
    notFound();
  }

  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  // Get all grades for this student
  const studentGrades = grades.filter((g) => g.studentId === request.studentId);

  // Group grades by course
  const gradesByCourse = studentGrades.reduce((acc, grade) => {
    if (!acc[grade.courseId]) {
      acc[grade.courseId] = [];
    }
    acc[grade.courseId].push(grade);
    return acc;
  }, {} as Record<string, typeof grades>);

  // Calculate course results
  const courseResults = Object.entries(gradesByCourse).map(
    ([courseId, courseGrades]) => {
      const course = courses.find((c) => c.id === courseId);
      const credits = courseCredits[courseId] || 0;
      const semester = courseSemesters[courseId] || "Unknown";

      // Calculate total points and max possible points
      let totalPoints = 0;
      let maxPossiblePoints = 0;

      courseGrades.forEach((grade) => {
        const assignment = assignments.find((a) => a.id === grade.assignmentId);
        if (assignment) {
          totalPoints += grade.points;
          maxPossiblePoints += assignment.maxPoints;
        }
      });

      // Calculate percentage and letter grade
      const percentage =
        maxPossiblePoints > 0 ? (totalPoints / maxPossiblePoints) * 100 : 0;
      const gradeInfo = calculateGradePoint(percentage);

      return {
        courseId,
        course,
        grades: courseGrades,
        percentage,
        letterGrade: gradeInfo.grade,
        gradePoints: gradeInfo.points,
        gradeDescription: gradeInfo.description,
        credits,
        semester,
        weightedPoints: gradeInfo.points * credits,
      };
    }
  );

  // Calculate overall GPA
  const totalCredits = courseResults.reduce(
    (sum, course) => sum + course.credits,
    0
  );
  const totalWeightedPoints = courseResults.reduce(
    (sum, course) => sum + course.weightedPoints,
    0
  );
  const overallGPA = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;

  // Group courses by semester for semester GPA
  const coursesBySemester = courseResults.reduce((acc, course) => {
    if (!acc[course.semester]) {
      acc[course.semester] = [];
    }
    acc[course.semester].push(course);
    return acc;
  }, {} as Record<string, typeof courseResults>);

  const verificationCode = Buffer.from(transcriptId).toString("base64");

  return (
    <div
      className={`min-h-screen bg-gray-50 ${isPrinting ? "print-mode" : ""}`}
    >
      {/* Watermark - visible in both screen and print modes */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.05]">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-6 gap-16">
          {Array(24)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center transform rotate-45"
              >
                <p className="text-6xl font-bold text-gray-800">
                  OFFICIAL TRANSCRIPT
                </p>
              </div>
            ))}
        </div>
      </div>

      <header className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg print:bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-16 w-16 mr-4 bg-white rounded-full flex items-center justify-center print:hidden">
              {/* Placeholder for university logo */}
              <div className="text-blue-600 font-bold text-xl">U</div>
            </div>
            <div className="hidden print:block print:mr-4">
              {/* SVG logo for print version */}
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                className="text-white"
              >
                <circle cx="30" cy="30" r="28" fill="#ffffff" />
                <text
                  x="30"
                  y="38"
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="bold"
                  fill="#1e40af"
                >
                  U
                </text>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Official Transcript
            </h1>
          </div>
          <div>
            <button
              onClick={() => window.print()}
              className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-50 mr-2 print:hidden shadow-sm"
            >
              Print
            </button>
            <Link
              href="/transcripts"
              className="text-white hover:text-blue-100 font-medium print:hidden"
            >
              Back
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 print:py-2 print:px-2 relative z-10">
        <Suspense
          fallback={<p className="text-center py-8">Loading transcript...</p>}
        >
          <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg print:shadow-none border border-gray-200 relative">
            {/* Header with University Info */}
            <div className="px-6 py-6 sm:px-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white print:from-white print:to-white">
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="hidden print:block mr-6">
                    {/* University seal for print version */}
                    <div className="w-24 h-24 border-2 border-blue-700 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 100 100" width="90" height="90">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="#ffffff"
                          stroke="#1e40af"
                          strokeWidth="2"
                        />
                        <text
                          x="50"
                          y="65"
                          textAnchor="middle"
                          fontSize="40"
                          fontWeight="bold"
                          fill="#1e40af"
                        >
                          U
                        </text>
                        <text
                          x="50"
                          y="30"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill="#1e40af"
                        >
                          ESTABLISHED
                        </text>
                        <text
                          x="50"
                          y="85"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill="#1e40af"
                        >
                          1875
                        </text>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-800 print:text-blue-700">
                      UNIVERSITY NAME
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Office of the Registrar
                    </p>
                    <p className="text-sm text-gray-600">
                      123 University Avenue, City, State 12345
                    </p>
                    <p className="text-sm text-gray-600">
                      registrar@university.edu • (555) 123-4567
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-blue-50 print:bg-blue-100 rounded-md px-4 py-3 border border-blue-100 print:border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      Generated: {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-sm text-blue-800">
                      Requested:{" "}
                      {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-blue-800 font-medium">
                      Transcript ID: {transcriptId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="px-6 py-6 sm:px-8 border-b border-gray-200">
              <div className="flex items-center mb-4">
                <div className="h-8 w-1 bg-blue-600 mr-3"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  STUDENT INFORMATION
                </h3>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 print:bg-gray-100 rounded-md p-4">
                  <p className="text-sm font-medium text-gray-500">Name:</p>
                  <p className="text-md text-gray-900 font-medium">
                    {student.name}
                  </p>
                </div>
                <div className="bg-gray-50 print:bg-gray-100 rounded-md p-4">
                  <p className="text-sm font-medium text-gray-500">Email:</p>
                  <p className="text-md text-gray-900">{student.email}</p>
                </div>
                <div className="bg-gray-50 print:bg-gray-100 rounded-md p-4">
                  <p className="text-sm font-medium text-gray-500">
                    Student ID:
                  </p>
                  <p className="text-md text-gray-900">{student.id}</p>
                </div>
                <div className="bg-blue-50 print:bg-blue-100 rounded-md p-4 border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-blue-700">
                    Cumulative GPA:
                  </p>
                  <p className="text-xl text-blue-800 font-bold">
                    {overallGPA.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Semester breakdown */}
            {Object.entries(coursesBySemester).map(
              ([semester, semesterCourses]) => {
                const semesterCredits = semesterCourses.reduce(
                  (sum, course) => sum + course.credits,
                  0
                );
                const semesterWeightedPoints = semesterCourses.reduce(
                  (sum, course) => sum + course.weightedPoints,
                  0
                );
                const semesterGPA =
                  semesterCredits > 0
                    ? semesterWeightedPoints / semesterCredits
                    : 0;

                return (
                  <div key={semester} className="border-t border-gray-200">
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-50 sm:px-8 flex justify-between items-center print:from-gray-200 print:to-gray-100">
                      <h4 className="text-md font-medium text-gray-900">
                        {semester}
                      </h4>
                      <div className="text-sm flex items-center">
                        <div className="bg-white print:bg-gray-50 px-3 py-1 rounded-full shadow-sm border border-gray-200">
                          <span className="font-medium text-blue-800">
                            GPA: {semesterGPA.toFixed(2)}
                          </span>
                        </div>
                        <span className="ml-4 text-gray-600">
                          Credits: {semesterCredits}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 print:bg-gray-100">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Course
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Credits
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Grade
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Grade Points
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {semesterCourses.map((result) => (
                            <tr
                              key={result.courseId}
                              className="hover:bg-blue-50 transition-colors print:hover:bg-white"
                            >
                              <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                                <div>
                                  {result.course?.title || "Unknown Course"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {result.course?.description || ""}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="bg-gray-100 print:bg-gray-200 px-2 py-1 rounded-md">
                                  {result.credits}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    result.letterGrade.startsWith("A")
                                      ? "bg-green-100 text-green-800 print:bg-green-200"
                                      : result.letterGrade.startsWith("B")
                                      ? "bg-blue-100 text-blue-800 print:bg-blue-200"
                                      : result.letterGrade.startsWith("C")
                                      ? "bg-yellow-100 text-yellow-800 print:bg-yellow-200"
                                      : result.letterGrade.startsWith("D")
                                      ? "bg-orange-100 text-orange-800 print:bg-orange-200"
                                      : "bg-red-100 text-red-800 print:bg-red-200"
                                  }`}
                                >
                                  {result.letterGrade}
                                </span>
                                <span className="block text-xs text-gray-500 mt-1">
                                  {result.gradeDescription}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                {result.gradePoints.toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }
            )}

            {/* Detailed view with assignments if requested */}
            {request.format === "detailed" && (
              <div className="border-t border-gray-200 mt-8">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white sm:px-8 print:from-blue-100 print:to-white">
                  <div className="flex items-center">
                    <div className="h-8 w-1 bg-blue-600 mr-3"></div>
                    <h4 className="text-md font-medium text-gray-900">
                      DETAILED GRADE REPORT
                    </h4>
                  </div>
                </div>

                {courseResults.map((result) => (
                  <div
                    key={result.courseId}
                    className="border-t border-gray-200"
                  >
                    <div className="px-6 py-4 bg-white sm:px-8">
                      <h5 className="text-md font-medium text-blue-800">
                        {result.course?.title || "Unknown Course"}
                      </h5>
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-600 mr-3">
                          Final Grade:
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.letterGrade.startsWith("A")
                              ? "bg-green-100 text-green-800 print:bg-green-200"
                              : result.letterGrade.startsWith("B")
                              ? "bg-blue-100 text-blue-800 print:bg-blue-200"
                              : result.letterGrade.startsWith("C")
                              ? "bg-yellow-100 text-yellow-800 print:bg-yellow-200"
                              : result.letterGrade.startsWith("D")
                              ? "bg-orange-100 text-orange-800 print:bg-orange-200"
                              : "bg-red-100 text-red-800 print:bg-red-200"
                          }`}
                        >
                          {result.letterGrade}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          ({result.percentage.toFixed(2)}%)
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 print:bg-gray-100">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Assignment
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Points
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Max Points
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Percentage
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.grades.map((grade) => {
                            const assignment = assignments.find(
                              (a) => a.id === grade.assignmentId
                            );
                            const percentage = assignment
                              ? (grade.points / assignment.maxPoints) * 100
                              : 0;

                            // Determine color based on percentage
                            const getPercentageColor = (pct: number) => {
                              if (pct >= 90) return "text-green-600";
                              if (pct >= 80) return "text-blue-600";
                              if (pct >= 70) return "text-yellow-600";
                              if (pct >= 60) return "text-orange-600";
                              return "text-red-600";
                            };

                            return (
                              <tr
                                key={grade.id}
                                className="hover:bg-gray-50 transition-colors print:hover:bg-white"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {assignment?.title || "Unknown Assignment"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {grade.points}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {assignment?.maxPoints || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span
                                    className={`font-medium ${getPercentageColor(
                                      percentage
                                    )}`}
                                  >
                                    {percentage.toFixed(2)}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Transcript footer with verification and legend */}
            <div className="border-t border-gray-200 mt-8 px-6 py-6 sm:px-8">
              <div className="mb-6 bg-gray-50 print:bg-gray-100 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="h-5 w-1 bg-blue-600 mr-2"></div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    GRADING SYSTEM
                  </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-green-50 print:bg-green-100 p-2 rounded border border-green-100 print:border-green-200">
                    <span className="font-medium text-green-800">
                      A+ (97-100):
                    </span>{" "}
                    4.0 - Exceptional
                  </div>
                  <div className="bg-green-50 print:bg-green-100 p-2 rounded border border-green-100 print:border-green-200">
                    <span className="font-medium text-green-800">
                      A (93-96):
                    </span>{" "}
                    4.0 - Excellent
                  </div>
                  <div className="bg-green-50 print:bg-green-100 p-2 rounded border border-green-100 print:border-green-200">
                    <span className="font-medium text-green-800">
                      A- (90-92):
                    </span>{" "}
                    3.7 - Outstanding
                  </div>
                  <div className="bg-blue-50 print:bg-blue-100 p-2 rounded border border-blue-100 print:border-blue-200">
                    <span className="font-medium text-blue-800">
                      B+ (87-89):
                    </span>{" "}
                    3.3 - Very Good
                  </div>
                  <div className="bg-blue-50 print:bg-blue-100 p-2 rounded border border-blue-100 print:border-blue-200">
                    <span className="font-medium text-blue-800">
                      B (83-86):
                    </span>{" "}
                    3.0 - Good
                  </div>
                  <div className="bg-blue-50 print:bg-blue-100 p-2 rounded border border-blue-100 print:border-blue-200">
                    <span className="font-medium text-blue-800">
                      B- (80-82):
                    </span>{" "}
                    2.7 - Above Average
                  </div>
                  <div className="bg-yellow-50 print:bg-yellow-100 p-2 rounded border border-yellow-100 print:border-yellow-200">
                    <span className="font-medium text-yellow-800">
                      C+ (77-79):
                    </span>{" "}
                    2.3 - Average
                  </div>
                  <div className="bg-yellow-50 print:bg-yellow-100 p-2 rounded border border-yellow-100 print:border-yellow-200">
                    <span className="font-medium text-yellow-800">
                      C (73-76):
                    </span>{" "}
                    2.0 - Satisfactory
                  </div>
                  <div className="bg-yellow-50 print:bg-yellow-100 p-2 rounded border border-yellow-100 print:border-yellow-200">
                    <span className="font-medium text-yellow-800">
                      C- (70-72):
                    </span>{" "}
                    1.7 - Below Average
                  </div>
                  <div className="bg-orange-50 print:bg-orange-100 p-2 rounded border border-orange-100 print:border-orange-200">
                    <span className="font-medium text-orange-800">
                      D+ (67-69):
                    </span>{" "}
                    1.3 - Poor
                  </div>
                  <div className="bg-orange-50 print:bg-orange-100 p-2 rounded border border-orange-100 print:border-orange-200">
                    <span className="font-medium text-orange-800">
                      D (63-66):
                    </span>{" "}
                    1.0 - Very Poor
                  </div>
                  <div className="bg-orange-50 print:bg-orange-100 p-2 rounded border border-orange-100 print:border-orange-200">
                    <span className="font-medium text-orange-800">
                      D- (60-62):
                    </span>{" "}
                    0.7 - Barely Passing
                  </div>
                  <div className="bg-red-50 print:bg-red-100 p-2 rounded border border-red-100 print:border-red-200">
                    <span className="font-medium text-red-800">F (0-59):</span>{" "}
                    0.0 - Failing
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="text-sm text-gray-600 italic">
                  This transcript is official only when it bears the seal of the
                  University and the signature of the Registrar.
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  For verification, please contact the Office of the Registrar
                  at registrar@university.edu.
                </p>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <div className="w-1/3 border-b border-gray-400 print:border-gray-600"></div>
                <div className="text-center flex-1">
                  <div className="border-2 border-blue-700 print:border-blue-800 p-4 rounded-md inline-block">
                    <div className="flex flex-col items-center">
                      <svg viewBox="0 0 100 100" width="80" height="80">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#1e40af"
                          strokeWidth="2"
                        />
                        <text
                          x="50"
                          y="65"
                          textAnchor="middle"
                          fontSize="40"
                          fontWeight="bold"
                          fill="#1e40af"
                        >
                          U
                        </text>
                        <text
                          x="50"
                          y="30"
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          fill="#1e40af"
                        >
                          OFFICIAL SEAL
                        </text>
                        <text
                          x="50"
                          y="85"
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          fill="#1e40af"
                        >
                          ESTABLISHED 1875
                        </text>
                      </svg>
                      <p className="text-xs text-gray-500 mt-2">
                        Digital Verification Code: {verificationCode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-1/3 border-b border-gray-400 print:border-gray-600"></div>
              </div>

              <div className="mt-8 print:mt-12 flex justify-between">
                <div className="text-center flex-1">
                  <div className="border-b border-gray-400 print:border-gray-600 pb-1 w-64 mx-auto"></div>
                  <p className="text-sm mt-1">Registrar Signature</p>
                </div>
                <div className="text-center flex-1">
                  <div className="border-b border-gray-400 print:border-gray-600 pb-1 w-64 mx-auto"></div>
                  <p className="text-sm mt-1">Date</p>
                </div>
              </div>
            </div>
          </div>

          {/* Print-specific styles */}
          <style jsx global>{`
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .print-mode {
                background-color: white !important;
              }

              @page {
                margin: 0.5cm;
                size: portrait;
              }
            }
          `}</style>
        </Suspense>
      </main>
    </div>
  );
}
