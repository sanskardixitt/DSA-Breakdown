 function countDigit(num) {
    let count = 0;
    while (num>0){

        let x = num %10;
        count++;
        num = Math.floor(num/10);
    }
    return count;
 }

 console.log(countDigit(123456789));