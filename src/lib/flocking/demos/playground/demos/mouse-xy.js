// Tracks the mouse's vertical and horizontal movement within the editor area only.
// Maps y position to amplitude and its x position to pitch.

flock.synth({
    synthDef: {
        ugen: "flock.ugen.sinOsc",
        freq: {
            ugen: "flock.ugen.mouse.cursor",
            rate: "control",
            mul: 880,
            add: 110,
            options: {
                axis: "width",
                interpolation: "exponential",
                target: ".CodeMirror"
            }
        },
        mul: {
            ugen: "flock.ugen.mouse.cursor",
            rate: "control",
            options: {
                axis: "height",
                target: ".CodeMirror"
            },
            mul: 0.5
        }
    }
});
