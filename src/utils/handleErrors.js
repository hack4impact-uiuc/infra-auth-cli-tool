
// @flow

module.exports = (handler: any => any) => async (...args: [any]) => {
    try {
      return await handler(...args)
    } catch (e) {
      console.trace(e);
      process.exit(1);
    }
  }