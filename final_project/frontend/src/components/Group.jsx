import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../components/UserContext';
import './Group.css';
import Confirm from './Confirm';
import CreateGroupForm from './CreateGroup';
import { CourseContext } from './CourseContext';

export default function Group({
  name,
  group = {},
  course,
  members,
  meetingTime,
  description,
  contact,
  onDeleteRequest,
  onEditSubmit,
  onEditRequest,
  showAdminButtons,
  onGroupChange 
}) {
  const { coursesData } = useContext(CourseContext);
  const { isLoggedIn, userGroups, setUserGroups, email: currentUserEmail } = useContext(UserContext);

  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showJoinSuccess, setShowJoinSuccess] = useState(false);
  const [isInGroup, setIsInGroup] = useState(false);

  const unifiedCourses = coursesData.map(course => ({
    id: course.course_id,
    label: `${course.code} ${course.number} - ${course.title}`
  }));

  const selected_course = unifiedCourses.find((d) => d.id == group.course_id)?.label || group.course || 'Unknown Course';
  const groupName = name || group.name;
  const groupCourse = selected_course || group.course;
  const groupMembers = members || group.num_members;
  const groupMeetingTime = meetingTime || group.meeting_time;
  const groupDescription = description || group.description;
  const groupContact = contact || group.contact;
  const groupCreator = group.created_by;

  useEffect(() => {
    if (isLoggedIn) {
      setIsInGroup(userGroups.some(g => g.group_id === group.group_id));
    } else {
      setIsInGroup(false);
    }
  }, [isLoggedIn, userGroups, group.group_id]);

  const handleJoin = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      const res = await fetch(`https://final-project-ro9j.onrender.com/api/userGroups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ group_id: group.group_id })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Join failed:", data);
        return;
      }

      setUserGroups(prev => [...prev, group]);
      setShowJoinSuccess(true);
      onGroupChange?.(); 
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };

  const handleLeave = () => {
    setShowConfirmLeave(true);
  };

  const confirmLeave = async () => {
    try {
      const res = await fetch(`https://final-project-ro9j.onrender.com/api/userGroups/${group.group_id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Leave failed:", data);
        return;
      }

      setIsInGroup(false);
      setUserGroups(prev => prev.filter(g => g.group_id !== group.group_id));
      setShowConfirmLeave(false);
      onGroupChange?.();
    } catch (err) {
      console.error("Error leaving group:", err);
    }
  };

  const cancelLeave = () => {
    setShowConfirmLeave(false);
  };

  return (
    <li className="group-item">
      <h3>{groupName}</h3>
      <p><strong>Course:</strong> {groupCourse}</p>
      <p><strong>Members:</strong> {groupMembers}</p>
      <p><strong>Meeting:</strong> {groupMeetingTime}</p>
      <p><strong>About:</strong> {groupDescription}</p>
      {isInGroup ? (
        <p><strong>Contact:</strong> {groupContact}</p>
      ) : (
        <p><strong>Contact:</strong> <em>Join the group to view contact info</em></p>
      )}

      <div className="group-buttons">
        {isInGroup ? (
          <button className="leave-group-button" onClick={handleLeave}>Leave Group</button>
        ) : (
          <button className="join-group-button" onClick={handleJoin}>Join Group</button>
        )}

        {showAdminButtons && (
          <>
            <button className="edit-group-button" onClick={() => onEditRequest?.(group)}>Edit</button>
            <button className="delete-group-button" onClick={() => onDeleteRequest?.(groupName)}>Delete</button>
          </>
        )}
      </div>

      {showConfirmLeave && (
        <Confirm
          message={`Are you sure you want to leave "${groupName}"?`}
          onConfirm={confirmLeave}
          onCancel={cancelLeave}
          confirmLabel="Yes, Leave"
          cancelLabel="Cancel"
        />
      )}

      {showLoginPrompt && (
        <Confirm
          message="You must be logged in to join a group."
          onConfirm={() => setShowLoginPrompt(false)}
          confirmLabel="OK"
        />
      )}

      {showJoinSuccess && (
        <Confirm
          message={`You successfully joined "${groupName}".`}
          onConfirm={() => setShowJoinSuccess(false)}
          confirmLabel="OK"
        />
      )}
    </li>
  );
}
