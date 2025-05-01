import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Group from '../components/Group';
import './Search.css';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const classes = [
    "CSCI 201 - Principles of Software Development",
    "MATH 125 - Calculus I",
    "PHYS 151 - Fundamentals of Physics I",
    "EE 109 - Introduction to Embedded Systems",
    "WRIT 150 - Writing and Critical Reasoning",
    "ITP 115 - Programming in Python",
    "CSCI 270 - Introduction to Algorithms",
    "BUAD 304 - Organizational Behavior",
    "ECON 203 - Principles of Microeconomics",
    "PSYC 100 - Introduction to Psychology",
  ];

  const groups = {
    "CSCI 201 - Principles of Software Development": [
      {
        name: "Group 1",
        course: "CSCI 201 - Principles of Software Development",
        members: 4,
        meetingTime: "Sundays at 3PM",
        description: "Working on Lab 5 together.",
        contact: "group1@usc.edu"
      },
      {
        name: "Group 2",
        course: "CSCI 201 - Principles of Software Development",
        members: 6,
        meetingTime: "Tuesdays at 5PM",
        description: "Focusing on the midterm review.",
        contact: "group2@usc.edu"
      }
    ],
    "MATH 125 - Calculus I": [
      {
        name: "Study Squad",
        course: "MATH 125 - Calculus I",
        members: 3,
        meetingTime: "Fridays at 2PM",
        description: "Going over integration techniques.",
        contact: "studysquad@usc.edu"
      },
      {
        name: "Limits Legends",
        course: "MATH 125 - Calculus I",
        members: 5,
        meetingTime: "Mondays at 4PM",
        description: "Limit laws practice and quizzes.",
        contact: "limitslegends@usc.edu"
      }
    ],
    "PHYS 151 - Fundamentals of Physics I": [
      {
        name: "Physics Gurus",
        course: "PHYS 151 - Fundamentals of Physics I",
        members: 4,
        meetingTime: "Thursdays at 6PM",
        description: "Working through problem sets together.",
        contact: "physicsgurus@usc.edu"
      }
    ],
    "EE 109 - Introduction to Embedded Systems": [
      {
        name: "Embedded Enthusiasts",
        course: "EE 109 - Introduction to Embedded Systems",
        members: 5,
        meetingTime: "Wednesdays at 7PM",
        description: "Helping each other with Arduino labs.",
        contact: "embedded@usc.edu"
      }
    ]
  };

  const filteredClasses = classes.filter((className) =>
    className.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filteredClasses.map((className, index) => (
              <div
                key={index}
                className={`class-card ${selectedClass === className ? "selected-card" : ""}`}
              >
                {className}
                <button
                  className="view-groups-button"
                  onClick={() => setSelectedClass(className)}
                >
                  View Groups
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="right-column">
          {selectedClass ? (
            <>
              <h2 className="groups-title">Groups for {selectedClass}</h2>
              <ul className="group-list">
                {groups[selectedClass] ? (
                  groups[selectedClass].map((group, idx) => (
                    <Group
                      key={idx}
                      name={group.name}
                      course={group.course}
                      members={group.members}
                      meetingTime={group.meetingTime}
                      description={group.description}
                      contact={group.contact || 'Not provided'}
                    />
                  ))
                ) : (
                  <div className='noGroupsMessage'>
                    Create a group in the groups page!
                  </div>
                )}
              </ul>
            </>
          ) : (
            <h2 className="groups-title">Select a class to view groups</h2>
          )}
        </div>
      </div>
    </>
  );
}
