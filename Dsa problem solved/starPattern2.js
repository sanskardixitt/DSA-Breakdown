// *
// **
// ***
// ****
// *****



function loop() {
    let star = "*";
    let hash = "#";

    for (let i = 0; i < 5; i++){
        let row = "";
        for (let j = 0; j <= i; j++){
            row = row + star;
        }
        console.log(row);
    }
}

loop();