import { Server, Socket } from 'socket.io';

type Role = 'X' | 'O';

interface Player {
  id: string;
  username: string;
  role: Role;
}

export const setupSocketHandlers = (io: Server) => {
  const rooms = new Map<string, Player[]>();
  
  const socketToRoom = new Map<string, string>();

  io.on('connection', (socket: Socket) => {
    console.log('New player connected:', socket.id);

    socket.on('create_room', (data: { username: string }, callback) => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      rooms.set(roomId, [{ id: socket.id, username: data.username, role: 'X' }]);
      
      socketToRoom.set(socket.id, roomId);
      
      socket.join(roomId);
      
      callback({ success: true, roomId, role: 'X' });
      console.log(`Room created: ${roomId} by ${data.username}`);
    });

    socket.on('join_room', (data: { roomId: string, username: string }, callback) => {
      const room = rooms.get(data.roomId);

      if (!room) {
        return callback({ success: false, message: 'Room not found.' });
      }

      if (room.length >= 2) {
        return callback({ success: false, message: 'This room is currently full (Max 2 players).' });
      }

      room.push({ id: socket.id, username: data.username, role: 'O' });

      socketToRoom.set(socket.id, data.roomId);
      
      socket.join(data.roomId);
      
      callback({ success: true, role: 'O' });
      console.log(`${data.username} joined room: ${data.roomId}`);

      const player1 = room.find(p => p.role === 'X');
      const player2 = room.find(p => p.role === 'O');

      io.to(data.roomId).emit('game_started', {
        playerX: player1?.username,
        playerO: player2?.username,
        playerX_id: player1?.id,
        room: data.roomId
      });
    });

    socket.on('make_move', (data: { room: string, index: number, player: string }) => {
      socket.to(data.room).emit('opponent_moved', {
        index: data.index,
        player: data.player
      });
    });

    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);
      
      const roomId = socketToRoom.get(socket.id);
      
      if (roomId) {
        const players = rooms.get(roomId);
        
        if (players) {
          const leavingPlayer = players.find(p => p.id === socket.id);
          
          if (leavingPlayer) {
            io.to(roomId).emit('player_left', { message: `${leavingPlayer.username} left the game.` });
            
            const remainingPlayers = players.filter(p => p.id !== socket.id);
            
            if (remainingPlayers.length === 0) {
              rooms.delete(roomId);
            } else {
              rooms.set(roomId, remainingPlayers);
            }
          }
        }
        
        socketToRoom.delete(socket.id);
      }
    });
  });
};
