"use client";
// src/app/courses/[id]/grading-schema/page.tsx

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { courses, gradingSchemas, users } from "@/data";
import {
  CourseGradingSchema,
  GradeComponent,
  GradeComponentType,
} from "@/types";

const componentTypes: GradeComponentType[] = [
  "midterm",
  "final",
  "assignment",
  "quiz",
  "project",
  "lab",
  "participation",
  "presentation",
  "other",
];

export default function CourseGradingSchemaPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState(() =>
    courses.find((c) => c.id === courseId)
  );
  const [lecturer, setLecturer] = useState<any>(null);
  const [schema, setSchema] = useState<CourseGradingSchema | null>(null);
  const [components, setComponents] = useState<GradeComponent[]>([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [error, setError] = useState("");
  const [newComponent, setNewComponent] = useState<GradeComponent>({
    id: `comp${Date.now()}`,
    name: "",
    type: "assignment",
    weight: 0,
    maxPoints: 100,
    description: "",
  });

  // Load existing schema if any
  useEffect(() => {
    if (courseId) {
      const existingSchema = gradingSchemas.find(
        (s) => s.courseId === courseId
      );
      if (existingSchema) {
        setSchema(existingSchema);
        setComponents(existingSchema.components);
        calculateTotalWeight(existingSchema.components);
      }

      // Find lecturer
      if (course) {
        const lecturerData = users.find((u) => u.id === course.lecturerId);
        setLecturer(lecturerData);
      }
    }
  }, [courseId, course]);

  // Calculate total weight whenever components change
  useEffect(() => {
    calculateTotalWeight(components);
  }, [components]);

  const calculateTotalWeight = (comps: GradeComponent[]) => {
    const total = comps.reduce((sum, comp) => sum + comp.weight, 0);
    setTotalWeight(total);
    if (total !== 100 && comps.length > 0) {
      setError(`Total weight is ${total}%, should be 100%`);
    } else {
      setError("");
    }
  };

  const handleNewComponentChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewComponent((prev) => ({
      ...prev,
      [name]: name === "weight" || name === "maxPoints" ? Number(value) : value,
    }));
  };

  const handleAddComponent = (e: FormEvent) => {
    e.preventDefault();

    if (!newComponent.name.trim()) {
      setError("Component name is required");
      return;
    }

    setComponents([...components, newComponent]);
    setNewComponent({
      id: `comp${Date.now()}`,
      name: "",
      type: "assignment",
      weight: 0,
      maxPoints: 100,
      description: "",
    });
  };

  const handleSaveSchema = (e: FormEvent) => {
    e.preventDefault();

    if (totalWeight !== 100) {
      setError(`Total weight must be 100% (currently ${totalWeight}%)`);
      return;
    }

    // In a real app, this would save to a database
    console.log("Saving schema:", {
      id: schema?.id || `gs${Date.now()}`,
      courseId,
      components,
      createdAt: schema?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Redirect back to course page
    router.push(`/courses/${courseId}`);
  };

  const handleComponentChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newComponents = [...components];
    newComponents[index] = {
      ...newComponents[index],
      [field]:
        field === "weight" || field === "maxPoints" ? Number(value) : value,
    };
    setComponents(newComponents);
  };

  const handleRemoveComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  if (!course) {
    return <div className="p-4">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Grading Schema for {course.title}
          </h1>
          <div className="flex items-center space-x-4">
            <Link
              href={`/courses/${courseId}/grades`}
              className="text-green-600 hover:text-green-800"
            >
              View Grades
            </Link>
            <Link
              href={`/courses/${courseId}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Course
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Course: {course.title}
            </h2>
            <p className="text-sm text-gray-500">
              Lecturer: {lecturer?.name || "Unknown"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Current Grading Components
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight (%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {components.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No grading components defined yet.
                      </td>
                    </tr>
                  ) : (
                    components.map((component, index) => (
                      <tr key={component.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={component.name}
                            onChange={(e) =>
                              handleComponentChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <select
                            value={component.type}
                            onChange={(e) =>
                              handleComponentChange(
                                index,
                                "type",
                                e.target.value
                              )
                            }
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            {componentTypes.map((type) => (
                              <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={component.weight}
                            onChange={(e) =>
                              handleComponentChange(
                                index,
                                "weight",
                                e.target.value
                              )
                            }
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            min="0"
                            value={component.maxPoints}
                            onChange={(e) =>
                              handleComponentChange(
                                index,
                                "maxPoints",
                                e.target.value
                              )
                            }
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={component.description || ""}
                            onChange={(e) =>
                              handleComponentChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleRemoveComponent(index)}
                            className="text-red-600 hover:text-red-800"
                            type="button"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-gray-50">
                    <td
                      colSpan={2}
                      className="px-6 py-4 text-right text-sm font-medium text-gray-900"
                    >
                      Total Weight:
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-medium ${
                        totalWeight === 100 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {totalWeight}%
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8 bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add New Component
            </h3>
            <form
              onSubmit={handleAddComponent}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Component Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newComponent.name}
                  onChange={handleNewComponentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={newComponent.type}
                  onChange={handleNewComponentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {componentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight (%)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="0"
                  max="100"
                  value={newComponent.weight}
                  onChange={handleNewComponentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="maxPoints"
                  className="block text-sm font-medium text-gray-700"
                >
                  Max Points
                </label>
                <input
                  type="number"
                  id="maxPoints"
                  name="maxPoints"
                  min="0"
                  value={newComponent.maxPoints}
                  onChange={handleNewComponentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  value={newComponent.description}
                  onChange={handleNewComponentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  Add Component
                </button>
              </div>
            </form>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveSchema}
              disabled={totalWeight !== 100}
              className={`px-4 py-2 rounded-md text-sm ${
                totalWeight === 100
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }`}
            >
              Save Grading Schema
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
