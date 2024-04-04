import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomCollection } from './lib/room-collection';
import { GetPatientInfoDto } from './models/dtos/get-patient-info.dto';
import { ResultBase } from './models/dtos/bases/result-base.dto';
import { AppResult } from './models/results/app.result';
import { PatientInfo } from './models/patient-info';
import { ProgressNote } from './models/progress-note';
import { SearchDtoBase } from './models/dtos/bases/search-dto-base';
import { Scan } from './models/scan';
import { removeEmptyObj } from './lib/object.util';
import { ObservationChart } from './models/observation-chart';
import { CerticiationDto } from './models/dtos/certification.dto';

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
        .timeout(30000)
        .emitWithAck('getPatientInfo', {
          userId: joinInfo.localId,
          weib: dto.weib,
        });

      return { dataList: ack?.[0]?.dataList, status: 'success' };
    } catch (error) {
      return this.returnError();
    }
  }

  private remakeDataList(ev: string, dataList?: any) {
    if (ev === 'getObservationChart') {
      const list = dataList as ObservationChart[];
      list.forEach(removeEmptyObj.bind(this));
      return list.filter((data) => {
        const observationChart = Object.assign(new ObservationChart(), {
          ...data,
        });
        return !observationChart.isEmpty;
      });
    }
    return dataList;
  }

  @ConstructDto
  async certification(client: Socket, dto: CerticiationDto) {
    try {
      const toId = this.roomCollection.getLocalClientId(dto.key);
      const ev = 'certification';

      const ack = await this.server
        .to(toId)
        .timeout(10000)
        .emitWithAck(ev, { ...dto });

      const result = ack?.[0];

      return result;
    } catch (error) {
      return this.returnError();
    }
  }

  
  @ConstructDto
  async getCommon<TDto>(
    client: Socket,
    dto: TDto,
    ev: string
  ): Promise<AppResult<Scan>> {
    try {
      const { joinInfo, toId } = this.roomCollection.getJoinInfoAndToId(client);

      const ack = await this.server
        .to(toId)
        .timeout(10000)
        .emitWithAck(ev, {
          ...dto,
          userId: joinInfo.localId,
        });

      const dataList = this.remakeDataList(ev, ack?.[0]?.dataList);
      return { dataList, status: 'success' };
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
    dto: T,
    ev: string
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

    return originalMethod.call(this, client, clonedDto, ev);
  };
  return descriptor;
}
