import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import ChatContainer from './components/ChatContainer';
import axios from 'axios';

function App() {
	type UserInput = {
		isClient: boolean,
		message: string,
		isLoading: false
	}

	const intialMessageObj = [
		{ isClient: true, message: 'Hello', isLoading: false },
		{ isClient: false, message: 'How can I help you today ?', isLoading: false }
	]
	const intialInput: UserInput = { isClient: true, message: '', isLoading: false }
	const [messageList, setMessageList] = useState(intialMessageObj)
	const [inputQuery, setInputQuery] = useState(intialInput)
	const messageContainerRef = useRef(null)
	const backendBaseURL = 'https://improved-giggle-9xq9j6rq4pj3gwr-5001.app.github.dev'

	useEffect(() => {
		scrollIntoView();
		checkDbConnection()
	}, [messageList])

	const checkDbConnection = () => {
		fetch(backendBaseURL, { credentials: 'include' }).then(resp => resp?.json()).then(data => {
			console.debug(data)
		})
		// axios.post(backendBaseURL + '/testPost', {}, { withXSRFToken: true, withCredentials: true })
	}
	const scrollIntoView = () => {
		const container: any = messageContainerRef.current
		if (container)
			container.scrollTo({ top: container.scrollHeight, behaviour: 'smooth' })
	}

	const askAI = async (query: string) => {
		// const response = await axios.post(backendBaseURL + '/query', { query: query }, {
		// 	withCredentials: true,
		// }).then(resp => resp?.data)
		const response = await axios.get(backendBaseURL + '/query/' + query, {
			withCredentials: true,
		}).then(resp => resp?.data)
		const tempList = messageList;
		const loadingIndex = tempList.findIndex(o => o?.isLoading === true);
		tempList[loadingIndex] = response
		setMessageList([...tempList])
	}

	const handleChange = (e: any) => {
		const { value } = e.target;
		inputQuery.message = value
		setInputQuery({ ...inputQuery, message: value })
	}

	const handleSend = () => {
		let tempList = messageList;
		tempList.push(inputQuery)
		tempList.push({ isClient: false, isLoading: true, message: '' })
		setMessageList([...tempList])
		askAI(inputQuery?.message)
		setInputQuery(intialInput)
	}


	return (
		<div className="App">
			<ChatContainer
				handleChange={handleChange}
				handleSend={handleSend}
				messageList={messageList}
				setMessageList={setMessageList}
				inputQuery={inputQuery}
				messageContainerRef={messageContainerRef}
			/>

		</div>
	);
}

export default App;
