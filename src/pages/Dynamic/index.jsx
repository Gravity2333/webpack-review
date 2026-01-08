
const LazyComp = import(
  /** webpackPrefetch */"../Dynamic2")
export default function Dynamic() {
 console.log("Dynamic component loaded111",LazyComp);
  return (
    <div >
      Dynamic!!
    </div>
  );
}
