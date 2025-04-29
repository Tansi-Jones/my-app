// src/app/courses/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { courses, users } from "@/data";

export default function CoursesPage() {
  // Generate course color classes
  const courseColors = [
    {
      bg: "bg-blue-50",
      accent: "bg-blue-600",
      text: "text-blue-600",
      hover: "group-hover:bg-blue-600",
    },
    {
      bg: "bg-emerald-50",
      accent: "bg-emerald-600",
      text: "text-emerald-600",
      hover: "group-hover:bg-emerald-600",
    },
    {
      bg: "bg-amber-50",
      accent: "bg-amber-600",
      text: "text-amber-600",
      hover: "group-hover:bg-amber-600",
    },
    {
      bg: "bg-purple-50",
      accent: "bg-purple-600",
      text: "text-purple-600",
      hover: "group-hover:bg-purple-600",
    },
    {
      bg: "bg-rose-50",
      accent: "bg-rose-600",
      text: "text-rose-600",
      hover: "group-hover:bg-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600 mr-8"
            >
              EduFlow
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/assignments"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Assignments
              </Link>
              <Link
                href="/grades"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Grades
              </Link>
              <Link
                href="/transcripts"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Transcripts
              </Link>
            </nav>
            <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">JS</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Courses</h2>
            <p className="text-gray-600 mt-1">Spring 2025 Semester</p>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => {
              const lecturer = users.find(
                (user) => user.id === course.lecturerId
              );
              const colorSet = courseColors[index % courseColors.length];

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-transparent hover:border-indigo-100 h-full flex flex-col">
                    <div
                      className={`${colorSet.bg} px-6 py-4 flex justify-between items-center`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-lg ${colorSet.accent} flex items-center justify-center mr-3`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                          {course.title}
                        </h3>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${colorSet.text} opacity-0 group-hover:opacity-100 transition-opacity`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <div className="p-6 flex-1">
                      <p className="text-gray-600 text-sm mb-4">
                        {course.description}
                      </p>

                      <div className="flex items-center mt-4">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {lecturer?.name.charAt(0) || "?"}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {lecturer?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">Lecturer</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-400 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          <span className="text-sm text-gray-600">
                            {course.studentIds.length} students
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            href={`/courses/${course.id}/grades`}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 p-1"
                          >
                            Grades
                          </Link>
                          <Link
                            href={`/courses/${course.id}/grading-schema`}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 p-1"
                          >
                            Schema
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Suspense>
      </main>
    </div>
  );
}
