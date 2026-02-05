import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import Utils from "./pages/Utils";
import jQuery from "jquery";
import _ from "lodash";
import unwindPng from "@assets/unwind.png";
import MyTxt from "./test.txt";
import styles from "./global.less";
import { createStore, applyMiddleWare } from "my-sample-redux";
import { Provider } from "my-redux-connect";
import("./utils/tools"); // 动态导入

function reducer(state, action) {
  if (action.type === "add") {
    return {
      ...state,
      cnt: state.cnt + action.payload,
    };
  }
  return {
    ...state,
    cnt: 10,
  };
}

function thunk(middlewareApi) {
  return (dispatch) => (action) => {
    if (typeof action === "function") {
      action(dispatch, middlewareApi.getState);
    } else {
      dispatch(action);
    }
  };
}

const store = createStore(reducer, applyMiddleWare(thunk));

// Web Worker 创建
const workerFile = new File(
  [
    `console.log("I am a worker!");
self.onmessage = (e) => {
  self.postMessage(e.data + 1);
};`,
  ],
  "worker.js",
  { lastModified: new Date(), type: "application/javascript" },
);
const webWorker = new Worker(URL.createObjectURL(workerFile));

export default function App() {
  const [workerResult, setWorkerResult] = useState(null);

  useEffect(() => {
    // 发送数据给 Worker
    webWorker.postMessage(100);
    webWorker.onmessage = (e) => {
      console.log("Worker returned:", e.data);
      setWorkerResult(e.data);
    };

    // 测试 jQuery
    jQuery(() => console.log("jQuery works"));

    // 测试 Lodash
    console.log("Lodash add:", _.add(1, 2));
  }, []);

  return (
    <Provider store={store}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Webpack 打包练习和配置说明</h1>
        </header>

        <main className={styles.main}>
          <section className={styles.card}>
            <h2>图片资源</h2>
            <img src={unwindPng} alt="Unwind" className={styles.image} />
          </section>

          <section className={styles.card}>
            <h2>文本资源</h2>
            <pre className={styles.text}>{MyTxt}</pre>
          </section>

          <section className={styles.card}>
            <h2>Web Worker</h2>
            <p>发送 100 给 Worker → 返回结果: {workerResult}</p>
          </section>

          <section className={styles.card}>
            <h2>页面组件</h2>
            <Home />
            <Utils />
          </section>
        </main>

        <footer className={styles.footer}>
          <p>© 2026 Webpack 打包练习 Demo</p>
        </footer>
      </div>
    </Provider>
  );
}
