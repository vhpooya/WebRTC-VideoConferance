// activate-microphone.js
async function activateMicrophone(userId) {
    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' } // Example STUN server
        ]
    };

    const peerConnection = createPeerConnection(configuration);
    
    // Add local audio track to the peer connection
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    // Create offer and set local description
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send the offer to the other peer
    sendOfferToServer(offer, userId);
}

// Function to handle incoming audio streams from remote peers
function handleIncomingAudioStream(stream) {
    // Play the incoming audio stream
    const audioElement = new Audio();
    audioElement.srcObject = stream;
    audioElement.play();
}

// Function to handle incoming offers from remote peers
async function handleIncomingOffer(offer, userId) {
    // Create a new RTCPeerConnection
    const peerConnection = createPeerConnection(configuration);

    // Add event listener for ICE candidates
    peerConnection.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
            // Send ICE candidate to the other peer
        }
    });

    // Set remote description from the offer
    await peerConnection.setRemoteDescription(offer);

    // Create answer
    const answer = await peerConnection.createAnswer();

    // Set local description for the answer
    await peerConnection.setLocalDescription(answer);

    // Send answer to the client
    sendAnswerToClient(answer, userId);

    // Add event listener for incoming audio streams
    peerConnection.addEventListener('track', (event) => {
        if (event.track.kind === 'audio') {
            handleIncomingAudioStream(event.streams[0]);
        }
    });
}
