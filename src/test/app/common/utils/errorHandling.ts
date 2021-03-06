import * as express from 'express';
import * as chai from 'chai';
import * as sinon from 'sinon';

import { mockReq, mockRes } from 'sinon-express-mock';
import { ErrorHandling } from 'common/utils/errorHandling';

const spies =  require('sinon-chai');
chai.use(spies);
const expect = chai.expect;

describe('ErrorHandling', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvingRequestHandler = sinon.spy((req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    return Promise.resolve();
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rejectingRequestHandler = sinon.spy((req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    return Promise.reject('Reject');
  });

  const nextFunction = sinon.spy(() => {
    // spy
  });

  it('should invoke given request handler', async () => {
    const handled = ErrorHandling.apply(resolvingRequestHandler);
    await handled(mockReq, mockRes, nextFunction);
    expect(resolvingRequestHandler).to.have.been.calledWith(mockReq, mockRes, nextFunction);
  });

  it('should not invoke next function when the request handler is successful', async () => {
    const handled = ErrorHandling.apply(resolvingRequestHandler);
    await handled(mockReq, mockRes, nextFunction);
    expect(nextFunction).to.have.not.been.called;
  });

  it('should invoke next function when the request handler has failed', async () => {
    const handled = ErrorHandling.apply(rejectingRequestHandler);
    await handled(mockReq, mockRes, nextFunction);
    expect(nextFunction).to.have.been.called;
  });
});
