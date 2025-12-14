let arr = [10, 20, 30, 40]

function traverse(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);

    }
}

function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max
}

function findMin(arr) {
    let min = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i]
    }
    return min
}


// sum of arraya elements
function arraySum(arr) {
    let sum = 0;
    for (let num of arr) {
        sum += num;
    }
    return sum
}


function reverseArray(arr) {
    let left = 0
    let right = arr.length - 1;
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]]
        left++
        right--
    }
}

// check if array is sorted or not 
function isSorted(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return false
        }
    }
    return true
}

// move all zeros to end 

function moveZeros(arr) {
    let index = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 0) {
            arr[index] = arr[i];
            index++;
        }
    }

    while (index < arr.length) {
        arr[index++] = 0;
    }
}




// sliding window

function maxSubArraySum(arr, k) {
    let maxSum = 0;
    let windowSUm = 0;

    for (let i = 0; i < k; i++) {
        windowSUm += arr[i];
    }

    maxSum = windowSUm;


    for (let i = k; i < arr.length; i++) {
        windowSUm += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSUm);
    }

    return maxSum

}

// find duplicate Element in array 

function findDuplicate(arr) {
    let seen = new Set()

    for (let num of arr) {
        if (seen.has(num)) {
            return num;
        }
        seen.add(num)
    }
    return -1;
}


let arr2 = [
    12, 45, 7, 89, 23, 56, 14, 67, 90, 34,
    21, 78, 55, 43, 19, 88, 6, 72, 31, 50,
    64, 27, 81, 9, 38, 60, 73, 16, 42, 95,
    28, 11, 84, 69, 5, 92, 37, 58, 76, 24,
    45
]



// rotate array by k 
function rotateArray(arr, k) {
    k = k % arr.length;

    reverse(arr, 0, arr.length - 1);
    reverse(arr, 0, k - 1);
    reverse(arr, k, arr.length - 1)
}


function reverse(arr, l, r) {
    while (l < r) {
        [arr[l], arr[r]] = [arr[r], arr[l]]
        l++;
        r--;
    }
}




// finding second largest from array 
function secondLarget(arr) {
    let larget = -Infinity;
    let second = -Infinity;

    for (let num of arr) {
        if (num > larget) {
            second = larget;
            larget = num
        } else if (num < larget && num > second) {
            second = num;
        }
    }

    return second === -Infinity ? null : second
}


function removeDuplicates(arr) {
    if (arr.length === 0) return 0

    let index = 1;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i - 1]) {
            arr[index] = arr[i]
            index++
        }
    }

    return index
}
// this is first method 

// second method to remvoe duplicate from array

function secondMethodToRemoveDuplicates(arr) {
    let newSet = new Set(arr);
    return [...newSet]
}

function secondMethod2(arr) {
    return Array.from(new Set(arr));

}

let arr1 = [1, 2, 3, 4, 5, 5, 0, 8, 5, 4, 8, 0, 8, 7, 4]



function intersection(arr1, arr2) {
    let set = new Set(arr1);
    let result = [];

    for (let num of arr2) {
        if (set.has(num)) {
            result.push(num)
            set.delete(num)
        }
    }
}


function intersectionSorted(arr1, arr2) {
    let i = 0, j = 0
    let result = []

    while (i < arr1.length && j < arr2.length) {
        if (arr[i] === arr[j]) {
            result.push(arr[i])
        } else if (arr[i] < arr[j]) {
            i++
        }
        else {
            j++
        }
    }
    return result
}


// kadane algirthm

function maxSubArray(arr) {
    let maxSum = arr[0]
    let currentSum = arr[0]

    for (let i = 0; i < arr.length; i++) {
        currentSum = Math.max(arr[i], currentSum + arr[i]);
        maxSum = Math.max(maxSum, currentSum)
    }
    return maxSum
}


// leaders in Array 

function leader(arr) {
    let result = [];
    let maxRight = -Infinity

    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] > maxRight) {
            result.push(arr[i])
            maxRight = arr[i]
        }
    }
    return result.reverse()
}


function thirdLarget(arr) {
    let first = -Infinity
    let second = -Infinity
    let third = -Infinity

    for (const num of arr) {
        if (num > first) {
            third = second
            second = third
            first = num
        } else if (num < second && num > third) {
            third = second;
            second = num
        } else if (num < second && num > third) {
            third = num
        }

    }
    return third === -Infinity ? null : third
}



function union(arr1, arr2) {
    return [...new Set(...[arr1], ...[arr2])]
}


function maxProduct(arr){
    let maxProd = arr[0]
    let minProd = arr[0]
    let result = arr[0]


    for(let i = 1 ; i < arr.length ; i++){
        let curr = arr[i]

        let tempMax = Math.max(curr, maxProd * curr , minProd * curr)
        minProd = Math.min(curr , maxProd * curr , minProd * curr)
        maxProd = tempMax

        result = Math.max(result , maxProd)
    }
    return result
}



function equilibreum(arr){
    let totalSum = arr.reduce((a , b) => a+ b , 0)
    let leftSum = 0

    for(let i =0 ; i< arr.length ; i++){
        totalSum -= arr[i]
        if (leftSum === totalSum) {
            return i 
        }
         leftSum += arr[i]
    }

    return -1
}
































// console.log(secondMethodToRemoveDuplicates(arr1));


// moveZeros(arr1)
// console.log(arr1);


// console.log(findDuplicate(arr2));

// let check = isSorted(arr)
// console.log(check);


// console.log(reverseArray(arr) , arr);
// console.log(arraySum(arr));
// console.log(findMin(arr));
// console.log(findMax(arr));
// traverse(arr)