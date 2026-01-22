import Home from "./pages/Home";
import Utils from "./pages/Utils";
import jQuery from "jquery";
import unwindPng from "@assets/unwind.png";
import _ from "lodash";
import MyTxt from './test.txt'
import styles from './global.less'
import("./utils/tools");

// const webWorker = new Worker(`data:application/javascript;utf-8,
//   ${encodeURIComponent(`console.log("i am worker!")
//   self.onmessage = (e) => {
//     self.postMessage(e.data + 1);
//   };`)}
//   `);

// webWorker.postMessage(100);
// webWorker.onmessage = (e) => {
//   console.log(e);
// };

const workerFile = new File(
  [
    `console.log("i am worker!")
  self.onmessage = (e) => {
    self.postMessage(e.data + 1);
  };`,
  ],
  "worker.js",
  {
    lastModified: new Date(),
    type: "application/javascript",
  },
);
console.log(MyTxt)
const webWorker = new Worker(URL.createObjectURL(workerFile));

webWorker.postMessage(100);
webWorker.onmessage = (e) => {
  console.log(e);
};

export default function App() {
  // console.log(1,_.add(1,2),add(PI, 1), jQuery.ajax("http://10.0.3.104"));
  console.log(222);
  return (
    <div className={styles['container']}>
      <img src={unwindPng} />
      <Home />
      <Utils />
    </div>
  );
}
