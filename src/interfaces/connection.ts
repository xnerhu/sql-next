import { ConnectionConfig } from 'mysql';
import { SecureContextOptions } from 'tls';

type IConfigExclude = 'database' | 'typeCast' | 'multipleStatements' | 'queryFormat' | 'stringifyObjects' | 'flags';

export type IConfig = Omit<ConnectionConfig, IConfigExclude> & {
  ssl?: ISSLConfig;
}

export type ISSLConfig = string | (SecureContextOptions & {
  rejectUnauthorized?: boolean;
});
