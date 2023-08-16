module.exports = {
    "MODE": "tdm",
    "serverName": "Boss Rush",
    "TEAM_AMOUNT": 1,
    "ROOM_SETUP": [
        ["outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb"],
        ["outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "norm", "bas1", "nest", "nest", "nest", "nest", "bas1", "norm", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "norm", "nest", "nest", "nest", "nest", "nest", "nest", "norm", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "norm", "nest", "nest", "nest", "nest", "nest", "nest", "norm", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "norm", "bas1", "nest", "nest", "nest", "nest", "bas1", "norm", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "boss", "boss", "boss", "boss", "boss", "boss", "boss", "boss", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "boss", "boss", "boss", "boss", "boss", "boss", "boss", "boss", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "outb", "outb"],
        ["outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb"],
        ["outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb", "outb"]
    ],
    "X_GRID": 16,
    "Y_GRID": 16,
    "BOTS": 6,
    "DO_BASE_DAMAGE": false,
    "SIEGE": true,
    "MAZE": {
        "ENABLED": true,
        amount: .3,
        mapString: `
            --------------------------------
            --------------------------------
            --@@@@@@@@@@@@@@@@@@@@@@@@@@@@--
            --@@@@@@@@@@@@@@@@@@@@@@@@@@@@--
            --@@########################@@--
            --@@#@@@@@@@@@@@@@@@@@@@@@@#@@--
            --@@#@@@@@@@@@@@@@@@@@@@@@@#@@--
            --@@#@@@@@@----------@@@@@@#@@--
            --@@#@@@@@@----------@@@@@@#@@--
            --@@#@@@@@------------@@@@@#@@--
            --@@#@@@@--------------@@@@#@@--
            --@@#@@@----------------@@@#@@--
            --@@#@@@@--------------@@@@#@@--
            --@@#@@@@@------------@@@@@#@@--
            --@@#@@@@@@----------@@@@@@#@@--
            --@@######@----------@######@@--
            --@@######@----------@######@@--
            --@@#####@------------@#####@@--
            --@@####@--------------@####@@--
            --@@###@----------------@###@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@------------------@@#@@--
            --@@#@@@@@@@@@@@@@@@@@@@@@@#@@--
            --@@#@@@@@@@@@@@@@@@@@@@@@@#@@--
            --@@########################@@--
            --@@@@@@@@@@@@@@@@@@@@@@@@@@@@--
            --@@@@@@@@@@@@@@@@@@@@@@@@@@@@--
            --------------------------------
            --------------------------------
            `,
        erosionPattern: {
            amount: .3,
            getter: (i, max) => {
                if (i > max * .4) {
                    return [(Math.random() * 2 + 1) | 0, 2];
                } else {
                    return [(Math.random() * 2) | 0, ((Math.random() * 2) | 0) * 2];
                }
            }
        }
    }
}