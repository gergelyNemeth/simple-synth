
function main(){
    var started = false;
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = ctx.createOscillator(); // instantiate an oscillator
    osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
    osc.frequency.value = 440; // Hz
    osc.connect(ctx.destination); // connect it to the destination

    document.addEventListener('keydown', function(event){
        if (event.key === "p"){
            startSound();
        }
    })

    document.addEventListener('keyup', function(event){
        if (event.key === "p"){
            stopSound();
        }
    });

    function startSound(event){
        if (started){
            osc.connect(ctx.destination);
        } else {
            osc.start(ctx.currentTime);
            started = true;
        }
        osc.frequency.value = 1000;
        console.log('start');
    }

    function stopSound(event){
        osc.disconnect(ctx.destination);
        console.log('stop');
    }
}

window.onload = function(event){
    main();
}