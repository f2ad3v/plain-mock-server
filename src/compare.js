module.exports = (value1, value2, isNumeric = false) => {

  const val1 = String(value1);
  const val2 = String(value2);

  if (isNumeric) {
    return val1.localeCompare(val2, undefined, { numeric: true });
  }

  return val1.localeCompare(val2, undefined, { sensitivity: 'base' });
};

// console.log(compare('abc', 'abc')); // 0
// console.log(compare('ABC', 'abc')); // 1
// console.log(compare('abc', 'ABC')); // -1

// console.log(compare('TESTE', 'teste')); // 0
// console.log(compare('áÀã-Éê-í-óÔ-ú-ç', 'aaa-ee-i-oo-u-c')); // 0

// // compare number
// console.log(compare('2', 2, true)); // 0 =
// console.log(compare('2', 1, true)); // 1 >
// console.log(compare('2', 10, true)); // -1 <

// // compare string
// console.log(compare('2', 2)); // 0
// console.log(compare('2', 1)); // 1
// console.log(compare('2', 10)); // 1