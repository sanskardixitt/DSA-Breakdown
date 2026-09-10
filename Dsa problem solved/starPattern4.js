//     #
//    ##
//   ###
//  ####
// #####


function loop() {
    let star = "*";
    let hash = "#";

    for (let i = 1; i <= 5; i++) {
        let row = "";
        for (let j = 5; j >= 1; j--) {

            if (j <= i) {
                row = row + hash;
            }
            else {

                row = row + " ";
            }
        }
        console.log(row);
    }
}

loop();