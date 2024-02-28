// import {
//   createParamDecorator,
//   ExecutionContext,
//   Injectable,
// } from '@nestjs/common';
// import { ModuleRef } from '@nestjs/core';

// export const JoinInfo = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): { joinInfo: any; toId: any } => {
//     const client = ctx.switchToWs().getClient();
//     return { joinInfo: 1, toId: 2 };
//   }
// );

// @Injectable()
// export class JoinInfoDecorator {
//   constructor(private moduleRef: ModuleRef) {}

//   create() {
//     return createParamDecorator(
//       (data: unknown, ctx: ExecutionContext): { joinInfo: any; toId: any } => {
//         const client = ctx.switchToWs().getClient();
//         const roomCollection = this.moduleRef.get('RoomCollection', {
//           strict: false,
//         });
//         return roomCollection.getJoinInfoAndToId(client);
//       }
//     )();
//   }
// }
