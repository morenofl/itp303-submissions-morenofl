import React, { useContext, useState } from 'react';
import { UserContext } from '../components/UserContext';
import Navbar from '../components/Navbar';
import Group from '../components/Group';
import './Groups.css';
import Confirm from '../components/Confirm';
import CreateGroup from '../components/CreateGroup';

export default function GroupsPage() {
  const { isLoggedIn, userGroups, setUserGroups } = useContext(UserContext);

  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const [groupDetailsMap, setGroupDetailsMap] = useState({
    "Group 1": {
      course: "CSCI 201 - Principles of Software Development",
      members: 4,
      meetingTime: "Sundays at 3PM",
      description: "Working on Lab 5 together.",
      contact: "group1@usc.edu"
    },
    "Group 2": {
      course: "CSCI 201 - Principles of Software Development",
      members: 6,
      meetingTime: "Tuesdays at 5PM",
      description: "Focusing on the midterm review.",
      contact: "cs201study@usc.edu"
    },
    "Study Squad": {
      course: "MATH 125 - Calculus I",
      members: 3,
      meetingTime: "Fridays at 2PM",
      description: "Going over integration techniques.",
      contact: "math125help@usc.edu"
    },
    "Limits Legends": {
      course: "MATH 125 - Calculus I",
      members: 5,
      meetingTime: "Mondays at 4PM",
      description: "Limit laws practice and quizzes.",
      contact: "limitslegends@usc.edu"
    },
    "Physics Gurus": {
      course: "PHYS 151 - Fundamentals of Physics I",
      members: 4,
      meetingTime: "Thursdays at 6PM",
      description: "Working through problem sets together.",
      contact: "physgurus@usc.edu"
    },
    "Embedded Enthusiasts": {
      course: "EE 109 - Introduction to Embedded Systems",
      members: 5,
      meetingTime: "Wednesdays at 7PM",
      description: "Helping each other with Arduino labs.",
      contact: "ee109team@usc.edu"
    }
  });
  

  const handleCreateClick = () => {
    setShowCreatePopup(true);
  };

  const confirmCreate = () => {
    setShowCreatePopup(false);
    alert('Group creation coming soon!');
  };

  const cancelCreate = () => {
    setShowCreatePopup(false);
  };

  return (
    <>
      <Navbar />
      <div className="search-page-body">
        <div className="left-column">
          <h2 className="search-title">My Groups</h2>
          {isLoggedIn ? (
            <>
              <ul className="group-list">
                {userGroups.length > 0 ? (
                  userGroups.map((groupName, index) => {
                    const groupInfo = groupDetailsMap[groupName];
                    return (
                      <Group
                        key={index}
                        name={groupName}
                        course={groupInfo?.course || 'Unspecified Course'}
                        members={groupInfo?.members || 'N/A'}
                        meetingTime={groupInfo?.meetingTime || 'TBD'}
                        description={groupInfo?.description || 'No description available.'}
                        contact={groupInfo?.contact || 'No contact provided.'}
                      />
                    );
                  })
                ) : (
                  <div className="groupPageMessage">
                    Use the Search Page to join study groups! Or create a group below!

                  </div>
                )}
              </ul>

              {/* Create Group Button */}
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="pinkButton" onClick={handleCreateClick}>
                  Create Group
                </button>
              </div>
            </>
          ) : (
            <div className="groupPageMessage">
              Please log in to view your groups.
            </div>
          )}

          {/* Create Group Popup */}
          {showCreatePopup && (
            <CreateGroup
              onSubmit={(newGroup) => {
                const newGroupName = newGroup.name.trim();

                // Add group name to user's list
                if (newGroupName && !userGroups.includes(newGroupName)) {
                  setUserGroups([...userGroups, newGroupName]);
                }

                // Optionally add it to groupDetailsMap if made stateful in future

                setShowCreatePopup(false);
                alert(`Created group: ${newGroupName}`);
              }}
              onCancel={cancelCreate}
            />
          )}
        </div>
      </div>
    </>
  );
}
