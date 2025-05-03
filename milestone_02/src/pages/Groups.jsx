import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../components/UserContext';
import Navbar from '../components/Navbar';
import Group from '../components/Group';
import './Groups.css';
import CreateGroup from '../components/CreateGroup';
import Confirm from '../components/Confirm';

export default function GroupsPage() {
  const { isLoggedIn, userGroups, setUserGroups, email: currentUserEmail } = useContext(UserContext);

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  const [groupDetailsMap, setGroupDetailsMap] = useState({
    "Group 1": {
      course: "CSCI 201 - Principles of Software Development",
      members: 4,
      meetingTime: "Sundays at 3PM",
      description: "Working on Lab 5 together.",
      contact: "group1@usc.edu",
      creatorEmail: "group1@usc.edu"
    },
    "Group 2": {
      course: "CSCI 201 - Principles of Software Development",
      members: 6,
      meetingTime: "Tuesdays at 5PM",
      description: "Focusing on the midterm review.",
      contact: "cs201study@usc.edu",
      creatorEmail: "cs201study@usc.edu"
    },
    "Study Squad": {
      course: "MATH 125 - Calculus I",
      members: 3,
      meetingTime: "Fridays at 2PM",
      description: "Going over integration techniques.",
      contact: "math125help@usc.edu",
      creatorEmail: "math125help@usc.edu"
    },
    "Limits Legends": {
      course: "MATH 125 - Calculus I",
      members: 5,
      meetingTime: "Mondays at 4PM",
      description: "Limit laws practice and quizzes.",
      contact: "limitslegends@usc.edu",
      creatorEmail: "limitslegends@usc.edu"
    },
    "Physics Gurus": {
      course: "PHYS 151 - Fundamentals of Physics I",
      members: 4,
      meetingTime: "Thursdays at 6PM",
      description: "Working through problem sets together.",
      contact: "physgurus@usc.edu",
      creatorEmail: "physgurus@usc.edu"
    },
    "Embedded Enthusiasts": {
      course: "EE 109 - Introduction to Embedded Systems",
      members: 5,
      meetingTime: "Wednesdays at 7PM",
      description: "Helping each other with Arduino labs.",
      contact: "ee109team@usc.edu",
      creatorEmail: "ee109team@usc.edu"
    },
    
    
  });

  // Sync userGroups with existing groupDetailsMap
  useEffect(() => {
    const existing = Object.keys(groupDetailsMap);
    const filtered = userGroups.filter(name => existing.includes(name));
    if (filtered.length !== userGroups.length) {
      setUserGroups(filtered);
    }
  }, []);

  const handleCreateClick = () => setShowCreatePopup(true);
  const cancelCreate = () => setShowCreatePopup(false);

  const handleRequestDelete = (groupName) => setGroupToDelete(groupName);
  const cancelDeleteGroup = () => setGroupToDelete(null);

  const confirmDeleteGroup = () => {
    if (!groupToDelete) return;
    setUserGroups(prev => prev.filter(name => name !== groupToDelete));
    setGroupDetailsMap(prev => {
      const updated = { ...prev };
      delete updated[groupToDelete];
      return updated;
    });
    setGroupToDelete(null);
  };

  const handleEditGroup = (originalName, updatedGroup) => {
    setGroupDetailsMap(prev => {
      const copy = { ...prev };
      if (originalName !== updatedGroup.name) {
        delete copy[originalName];
      }
      copy[updatedGroup.name] = {
        ...copy[originalName],
        ...updatedGroup
      };
      return copy;
    });
    if (!userGroups.includes(updatedGroup.name)) {
      setUserGroups(prev => [...prev, updatedGroup.name]);
    }
    setEditingGroup(null);
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
                    if (!groupInfo) return null;
                    return (
                      <Group
                      key={index}
                      name={groupName}
                      group={groupInfo}
                      onDeleteRequest={handleRequestDelete}
                      onEditSubmit={handleEditGroup}
                      onEditRequest={(name) => setEditingGroup({ originalName: name })}
                      showAdminButtons={true} // ✅ only here!
                    />
                    );
                  })
                ) : (
                  <div className="groupPageMessage">
                    Use the Search Page to join study groups! Or create a group below!
                  </div>
                )}
              </ul>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="pinkButton" onClick={handleCreateClick}>Create Group</button>
              </div>
            </>
          ) : (
            <div className="groupPageMessage">Please log in to view your groups.</div>
          )}

          {showCreatePopup && (
            <CreateGroup
              onSubmit={(newGroup) => {
                const newGroupName = newGroup.name.trim();
                if (!userGroups.includes(newGroupName)) {
                  setUserGroups(prev => [...prev, newGroupName]);
                }
                setGroupDetailsMap(prevMap => ({
                  ...prevMap,
                  [newGroupName]: {
                    course: newGroup.course,
                    members: newGroup.members || 1,
                    meetingTime: newGroup.meetingTime || "TBD",
                    description: newGroup.description || "No description available.",
                    contact: newGroup.contact || "No contact provided.",
                    creatorEmail: newGroup.creatorEmail || currentUserEmail
                  }
                }));
                setShowCreatePopup(false);
              }}
              onCancel={cancelCreate}
            />
          )}

          {groupToDelete && (
            <Confirm
              message={`Are you sure you want to delete "${groupToDelete}"?`}
              onConfirm={confirmDeleteGroup}
              onCancel={cancelDeleteGroup}
              confirmLabel="Yes, Delete"
              cancelLabel="Cancel"
            />
          )}

          {editingGroup && (
            <CreateGroup
              isEdit={true}
              initialValues={{
                name: editingGroup.originalName,
                ...groupDetailsMap[editingGroup.originalName]
              }}
              onSubmit={(updatedData) => handleEditGroup(editingGroup.originalName, updatedData)}
              onCancel={() => setEditingGroup(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}