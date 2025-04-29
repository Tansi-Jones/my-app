// src/app/assignments/[id]/page.tsx

import Link from "next/link";
import { Suspense } from "react";
import { assignments, courses, submissions, users } from "@/data";
import { notFound } from "next/navigation";

export default function AssignmentPage({ params }: { params: { id: string } }) {
  const assignmentId = params.id;
  const assignment = assignments.find((a) => a.id === assignmentId);

  if (!assignment) {
    notFound();
  }

  const course = courses.find((c) => c.id === assignment.courseId);
  const assignmentSubmissions = submissions.filter(
    (s) => s.assignmentId === assignmentId
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {assignment.title}
          </h1>
          <Link
            href={`/courses/${assignment.courseId}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Course
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<p>Loading assignment details...</p>}>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Assignment Details
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {course?.title || "Unknown Course"}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {assignment.description}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Due Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Maximum Points
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {assignment.maxPoints}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Submissions
              </h2>
              <Link
                href={`/assignments/${assignment.id}/submit`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Submit Assignment
              </Link>
            </div>
            {assignmentSubmissions.length === 0 ? (
              <p className="text-gray-500">
                No submissions for this assignment yet.
              </p>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {assignmentSubmissions.map((submission) => {
                    const student = users.find(
                      (u) => u.id === submission.studentId
                    );
                    return (
                      <li key={submission.id}>
                        <Link
                          href={`/assignments/${assignmentId}/submissions/${submission.id}`}
                          className="block hover:bg-gray-50"
                        >
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {student?.name || "Unknown Student"}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Submitted:{" "}
                                  {new Date(
                                    submission.submittedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </Suspense>
      </main>
    </div>
  );
}
