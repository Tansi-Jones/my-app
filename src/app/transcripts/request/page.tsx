"use client";
// src/app/transcripts/request/page.tsx

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { users } from "@/data";

export default function RequestTranscriptPage() {
  const router = useRouter();
  const students = users.filter((user) => user.role === "student");

  const [studentId, setStudentId] = useState<string>("");
  const [format, setFormat] = useState<"detailed" | "summary">("detailed");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // In a real app, this would send the data to the server
    // Since we're using mock data, we'll just redirect back
    router.push("/transcripts");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Request Transcript
          </h1>
          <Link
            href="/transcripts"
            className="text-blue-600 hover:text-blue-800"
          >
            Cancel
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="student"
                className="block text-sm font-medium text-gray-700"
              >
                Student
              </label>
              <select
                id="student"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Transcript Format
              </label>
              <div className="mt-2">
                <div className="flex items-center mb-2">
                  <input
                    id="detailed"
                    name="format"
                    type="radio"
                    checked={format === "detailed"}
                    onChange={() => setFormat("detailed")}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label
                    htmlFor="detailed"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Detailed (includes all assignments and grades)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="summary"
                    name="format"
                    type="radio"
                    checked={format === "summary"}
                    onChange={() => setFormat("summary")}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label
                    htmlFor="summary"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Summary (only course totals and GPA)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Request Transcript
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
