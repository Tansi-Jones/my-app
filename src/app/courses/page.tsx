// src/app/courses/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { courses, users } from "@/data";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<p>Loading courses...</p>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const lecturer = users.find(
                (user) => user.id === course.lecturerId
              );
              return (
                <div
                  key={course.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link
                        href={`/courses/${course.id}`}
                        className="hover:text-blue-600"
                      >
                        {course.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {course.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      Lecturer: {lecturer?.name || "Unknown"}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      Students: {course.studentIds.length}
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details →
                    </Link>
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
