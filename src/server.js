const app = require('./app');
const config = require('./config');
const { initDB } = require('./setup');

initDB();

app.listen(config.PORT, () => {
  console.log(`Startup Buzzer listening on port ${config.PORT}!`)
});
