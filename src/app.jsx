import Home from "./pages/Home";
import { add } from "./utils/tools";
import jQuery from "jquery";
import _ from "lodash";
export default function App() {
  console.log(_.add(1,2),add(PI, 1), jQuery.ajax("http://10.0.3.104"));
  return (
    <>
      <Home />
    </>
  );
}
