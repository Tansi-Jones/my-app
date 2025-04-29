// src/app/courses/[id]/attendance/sessions/[sessionId]/record/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { courses, users, attendanceSessions, attendanceRecords } from "@/data";

export default function RecordAttendancePage({
  params,
}: {
  params: { id: string; sessionId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentIdParam = searchParams.get("studentId");

  const { id, sessionId } = params;

  const course = courses.find((c) => c.id === id);
  const session = attendanceSessions.find((s) => s.id === sessionId);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    studentIdParam || ""
  );
  const [status, setStatus] = useState<
    "present" | "absent" | "late" | "excused"
  >("present");
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const students = users.filter(
    (user) => course?.studentIds.includes(user.id) && user.role === "student"
  );

  useEffect(() => {
    if (studentIdParam && students.some((s) => s.id === studentIdParam)) {
      // Check if there's an existing record for this student
      const existingRecord = attendanceRecords.find(
        (r) => r.sessionId === sessionId && r.studentId === studentIdParam
      );

      if (existingRecord) {
        setStatus(existingRecord.status);
        setNotes(existingRecord.notes || "");
      }
    }
  }, [studentIdParam, sessionId, students]);

  if (!course || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2">Course or session not found</p>
          <Link
            href="/courses"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedStudentId) {
      setError("Please select a student");
      return;
    }

    // In a real app, this would be an API call
    // For now we'll just simulate saving the record

    // Check if we're updating an existing record
    const existingRecordIndex = attendanceRecords.findIndex(
      (r) => r.sessionId === sessionId && r.studentId === selectedStudentId
    );

    if (existingRecordIndex >= 0) {
      // Update existing record (in a real app)
      setSuccess(
        `Attendance record updated for ${
          students.find((s) => s.id === selectedStudentId)?.name
        }`
      );
    } else {
      // Create new record (in a real app)
      setSuccess(
        `Attendance recorded for ${
          students.find((s) => s.id === selectedStudentId)?.name
        }`
      );
    }

    // In a real app, we'd redirect after successful save
    setTimeout(() => {
      router.push(`/courses/${id}/attendance/sessions/${sessionId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Record Attendance
            </h1>
            <p className="text-sm text-gray-500">
              {session.title} - {course.title}
            </p>
          </div>
          <Link
            href={`/courses/${id}/attendance/sessions/${sessionId}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Session
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="student"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Student
                  </label>
                  <select
                    id="student"
                    name="student"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    disabled={!!studentIdParam}
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["present", "late", "absent", "excused"].map(
                      (statusOption) => (
                        <div key={statusOption} className="flex items-center">
                          <input
                            id={statusOption}
                            name="status"
                            type="radio"
                            checked={status === statusOption}
                            onChange={() => setStatus(statusOption as any)}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label
                            htmlFor={statusOption}
                            className="ml-3 block text-sm font-medium text-gray-700 capitalize"
                          >
                            {statusOption}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Notes (optional)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Add any relevant notes about this attendance record"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/courses/${id}/attendance/sessions/${sessionId}`}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
