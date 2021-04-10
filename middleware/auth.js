import admin from '../index.js';

//Working of Middleware: Suppose a user wants to like a post
// click the like button => auth middleware(next) => like controller...

const auth = async (req, res, next) => {
    const idToken = req.headers.authorization;

    // idToken comes from the client app
    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            req.userId = decodedToken.uid;

            next();
        })
        .catch((error) => {
            // Handle error
            console.log(error);
        });
}


export default auth;