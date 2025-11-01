import React, { useEffect } from "react";
import useStore from "../store/useStore";
import SearchBar from "./SearchBar";

const CourseList: React.FC = () => {
  const { courses, loadCourses } = useStore();

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Courses</h2>
      <SearchBar />
      <ul className="mt-2">
        {courses.map((c) => (
          <li key={c.course_id} className="border-b py-2">
            <strong>{c.title}</strong> — {c.instructor} ({c.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
