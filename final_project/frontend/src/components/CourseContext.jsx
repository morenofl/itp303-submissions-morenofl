import React, { createContext, useState, useEffect } from 'react';

export const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [coursesData, setCoursesData] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('https://final-project-ro9j.onrender.com/api/courses'); 
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
		
        setCoursesData(data);
      } catch (err) {
        console.error('Error loading courses:', err);
        setError(err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider value={{ coursesData, loadingCourses, error }}>
      {children}
    </CourseContext.Provider>
  );
}