// 1
// 12
// 123
// 1234



function loop() {
    let star = "*";
    let hash = "#";

    for (let i = 1; i < 5; i++) {
        let row = "";
        for (let j = 1; j <= i; j++) {
            row = row + `${j}`;
        }
        console.log(row);
    }
}

loop();