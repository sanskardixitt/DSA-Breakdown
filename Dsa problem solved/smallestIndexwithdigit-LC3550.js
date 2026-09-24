function calculateSum(num){
    let sum =0;

    if(num <= 0)return 0;

    while (num > 0){
        sum += num % 10;
        num = Math.floor(num/10);
    }
    return sum;
}

var smallestIndexWithLargestDigit = function(nums) {

    if (nums.length === 0) return -1;

    let smallestIndex = -1;

    let length = nums.length;

    for (let i = 0; i < length; i++) {
        let currentNum = nums[i];
        let result = calculateSum(currentNum);

        if(i == result){
            smallestIndex = i;
            break;
        }
     

    }

    return (smallestIndex === -1) ? -1 : smallestIndex;


}

console.log(smallestIndexWithLargestDigit([1,10,11]));