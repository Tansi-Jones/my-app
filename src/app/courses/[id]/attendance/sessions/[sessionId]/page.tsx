// src/app/courses/[id]/attendance/sessions/[sessionId]/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { courses, users, attendanceSessions, attendanceRecords } from "@/data";
import { notFound } from "next/navigation";

export default function SessionDetailPage({
  params,
}: {
  params: { id: string; sessionId: string };
}) {
  const { id, sessionId } = params;

  const course = courses.find((c) => c.id === id);
  const session = attendanceSessions.find((s) => s.id === sessionId);

  if (!course || !session) {
    notFound();
  }

  const students = users.filter(
    (user) => course.studentIds.includes(user.id) && user.role === "student"
  );

  // Get records for this session
  const sessionRecords = attendanceRecords.filter(
    (record) => record.sessionId === sessionId
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {session.title}
            </h1>
            <p className="text-sm text-gray-500">{course.title}</p>
          </div>
          <Link
            href={`/courses/${id}/attendance`}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Attendance
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<p>Loading session details...</p>}>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Session Details
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {session.date}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Time</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {session.startTime} - {session.endTime}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {session.description || "No description provided"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Attendance Records
              </h2>
              <Link
                href={`/courses/${id}/attendance/sessions/${sessionId}/record`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Take Attendance
              </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Notes
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const record = sessionRecords.find(
                      (r) => r.studentId === student.id
                    );

                    const statusColors = {
                      present: "bg-green-100 text-green-800",
                      absent: "bg-red-100 text-red-800",
                      late: "bg-yellow-100 text-yellow-800",
                      excused: "bg-gray-100 text-gray-800",
                    };

                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record ? (
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                statusColors[record.status]
                              }`}
                            >
                              {record.status.charAt(0).toUpperCase() +
                                record.status.slice(1)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Not recorded
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record?.timestamp
                            ? new Date(record.timestamp).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {record?.notes || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/courses/${id}/attendance/sessions/${sessionId}/record?studentId=${student.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {record ? "Edit" : "Record"}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  );
}
