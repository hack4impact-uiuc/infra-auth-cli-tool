
//      

module.exports = (handler            ) => async (...args       ) => {
    try {
      return await handler(...args)
    } catch (e) {
      console.trace(e);
      process.exit(1);
    }
  }