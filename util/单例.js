class Singleton {
    constructor() {
      if (!Singleton.instance) {
        // 单例对象的代码
        Singleton.instance = this;
      }
      return Singleton.instance;
    }
  
    // 属性和方法
    someMethod() {
      console.log('Some method');
    }
  }
  
  // 使用单例
  const instance1 = new Singleton();
  const instance2 = new Singleton();
  
  console.log(instance1 === instance2); // 输出: true