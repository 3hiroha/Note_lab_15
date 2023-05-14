import { Box, Button, Card, Modal, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useKeyDown } from '../../../hooks/useKeyDown';
import CommentCard from './components/CommentCard';
import { useEffect,useContext } from 'react';
import Axios from '../../AxiosInstance';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import GlobalContext from '../../Context/GlobalContext';




const CommentModal = ({ open = false, handleClose = () => {} }) => {
  const {user, setStatus} = useContext(GlobalContext);
  const [textField, setTextField] = useState('');
  const [comments, setComments] = useState([]);
  const [openComment, setopenComments] = useState(false);

  useKeyDown(() => {
    handleAddComment();
  }, ['Enter']);
  
  useEffect(() => {
    // TODO: Implement get notes by user's token
    // 1. check if user is logged in
    const userToken = Cookies.get('UserToken');
    if (userToken !== undefined && userToken !== 'undefined') {
      // 2. call API to get notes
      Axios.get('/comment', { headers: { Authorization: `Bearer ${userToken}` } }).then((res) => {
        // 3. set notes to state
        const Commenttext = res.data.data.map((data) => {
          return {
            msg : data.text
          }
        })
        setComments(Commenttext);
      });
    }
  }, [user]);

  const handleAddComment = async () =>  {
    // TODO implement logic
    console.log(textField);
    
    try{ 
      // POST403 ???????
      // const userToken = Cookies.get('userToken');
      // const response = await Axios.post('/comment', textField, {
        //   headers: { Authorization: `Bearer ${userToken}` },
        // });
        
        const userToken = Cookies.get('UserToken');
        const response = await Axios.post('/comment', {text:textField}, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        
        if (response.data.success) {
          setStatus({ severity: 'success', msg: 'Create comment successfully' });
          setComments((prev) => [...prev, response.data.data]);
          
        }
      }catch(error){
        if(error instanceof AxiosError&& error.response){
          setStatus({ Serverity : 'error' , msg : error.response.data.error})
      }else{
        setStatus({ Serverity : 'error' , msg : error.message})
      }
    }
    setComments([...comments, { id: Math.random(), msg: textField }]);
  };
  // GET ALL COMMENTS get /comment ----- for each user binded by cookies
  
  
  // Create comment section Post /comment
  // Edit comment section patch /comment
  // Delete comment Delete /comment

  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        sx={{
          width: { xs: '60vw', lg: '40vw' },
          maxWidth: '600px',
          maxHeight: '400px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '16px',
          backgroundColor: '#ffffffCC',
          p: '2rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <TextField
            value={textField}
            onChange={(e) => setTextField(e.target.value)}
            fullWidth
            placeholder="Type your comment"
            variant="standard"
          />
          <Button onClick={handleAddComment}>Submit</Button>
        </Box>
        <Box
          sx={{
            overflowY: 'scroll',
            maxHeight: 'calc(400px - 2rem)',
            '&::-webkit-scrollbar': {
              width: '.5rem', // chromium and safari
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#999999',
              borderRadius: '10px',
            },
          }}
        >
          {comments.map((comment) => (
            <CommentCard comment={comment} key={comment.id} />
          ))}
        </Box>
      </Card>
    </Modal>
  );
};

export default CommentModal;
