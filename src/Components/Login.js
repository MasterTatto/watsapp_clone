import React from 'react';
import db, { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
	const navigate = useNavigate();

	const signInWithGoogle = () => {
		auth
			.signInWithPopup(googleProvider)
			.then((result) => {
				const newUser = {
					fullname: result.user.displayName,
					email: result.user.email,
					photoURL: result.user.photoURL,
					online: true,
				};
				navigate('/');
				setUser(newUser);
				localStorage.setItem('user', JSON.stringify(newUser));
				db.collection('users').doc(result.user.email).set(newUser);
			})
			.catch((err) => alert(err.message));
	};

	return (
		<div className='login'>
			<div className='login-container'>
				<img className='login-logo' src='./whatsapp-logo.png' alt='' />
				<h2 className='login_h2'>Welcome Back</h2>
				<p className='login_p'> To keep connected with us please login with you personal info</p>
				<button className='login-btn' onClick={signInWithGoogle}>
					SIGN IN
				</button>
			</div>
		</div>
	);
}

export default Login;
