import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';
import { UserDetails } from 'src/user/user-details.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  /**
   * Uses the bcrypt library to hash the password
   *
   * @param password password in plain text
   * @returns encrypted password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Uses bcrypt library to compare encrypted and not encrypted passwords
   *
   * @param password plain text password
   * @param hashedPassword hashed password
   * @returns Boolean indicating match
   */
  async checkPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Checks if a user with same email address is already present in database. If not, hashes the password and saves
   * the new user in database
   *
   * @param user Required information to create a user
   * @returns Created user information (no password)
   */
  async signup(user: User): Promise<UserDetails | string> {
    const { username, email, password } = user;
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      return 'There is already an account with this email address';
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.createUser(
      username,
      email,
      hashedPassword,
    );

    return this.userService.getUserDetails(newUser);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findUserByEmail(email);
    const userExists = !!user;

    if (!userExists) {
      return null;
    }

    const passwordMatches = await this.checkPasswordMatch(
      password,
      user.password,
    );

    if (!passwordMatches) {
      return null;
    }

    return this.userService.getUserDetails(user);
  }

  async login(existingUser: {
    email: string;
    password: string;
  }): Promise<{ token: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) {
      return null;
    }

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }
}