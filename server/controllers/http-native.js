const http = require('http');

const url = 'http://127.0.0.1:3001/'
/*
http.get( url, res => {
  res.setEncoding( 'utf8' );
  let body = '';
  res.on( 'data', data => {
    body += data;
  });

  res.on( 'end', () => {
    body = JSON.parse( body );
    console.log( body );
  });
});
*/
var options = {
  host: 'gmapi.azurewebsites.net',
  path: '/getVehicleInfoService',//?id=1234&responseType=JSON',
  //host: '127.0.0.1',
  //port: 3001,
  //path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}
const postData = JSON.stringify( { 'id': '1235', 'responseType': 'JSON' } );

var expected = {"service":"getVehicleInfo","status":"200","data":{"vin":{"type":"String","value":"1235AZ91XP"},"color":{"type":"String","value":"Forest Green"},"fourDoorSedan":{"type":"Boolean","value":"False"},"twoDoorCoupe":{"type":"Boolean","value":"True"},"driveTrain":{"type":"String","value":"electric"}}};
expected = '[' +  JSON.stringify( expected )  + ']';

var i = 0;

var doPost = function() {
  const req = http.request( options, res => {
    res.setEncoding( 'utf8' );
    var result = '';
    res.on( 'data', ( chunk ) => {

      result += chunk;

      if( chunk.length === 0 ) {
        console.log( 'chunk length is 0');
      }
    });
    res.on( 'end', () => {
      try {
        if( result.length === 0 ) {
          console.log( 'result length is 0');
        }
        result = '[' +  JSON.stringify( JSON.parse ( result ) ) + ']';
        if( expected !== result ) {
          console.log( i, ' response is different' );
        } else {
          console.log( i, ' same' );
        }
      } catch (e) {
        console.log(i, e, ' invalid json:', result.toString('utf8'));
      }

    });
  });

  req.on( 'error', ( err ) => {
    console.error( `problem with request: ${ err.message }` );
  });

  req.write( postData );
  req.end();
  i++;
  setTimeout( doPost, 200 );
}


doPost();


// for( var i = 0; i < 49; i++){
//   if (i >= 48) {
//     continue;
//   }
//   console.log( 'i start =', i );
//   const req = http.request( options, res => {
//     //res.setEncoding( 'utf8' );
//     res.on( 'data', ( chunk ) => {
//       try {
//         var result = '[' +  JSON.stringify( JSON.parse ( chunk ) ) + ']';

//         if( expected !== result ) {
//           console.log( 'response is different ' + i );
//         } else {
//           //console.log( 'same' );
//         }
//       } catch (e) {
//         console.log('invalid json at ', i);
//       }

//     });
//     res.on( 'end', () => {
//       //console.log( '--end of message--' );
//     });
//   });

//   req.on( 'error', ( err ) => {
//     console.error( `problem with request: ${ err.message }` );
//   });

//   req.write( postData );
//   req.end();
//   console.log( 'i=', i );
//   setTimeout(function() {}, 500);
// }
