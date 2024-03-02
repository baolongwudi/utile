/**
 * 
 * @param {Function} fn 
 */
function isAsyncFunction(fn){
    return Object.prototype.toString.call(fn) === '[object AsyncFunction]'
}