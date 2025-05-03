import React, { useState, useEffect } from 'react';
import './CreateGroup.css';

export default function CreateGroupForm({ onSubmit, onCancel }) {
	const [name, setName] = useState('');
	const [courseDept, setCourseDept] = useState('');
	const [courseNum, setCourseNum] = useState('');
	const [meetingTime, setMeetingTime] = useState('');
	const [description, setDescription] = useState('');
	const [contact, setContact] = useState('');
	const [departments, setDepartments] = useState([]);

	// Fetch departments on component mount
	useEffect(() => {
		const fetchDepartments = async () => {
		  try {
			const res = await fetch('http://localhost:3000/api/groups'); // Proxy handles this
			if (!res.ok) throw new Error('Failed to fetch departments');
			const data = await res.json();
			setDepartments(data); // Set fetched departments
			console.log(data);
		  } catch (err) {
			console.error('Error fetching departments:', err);
		  }
		};
	
		fetchDepartments();
	  }, []);

	// Example departments and course numbers (customize as needed)
	
	const courseNumbers = ['101', '102', '170', '201', '270', '303', '401'];

	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmedName = name.trim();
		const trimmedDept = courseDept.trim().toUpperCase();
		const trimmedNum = courseNum.trim();

		if (!trimmedName || !trimmedDept || !trimmedNum) return;

		onSubmit({
			name: trimmedName,
			courseDept: trimmedDept,
			courseNum: trimmedNum,
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
					<div className="course-inputs">
						<select
							value={courseDept}
							onChange={(e) => setCourseDept(e.target.value)}
							required
							className="course-select"
						>
							<option value="">Select Department</option>
							{departments.map((dept) => (
								<option key={dept.department_id} value={dept.department_id}>
									{dept.code}
								</option>
							))}
						</select>

						<select
							value={courseNum}
							onChange={(e) => setCourseNum(e.target.value)}
							required
							className="course-select"
						>
							<option value="">Select Course Number</option>
							{courseNumbers.map((num) => (
								<option key={num} value={num}>
									{num}
								</option>
							))}
						</select>
					</div>
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
