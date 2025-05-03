// Group.js (refactored to use `group` prop)
import React, { useContext, useState } from 'react';
import { UserContext } from '../components/UserContext';
import './Group.css';
import Confirm from './Confirm';
import CreateGroupForm from './CreateGroup';

export default function Group({
  name,
  group,
  onDeleteRequest,
  onEditSubmit,
  onEditRequest,
  showAdminButtons = false // 👈 default to false
}) {
  const { userGroups, setUserGroups, email: currentUserEmail } = useContext(UserContext);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isInGroup = userGroups.includes(name);
  const isCreator = currentUserEmail === group?.creatorEmail;

  // ... rest of your handlers

  return (
    <li className="group-item">
      <h3>{name}</h3>
      <p><strong>Course:</strong> {group.course}</p>
      <p><strong>Members:</strong> {group.members}</p>
      <p><strong>Meeting:</strong> {group.meetingTime}</p>
      <p><strong>About:</strong> {group.description}</p>
      <p><strong>Contact:</strong> {group.contact}</p>

      <div className="group-buttons">
        {isInGroup ? (
          <button className="leave-group-button" onClick={() => setShowConfirmLeave(true)}>Leave Group</button>
        ) : (
          <button className="join-group-button" onClick={() => setUserGroups([...userGroups, name])}>Join Group</button>
        )}

        {/* 👇 Only show these if it's from GroupsPage and user is creator */}
        {showAdminButtons && isCreator && (
          <>
            <button className="edit-group-button" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="delete-group-button" onClick={() => onDeleteRequest(name)}>Delete</button>
          </>
        )}
      </div>

      {showConfirmLeave && (
        <Confirm
          message={`Are you sure you want to leave "${name}"?`}
          onConfirm={() => {
            setUserGroups(userGroups.filter(g => g !== name));
            setShowConfirmLeave(false);
          }}
          onCancel={() => setShowConfirmLeave(false)}
          confirmLabel="Yes, Leave"
          cancelLabel="Cancel"
        />
      )}

      {isEditing && (
        <CreateGroupForm
          onSubmit={(updatedGroup) => {
            onEditSubmit(name, updatedGroup);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          isEdit={true}
          initialValues={{ name, ...group }}
        />
      )}
    </li>
  );
}