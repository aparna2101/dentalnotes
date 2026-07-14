
exports.customErrorLogger = (err) => {
  if (!(err instanceof Error)) {
    err = new Error(err);
  }
  console.error(err);
};
