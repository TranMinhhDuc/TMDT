const myArray = [
    {
        a: 1,
        b: 2,
        c: 3
    },
    {
        a: 2,
        b: 3,
        c: 4
    },
    {
        a: 7,
        b: 8,
        c: 9
    }
]


const resultMap = myArray.map((item) => {
    if(item.a == 2) return item;
})

console.log(resultMap);