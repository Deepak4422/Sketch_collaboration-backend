const express=require('express');
const app=express();
const http=require('http').createServer(app);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const socketIO = require('socket.io');
const fetchUser= require('./middleware');
var  jwt = require('jsonwebtoken');
const JWT_SECRET='webtokenboyoftheyear';


const connectmongo=require('./connect');
var cors = require('cors')


const { body, validationResult } = require('express-validator');





app.use(cors())
app.use(express.json());


const port=process.env.YOUR_PORT || process.env.PORT ||5000;



// For user signup
app.post('/signup', [
   
    body('pin','Enter a valid pin').isLength({ min: 5 }),],
    async (req,res)=>{

        const errors = validationResult(req);
        let success=false;
        if (!errors.isEmpty()) {
            res.status(400).json({success,errors: errors.array() });
        }
        try{
            const findemail=await User.findOne({pin: req.body.pin});
                        if(findemail)
                        {
                        return  res.status(400).json({success,error: "This email address is already in use"});
                        }
                        
                        const salt=await bcrypt.genSalt(10);
                        const newpassword=await bcrypt.hash(req.body.pin,salt);
                         await User.create({pin: req.body.pin});
                      
                         success=true
                         const authtoken=jwt.sign(data,JWT_SECRET);
                        
                         res.json({success,authtoken});     
        }
        catch(err){
                       res.status(500).send({message: err.message});
        }
    });







    app.post('/login', [
     
      body('pin','Pin cannot be blank').exists()]  ,
      async (req,res)=>{
          const errors = validationResult(req);
          let success=false;
         
  if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
  }
  const find= await User.findOne({pin:req.body.pin} );
  if(!find)
  {
     return  res.status(400).json({success: success,error:"Please login with correct credentials"});
  }
 try{
              let compare=  await bcrypt.compare(req.body.pin, find.pin);
          if(!compare)
          {
              return res.status(400).json({success: success, error:"Please login with correct credentials"});
          }
          const data={
              user:{
                  id: find.id
              }
          }
          const authtoken=jwt.sign(data,JWT_SECRET);
          success=true;
          res.json({success,authtoken});
 }
 catch(error){
          console.error(error.message);
          res.status(500).send("Some error occured");
 }
});









const canvasSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    drawingData: { type: Array, required: true },
    
  });

  
  const Canvas = mongoose.model('Canvas', canvasSchema);
  
  // Express routes for saving and retrieving canvas state
  
  // Save canvas state
  app.post('/api/save-canvas', async (req, res) => {
    try {
      const { userId, drawingData } = req.body;
  
      // Check if the canvas state already exists for the user
      let canvas = await Canvas.findOne({ userId });
  
      if (!canvas) {
        // If the canvas doesn't exist, create a new one
        canvas = new Canvas({ userId, drawingData });
      } else {
        // If the canvas exists, update the drawingData
        canvas.drawingData = drawingData;
      }
  
      // Save the canvas to the database
      await canvas.save();
  
      res.status(200).json({ message: 'Canvas state saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  // Retrieve canvas state
  app.get('/api/get-canvas/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find the canvas state for the specified user
      const canvas = await Canvas.findOne({ userId });
  
      if (!canvas) {
        // If no canvas state is found, return an empty array
        return res.status(200).json({ drawingData: [] });
      }
  
      res.status(200).json({ drawingData: canvas.drawingData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });








const io = socketIO(http);

io.on('connection', (socket) => {
    console.log('A user connected');
  
   
    socket.on('joinRoom', (userId) => {
      socket.join(userId);
    });
  
    socket.on('draw', (data) => {

      io.to(data.userId).emit('draw', data.drawingData);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });




app.listen(port,()=>{
  console.log("server is running on port", port);
});
