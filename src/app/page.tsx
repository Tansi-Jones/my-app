// src/app/page.tsx

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Learning Management System
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/courses"
              className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-blue-700">Courses</h2>
              <p className="mt-2 text-gray-600">
                Browse and manage available courses
              </p>
            </Link>
            <Link
              href="/assignments"
              className="bg-green-50 p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-green-700">
                Assignments
              </h2>
              <p className="mt-2 text-gray-600">
                View and submit course assignments
              </p>
            </Link>
            <Link
              href="/grades"
              className="bg-purple-50 p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-purple-700">Grades</h2>
              <p className="mt-2 text-gray-600">
                Check grades and generate transcripts
              </p>
            </Link>
            <Link
              href="/transcripts"
              className="bg-red-50 p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-red-700">
                Transcripts
              </h2>
              <p className="mt-2 text-gray-600">
                Request and view official transcripts
              </p>
            </Link>
            ;
          </div>
        </div>
      </main>
    </div>
  );
}
