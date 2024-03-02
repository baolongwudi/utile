class a {
  run() {
    console.log("执行 run 方法");
  }
  c(){

  }
}


const proxy = new Proxy(a, {
  get(target, prop) {
    if (prop === "run") {
      throw new Error("访问被禁止");
    }
    return target[prop];
  },
});

const b = new a();


console.log(b.run)