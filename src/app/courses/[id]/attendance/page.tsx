// src/app/courses/[id]/attendance/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { courses, users, attendanceSessions } from "@/data";
import { getStudentAttendanceRate, getCourseAttendanceStats } from "@/types";
import { notFound } from "next/navigation";

export default function CourseAttendancePage({
  params,
}: {
  params: { id: string };
}) {
  const courseId = params.id;
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    notFound();
  }

  const sessions = attendanceSessions.filter(
    (session) => session.courseId === courseId
  );
  const students = users.filter(
    (user) => course.studentIds.includes(user.id) && user.role === "student"
  );
  const stats = getCourseAttendanceStats(courseId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance: {course.title}
          </h1>
          <Link
            href={`/courses/${courseId}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Course
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<p>Loading attendance data...</p>}>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Attendance Overview
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Summary of attendance statistics for this course
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Overall</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stats.attendanceRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-green-500">Present</p>
                  <p className="mt-1 text-2xl font-semibold text-green-600">
                    {stats.presentRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-yellow-500">Late</p>
                  <p className="mt-1 text-2xl font-semibold text-yellow-600">
                    {stats.lateRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-red-500">Absent</p>
                  <p className="mt-1 text-2xl font-semibold text-red-600">
                    {stats.absentRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Sessions</h2>
              <Link
                href={`/courses/${courseId}/attendance/create-session`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Create Session
              </Link>
            </div>

            {sessions.length === 0 ? (
              <p className="text-gray-500">
                No attendance sessions created yet.
              </p>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <li key={session.id}>
                      <Link
                        href={`/courses/${courseId}/attendance/sessions/${session.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {session.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {session.date}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {session.startTime} - {session.endTime}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                {session.description ||
                                  "No description provided"}
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

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Student Attendance
            </h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {students.map((student) => {
                  const attendanceRate = getStudentAttendanceRate(
                    student.id,
                    courseId
                  );
                  let rateColor = "text-red-600";
                  if (attendanceRate >= 90) rateColor = "text-green-600";
                  else if (attendanceRate >= 75) rateColor = "text-yellow-600";

                  return (
                    <li key={student.id}>
                      <Link
                        href={`/courses/${courseId}/attendance/students/${student.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {student.name}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p
                                className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${rateColor
                                  .replace("text", "bg")
                                  .replace("600", "100")} ${rateColor}`}
                              >
                                {attendanceRate.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {student.email}
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
          </div>
        </Suspense>
      </main>
    </div>
  );
}
