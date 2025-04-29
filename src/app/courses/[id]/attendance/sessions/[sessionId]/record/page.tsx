// src/app/courses/[courseId]/attendance/sessions/[sessionId]/record/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  courses,
  users,
  attendanceSessions,
  attendanceRecords
} from "@/data";

export default function RecordAttendancePage({
  params
}: {
  params: { courseId: string; sessionId: string }
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentIdParam = searchParams.get('studentId');

  const { courseId, sessionId } = params;

  const course = courses.find((c) => c.id === courseId);
  const session = attendanceSessions.find((s) => s.id === sessionId);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentIdParam || "");
  const [status, setStatus] = useState<"present" | "absent" | "late" | "excused">("present");
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const students = users.filter(
    (user) => course?.studentIds.includes(user.id) && user.role === "student"
  );

  useEffect(() => {
    if (studentIdParam && students.some(s => s.id === studentIdParam)) {
      // Check if there's an existing record for this student
      const existingRecord = attendanceRecords.find(
        r => r.sessionId === sessionId && r.studentId === studentIdParam
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
      r => r.sessionId === sessionId && r.studentId === selectedStudentId
    );

    if (existingRecordIndex >= 0) {
      // Update existing record (in a real app)
      setSuccess(`Attendance record updated for ${
        students.find(s => s.id === selectedStudentId)?.name
      }`);
    } else {
      // Create new record (in a real app)
      setSuccess(`Attendance recorded for ${
        students.find(s => s.id === selectedStudentId)?.name
      }`);
    }

    // In a real app, we'd redirect after successful save
    setTimeout(() => {
      router.push(`/courses/${courseId}/attendance/sessions/${sessionId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Record Attendance</h1>
            <p className="text-sm text-gray-500">{session.title} - {course.title}</p>
          </div>
          <Link
            href={`/courses/${courseId}/attendance/sessions/${sessionId}`}
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
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
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
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="
