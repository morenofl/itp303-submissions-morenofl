import React, { useState, useContext, useEffect } from 'react';
import './CreateGroup.css';
import { UserContext } from '../components/UserContext';

export default function CreateGroupForm({
	onSubmit,
	onCancel,
	initialValues = {},
	isEdit = false
}) {
	const [name, setName] = useState('');
	const [course, setCourse] = useState('');
	const [meetingTime, setMeetingTime] = useState('');
	const [description, setDescription] = useState('');
	const [contact, setContact] = useState('');

	const { email: currentUserEmail } = useContext(UserContext);

	// 🛠 Pre-fill form if editing
	useEffect(() => {
		if (isEdit && initialValues) {
			setName(initialValues.name || '');
			setCourse(initialValues.course || '');
			setMeetingTime(initialValues.meetingTime || '');
			setDescription(initialValues.description || '');
			setContact(initialValues.contact || '');
		}
	}, [isEdit, initialValues]);

	const handleSubmit = (e) => {
		e.preventDefault();

		const trimmedName = name.trim();
		const trimmedCourse = course.trim().toUpperCase();

		if (!trimmedName || !trimmedCourse) return;

		onSubmit({
			name: trimmedName,
			course: trimmedCourse,
			meetingTime: meetingTime.trim(),
			description: description.trim(),
			contact: contact.trim(),
			members: initialValues?.members || 1,
			creatorEmail: initialValues?.creatorEmail || currentUserEmail || 'unknown'
		});
	};

	return (
		<div className="form-popup-overlay">
			<div className="form-card">
				<h3>{isEdit ? 'Edit Group' : 'Create New Group'}</h3>
				<form onSubmit={handleSubmit} className="form-fields">
					<input
						type="text"
						placeholder="Group Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isEdit} 
						required
					/>
					<input
						type="text"
						placeholder="Course Number"
						value={course}
						onChange={(e) => setCourse(e.target.value)}
						required
					/>
					<input
						type="text"
						placeholder="Meeting Time"
						value={meetingTime}
						onChange={(e) => setMeetingTime(e.target.value)}
					/>
					<textarea
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></textarea>
					<input
						type="email"
						placeholder="Contact Email"
						value={contact}
						onChange={(e) => setContact(e.target.value)}
					/>
					<div className="form-buttons">
						<button type="submit" className="pinkButton">
							{isEdit ? 'Save Changes' : 'Create'}
						</button>
						<button type="button" className="cancelButton" onClick={onCancel}>Cancel</button>
					</div>
				</form>
			</div>
		</div>
	);
}
