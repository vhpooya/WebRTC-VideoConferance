const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const { RTCVideoSource, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = require('wrtc'); // Import necessary WebRTC objects
const fs = require('fs');
const { Readable } = require('stream');
const path = require('path');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketIo(server);
// Start the server
const PORT = process.env.PORT || 3000;

const configuration = {}; // Define WebRTC configuration object

let videoStreams = {};
let recordedStream;



// Handle WebRTC consumer connections
app.post('/consumer', async ({ body }, res) => {
    const peer = new RTCPeerConnection(configuration); // Create a new RTCPeerConnection
    const desc = new RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    Object.values(videoStreams).forEach(stream => {
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
    });
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }
    res.json(payload);
});

// Function to track video streams
function trackVideo(stream) {
    videoStreams[stream.id] = stream;
    Object.values(io.sockets.connected).forEach(socket => {
        socket.emit('new video stream', { streamId: stream.id });
    });
}

// Handle client connections
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('connection_status', 'Connected');
    io.emit('user_joined', 'A new user joined');

    // Handle incoming video streams
    socket.on('send video stream', (stream) => {
        console.log('Received video stream from client');
        trackVideo(stream);
        recordedStream = stream;
    });

    // Handle chat messages
    socket.on('send_message', (message) => {
        io.emit('receive_message', message);
    });

    // Handle file sharing
    socket.on('send_file', (fileData) => {
        const fileName = `uploads/${fileData.name}`;
        fs.writeFile(fileName, fileData.data, (err) => {
            if (err) {
                console.error('Error saving file:', err);
            } else {
                io.emit('receive_file', { name: fileData.name, path: fileName });
            }
        });
    });

    // Handle video recording start
    socket.on('start_recording', () => {
        recordedStream = new Readable();
        socket.emit('recording_started');
    });

    // Handle video recording stop
    socket.on('stop_recording', () => {
        if (recordedStream) {
            recordedStream.destroy();
            recordedStream = null;
            socket.emit('recording_stopped');
        }
    });

    // Handle notifications
    socket.on('send_notification', (notification) => {
        io.emit('receive_notification', notification);
    });

    // Handle client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        // Implement any necessary cleanup logic
    });
});

// Handle form submission
app.post('/invitee-login', (req, res) => {
    const { first_name, last_name, phone, organization, city } = req.body;
    
    // Save the data to database or temporary storage
    console.log('Received data:', { first_name, last_name, phone, organization, city });
    
    // Redirect to main page or session page
    res.json({ message: 'Form submitted successfully' });
});

// Retrieve user data
app.get('/users', (req, res) => {
    // Retrieve user data from database or storage
    const users = [
        { id: 1, name: 'John Doe', image: 'john-doe.jpg' },
        { id: 2, name: 'Jane Smith', image: 'jane-smith.jpg' },
        // Add more user data as needed
    ];
    
    res.json(users);
});

// Handle offer exchange
io.on('connection', (socket) => {
    console.log('A new client connected');
    
    socket.on('offer', async (offer, userId) => {
        const peerConnection = new RTCPeerConnection(configuration); // Create a new RTCPeerConnection
        
        peerConnection.addEventListener('icecandidate', (event) => {
            if (event.candidate) {
                io.to(userId).emit('iceCandidate', event.candidate, socket.id);
            }
        });
        
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        sendAnswerToClient(answer, userId);
    });

    socket.on('iceCandidate', (candidate, userId) => {
        io.to(userId).emit('iceCandidate', candidate, socket.id);
    });

    function sendAnswerToClient(answer, userId) {
        io.to(userId).emit('answer', answer, socket.id);
    }
});

// Function to send ICE candidate to the remote peer
function sendICECandidate(candidate) {
    // Replace 'ws://localhost:8080' with the URL of your WebSocket server
    const socket = new WebSocket(`ws://localhost:${PORT}`);
    
    // Wait for the WebSocket connection to open
    socket.onopen = function(event) {
        // Prepare the ICE candidate message
        const message = {
            type: 'ice_candidate',
            candidate: candidate
        };

        // Send the ICE candidate message to the remote peer
        socket.send(JSON.stringify(message));
    };

    // Log any errors that occur with the WebSocket connection
    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
}



server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
