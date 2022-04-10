import React, { useState } from 'react';
import Chatcontainer from './Chatcontainer';
import Sidebar from './Sidebar';
import './ChatPage.css';
function ChatPage({ currentUser, signOut }) {
	const [unreadMessages, setUnreadMessages] = useState(2);

	return (
		<div className='chatpage'>
			<div className='chatpage-container'>
				{/* sidebar */}
				<Sidebar currentUser={currentUser} signOut={signOut} unreadMessages={unreadMessages} />
				{/* chatcontainer */}
				<Chatcontainer currentUser={currentUser} setUnreadMessages={setUnreadMessages} />
			</div>
		</div>
	);
}

export default ChatPage;
