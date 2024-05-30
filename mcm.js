class MatrixChainMultiplication {
  constructor(dimensios) {
    this.p = dimensios; //ذخیره ابعاد
    this.n = dimensios.length - 1; // تعداد ماتریس
    this.m = Array.from({ length: this.n }, () => Array(this.n).fill(0)); // جدول هزینه ها
    this.s = Array.from({ length: this.n }, () => Array(this.n).fill(0)); //جدول نشان دهنده جایگاه تقسیمات
  }
  matrixChainOrder() {
    for (let l = 2; l <= this.n; l++) {
      // ببرسی طول زنجیره از 2 تا n
      for (let i = 0; i < this.n - l + 1; i++) {
        // شروع زنجیر
        let j = i + l - 1; //پایان زنجیر
        this.m[i][j] = Number.MAX_SAFE_INTEGER; //مقدار اولیه بزرگ برای مقایسه
        for (let k = i; k < j; k++) {
          //بررسی تمام تقسیمات ممکن زنجیر
          let q =
            this.m[i][k] +
            this.m[k + 1][j] +
            this.p[i] * this.p[k + 1] * this.p[j + 1];
          if (q < this.m[i][j]) {
            //اگر هزینه کمتر باشد انرا به روز رسنی میکنیم
            this.m[i][j] = q;
            this.s[i][j] = k; //محل تقسیم را ذخیره میکنیم
          }
        }
      }
    }
  }
  printOptimalParens(i, j) {
    if (i == j) {
      //اگر یک ماتریس باشد
      return `A${i + 1}`;
    } else {
      let left = this.printOptimalParens(i, this.s[i][j]); //قسمت چپ تقسیم
      let right = this.printOptimalParens(this.s[i][j] + 1, j); //قسمت راست تقسیم
      return `(${left} x ${right})`;
    }
  }
}

class GreedyMatrixChainMultiplication {
  constructor(dimensios) {
    this.p = dimensios; // ذخیره ابعادا
  }
  greedyMatrixChainOrder() {
    let n = this.p.length - 1;
    let result = [];
    let p = [...this.p]; //کپی از ابعاد ماتریس

    while (n > 1) {
      let maxDim = -1;
      let index = -1;
      for (let i = 1; i < n; i++) {
        if (p[i] > maxDim) {
          //پیدا کردن بزرگ ترین بعد
          maxDim = p[i];
          index = i;
        }
      }
      result.push([index - 1, index]); //ذخیره تقسیم
      p.splice(index, 1); // حذف بعد انتخاب شده
      n--;
    }
    return result;
  }
}
class Utils {
  static generateRandomMatrices(num) {
    let matrices = [];
    for (let i = 0; i < num; i++) {
      matrices.push(Math.floor(Math.random() * 100) + 1); //تولید عدد تصادفی بین 1تا 100
    }
    return matrices;
  }
  static measureExcutionTime(func, ...args) {
    const start = performance.now();
    let result = func(...args); // اجرا و اندازه گیری تابع
    const end = performance.now();
    return { result, time: end - start };
  }
}
const numMatrices = 5;
const matrices = Utils.generateRandomMatrices(numMatrices);
console.log("Matrices dimensions:", matrices);

//اندازه‌گیری زمان اجرا و اجرای
const dpInstance = new MatrixChainMultiplication(matrices);
const dpResult = Utils.measureExcutionTime(() => {
  dpInstance.matrixChainOrder();
  return dpInstance;
});
console.log(`Dynamic Programming Time: ${dpResult.time} ms`);
console.log(
  "Optimal Order (DP):",
  dpInstance.printOptimalParens(0, matrices.length - 2)
);

const greedyInstance = new GreedyMatrixChainMultiplication(matrices);
const greedyResult = Utils.measureExcutionTime(() =>
  greedyInstance.greedyMatrixChainOrder()
);

//نمایش زمان و نتیجه
console.log(`Greedy Algorithm Time: ${greedyResult.time} ms`);
console.log(
  "Greedy Order:",
  greedyResult.result.map((pair) => `(${pair[0]},${pair[1]})`).join(" -> ")
);
