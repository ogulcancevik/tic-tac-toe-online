import { Server, Socket } from 'socket.io';

let waitingPlayer: Socket | null = null;

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    socket.on('join_game', () => {
      if (waitingPlayer && waitingPlayer.id !== socket.id) {
        // Bekleyen biri var, ikisini aynı odaya al ve maçı başlat
        const roomName = `room_${waitingPlayer.id}_${socket.id}`;
        
        socket.join(roomName);
        waitingPlayer.join(roomName);

        // Oyunculara rolleri ve odaları bildir
        waitingPlayer.emit('game_started', { role: 'X', room: roomName });
        socket.emit('game_started', { role: 'O', room: roomName });

        console.log(`Game started: ${roomName} (X: ${waitingPlayer.id}, O: ${socket.id})`);
        
        waitingPlayer = null;
      } else {
        // Bekleyen kimse yok, bu oyuncuyu beklemeye al
        waitingPlayer = socket;
        socket.emit('waiting_for_player', { message: 'Rakip bekleniyor...' });
        console.log('Waiting for player:', socket.id);
      }
    });

    // Hamle yapıldığında
    socket.on('make_move', (data: { room: string, index: number, player: string }) => {
      // Sadece "diğer" oyuncuya (kendisi hariç o odadaki herkese) ilet
      socket.to(data.room).emit('opponent_moved', {
        index: data.index,
        player: data.player
      });
    });

    // Oyuncu oyundan ayrıldığında / bağlantısı koptuğunda
    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);
      if (waitingPlayer?.id === socket.id) {
        waitingPlayer = null;
      }
    });
  });
};
