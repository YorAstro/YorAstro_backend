const { server } = require('./app');
const config = require('./config/config');

const PORT = config.port;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});