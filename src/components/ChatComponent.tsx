import { Box, Button, LinearProgress, TextField } from "@mui/material"
import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'


type InputQuery = {
    message: string,
    isLoading: boolean,
    isClient: boolean
}

type ChatComponentProps = {
    messageContainerRef: React.RefObject<null>,
    messageList: InputQuery[],
    setMessageList: React.Dispatch<React.SetStateAction<{
        message: string,
        isLoading: boolean,
        isClient: boolean
    }[]>>,
    inputQuery: InputQuery,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSend: () => void
}

const ChatComponent = ({ messageContainerRef, messageList, inputQuery, handleChange, handleSend }: ChatComponentProps) => {
    return <>
        <div className='chat_container'>
            <div className='message_container' ref={messageContainerRef} id="messageContainerRef">
                {messageList?.map((messageObj, index) => (
                    <div className={(messageObj?.isClient === true ? 'message_align_right' : 'message_align_left') + ' message'} key={index}>
                        {messageObj?.isLoading === false &&
                            <div className={'message_body ' + (messageObj?.isClient === true ? 'message_body_right' : 'message_body_left')}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {messageObj?.message}
                                </ReactMarkdown>
                            </div>
                        }
                        {messageObj?.isLoading === true &&
                            <Box sx={{ width: '80%' }}>
                                <LinearProgress />
                            </Box>
                        }

                    </div>
                ))}
            </div>
            <div className='message_context'>
                <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                    noValidate
                    autoComplete="off"
                    className='message_inputs'
                >
                    <TextField
                        fullWidth
                        className="message_text"
                        id="standard-basic"
                        label="Ask somthing"
                        variant="standard"
                        onChange={handleChange}
                        value={inputQuery?.message !== '' ? inputQuery?.message : ''}
                    />
                    <Button
                        className="message_action"
                        variant='contained'
                        onClick={handleSend}
                    >Send</Button>
                </Box>
            </div>
        </div>
    </>
}
export default ChatComponent