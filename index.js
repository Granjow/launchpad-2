const midi = require( 'midi' );


const input = new midi.input();
const available = new Array( input.getPortCount() ).fill( 0 )
    .map( ( el, ix ) => {
        const name = input.getPortName( ix );
        const match = /^Launchpad MK2 (\d+)/.exec( name );
        const isLaunchpad = !!match;
        const hardwareId = isLaunchpad ? Number( match[ 1 ] ) : undefined;
        return {
            port: ix,
            name: input.getPortName( ix ),
            isLaunchpad: isLaunchpad,
            hardwareId: hardwareId,
        };
    } )
    .filter( el => el.isLaunchpad );

console.log( available );

const output = new midi.output();
new Array( output.getPortCount() ).fill( 0 ).forEach( ( el, ix ) => {
    console.log( `${ix}: ${output.getPortName( ix )}` );
} );
output.openPort( available[ 0 ].port );


let col = 0;
input.on( 'message', function ( deltaTime, message ) {

    // The message is an array of numbers corresponding to the MIDI bytes:
    //   [status, data1, data2]
    // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
    // information interpreting the messages.
    console.log( 'm:' + message + ' d:' + deltaTime );

    output.sendMessage( [ message[ 0 ], message[ 1 ], (col++ & 0x7f) ] );

} );

input.openPort( available[ 0 ].port );
input.ignoreTypes( false, false, false );

