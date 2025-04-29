// src/app/students/[id]/transcript/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { grades, assignments, users, courses } from "@/data";
import { calculateGradePoint } from "@/types";
import { notFound } from "next/navigation";

export default function TranscriptPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { courseId?: string };
}) {
  const studentId = params.id;
  const courseId = searchParams?.courseId;

  const student = users.find((u) => u.id === studentId);

  if (!student || student.role !== "student") {
    notFound();
  }

  // Get all grades for this student, optionally filtered by course
  let studentGrades = grades.filter((g) => g.studentId === studentId);
  if (courseId) {
    studentGrades = studentGrades.filter((g) => g.courseId === courseId);
  }

  // Group grades by course
  const gradesByCourse = studentGrades.reduce((acc, grade) => {
    if (!acc[grade.courseId]) {
      acc[grade.courseId] = [];
    }
    acc[grade.courseId].push(grade);
    return acc;
  }, {} as Record<string, typeof grades>);

  // Calculate GPA and course grades
  const courseResults = Object.entries(gradesByCourse).map(
    ([courseId, courseGrades]) => {
      const course = courses.find((c) => c.id === courseId);

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
      const { grade, points } = calculateGradePoint(percentage);

      return {
        courseId,
        courseName: course?.title || "Unknown Course",
        percentage,
        grade,
        gradePoints: points,
      };
    }
  );

  // Calculate overall GPA
  const totalGradePoints = courseResults.reduce(
    (sum, course) => sum + course.gradePoints,
    0
  );
  const gpa =
    courseResults.length > 0 ? totalGradePoints / courseResults.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Academic Transcript
          </h1>
          <Link
            href={courseId ? `/courses/${courseId}` : "/grades"}
            className="text-blue-600 hover:text-blue-800"
          >
            Back
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<p>Loading transcript...</p>}>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {student.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {student.email}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Cumulative GPA
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {gpa.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Courses
              </h3>
            </div>

            {courseResults.length === 0 ? (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-500">No grades available yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
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
                        Grade
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Percentage
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
                    {courseResults.map((result) => (
                      <tr key={result.courseId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.courseName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.grade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.percentage.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.gradePoints.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Individual Assignment Grades for each course */}
            {Object.entries(gradesByCourse).map(([courseId, courseGrades]) => {
              const course = courses.find((c) => c.id === courseId);
              return (
                <div key={courseId} className="mt-8">
                  <div className="px-4 py-3 bg-gray-50 sm:px-6">
                    <h4 className="text-md font-medium text-gray-900">
                      {course?.title || "Unknown Course"} - Assignments
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-white">
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
                        {courseGrades.map((grade) => {
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
              );
            })}
          </div>
        </Suspense>
      </main>
    </div>
  );
}
