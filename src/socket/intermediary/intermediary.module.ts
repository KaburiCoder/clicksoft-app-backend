import { Module } from '@nestjs/common';
import { IntermediaryService } from './intermediary.service';
import { IntermediaryGateway } from './intermediary.gateway';
import { RoomCollection } from './lib/room-collection';

@Module({
  imports: [],
  providers: [IntermediaryGateway, IntermediaryService, RoomCollection],
  exports: [],
})
export class IntermediaryModule {}
