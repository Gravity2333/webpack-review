import styles from "./index.less";
import uwwindPng from "../../assets/unwind.png";
import { lazy, Suspense } from "react";
import { useEffect } from "react";

const intervalFn = ()=>{
  console.log("interval",performance.now())
}
const interval = setInterval(intervalFn,2000);
if (module.hot) {
  // module.hot.accept();
  module.hot.dispose(()=>{
    console.log('热更新了模块')
    clearInterval(interval)
  })
}

// 1. 定义 lazy
const LazyComp = lazy(() => import(/* webpackPreload: true */ "../Dynamic"));
console.log(231231)

export default function Home() {
  useEffect(() => {
    // 关键：你必须真正运行 import() 这一行代码
    // 只有运行了这一行，Webpack 的运行时脚本才会动态往 <head> 插入 <link>
    import(/* webpackPreload: true */ "../Dynamic");
  }, []);

  return (
    <div>
      <h2>Hello React!</h2>
      {/* 或者取消这里的注释，渲染它也会触发 */}
      <Suspense fallback="loading"><LazyComp /></Suspense>
      <input placeholder="input text to test!" />
    </div>
  );
}

function unusedFn() {
  window.a = 123;
  return 123;
}

/*#__PURE__*/ unusedFn();
