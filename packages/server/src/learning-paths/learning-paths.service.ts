import { Injectable, NotFoundException } from '@nestjs/common';
import { LEARNING_PATHS } from '@yubing/shared';

@Injectable()
export class LearningPathsService {
  list(module?: string) {
    if (module) {
      return LEARNING_PATHS.filter((p) => p.module === module);
    }
    return LEARNING_PATHS;
  }

  getById(id: string) {
    const path = LEARNING_PATHS.find((p) => p.id === id);
    if (!path) throw new NotFoundException('学习路径不存在');
    return path;
  }
}
