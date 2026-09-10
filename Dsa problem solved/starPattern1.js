// # * # * #
// * # * # *
// # * # * #
// * # * # *
// # * # * #

function loop() {
    let star = "*";
    let hash = "#";

    for (let i = 0; i < 5; i++) {
        let row = "";

        for (let j = 0; j < 5; j++) {
            if (j % 2 === 0) {
                row += hash + " ";
            } else {
                row += star + " ";
            }
        }

        console.log(row);
    }
}

loop();