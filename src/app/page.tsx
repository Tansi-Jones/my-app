// src/app/page.tsx

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600">
            EduFlow
          </h1>
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/courses"
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Courses
            </Link>
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
          </nav>
          <div className="flex items-center space-x-4">
            <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">JS</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Learning Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access all your academic resources in one place
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/courses" className="group">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-transparent hover:border-indigo-100 h-full">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600 group-hover:text-white"
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Courses
              </h2>
              <p className="text-gray-600">Browse and manage your courses</p>
            </div>
          </Link>

          <Link href="/assignments" className="group">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-transparent hover:border-green-100 h-full">
              <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600 group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Assignments
              </h2>
              <p className="text-gray-600">View and submit your assignments</p>
            </div>
          </Link>

          <Link href="/grades" className="group">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-transparent hover:border-purple-100 h-full">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600 group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Grades
              </h2>
              <p className="text-gray-600">Check your academic progress</p>
            </div>
          </Link>

          <Link href="/transcripts" className="group">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-transparent hover:border-rose-100 h-full">
              <div className="w-12 h-12 bg-rose-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-rose-600 group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Transcripts
              </h2>
              <p className="text-gray-600">Request and view your transcripts</p>
            </div>
          </Link>
        </div>

        <div className="mt-16 bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-4">
            <h3 className="text-lg font-medium text-white">
              Academic Calendar
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">15</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Final Exam - Intro to CS
                  </h4>
                  <p className="text-sm text-gray-500">
                    May 15, 2025 • 9:00 AM
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">20</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Assignment Due - Web Dev
                  </h4>
                  <p className="text-sm text-gray-500">
                    May 20, 2025 • 11:59 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">25</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Data Structures Submission
                  </h4>
                  <p className="text-sm text-gray-500">
                    May 25, 2025 • 11:59 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
