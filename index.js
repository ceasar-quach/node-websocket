import { WebSocketServer } from 'ws';
// var WebSocketServer = require('ws').Server

var port = 8088;

  const wss = new WebSocketServer({ 
    port: port
  });
  let rooms = [];

  wss.on('connection', function (ws, request) {
    const room = request.url.split('=')[1];
      rooms = updateRooms(
          ws,
          request.url.split('=')[1],
          rooms,
      )
      console.log(rooms);
      
    ws.on('message', function (messageAsString) {
      rooms.filter(item=>item.id===room)[0].clients
      .filter(client=>client!==ws)
      .forEach((client) => {
        client.send(messageAsString.toString());
      });
    });
  
    ws.on('close', function connection() {
      rooms = removeClient(
        room,
        ws,
        rooms,
      );
      rooms.filter(item=>item.id===room)[0]&&console.log('Room '+room+', 1/'+ [rooms.filter(item=>item.id===room)[0].clients,[]].length +' client has disconnected')
    })
  
  });
  function updateRooms(
    client,
    room,
    rooms,
  ) {
    if (rooms.filter(item=>item.id===room).length<=0){
      // new room
      return [...rooms, {
        id:room,
        clients: [client]
      }]
    }else{
      //existed room
      if(rooms.filter(item=>item.id===room)[0].clients.filter(item=>item===client).length<=0){
        return [
          ...rooms.filter(item=>item.id!==room),
          {
          id: room,
          // updated clients list with new client
          clients: [...rooms.filter(item=>item.id===room)[0].clients, client]
          }
        ]
      }else{
        return rooms;
      }
    }
  }

  function removeClient (
    room,
    client,
    rooms,
  ) {
    if(rooms.filter((item)=>item.id===room)[0].clients.filter(item=>item!==client).length!==0){
      return [
        ...rooms.filter(item=>item.id!==room), {
        id: room,
        clients: rooms.filter((item)=>item.id===room)[0].clients.filter(item=>item!==client)
        }
      ]
    }else{
      return rooms.filter(item=>item.id!==room)
    }

  }

  console.log("WS server up!");