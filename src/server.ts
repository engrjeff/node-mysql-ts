import * as dotenv from 'dotenv';

dotenv.config();

import app from './app';

const PORT = process.env.PORT as string;

app.listen(PORT, () => {
  console.log(`API running at Port: ${PORT}...`);
});
