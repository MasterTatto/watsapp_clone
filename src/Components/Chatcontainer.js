import React, { useEffect, useRef, useState } from 'react';
import './Chatcontainer.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import './Chatcontainer.css';
import ChatMessage from './ChatMessage';
import Picker from 'emoji-picker-react';
import { useParams } from 'react-router-dom';
import db from '../firebase';
import firebase from 'firebase';
import axios from 'axios';

function Chatcontainer({ currentUser, setUnreadMessages }) {
	const [message, setMessage] = useState('');
	const [openEmojiBox, setOpenEmojiBox] = useState(false);
	const { emailID } = useParams();
	const [chatUser, setChatUser] = useState({});
	const chatBox = useRef(null);
	const [chatMessages, setChatMessages] = useState([]);
	const [translateFlag, setTranslateFlag] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			const data = await db
				.collection('users')
				.doc(emailID)
				.onSnapshot((snapshot) => {
					setChatUser(snapshot.data());
				});
		};

		const getMessages = async () => {
			const data = await db
				.collection('chats')
				.doc(emailID)
				.collection('messages')
				.orderBy('timeStamp', 'asc')
				.onSnapshot((snapshot) => {
					let messages = snapshot.docs.map((doc) => doc.data());

					let newMessage = messages.filter(
						(message) => message.senderEmail === (currentUser.email || emailID) || message.receiverEmail === (currentUser.email || emailID)
					);

					setChatMessages(newMessage);
				});
		};
		getUser();
		getMessages();
	}, [emailID]);

	useEffect(() => {
		chatBox.current.addEventListener('DOMNodeInserted', (event) => {
			const { currentTarget: target } = event;
			target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
		});
	}, [chatMessages]);

	const send = async (e) => {
		e.preventDefault();

		if (emailID) {
			let currentPayload = {
				text: message,
				senderEmail: currentUser.email,
				receiverEmail: emailID,
				timeStamp: firebase.firestore.Timestamp.now(),
				isRead: false,
			};

			let chatUserPayload = {
				text: message,
				senderEmail: currentUser.email,
				receiverEmail: emailID,
				timeStamp: firebase.firestore.Timestamp.now(),
				isRead: false,
			};
			// sender
			db.collection('chats').doc(currentUser.email).collection('messages').add(currentPayload);

			// reciever
			db.collection('chats').doc(emailID).collection('messages').add(chatUserPayload);

			db.collection('Friendlist').doc(currentUser.email).collection('list').doc(emailID).set({
				email: chatUser.email,
				fullname: chatUser.fullname,
				photoURL: chatUser.photoURL,
				lastMessage: message,
				timeStamp: firebase.firestore.Timestamp.now(),
			});

			db.collection('Friendlist').doc(emailID).collection('list').doc(currentUser.email).set({
				email: currentUser.email,
				fullname: currentUser.fullname,
				photoURL: currentUser.photoURL,
				lastMessage: message,
				timeStamp: firebase.firestore.Timestamp.now(),
			});

			setMessage('');
		}
	};
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

	useEffect(() => {
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
	}, [emailID, chatMessages]);
	return (
		<div className='chat-container'>
			<div className='chat-container-header'>
				<div className='chat-user-info'>
					{/* <div className='chat-user-img'>
						<img src={chatUser?.photoURL} alt='' />
					</div> */}
					<p>{chatUser?.fullname}</p>
					{chatUser?.online && <span>Active now</span>}
					{chatUser?.online && <div className='active' />}
				</div>

				<div className='chat-container-header-btn'>
					<MoreVertIcon />
				</div>
			</div>

			{/* chatdisplay-container */}

			<div className='chat-display-container' ref={chatBox}>
				{chatMessages.map((message) => (
					<ChatMessage
						message={message.text}
						time={message.timeStamp}
						sender={message.senderEmail}
						translateFlag={translateFlag}
						chatUser={chatUser.photoURL}
						currentUser={currentUser}
						messageFull={message}
					/>
				))}
			</div>
			{/* chatinput */}

			<div className='chat-input'>
				{/* buttons */}
				{openEmojiBox && <Picker onEmojiClick={(event, emojiObject) => setMessage(message + emojiObject.emoji)} />}

				<div className='chat-input-btn'>
					<InsertEmoticonIcon onClick={() => setOpenEmojiBox(!openEmojiBox)} />
					<AttachFileIcon />
					<ImageIcon />
				</div>
				{/* text input element */}
				<form onSubmit={send}>
					<input
						type='text'
						placeholder='Type a Message'
						value={message}
						onChange={(e) => {
							setMessage(e.target.value);
						}}
					/>
				</form>
				{/* send button */}
				<div className='select'>
					<span
						onClick={() =>
							setTranslateFlag((translateFlag === null && true) || (translateFlag === true && false) || (translateFlag === false && true))
						}
					>
						Translate to {translateFlag ? 'en' : 'ru'}
					</span>
				</div>
				<div className='chat-input-send-btn' onClick={send}>
					<SendIcon />
				</div>
			</div>
		</div>
	);
}

export default Chatcontainer;
