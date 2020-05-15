//test.js

let arr = []
let NUM = 9

for (let i = 0; i < NUM; i++) {
  arr[i] = 0
}

for (let i = 1; i < 40000; i++) {
  let r = Math.floor( Math.random() * NUM )
  arr[r] += 1
}

console.log(arr, Math.max(...arr), Math.min(...arr) )