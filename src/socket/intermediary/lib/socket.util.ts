import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketUtil {
  getRooms(client: Socket) {
    return Array.from(client.rooms.keys());
  }
}
