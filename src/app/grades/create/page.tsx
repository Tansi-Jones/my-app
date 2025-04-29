"use client";
// src/app/grades/create/page.tsx

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { assignments, submissions, users } from "@/data";

export default function CreateGradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const submissionId = searchParams.get("submissionId") || "";
  const assignmentId = searchParams.get("assignmentId") || "";

  const submission = submissions.find((s) => s.id === submissionId);
  const assignment = assignments.find((a) => a.id === assignmentId);
  const student = submission
    ? users.find((u) => u.id === submission.studentId)
    : null;

  const [points, setPoints] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  if (!submission || !assignment || !student) {
    return <div className="p-4">Invalid submission or assignment</div>;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // In a real app, this would send the data to the server
    // Since we're using mock data, we'll just redirect back
    router.push(`/assignments/${assignmentId}/submissions/${submissionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Grade Submission</h1>
          <Link
            href={`/assignments/${assignmentId}/submissions/${submissionId}`}
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
              <h2 className="text-lg font-medium text-gray-900">
                {assignment.title}
              </h2>
              <p className="text-sm text-gray-500">Student: {student.name}</p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="points"
                className="block text-sm font-medium text-gray-700"
              >
                Points (Max: {assignment.maxPoints})
              </label>
              <input
                type="number"
                id="points"
                min="0"
                max={assignment.maxPoints}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="feedback"
                className="block text-sm font-medium text-gray-700"
              >
                Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Submit Grade
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
