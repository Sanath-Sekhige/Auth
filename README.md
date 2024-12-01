npm install bcryptjs cookie-parser crypto dotenv express jsonwebtoken mailtrap mongoose

npm install -D nodemon

npm run dev

.env
MONGO_URI= <mongodb connection string>
PORT=5000
JWT_SECRET=mysecretkey
NODE_ENV=development
MAILTRAP_TOKEN= <mailtrap token>
MAILTRAP_ENDPOINT= <mailtrap endpoint>
CLIENT_URL=http://localhost:5173
