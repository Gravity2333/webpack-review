import { connect, useDispatch } from "my-redux-connect";
import { useEffect } from "react";

function Utils({ cnt, addCnt, addCntAsync }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "add",
      payload: 100,
    });
  }, []);

  return (
    <div>
      <>{cnt}</>
      <button
        onClick={() => {
          addCnt(5);
        }}
      >
        +
      </button>

      <button
        onClick={() => {
          addCntAsync(5);
        }}
      >
        + delay
      </button>

      <button
        onClick={() => {
          dispatch({
            type: "add",
            payload: 100,
          });
        }}
      >
        + dispatch fn
      </button>
    </div>
  );
}

export default connect(
  (state) => {
    return {
      cnt: state.cnt,
    };
  },
  (dispatch) => {
    return {
      addCnt(payload) {
        dispatch({
          type: "add",
          payload,
        });
      },
      addCntAsync(payload) {
        dispatch(async (dispatch) => {
          setTimeout(() => {
            dispatch({
              type: "add",
              payload,
            });
          }, 1000);
        });
      },
    };
  },
)(Utils);
