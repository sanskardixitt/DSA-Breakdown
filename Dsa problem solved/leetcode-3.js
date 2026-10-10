
var lengthOfLongestSubstring = function(s) {
    let left = 0;
    let maxLength = 0;
    let charSet = new Set();

    for (let right = 0; right < s.length; right++) {
        // Remove characters until the duplicate is gone
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }

        // Add current character
        charSet.add(s[right]);

        // Update maximum window length
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
};

console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb"));    // 1
console.log(lengthOfLongestSubstring("pwwkew"));   // 3
