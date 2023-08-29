import "./db";
import "./models/Video"; 
import app from "./server";

const PORT = 4000;

const handleListening = () => {
    console.log(`✅ app listening on port localhost:${PORT} 🚀`)
}

app.listen(PORT, handleListening);
