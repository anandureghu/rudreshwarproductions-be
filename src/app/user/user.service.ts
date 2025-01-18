import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  async getAllAgents() {
    try {
      const query = `SELECT id, email, name, phone FROM t_users WHERE agent = true AND active = true`;
      const agents = await this.dbService.executeQuery(query);

      if (agents.length === 0) {
        throw new HttpException('No agents found', HttpStatus.NOT_FOUND);
      }

      return agents;
    } catch (error) {
      throw new HttpException(
        error.message || 'Database query failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addAgent(agentData: { email: string; name: string; phone: string }) {
    const { email, name, phone } = agentData;

    try {
      const query = `
        INSERT INTO t_users (email, name, phone, agent, location, age, gender, active)
        VALUES ($1, $2, $3, true, '', 0, '', true)
        RETURNING id, email, name, phone
      `;
      const values = [email, name, phone];
      const result = await this.dbService.executeQuery(query, values);

      if (result.length === 0) {
        throw new HttpException(
          'Failed to add agent',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result[0];
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique constraint violation
        throw new HttpException(
          'Agent with this email already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        error.message || 'Database query failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
