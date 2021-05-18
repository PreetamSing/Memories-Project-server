import MessageToken from '../models/msgToken.js';
import admin from '../index.js';

export const storeToken = async (req, res) => {
    const token = req.body.token;
    const _id = req.userId;

    const newMsgToken = new MessageToken({ token, _id });

    try {
        await newMsgToken.save();
        res.status(200);
        addRegTokens(token);
    } catch (error) {
        if (error?.code === 11000) {
            try {
                await MessageToken.findByIdAndUpdate(_id, { token, _id });
                res.status(200);
                addRegTokens(token);
            } catch (error) {
                console.log(error);
                res.status(500);
            }
        }
    }
}

async function addRegTokens(token = '') {
    const regTokens = await MessageToken.find({}, '-_id token');
    let filteredRegTokens = [];
    regTokens.forEach(item => {
        filteredRegTokens.push(item.token);
    });
    if (token) filteredRegTokens.push(token);
    console.log(filteredRegTokens)
    admin.messaging().subscribeToTopic(filteredRegTokens, 'all')
        .then(function (response) {
            // See the MessagingTopicManagementResponse reference documentation
            // for the contents of response.
            console.log('Successfully subscribed to topic:', response);
        })
        .catch(function (error) {
            console.log('Error subscribing to topic:', error);
        });
}