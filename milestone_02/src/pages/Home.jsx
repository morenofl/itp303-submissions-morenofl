import React from 'react'
import './Home.css';
import Navbar from '../components/Navbar';
export default function Home() {
  return (
	<>
		<Navbar/>
		<div className="body">
			<div className='welcome'>
				<p>Hi there! Welcome To <span className="webname">StudyMatch</span></p>
				<p>Are you looking for a study group in a class you are taking?</p>
				<p>StudyMatch connects college students taking the same classes. We make studying for classes and finding new friends easier.</p>
			</div>
		</div>
	</>
	
  )
}
