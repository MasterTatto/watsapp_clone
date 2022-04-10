import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import db from '../firebase';
import './UserProfile.css';

function UserProfile({ name, photoURL, email, lastMessage, timeStamp }) {
	const navigate = useNavigate();
	const lastDataSend = new Date(timeStamp?.toDate()).toLocaleTimeString();

	const [chatMessages, setChatMessages] = useState([]);
	const { emailID } = useParams();
	const [chatUser, setChatUser] = useState({});

	console.log(email, 'userProfile');
	console.log(chatMessages, 'userProfile');

	useEffect(() => {
		const getUser = async () => {
			const data = await db
				.collection('users')
				.doc(email)
				.onSnapshot((snapshot) => {
					setChatUser(snapshot.data());
				});
		};

		const getMessages = async () => {
			const data = await db
				.collection('chats')
				.doc(email)
				.collection('messages')
				.orderBy('timeStamp', 'asc')
				.onSnapshot((snapshot) => {
					let messages = snapshot.docs.map((doc) => doc.data());

					let newMessage = messages.filter((message) => message.senderEmail === (email || emailID) || message.receiverEmail === (email || emailID));

					setChatMessages(newMessage.filter((f) => !f.isRead && (email || emailID) === f.senderEmail));
				});
		};
		getUser();
		getMessages();
	}, []);

	const filter = () => {};

	useEffect(() => {
		const getUser = async () => {
			const data = await db
				.collection('users')
				.doc(email)
				.onSnapshot((snapshot) => {
					setChatUser(snapshot.data());
				});
		};
		getUser();
	}, [email]);

	const clearRemoveMessage = () => {
		db.collection('chats')
			.doc(emailID)
			.collection('messages')
			.get()
			.then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					doc.ref.update({
						isRead: true,
					});
				});
			});
	};

	const goToUser = (emailId) => {
		if (emailId) {
			navigate(`/${emailId}`);
			filter();
		}
	};
	console.log(chatMessages);
	const chatUserUnreadMessage = chatMessages.filter((el) => el.isRead === false);

	return (
		<div
			className='user-profile'
			onClick={() => {
				clearRemoveMessage();
				goToUser(email);
			}}
		>
			{chatMessages.length > 0 && <div className='unread_message'>{chatUserUnreadMessage.length}</div>}
			<div className='user-image'>
				<img src={photoURL} alt='' />
				{chatUser.online && <div className='user-active' />}
			</div>
			{/* name of user */}
			<div className='user-info'>
				{<span className='last_time'> {lastDataSend} </span>}
				<p className='user-name'>{name}</p>

				{lastMessage && <p className='user-lastmessage'>{lastMessage}</p>}
			</div>
		</div>
	);
}

export default UserProfile;
