var asyncIterable = {
    [Symbol.asyncIterator]() {
      return {
        i: 0,
        next() {
          if (this.i <= 10) {
            return Promise.resolve({ value: this.i++, done: false });
          }
          return Promise.resolve({ done: true });
        },
      };
    },
  };
  
  (async function () {
    for await (num of asyncIterable) {
      console.log(num);
    }
  })();
  
  // 0
  // 1
  // 2