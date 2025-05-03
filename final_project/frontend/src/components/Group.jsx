import React, { useContext, useState } from 'react';
import { UserContext } from '../components/UserContext';
import './Group.css';
import Confirm from './Confirm';

export default function Group({ name, course, members, meetingTime, description, contact }) {
  const { isLoggedIn, userGroups, setUserGroups } = useContext(UserContext);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  const isInGroup = userGroups.includes(name);

  const handleJoin = () => {
    if (!isLoggedIn) {
      alert("Please log in to join a group.");
      return;
    }
    if (!isInGroup) {
      setUserGroups([...userGroups, name]);
      alert(`You joined ${name}!`);
    }
  };

  const handleLeave = () => {
    setShowConfirmLeave(true); // Show popup
  };

  const confirmLeave = () => {
    setUserGroups(userGroups.filter(g => g !== name));
    setShowConfirmLeave(false);
  };

  const cancelLeave = () => {
    setShowConfirmLeave(false);
  };

  return (
    <li className="group-item">
      <h3>{name}</h3>
      <p><strong>Course: </strong>{course}</p>
      <p><strong>Members:</strong> {members}</p>
      <p><strong>Meeting:</strong> {meetingTime}</p>
      <p><strong>About:</strong> {description}</p>
      <p><strong>Contact:</strong> {contact}</p>

      {isInGroup ? (
        <button className="leave-group-button" onClick={handleLeave}>
          Leave Group
        </button>
      ) : (
        <button className="join-group-button" onClick={handleJoin}>
          Join Group
        </button>
      )}

      {showConfirmLeave && (
        <Confirm
          message={`Are you sure you want to leave ${name}?`}
          onConfirm={confirmLeave}
          onCancel={cancelLeave}
          confirmLabel="Yes, Leave"
          cancelLabel="Cancel"
        />
      )}
    </li>
  );
}


