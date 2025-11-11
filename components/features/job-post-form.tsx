"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createJob } from "@/actions/job-actions";
import { Button } from "@/components/ui/button";

export function JobPostForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);

    try {
      // Get skills from form (comma-separated)
      const skillsInput = formData.get("skills") as string;
      const skills = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const result = await createJob({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        company: formData.get("company") as string,
        location: formData.get("location") as string,
        jobType: formData.get("jobType") as string,
        requiredSkills: skills,
        yearsOfExperience: formData.get("yearsOfExperience")
          ? parseInt(formData.get("yearsOfExperience") as string)
          : undefined,
        salaryMin: formData.get("salaryMin")
          ? parseInt(formData.get("salaryMin") as string)
          : undefined,
        salaryMax: formData.get("salaryMax")
          ? parseInt(formData.get("salaryMax") as string)
          : undefined,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard/jobs");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Company Name"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., San Francisco, CA or Remote"
          />
        </div>

        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
            Job Type *
          </label>
          <select
            id="jobType"
            name="jobType"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="yearsOfExperience"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Years of Experience
          </label>
          <input
            type="number"
            id="yearsOfExperience"
            name="yearsOfExperience"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5"
          />
        </div>

        <div>
          <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
            Salary Range (Min)
          </label>
          <input
            type="number"
            id="salaryMin"
            name="salaryMin"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 80000"
          />
        </div>

        <div>
          <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
            Salary Range (Max)
          </label>
          <input
            type="number"
            id="salaryMax"
            name="salaryMax"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 120000"
          />
        </div>
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills * (comma-separated)
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., JavaScript, React, Node.js, TypeScript"
        />
        <p className="mt-1 text-sm text-gray-500">
          Separate multiple skills with commas
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Job Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the job responsibilities, requirements, and qualifications..."
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Creating..." : "Post Job"}
        </Button>
        <Link href="/dashboard/jobs">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}

