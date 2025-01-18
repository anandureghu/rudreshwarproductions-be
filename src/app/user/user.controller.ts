import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('agents')
  async getAllAgents() {
    try {
      const agents = await this.userService.getAllAgents();
      return {
        success: true,
        message: 'Agents retrieved successfully',
        data: agents,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve agents',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('agent')
  async addAgent(
    @Body() agentData: { email: string; name: string; phone: string },
  ) {
    if (!agentData.email || !agentData.name || !agentData.phone) {
      throw new HttpException(
        {
          success: false,
          message: 'Missing required fields: email, name, or phone',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const agent = await this.userService.addAgent(agentData);
      return {
        success: true,
        message: 'Agent added successfully',
        data: agent,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to add agent',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
