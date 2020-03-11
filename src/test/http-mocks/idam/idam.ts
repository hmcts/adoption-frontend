import config from 'config';
import * as HttpStatus from 'http-status-codes';

import mock from 'nock';

const apiServiceBaseURL: string = config.get<string>('idam.api.url');
const s2sAuthServiceBaseURL = config.get<string>('idam.service-2-service-auth.url');

export const defaultAccessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpZGFtIiwiaWF0IjoxNDgzMjI4ODAwLCJleHAiOjQxMDI0NDQ4MDAsImF1ZCI6ImFkb3B0aW9uIiwic3ViIjoiYWRvcHRpb24ifQ.0EKZpjflxgaOryKryWVgXpsfJT1zTZAHM0Qfyn2-X1Q';

export function resolveRetrieveUserFor (id: string, ...roles: string[]): mock.Scope {
  return mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.OK, { id: id, roles: roles, email: 'user@example.com' });
}

export function resolveAuthToken (token: string): void {
  mock(apiServiceBaseURL)
    .post(new RegExp('/oauth2/token.*'))
    .reply(HttpStatus.OK, {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 28800,
    });
}

export function rejectAuthToken (): void {
  mock(apiServiceBaseURL)
    .post(new RegExp('/oauth2/token.*'))
    .reply(HttpStatus.UNAUTHORIZED);
}

export function resolveInvalidateSession (token: string): void {
  mock(apiServiceBaseURL)
    .delete(`/session/${token}`)
    .reply(HttpStatus.OK);
}

export function rejectInvalidateSession (token: string = defaultAccessToken, reason = 'HTTP error'): void {
  mock(apiServiceBaseURL)
    .delete(`/session/${token}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}

export function rejectRetrieveUserFor (reason: string): mock.Scope {
  return mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.FORBIDDEN, reason);
}
