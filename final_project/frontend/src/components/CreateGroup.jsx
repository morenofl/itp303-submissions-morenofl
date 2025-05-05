import React, { useState, useContext, useEffect } from 'react';
import './CreateGroup.css';
import { UserContext } from '../components/UserContext';
import { CourseContext } from '../components/CourseContext';

export default function CreateGroupForm({
	onSubmit,
	onCancel,
	initialValues = {},
	isEdit = false
}) {
	const [name, setName] = useState('');
	const [courseDeptId, setCourseDeptId] = useState('');
	const [courseNum, setCourseNum] = useState('');
	const [meetingTime, setMeetingTime] = useState('');
	const [description, setDescription] = useState('');
	const [contact, setContact] = useState('');
	const [departments, setDepartments] = useState([]);
	const [filteredCourses, setFilteredCourses] = useState([]);

	const { email: currentUserEmail, user_id } = useContext(UserContext);
	const { coursesData, loadingCourses } = useContext(CourseContext);

	// Fetch department list
	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				const res = await fetch('https://final-project-ro9j.onrender.com/api/departments');
				if (!res.ok) throw new Error('Failed to fetch departments');
				const data = await res.json();
				setDepartments(data);
			} catch (err) {
				console.error('Error fetching departments:', err);
			}
		};
		fetchDepartments();
	}, []);

	useEffect(() => {
		if (isEdit && initialValues) {
			setName(initialValues.name || '');
			setMeetingTime(initialValues.meeting_time || '');
			setDescription(initialValues.description || '');
			setContact(initialValues.contact || '');
			const course = coursesData.find((c) => c.course_id === initialValues.course_id);


			if (course) {
				const deptObj = departments.find((d) => d.code === course.code);
				setCourseDeptId(deptObj?.department_id || '');
				setCourseNum(course.number || '');
			}

		}
	}, [isEdit, initialValues, departments]);

	// Filter courses based on selected department ID
	useEffect(() => {


		const deptCode = departments.find((d) => d.department_id == courseDeptId)?.code || '';

		const filtered = coursesData.filter(course => course.code === deptCode);
		setFilteredCourses(filtered);
	}, [courseDeptId, coursesData, departments]);

	const handleSubmit = async (e) => {
		e.preventDefault();
	
		const deptCode = departments.find((d) => d.department_id == courseDeptId)?.code || '';
		const selected_course = coursesData.find((d) =>
			String(d.code) == deptCode && String(d.number) == courseNum
		)?.course_id;
	
		if (!selected_course) {
			console.error("No matching course found.");
			return;
		}
	
		const groupPayload = {
			name: name.trim(),
			course_id: selected_course,
			meetingTime: meetingTime.trim(),
			description: description.trim(),
			contact: contact.trim(),
			creator: user_id
		};
	
		try {
			let res, data;
			if (isEdit && initialValues.group_id) {
				res = await fetch(`https://final-project-ro9j.onrender.com/api/groups/${initialValues.group_id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify(groupPayload)
				});
				data = await res.json();
			} else {
				res = await fetch('https://final-project-ro9j.onrender.com/api/groups', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify(groupPayload)
				});
				data = await res.json();
			}
	
			if (!res.ok) {
				console.error(isEdit ? 'Failed to update group:' : 'Failed to create group:', data);
				return;
			}
	
			// Clear form only on creation
			if (!isEdit) {
				setName('');
				setCourseDeptId('');
				setCourseNum('');
				setMeetingTime('');
				setDescription('');
				setContact('');
			}
	
			if (onSubmit) {
				onSubmit(data.group || groupPayload); 
			}
		} catch (err) {
			console.error(isEdit ? 'Error updating group:' : 'Error creating group:', err);
		}
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

					<div className="course-inputs">
						<select
							value={courseDeptId}
							onChange={(e) => setCourseDeptId(e.target.value)}
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
							disabled={loadingCourses || !courseDeptId}
						>
							<option value="">Select Course Number</option>
							{filteredCourses.length === 0 && courseDeptId && (
								<option disabled>No courses available</option>
							)}
							{filteredCourses.map((course) => (
								<option key={course.course_id} value={course.number}>
									{course.number}
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
					/>
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
						<button type="button" className="cancelButton" onClick={onCancel}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
