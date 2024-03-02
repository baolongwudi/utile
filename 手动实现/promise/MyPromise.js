// 什么是promise    对象  then  then 返回一个promise
// promise能干嘛
// 两种结果  三种状态

// 状态

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const NODE = "node";
const BROWSER = "browser";
const OTHER = "other";

const env = (() => {
  if (typeof process === "object" && typeof process.nextTick === "function")
    return NODE;
  if (MutationObserver) {
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
   * @param {Function} executor 确定状态的回调函数
   */
  constructor(executor) {
    this._state = PENDING;
    this._value = undefined;
    this._handles = [];
    try {
      executor(this._resole.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }
  /**
   * 添加一项任务
   * @param {Function} executor
   * @param {String} state
   * @param {Function} resolve
   * @param {Function} reject
   */
  _pushHandler(executor, state, resolve, reject) {
    this._handles.push({
      executor,
      state,
      resolve,
      reject,
    });
  }
  /**
   * 执行任务队列
   */
  _runHandlers() {
    if (this._state === PENDING) return;
    while (this._handles[0]) {
      this._runOneHandlers(this._handles[0]);
      this._handles.shift();
    }
  }
  /**
   * 处理一个任务执行
   * @param {Object} obj 任务列表对象
   */
  _runOneHandlers({ executor, state, resolve, reject }) {
    runMicroTask(() => {
      if (this._state !== state) return;
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
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 添加一个任务
   * @param {Function} onFulfilled 成功之后执行的函数
   * @param {Function} onRejected 失败之后执行的函数
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this._pushHandler(onFulfilled, FULFILLED, resolve, reject);
      this._pushHandler(onRejected, REJECTED, resolve, reject);
      this._runHandlers();
    });
  }
  /**
   * 更新属性和状态
   * @param {any} value 新数据
   * @param {String} state 状态
   */
  _changeState(value, state) {
    if (this._state !== PENDING) return;
    this._state = state;
    this._value = value;
    this._runHandlers();
  }

  /**
   *
   * @param {any} value 设置状态成功的数据
   */
  _resole(value) {
    this._changeState(value, FULFILLED);
  }
  /**
   *
   * @param {any} value 设置拒绝之后的数据
   */
  _reject(value) {
    this._changeState(value, REJECTED);
  }
}

