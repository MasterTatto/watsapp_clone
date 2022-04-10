import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import db, { auth } from '../firebase';
import './ChatMessage.css';
function ChatMessage({ message, time, sender, translateFlag, chatUser, currentUser, messageFull }) {
	const [transalteWord, setTranslateWord] = useState(message);
	const { emailID } = useParams();
	const whoIsWho = currentUser.email === sender ? true : false;
	const currentimg = whoIsWho ? currentUser.photoURL : chatUser;
	console.log(messageFull);
	// useEffect(() => {
	// 	db.collection('chats').doc(currentUser.email).collection('messages').set({
	// 		text: message,
	// 		senderEmail: currentUser.email,
	// 		receiverEmail: emailID,
	// 		timeStamp: time,
	// 		isRead: true,
	// 	});
	// }, []);
	//шлем запрос на перевод и получаем слово с переводом
	useEffect(() => {
		if (translateFlag === null) return;
		//надстройки для CORS
		const params = new URLSearchParams();
		params.append('q', transalteWord);
		params.append('source', translateFlag ? 'en' : 'ru');
		params.append('target', translateFlag ? 'ru' : 'en');
		params.append('api_key', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		axios
			.post('https://libretranslate.de/translate', params, {
				headers: {
					accept: 'application.json',
					'Content-type': 'application/x-www-form-urlencoded',
				},
			})
			.then((res) => {
				// setTranslateMessages([...translateMessages,res.data.translatedText]);
				setTranslateWord(res.data.translatedText);
			});
	}, [translateFlag]);

	return (
		<div
			className='chat-message'
			style={{
				alignSelf: whoIsWho ? 'flex-end' : 'flex-start',
				alignItems: whoIsWho ? 'left' : 'left',

				// backgroundColor: whoIsWho ? '#dcf8c6' : '#fff',
				backgroundColor: whoIsWho ? 'rgb(64, 245, 101)' : '#fff',
			}}
		>
			<img
				src={currentimg}
				alt='user'
				className='img'
				style={{
					left: !whoIsWho && '-20px',
					right: whoIsWho && '-20px',
					top: '-18px',
				}}
			/>
			<div
				className='chat-message-text'
				style={{
					color: whoIsWho && '#fff',
				}}
			>
				<p>{transalteWord}</p>
			</div>
			<div className='chat-message-date'>
				<p>{new Date(time.toDate()).toLocaleTimeString()}</p>
			</div>
		</div>
	);
}

export default ChatMessage;
