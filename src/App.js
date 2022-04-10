import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';

import ChatPage from './Components/ChatPage';
import { useState } from 'react';
import Login from './Components/Login';
import db, { auth } from './firebase';
function App() {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

	const signOut = () => {
		auth
			.signOut()
			.then(() => {
				setUser(null);
				localStorage.removeItem('user');
				db.collection('users').doc(user.email).set({
					email: user.email,
					fullname: user.fullname,
					photoURL: user.photoURL,
					online: false,
				});
			})
			.catch((err) => alert(err.message));
	};
	return (
		<Router>
			<div className='App'>
				{user ? (
					<Routes>
						<Route path='/:emailID' element={<ChatPage currentUser={user} signOut={signOut} />} />
						<Route path='/' element={<Home currentUser={user} signOut={signOut} />} />
					</Routes>
				) : (
					<Login setUser={setUser} />
				)}
			</div>
		</Router>
	);
}

export default App;
