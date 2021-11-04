const createStore = (reducer, initState = undefined, enhaner = undefined) => {
  if(typeof enhaner === "function") {
    return enhaner(createStore)(reducer, initState);
  }

  let state = initState;

  let listenersList = [];

  const getState = () => {
    return state
  }

  const dispatch = (action) => {
    state = reducer(state, action)
    listenersList.forEach(cb => {
      cb()
    });
    return action
  }

  const subscribe = (listeners) => {
    if(typeof listeners === 'function') {
      listenersList.push(listeners)
      return () => {
        const index = listenersList.findIndex(ls => ls === listeners);
        listenersList.splice(index, 1)
      }
    }else{
      throw new Error("listeners must be a function");
    }
  }

  return {
    getState,
    dispatch,
    subscribe
  }

}

export default createStore;
