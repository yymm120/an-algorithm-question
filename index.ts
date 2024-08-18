import { argv } from "process";
import Point, { Axis } from "./point.js";

/**
 *    m 和 n, 其中一个值固定为3时, 存在如下一个规律
 *    [3] = 1 + 1 = 2
 *    [4] = 2 + 2 = 4 = 2^2
 *    [5] = 4 + 4 = 8 = 2^3
 *    [6] = 8 + 8 = 16 = 2^4
 *    [7] = 16 + 16 = 32 = 2^5
 *    另外, m 和 n 如果都是2的倍数, 似乎找不到满足的路径
 * 
 *    当 m和n >= 4时, 通过模拟坐标点的行走过程, 遍历求解。
 */
const solve = (m, n) => {
  if (m < 2 || n < 2 || (m === 2 && m === n)) {
    return 0;
  } else if ((m === 2 && n % 2 === 0) || (n === 2 && m % 2 === 0)) {
    return 0;
  }
  else if (m % 2 === 0 && n % 2 === 0) {
    return 0;
  }
   else if ((m === 2 && n % 2 === 1) || (n === 2 && m % 2 === 1)) {
    return 1;
  } else {
    if (m === 3) {
      return 2 << (n - 3);
    } else if (n === 3) {
      return 2 << (m - 3);
    } else {
      // 其他情况
      return count_a_to_b_by_simulation(m, n);
    }
  }
};



/**
 * 模拟从坐标轴原点a(0, 0) 行走到坐标轴右上角b (n-1, m-1)
 * 几乎可以肯定, 它存在性能问题。
 */
const count_a_to_b_by_simulation = (m, n) => {
  const axis = new Axis(m, n);
  const a_point = new Point(0, 0, axis);
  let count = 0;
  while (true) {
    let { choosed_position } = a_point.choose_position();
    if (!choosed_position) {
      // 满足所有点都经过(total_step)) && 满足最后一个点刚好等于 b点
      if (a_point.step === axis.total_step && a_point.position.toString() === a_point.destination.toString()) {
        count = count + 1;
      }
      a_point.roll_back();
      // 跳出while
      if (a_point.done === true) {
        break;
      }
      continue;
    }
    a_point.go_one_time(choosed_position);
  }
  return count;
}


// console.log(count_a_to_b_by_simulation(5, 7))
// console.log(solve(3, 8));
// console.log(count_a_to_b_by_simulation(3, 5));
// 编写一段程序求解:m2、3、4，n=6、7、8时的所有组合情况

console.log("m=2, n=6, result is ", solve(2, 6));
console.log("m=2, n=7, result is ", solve(2, 7));
console.log("m=2, n=8, result is ", solve(2, 8));
console.log("m=3, n=6, result is ", solve(3, 6));
console.log("m=3, n=7, result is ", solve(3, 7));
console.log("m=3, n=8, result is ", solve(3, 8));
console.log("m=4, n=6, result is ", solve(4, 6));
console.log("m=4, n=7, result is ", solve(4, 7));
console.log("m=4, n=8, result is ", solve(4, 8));

