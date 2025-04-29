// src/app/transcripts/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { transcriptRequests, users } from "@/data";

export default function TranscriptsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Transcript Requests
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Requests</h2>
          <Link
            href="/transcripts/request"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            Request New Transcript
          </Link>
        </div>

        <Suspense fallback={<p>Loading transcript requests...</p>}>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {transcriptRequests.map((request) => {
                const student = users.find((u) => u.id === request.studentId);
                return (
                  <li key={request.id}>
                    <div className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {student?.name || "Unknown Student"}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {request.status === "completed"
                                ? "Completed"
                                : "Pending"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Format:{" "}
                              {request.format === "detailed"
                                ? "Detailed"
                                : "Summary"}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Requested:{" "}
                              {new Date(
                                request.requestDate
                              ).toLocaleDateString()}
                            </p>
                            {request.status === "completed" && (
                              <Link
                                href={`/transcripts/${request.id}`}
                                className="ml-4 text-blue-600 hover:text-blue-800"
                              >
                                View
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Suspense>
      </main>
    </div>
  );
}
