"use client";
// src/app/assignments/[id]/submit/page.tsx

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { assignments } from "@/data";

export default function SubmitAssignmentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const assignmentId = params.id;

  const assignment = assignments.find((a) => a.id === assignmentId);

  const [content, setContent] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  if (!assignment) {
    return <div className="p-4">Assignment not found</div>;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // In a real app, this would send the data to the server
    // Since we're using mock data, we'll just redirect back
    router.push(`/assignments/${assignmentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Submit Assignment
          </h1>
          <Link
            href={`/assignments/${assignmentId}`}
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
              <p className="text-sm text-gray-500">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Submission Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700"
              >
                Attachment (optional)
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Submit Assignment
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
