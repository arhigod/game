
(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 16:
            key = 'SHIFT'; break;
        case 17:
            key = 'CTRL'; break;
        case 27:
            key = 'ESC'; break;
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        case 190:
            key = '.'; break;
        case 191:
            key = '/'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code).toUpperCase();
        }
        pressedKeys[key] = status;
        //console.log(pressedKeys);
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();
