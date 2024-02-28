import { Socket } from 'socket.io';
import { JoinRoomDto } from './dtos/join-room.dto';

export class RoomData extends JoinRoomDto {
  constructor(public client: Socket) {
    super();
  }

  isEqualRoom({ socketId, room }: { socketId: string; room: string }) {
    return this.client.id === socketId && this.key === room;
  }
}
