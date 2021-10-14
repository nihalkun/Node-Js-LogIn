require('dotenv').config()
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')  
app.use(express.json())

//local DB
const users = []

app.get('/users', (req ,res) => {
    res.json(users)
})


//Register api
app.post('/users', async(req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        const user = {name : req.body.name , 
                      email: req.body.email , 
                      mobile: req.body.mobile,
                      password : hashedPassword,
                      }
        users.push(user)
        res.status(201).send()
    } catch{
        res.status(500).send()
    }
   
})

//Login api
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
    try {
      if(await bcrypt.compare(req.body.password, user.password)) {
        //  res.send('Success')
        const username = req.body.username
        const user = {name : username}

        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.json({accessToken : accessToken}) 
      } else {
        res.send('Not Allowed')
      }
    } catch {
      res.status(500).send()
    }
  })

 
app.listen(3000)