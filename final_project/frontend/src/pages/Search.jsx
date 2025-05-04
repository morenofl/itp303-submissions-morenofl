import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Group from '../components/Group';
import './Search.css';
import { CourseContext } from '../components/CourseContext';

export default function Search() {
  const { coursesData } = useContext(CourseContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  const unifiedCourses = coursesData.map(course => ({
    id: course.course_id,
    label: `${course.code} ${course.number} - ${course.title}`
  }));

  const filteredCourses = unifiedCourses.filter((cls) =>
    cls.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewGroups = async (course) => {
    setSelectedCourse(course);
    setGroupList([]);
    setLoadingGroups(true);

    try {
      const res = await fetch(`http://localhost:3000/api/groups/${course.id}`);
      if (!res.ok) throw new Error("Failed to fetch groups");
      const data = await res.json();
      setGroupList(data || []);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setGroupList([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="search-page-body">
        <div className="left-column">
          <h2 className="search-title">Find Your Class</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search for a class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="class-grid">
            {filteredCourses.slice(0, 10).map((course) => (
              <div
                key={course.id}
                className={`class-card ${selectedCourse?.id === course.id ? "selected-card" : ""}`}
              >
                {course.label}
                <button
                  className="view-groups-button"
                  onClick={() => handleViewGroups(course)}
                >
                  View Groups
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="right-column">
          {selectedCourse ? (
            <>
              <h2 className="groups-title">Groups for {selectedCourse.label}</h2>
              {loadingGroups ? (
                <p>Loading groups...</p>
              ) : (
                <ul className="group-list">
                  {groupList.length > 0 ? (
                    groupList.map((group, idx) => (
                      <Group
                        key={idx}
                        name={group.name}
                        group={group}
                      />
                    ))
                  ) : (
                    <div className="noGroupsMessage">
                      No groups yet. Create one in the Groups page!
                    </div>
                  )}
                </ul>
              )}
            </>
          ) : (
            <h2 className="groups-title">Select a class to view groups</h2>
          )}
        </div>
      </div>
    </>
  );
}
