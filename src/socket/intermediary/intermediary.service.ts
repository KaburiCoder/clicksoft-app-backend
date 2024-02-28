import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomCollection } from './lib/room-collection';
import { GetPatientInfoDto } from './models/dtos/get-patient-info.dto';
import { GetProgressNoteDto } from './models/dtos/get-progress-note.dto';
import { ResultBase } from './models/dtos/bases/result-base.dto';
import { AppResult } from './models/results/app.result';
import { PatientInfo } from './models/patient-info';
import { ProgressNote } from './models/progress-note';
import { GetNursingRecordDto } from './models/dtos/get-nursing-record.dto';
import { SearchDtoBase } from './models/dtos/bases/search-dto-base';

@Injectable()
export class IntermediaryService {
  constructor(private readonly roomCollection: RoomCollection) {}
  private server: Server;

  private returnError(): ResultBase {
    return {
      status: 'error',
      message: '클라이언트로부터 데이터 요청에 실패했습니다.',
    };
  }

  setServer(server: Server) {
    this.server = server;
  }

  async getPatientInfo(
    client: Socket,
    dto: GetPatientInfoDto
  ): Promise<AppResult<PatientInfo>> {
    try {
      const { joinInfo, toId } = this.roomCollection.getJoinInfoAndToId(client);

      const ack = await this.server
        .to(toId)
        .timeout(10000)
        .emitWithAck('getPatientInfo', {
          userId: joinInfo.localId,
          weib: dto.weib,
        });

      return { dataList: ack?.[0]?.dataList, status: 'success' };
    } catch (error) {
      return this.returnError();
    }
  }

  @ConstructDto
  async getProgressNote(
    client: Socket,
    dto: GetProgressNoteDto
  ): Promise<AppResult<ProgressNote>> {
    try {
      const { joinInfo, toId } = this.roomCollection.getJoinInfoAndToId(client);
      const ack = await this.server
        .to(toId)
        .timeout(10000)
        .emitWithAck('getProgressNote', {
          ...dto,
          userId: joinInfo.localId,
        });

      return { dataList: ack?.[0]?.dataList, status: 'success' };
    } catch (error) {
      return this.returnError();
    }
  }

  @ConstructDto
  async getNursingRecord(client: Socket, dto: GetNursingRecordDto) {
    try {
      const { joinInfo, toId } = this.roomCollection.getJoinInfoAndToId(client);

      const ack = await this.server
        .to(toId)
        .timeout(10000)
        .emitWithAck('getNursingRecord', {
          ...dto,
          userId: joinInfo.localId,
        });

      return { dataList: ack?.[0]?.dataList, status: 'success' };
    } catch (error) {
      return this.returnError();
    }
  }
}

function ConstructDto(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function <T extends SearchDtoBase>(
    client: Socket,
    dto: T
  ): Promise<AppResult<ProgressNote>> {
    let clonedDto = Object.assign(new SearchDtoBase(), {
      ...dto,
    });

    clonedDto = {
      ...clonedDto,
      startYmd: clonedDto.startYmd,
      endYmd: clonedDto.endYmd,
      koStartDtString: clonedDto.koStartDtString,
      koEndDtString: clonedDto.koEndDtString,
    };

    return originalMethod.call(this, client, clonedDto);
  };

  return descriptor;
}
