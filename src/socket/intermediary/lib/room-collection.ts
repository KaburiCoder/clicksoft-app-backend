import { Injectable, Scope } from '@nestjs/common';
import { Socket } from 'socket.io';
import { DataType, JoinRoomDto } from '../models/dtos/join-room.dto';
import { RoomData } from '../models/room-data';

@Injectable()
export class RoomCollection {
  private rooms: RoomData[] = [];

  add(client: Socket, dto: JoinRoomDto) {
    const roomData: RoomData = Object.assign(new RoomData(client), dto);
    const isExists = this.rooms.some((r) =>
      r.isEqualRoom({ socketId: client.id, room: dto.key })
    );
    if (isExists) return;

    this.rooms.push(roomData);
  }

  remove(client: Socket, dto: JoinRoomDto) {
    this.rooms = this.rooms.filter(
      (r) => !r.isEqualRoom({ socketId: client.id, room: dto.key })
    );
  }

  removeAll(client: Socket) {
    this.rooms = this.rooms.filter((r) => r.client.id !== client.id);
  }

  getLocalClient(room: string) {
    return this.rooms.find(
      (r) => r.key === room && r.dataType === DataType.LOCAL
    );
  }

  getLocalClientId(room: string) {
    const client = this.getLocalClient(room);
    return client.client.id;
  }

  /**
   * 클라이언트 정보로 룸에 접속한 대상 정보구하는 함수
   * @param client 호출한 클라이언트
   * @returns
   */
  getJoinInfo(client: Socket): JoinRoomDto {
    const data = this.rooms.find((r) => r.client.id === client.id);
    const { client: _, ...joinInfo } = data;
    return joinInfo;
  }

  getJoinInfoAndToId(client: Socket) {
    const joinInfo = this.getJoinInfo(client);
    const toId = this.getLocalClientId(joinInfo.key);

    return {
      joinInfo,
      toId,
    };
  }

  getRooms() {
    return this.rooms;
  }
}
