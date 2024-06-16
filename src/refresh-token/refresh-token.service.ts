import { RefreshToken } from '@/db/mongo-schema/refresh-token.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokenService {
  constructor(@InjectModel(RefreshToken.name) private tokenModel: Model<RefreshToken>) { }

  async create(userId: string, accessToken: string, refreshToken: string) {
    const refeshToken = new this.tokenModel({ userId, accessToken, refreshToken, expiredAt: dayjs().add(2, "day").toDate() })
    return await refeshToken.save();
  }

  async findRefreshToken(userId: string, accessToken: string): Promise<string | undefined> {
    const tokens = await this.tokenModel.findOne({ userId, accessToken }).exec();
    return tokens?.refreshToken;
  }

  async deleteByAccessToken(accessToken: string): Promise<any> {
    return this.tokenModel.deleteOne({ accessToken }).exec();
  }
}
