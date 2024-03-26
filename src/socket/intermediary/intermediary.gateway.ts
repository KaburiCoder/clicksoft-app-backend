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
import { GetVitalSignDto } from './models/dtos/get-vital-sign.dto';
import { GetPtProgressDto } from './models/dtos/get-pt-progress.dto';
import { GetScanDto } from './models/dtos/get-scan.dto';
import { GetInsulinDto } from './models/dtos/get-insulin.dto';
import { GetFirstChartDto } from './models/dtos/get-first-chart.dto';
import { GetScanImageDto } from './models/dtos/get-scan-image.dto';
import { GetConsultationDto } from './models/dtos/get-consultation.dto';
import { GetObservationChartDto } from './models/dtos/get-observation-chart.dto';
import { GetBasicExamDto } from './models/dtos/get-basic-exam.dto';
import { GetPrescriptionDto } from './models/dtos/get-prescription.dto';

@WebSocketGateway({
  transports: ['websocket'],
  maxHttpBufferSize: 50 * 1024 * 1024 * 1024,
})
export class IntermediaryGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly service: IntermediaryService,
    private readonly roomCollection: RoomCollection
  ) {}

  afterInit(server: Server) {
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
    return await this.service.getCommon(socket, dto, 'getProgressNote');
  }

  @SubscribeMessage('getNursingRecord')
  async getNursingRecord(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetNursingRecordDto
  ) {
    return await this.service.getCommon(socket, dto, 'getNursingRecord');
  }

  @SubscribeMessage('getVitalSign')
  async getVitalSign(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetVitalSignDto
  ) {
    return await this.service.getCommon(socket, dto, 'getVitalSign');
  }

  @SubscribeMessage('getIOSheet')
  async getIOSheet(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetVitalSignDto
  ) {
    return await this.service.getCommon(socket, dto, 'getIOSheet');
  }

  @SubscribeMessage('getPtProgress')
  async getPtProgress(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetPtProgressDto
  ) {
    return await this.service.getCommon(socket, dto, 'getPtProgress');
  }

  @SubscribeMessage('getInsulin')
  async getInsulin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetInsulinDto
  ) {
    return await this.service.getCommon(socket, dto, 'getInsulin');
  }

  @SubscribeMessage('getFirstChart')
  async getFirstChart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetFirstChartDto
  ) {
    return await this.service.getCommon(socket, dto, 'getFirstChart');
  }

  @SubscribeMessage('getScan')
  async getScan(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetScanDto
  ) {
    return await this.service.getCommon(socket, dto, 'getScan');
  }

  @SubscribeMessage('getScanImage')
  async getScanImage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetScanImageDto
  ) {
    return await this.service.getCommon(socket, dto, 'getScanImage');
  }

  @SubscribeMessage('getConsultation')
  async getConsultation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetConsultationDto
  ) {
    return await this.service.getCommon(socket, dto, 'getConsultation');
  }

  @SubscribeMessage('getObservationChart')
  async getObservationChart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetObservationChartDto
  ) {
    return await this.service.getCommon(socket, dto, 'getObservationChart');
  }

  @SubscribeMessage('getBasicExam')
  async getBasicExam(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetBasicExamDto
  ) {
    return await this.service.getCommon(socket, dto, 'getBasicExam');
  }

  @SubscribeMessage('getPrescription')
  async getPrescription(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: GetPrescriptionDto
  ) {
    return await this.service.getCommon(socket, dto, 'getPrescription');
  }

  @SubscribeMessage('test')
  async getTest(@MessageBody() dto: any) {
    console.log(dto.length);
  }
}
