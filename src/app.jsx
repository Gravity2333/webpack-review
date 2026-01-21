import Home from "./pages/Home";
import Utils from "./pages/Utils";
import jQuery from "jquery";
import unwindPng from "@assets/unwind.png";
import _ from "lodash";
import("./utils/tools");
export default function App() {
  // console.log(1,_.add(1,2),add(PI, 1), jQuery.ajax("http://10.0.3.104"));
  console.log(222);
  return (
    <>
      <img src={unwindPng} />
      <Home />
      <Utils/>
    </>
  );
}
