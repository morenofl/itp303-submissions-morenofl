import React, { useState } from 'react';
import './CreateGroup.css';

export default function CreateGroupForm({ onSubmit, onCancel }) {
	const [name, setName] = useState('');
	const [course, setCourse] = useState('');
	const [meetingTime, setMeetingTime] = useState('');
	const [description, setDescription] = useState('');
	const [contact, setContact] = useState('');


	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmedName = name.trim();
		const trimmedCourse = course.trim().toUpperCase();

		if (!trimmedName || !trimmedCourse) return;

		onSubmit({
			name: trimmedName,
			courseCode: trimmedCourse,
			meetingTime: meetingTime.trim(),
			description: description.trim(),
			contactEmail: contact.trim()
		});
	};

	return (
		<div className="form-popup-overlay">
			<div className="form-card">
				<h3>Create New Group</h3>
				<form onSubmit={handleSubmit} className="form-fields">
					<input
						type="text"
						placeholder="Group Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
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
						<button type="submit" className="pinkButton">Create</button>
						<button type="button" className="cancelButton" onClick={onCancel}>Cancel</button>
					</div>
				</form>
			</div>
		</div>
	);
}
