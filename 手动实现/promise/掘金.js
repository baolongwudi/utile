const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const NODE = "node";
const BROWSER = "browser";
const OTHER = "other";

const env = (() => {
  if (typeof process === "object" && typeof process.nextTick === "function")
    return NODE;
  if (typeof MutationObserver === "function") {
    return BROWSER;
  }
  return OTHER;
})();

const microTask = {
  [NODE]: (callback) => {
    process.nextTick(callback);
  },
  [BROWSER]: (callback) => {
    const div = document.createElement("div");
    const observer = new MutationObserver(callback);
    observer.observe(div, {
      childList: true,
    });
    div.innerHTML = "1";
  },
  [OTHER]: (callback) => {
    setTimeout(callback, 0);
  },
};

/**
 * 添加一个函数到微队列里面
 * @param {Function} callback 任务函数
 */
function runMicroTask(callback) {
  microTask[env](callback);
}

/**
 * 判断函数是否为promise
 * @param {Object} obj
 */
function isPromise(obj) {
  return !!(obj && typeof obj === "object" && typeof obj.then === "function");
}

class MyPromise {
  /**
   *
   * @param {Function} executor 立即执行这个函数
   */
  constructor(executor) {
    if (typeof executor !== "function") {
      throw TypeError(`An argument is not a function`);
    }
    this._state = PENDING;
    this._value = undefined;
    this._handles = [];
    try {
      executor(this._resole.bind(this), this._reject.bind(this)); //这里需要使用bind绑定一下this,不然之后在resole里面使用this的话可能会出现问题造成参数访问不了，这个就不细讲了大家可以下去模拟一下
    } catch (exception) {
      this._reject(exception);
    }
  }
  /**
   * 设置promise的状态和值 状态和值只能修改一次
   * @param {String} state 状态
   * @param {any} value 值
   */
  _changeState(state, value) {
    if (this._state !== PENDING) return;
    this._state = state;
    this._value = value;
    this._runHandles();
  }

  /**
   * 取出处理队列里面的任务一个一个执行
   */
  _runHandles() {
    if (this._state === PENDING) return;
    while (this._handles[0]) {
      this._runOneHandles(this._handles[0]);
      this._handles.shift(); //每次执行完都要弹出去
    }
  }
  /**
   * 处理一项数据
   * @param {Object} param0
   */
  _runOneHandles({ executor, state, resolve, reject }) {
    runMicroTask(() => {
      if (state !== this._state) return;
      if (typeof executor !== "function") {
        state === FULFILLED ? resolve(this._value) : reject(this._value);
        return;
      }
      try {
        const resp = executor(this._value);
        if (isPromise(resp)) {
          resp.then(resolve, reject);
        } else {
          resolve(resp);
        }
      } catch (reason) {
        reject(reason);
      }
    });
  }
  /**
   * 设置当前promise的状态为成功 传递一个value为成功之后的数据
   * @param {any} value 成功的值
   */
  _resole(value) {
    this._changeState(FULFILLED, value);
  }
  /**
   * 调用这个函数设置promise的状态为失败 并且有一个失败的原因
   * @param {any} reason 失败的原因
   */
  _reject(reason) {
    this._changeState(REJECTED, reason);
  }
  /**
   * 向任务队列里面添加一项
   * @param {Function} executor 需要执行的函数
   * @param {String} state 当前这个函数是在什么状态下执行
   * @param {Function} resolve 设置当前promise为成功
   * @param {Function} reject 设置当前Promise为失败
   */
  _addOneHandles(executor, state, resolve, reject) {
    this._handles.push({
      executor,
      state,
      resolve,
      reject,
    });
  }

  /**
   * 可以多次调用
   * @param {Function} onFulfilled 完成之后执行的函数
   * @param {Function} onRejected 失败之后执行的函数
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this._addOneHandles(onFulfilled, FULFILLED, resolve, reject);
      this._addOneHandles(onRejected, REJECTED, resolve, reject);
      this._runHandles();
    });
  }
}

let r;

const p1 = new Promise((re) => {
  re(1);
}).then((r) => {
  console.log(r);
  return 2;
});

const p2 = p1.then().then((r) => {
  console.log(r); 
});

console.log(p1) 