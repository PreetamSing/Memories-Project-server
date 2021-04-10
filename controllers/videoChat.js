import { v4 as uuidv4 } from 'uuid';

let groups = {};
let meetings = [];

Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

export const createMeeting = (req, res) => {
    const meetingId = uuidv4();
    res.status(201).json(meetingId);
    meetings.push(meetingId);
}

export const setupConnection = (ws, req) => {
    const connection = ws;
    connection.on('message', (message) => {
        const data = JSON.parse(message)

        switch (data.type) {
            case "store_user":
                if (!meetings.find(meeting => meeting === data.meetingId)) {
                    sendData({ type: "error", error: "Meeting Id does not exist" }, connection);
                    return;
                }
                const checkUser = findUser(data.username, data.meetingId);

                if (checkUser) {
                    sendData({ type: "error", error: "This userName already exists in this meeting. Choose a different userName" }, connection);
                    return
                }

                groups[data.meetingId] = {
                    ...groups[data.meetingId]
                }
                groups[data.meetingId][data.username] = {
                    conn: connection,
                    username: data.username
                }
                for (let prop in groups[data.meetingId]) {
                    if (groups[data.meetingId][prop].username !== data.username) {
                        sendData({
                            type: 'send_offer',
                            askee: data.username
                        }, groups[data.meetingId][prop].conn);
                    }
                }
                break;

            case "pass_offer":
                if (!groups[data.meetingId]?.[data.username] || !groups[data.meetingId]?.[data.address]) return;

                sendData({
                    type: 'send_answer',
                    askee: data.username,
                    offer: data.offer
                }, groups[data.meetingId][data.address].conn);
                break;

            case "pass_answer":
                if (!groups[data.meetingId]?.[data.username] || !groups[data.meetingId]?.[data.address]) return;

                sendData({
                    type: 'answer',
                    sender: data.username,
                    answer: data.answer
                }, groups[data.meetingId][data.address].conn);
                break;

            case "pass_candidate":
                if (!groups[data.meetingId]?.[data.username] || !groups[data.meetingId]?.[data.address]) return;

                sendData({
                    type: 'candidate',
                    sender: data.username,
                    candidate: data.candidate
                }, groups[data.meetingId][data.address].conn);
                break;

            default:
                console.log("unknown behaviour", data);
        }
    })

    connection.on('close', (code, reason) => {
        if (code === 1000) {
            const { username, meetingId } = JSON.parse(reason);
            delete groups[meetingId]?.[username];
            for (let prop in groups[meetingId]) {
                sendData({
                    type: "user_left",
                    username
                }, groups[meetingId][prop].conn)
            }
            
            if (Object.size(groups[meetingId]) === 0) {
                delete groups[meetingId];
                meetings.splice(meetings.indexOf(meetingId), 1);
            }
        }
    })
}


function sendData(data, conn) {
    conn.send(JSON.stringify(data))
}

function findUser(username, meetingId) {
    return groups?.[meetingId]?.[username]
}