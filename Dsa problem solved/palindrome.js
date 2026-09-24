function palindrome(num){

    let rev = 0;
    let temp =  num;
     if (num < 0 || (num !== 0 && num % 10 === 0)) return false; 
    while(num>0){

        let x =num%10;
        rev = rev*10+x;
        num = Math.floor(num/10);

    }
    return rev === temp;
}
console.log(palindrome(12321));