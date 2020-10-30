// Visually displays the synth's output with an oscilliscope.

flock.synth({
    synthDef: {
        ugen: "flock.ugen.scope",
        source: {
            ugen: "flock.ugen.sinOsc",
            freq: 440,
            mul: 0.25
        },
        options: {
            canvas: "#gfx",
            styles: {
                strokeColor: "#777777",
                strokeWidth: 2
            }
        }
    }
});
