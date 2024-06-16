import { User } from '@/db/mongo-schema/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async findOneById(id: string): Promise<User | undefined> {
    const user = await this.userModel.findById(id).exec();

    return user?.toJSON() ?? undefined;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(email: string, password: string): Promise<User> {
    const newUser = new this.userModel({ email, password });
    const user = await newUser.save();

    return user.toJSON();
  }
}
