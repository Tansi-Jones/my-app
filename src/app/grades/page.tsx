// src/app/grades/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { grades, users } from "@/data";

export default function GradesPage() {
  // Group grades by student for easier display
  const gradesByStudent = grades.reduce((acc, grade) => {
    if (!acc[grade.studentId]) {
      acc[grade.studentId] = [];
    }
    acc[grade.studentId].push(grade);
    return acc;
  }, {} as Record<string, typeof grades>);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<p>Loading grades...</p>}>
          {Object.entries(gradesByStudent).length === 0 ? (
            <p className="text-gray-500">No grades available yet.</p>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {Object.entries(gradesByStudent).map(
                  ([studentId, studentGrades]) => {
                    const student = users.find((u) => u.id === studentId);
                    return (
                      <li key={studentId}>
                        <Link
                          href={`/students/${studentId}/transcript`}
                          className="block hover:bg-gray-50"
                        >
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {student?.name || "Unknown Student"}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {studentGrades.length} Grades
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  View Transcript
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
}
