var missingNumber = function(nums) {
    const n = nums.length;
    const seen = Array(n + 1).fill(false);

    for (const value of nums) {
        seen[value] = true;
    }

    for (let i = 0; i <= n; i++) {
        if (!seen[i]) {
            return i;
        }
    }
};

console.log(missingNumber([3, 0, 1])); 


    // let len = nums.length;
    // let sum = len*(len+1)/2;

    // let partialSum = 0;

    // for(let i=0;i<len;i++)
    // {
    //     partialSum += nums[i];
    // }

    // return (sum - partialSum);
    