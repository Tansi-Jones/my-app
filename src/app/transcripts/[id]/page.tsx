// src/app/transcripts/[id]/page.tsx
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  const transcriptId = params.id;
  const request = transcriptRequests.find((r) => r.id === transcriptId);

  if (!request || request.status !== "completed") {
    notFound();
  }

  const student = users.find((u) => u.id === request.studentId);

  if (!student || student.role !== "student") {
    notFound();
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Official Transcript
          </h1>
          <div>
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 mr-2 print:hidden"
            >
              Print
            </button>
            <Link
              href="/transcripts"
              className="text-blue-600 hover:text-blue-800 print:hidden"
            >
              Back
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 print:py-0 print:px-0">
        <Suspense fallback={<p>Loading transcript...</p>}>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg print:shadow-none">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    UNIVERSITY NAME
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Office of the Registrar
                  </p>
                  <p className="text-sm text-gray-500">University Address</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Generated: {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Requested:{" "}
                    {new Date(request.requestDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Transcript ID: {transcriptId}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-semibold text-gray-900">
                STUDENT INFORMATION
              </h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name:</p>
                  <p className="text-sm text-gray-900">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email:</p>
                  <p className="text-sm text-gray-900">{student.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Student ID:
                  </p>
                  <p className="text-sm text-gray-900">{student.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Cumulative GPA:
                  </p>
                  <p className="text-sm text-gray-900 font-semibold">
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
                    <div className="px-4 py-3 bg-gray-50 sm:px-6 flex justify-between items-center">
                      <h4 className="text-md font-medium text-gray-900">
                        {semester}
                      </h4>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          Semester GPA: {semesterGPA.toFixed(2)}
                        </span>
                        <span className="ml-4 text-gray-500">
                          Credits: {semesterCredits}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
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
                            <tr key={result.courseId}>
                              <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                                <div>
                                  {result.course?.title || "Unknown Course"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {result.course?.description || ""}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.credits}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {result.letterGrade}
                                <span className="block text-xs text-gray-500">
                                  {result.gradeDescription}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                <div className="px-4 py-3 bg-gray-50 sm:px-6">
                  <h4 className="text-md font-medium text-gray-900">
                    DETAILED GRADE REPORT
                  </h4>
                </div>

                {courseResults.map((result) => (
                  <div
                    key={result.courseId}
                    className="border-t border-gray-200"
                  >
                    <div className="px-4 py-3 bg-white sm:px-6">
                      <h5 className="text-md font-medium text-gray-900">
                        {result.course?.title || "Unknown Course"}
                      </h5>
                      <p className="text-sm text-gray-500">
                        Final Grade: {result.letterGrade} (
                        {result.percentage.toFixed(2)}%)
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
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

                            return (
                              <tr key={grade.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {assignment?.title || "Unknown Assignment"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {grade.points}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {assignment?.maxPoints || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {percentage.toFixed(2)}%
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
            <div className="border-t border-gray-200 mt-8 px-4 py-5 sm:px-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  GRADING SYSTEM
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div>A+ (97-100): 4.0 - Exceptional</div>
                  <div>A (93-96): 4.0 - Excellent</div>
                  <div>A- (90-92): 3.7 - Outstanding</div>
                  <div>B+ (87-89): 3.3 - Very Good</div>
                  <div>B (83-86): 3.0 - Good</div>
                  <div>B- (80-82): 2.7 - Above Average</div>
                  <div>C+ (77-79): 2.3 - Average</div>
                  <div>C (73-76): 2.0 - Satisfactory</div>
                  <div>C- (70-72): 1.7 - Below Average</div>
                  <div>D+ (67-69): 1.3 - Poor</div>
                  <div>D (63-66): 1.0 - Very Poor</div>
                  <div>D- (60-62): 0.7 - Barely Passing</div>
                  <div>F (0-59): 0.0 - Failing</div>
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-gray-500">
                <p>
                  This transcript is official only when it bears the seal of the
                  University and the signature of the Registrar.
                </p>
                <p className="mt-1">
                  For verification, please contact the Office of the Registrar.
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <div className="text-center border-2 border-gray-300 border-dashed p-4 rounded-md">
                  <p className="font-medium">UNIVERSITY SEAL</p>
                  <p className="text-xs text-gray-500">
                    Digital Verification Code:{" "}
                    {Buffer.from(transcriptId).toString("base64")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  );
}
