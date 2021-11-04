export default function compose(...fns) {
  if (fns.length === 0) {
    return (arg) => arg;
  } else if (fns.length === 1) {
    return fns[0];
  } else {
    return fns.reduce((pre, val) => {
      return (...args) => pre(val(...args))
    });
  }
}
