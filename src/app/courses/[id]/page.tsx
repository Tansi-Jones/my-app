// src/app/courses/[id]/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { courses, users, assignments } from "@/data";
import { notFound } from "next/navigation";

export default function CoursePage({ params }: { params: { id: string } }) {
  const courseId = params.id;
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    notFound();
  }

  const lecturer = users.find((user) => user.id === course.lecturerId);
  const students = users.filter((user) => course.studentIds.includes(user.id));
  const courseAssignments = assignments.filter((a) => a.courseId === courseId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <Link href="/courses" className="text-blue-600 hover:text-blue-800">
            Back to Courses
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<p>Loading course details...</p>}>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Course Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {course.description}
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href={`/courses/${courseId}/grading-schema`}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm hover:bg-indigo-200"
                >
                  Grading Schema
                </Link>
                <Link
                  href={`/courses/${courseId}/grades`}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm hover:bg-green-200"
                >
                  View Grades
                </Link>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Lecturer
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lecturer?.name || "Unknown"}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Students
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {students.map((student) => (
                        <li
                          key={student.id}
                          className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                        >
                          <div className="w-0 flex-1 flex items-center">
                            <span className="ml-2 flex-1 w-0 truncate">
                              {student.name}
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <Link
                              href={`/students/${student.id}/transcript?courseId=${course.id}`}
                              className="font-medium text-blue-600 hover:text-blue-500"
                            >
                              View Transcript
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Assignments
              </h2>
              <Link
                href={`/assignments/create?courseId=${course.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Add Assignment
              </Link>
            </div>
            {courseAssignments.length === 0 ? (
              <p className="text-gray-500">
                No assignments for this course yet.
              </p>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {courseAssignments.map((assignment) => (
                    <li key={assignment.id}>
                      <Link
                        href={`/assignments/${assignment.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {assignment.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Due:{" "}
                                {new Date(
                                  assignment.dueDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                Max Points: {assignment.maxPoints}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Suspense>
      </main>
    </div>
  );
}
