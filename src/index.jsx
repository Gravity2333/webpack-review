import { createRoot } from "react-dom/client";
import App from './app'

const root = createRoot(document.querySelector("#container"));

root.render(<App/>);

// module.exports = {a: 100}