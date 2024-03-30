import "dotenv/config";
import { app } from "./src/app.js";

const port = process.env.SERVER_PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
