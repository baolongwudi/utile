
// const arr = [2,33,33, 3, 1,3, 2, 3];

/**
 * 判断两个数据是否相等 相等返回true
 * @param {any} data 现在的数据
 * @param {any} next 需要比对的数据
 */
function isWeight(data, next) {
    if (
      (typeof data !== "object" && typeof next !== "object") ||
      data === null ||
      next === null
    ) {
      if (data === next) return true;
      return false;
    }
  
    if (
      Object.keys(data).length !== Object.keys(next).length ||
      Object.getPrototypeOf(data) !== Object.getPrototypeOf(next)
    ) {
      return false;
    }
  
    
    for (let key in data) {
      if (data[key] !== next[key]) {
        return false;
      }
    }
  
    return true;
  }
  
  
  /**
   * 数组去重
   * @param {Array} arr 需要去重的数组
   */
  function deWeight(arr) {
    let resp = []; // 需要返回的数组
    let isTrue = false; // 是否重复
    for (let i = 0; i < arr.length; i++) {
      if (i === arr.length - 1) {
        resp.push(arr[i]);
        break;
      }
      for (let j = i + 1; j < arr.length; j++) {
      isTrue = isWeight(arr[i], arr[j]);
      if(isTrue){
        break;
      }
      }
     if(!isTrue){
      resp.push(arr[i]);
     }
    }
    return resp;
  }
  
  
  const arr = [{a : 1},{a : 1},3,4,56,6,6,6,6];
  
  
  console.log(deWeight(arr));
  