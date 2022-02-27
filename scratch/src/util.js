export default {
  foo (fn) {
    callWithErrorHandling(fn);
  },
  bar (obj) {
    callWithErrorHandling(fn);
  },
  registerErrorHandler(fn) {
    handleError = fn;
  }
}

function callWithErrorHandling(fn) {
  try {
    fn && fn();
  } catch (e) {
    handleError(e)
  }
}