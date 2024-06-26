import { makeConnection } from "./services/connectionLogic";
import { connectionRequestAlreadySent, sendConnectionRequest } from "./services/connectionReqLogic";
import { getUserByName, search, signUpStudent } from "./services/student";
import { signUpTutor } from "./services/tutor";
import { findUser, updateUser } from "./services/user";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const express = require("express");
const bodyParser = require('body-parser')
const app = express();

// Configure CORS middleware
const corsOptions = {
    origin: 'https://phoenixtutorium.netlify.app', // Only allow requests from this origin
    // origin: 'http://localhost:3001', // Only allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allow only GET and POST requests
    allowedHeaders: ['Content-Type', 'Authorization'], // Only allow these headers
    credentials: true, // Allow cookies to be sent with the request
};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Use CORS middleware globally
app.use(cors(corsOptions));
// parse application/json
app.use(bodyParser.json())

app.get('/', (req: any, res: any) => {
    console.log('Default endpoint hit');
    res.json({ message: "all good" })
});

app.get('/user/get/:id', async (req: any, res: any) => {
    let id = req.params.id;
    console.log(id);
    try {
        const user = await findUser(id);
        console.log(user);
        res.status(200).json(user);
    } catch(error: any) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

app.put('/user/update/:id', authenticateToken, async (req: any, res: any) => {
    const loggedIn = req.user.id;
    const userIdToUpdate = req.params.id;

    console.log(loggedIn, userIdToUpdate);

    try {
        if (loggedIn !== userIdToUpdate) {
            console.log('You cannot update a profile that isn\'t yours bud');
            return;
        }

        await updateUser(userIdToUpdate, req.body);
        res.json('Updated');
    } catch (error) {
        res.send(error);
    }
})

app.post('/student/signup', async (req: any, res: any) => {
    let user = req.body;

    try {
        user.password = await bcrypt.hash(user.password, 10);
        let createdStudent = await signUpStudent(user);
        console.log(req.body);
        
        if (createdStudent) {
            res.json(createdStudent);
        }
    } catch {
        res.status(500).send();
    }
});

app.post('/login', async (req: any, res: any) => {
    let { username, password } = req.body;

    const user = await getUserByName(username);

    if (!user) {
        return res.status(400).send("Cannot find user");
    }
    
    const hashedPassword = user?.password;
    
    try {
        if (await bcrypt.compare(password, hashedPassword)) {

            const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET);
            console.log(accessToken);
            res.send(accessToken);
        } else {
            res.status(401).send('Incorrect credentials');
        }
    } catch {
        res.status(500).send();
    }
});

app.post('/tutor/signup', async (req: any, res: any) => {
    let user = req.body;
    console.log(user);
    try {
        user.password = await bcrypt.hash(user.password, 10);

        let createdTutor = await signUpTutor(user);
        console.log(req.body);

        if (createdTutor) {
            res.json(createdTutor);
        }
    } catch(err: any) {
        console.log(err);
        res.status(500).send();
    }
});

app.post('/connectionRequest/:to', authenticateToken, async (req: any, res: any) => {
    const receiverId = req.params.to;
    const message = req.body.message;

    try {
        let success = await sendConnectionRequest(req.user.id, receiverId, message);
        res.send(success);
    } catch {
        res.status(500).send()
    }
});

app.get('/checkconnrequest/:id', authenticateToken, async (req: any, res: any) => {
    const receiverId = req.params.id;

    console.log(req.user.id, receiverId);
    try {
        let success = await connectionRequestAlreadySent(req.user.id, receiverId);
        res.status(200).send(success);
    } catch (err) {
        res.status(500).send();
    }
});

app.post('/acceptConnection/:to', authenticateToken, async (req: any, res: any) => {
    const receiverId = req.params.to;
    console.log(req.body);

    try {
        let success = await makeConnection(req.body.id, receiverId);
        res.send(success);
    } catch {
        res.status(500).send();
    }
});

app.post('/tutor/search', async (req: any, res: any) => {
    const request = req.body;

    if (request.price) {
        request.startingPrice = Number.parseFloat((request.price.split('-')[0]));
        request.endingPrice = Number.parseFloat((request.price.split('-')[1]));
    }

    console.log(request);
    
    try {
        const tutors = await search(request.city, request.suburb, request.startingPrice, request.endingPrice);
        res.json(tutors);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// middleware
function authenticateToken(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403); // token no longer valid, no more access
        req.user = user;
        next();
    })
}

app.listen(3000);