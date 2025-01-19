const express = require('express');
const app = express();

// Fetch server name from environment variables
const serverName = process.env.SERVER_NAME || "undefined";

app.get('/', (req, res) => {
  res.send(`Hello from Backend Server! - ${serverName}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on fine on port ${PORT}`));
