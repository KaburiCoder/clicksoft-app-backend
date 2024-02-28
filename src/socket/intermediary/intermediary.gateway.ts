import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { IntermediaryService } from './intermediary.service';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './models/dtos/join-room.dto';
import { RoomCollection } from './lib/room-collection';
import { GetPatientInfoDto } from './models/dtos/get-patient-info.dto';
import { GetProgressNoteDto } from './models/dtos/get-progress-note.dto';
import { GetNursingRecordDto } from './models/dtos/get-nursing-record.dto';

@WebSocketGateway({
  transports: ['websocket'],
  maxHttpBufferSize: 50 * 1024 * 1024,
})
export class IntermediaryGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;
  constructor(
    private readonly service: IntermediaryService,
    private readonly roomCollection: RoomCollection
  ) {}

  afterInit(server: Server) {
    this.server = server;
    this.service.setServer(server);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('conn', client.id);
  }
  handleDisconnect(client: Socket) {
    this.roomCollection.removeAll(client);
    console.log('disconn', client.id);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: JoinRoomDto
  ) {
    await socket.join(dto.key);
    this.roomCollection.add(socket, dto);
    return true;
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: JoinRoomDto
  ) {
    await socket.leave(dto.key);
    this.roomCollection.remove(socket, dto);
  }

  @SubscribeMessage('getPatientInfo')
  async getPatientInfo(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetPatientInfoDto
  ) {
    return await this.service.getPatientInfo(socket, dto);
  }

  @SubscribeMessage('getProgressNote')
  async getProgressNote(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetProgressNoteDto
  ) {
    return await this.service.getProgressNote(socket, dto);
  }

  @SubscribeMessage('getNursingRecord')
  async getNursingRecord(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetNursingRecordDto
  ) {
    return await this.service.getNursingRecord(socket, dto);
  }

  @SubscribeMessage('test')
  async getTest(@MessageBody() dto: any) {
    console.log(dto.length);
  }
}
