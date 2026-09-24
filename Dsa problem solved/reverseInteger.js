var reverse = function(x) {
    let sign = x < 0 ? -1 : 1;
    let reversed = Number(
        Math.abs(x).toString().split('').reverse().join('')
    );

    reversed *= sign;

    if (reversed < -2147483648 || reversed > 2147483647) {
        return 0;
    }
 
    return reversed;
};

console.log(reverse(-123));