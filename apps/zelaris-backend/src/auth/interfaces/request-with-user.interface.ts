import { Role } from '../../shared/enums/role.enum';

export interface RequestWithUser {
  user?: {
    roles?: Role[];
  };
}
