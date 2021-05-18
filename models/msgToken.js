import mongoose from 'mongoose';

const tokenSchema = mongoose.Schema({
    _id: String,
    token: String
})

const MessageToken = mongoose.model("MessageToken", tokenSchema);

export default MessageToken;