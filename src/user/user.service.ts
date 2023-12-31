import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDetails, UserDocument } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Uses received parameters to create a new user and saves it in database
   *
   * @param username
   * @param email
   * @param hashedPassword encrypted password
   * @returns newly saved user
   */
  async createUser(
    username: string,
    email: string,
    hashedPassword: string,
  ): Promise<UserDocument> {
    return this.userModel.create({ username, email, password: hashedPassword });
  }

  async findUserByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).lean().exec();
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async findUserById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).lean().exec();

    if (!user) {
      return null;
    }

    return this.getUserDetails(user);
  }

  /**
   * Clears the password from the user information before returning it
   *
   * @param user User information
   * @returns User information without password
   */
  getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      name: user.username,
      email: user.email,
    };
  }
}
