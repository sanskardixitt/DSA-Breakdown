var reverseString = function(s) {
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
        // Swap characters
        [s[left], s[right]] = [s[right], s[left]];

        left++;
        right--;
    }
};

console.log(reverseString(["h","e","l","l","o"])); // ["o","l","l","e","h"]