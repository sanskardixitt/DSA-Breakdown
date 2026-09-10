function secondLargest(arr) {

    let length = arr.length;
    let largest = -Infinity;
    let secondLargest = -Infinity;


    for (let i = 0; i < length; i++) {
        if (arr[i] > largest) {
            secondLargest = largest;
            largest = arr[i];
        }
        else if (arr[i] > secondLargest) {
            secondLargest = arr[i];
        }

    }
    return secondLargest;

}

let arr = [22, 33, 44, 66, 77];

let result = secondLargest(arr);

console.log(result);

