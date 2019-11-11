import { ConnectionConfig } from 'mysql';

export type IConnectionConfig = Omit<ConnectionConfig, 'database'>;
