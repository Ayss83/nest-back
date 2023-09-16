import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User, UserDetails } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Checks if a user with same email address is already present in database. If not, hashes the password and saves
   * the new user in database
   *
   * @param user Required information to create a user
   * @returns Created user information (no password)
   */
  async signup(user: User): Promise<UserDetails | { error: string }> {
    const { username, email, password } = user;
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      return { error: 'There is already an account with this email address' };
    }

    if (!username || !email || !password) {
      return { error: 'All fields are required' };
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.createUser(
      username,
      email,
      hashedPassword,
    );

    return this.userService.getUserDetails(newUser);
  }

  /**
   * If received credentials are valid, returns the corresponding Json web token
   *
   * @param credentials login information
   * @returns Json web token to be used for secured requests
   */
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string } | null> {
    const { email, password } = credentials;
    const user = await this.validateUser(email, password);

    if (!user) {
      return null;
    }

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }

  //#region helper methods

  /**
   * Checks if received email and password are matching a user in database and returns it
   *
   * @param email
   * @param password
   * @returns User information without password
   */
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

  //#endregion
}
