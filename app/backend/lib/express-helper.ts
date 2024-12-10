import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
import IncomingForm from 'formidable/Formidable';
import config from '../../config';

type AnyObject = Record<string, any>;
type TypedRequest<
  ReqBody = AnyObject & Request,
  QueryString = AnyObject,
> = Request<AnyObject, AnyObject, ReqBody, Partial<QueryString>>;

export type ExpressMiddleware<
  ReqBody = AnyObject,
  Res = AnyObject | string,
  QueryString = AnyObject,
> = (
  req: TypedRequest<ReqBody, QueryString>,
  res: Response<Res>,
  next: NextFunction
) =>
  | Promise<void | Response<Res>>
  | Promise<void>
  | ExpressMiddleware<ReqBody, Res, QueryString>
  | Response<any, Record<string, any>>
  | void;

export const parseForm = (
  form: IncomingForm,
  req
): Promise<formidable.Files<string>> => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return resolve(files);
    });
  });
};

const OPENSHIFT_APP_NAMESPACE = config.get('OPENSHIFT_APP_NAMESPACE');

export const isDeployedToOpenShift =
  OPENSHIFT_APP_NAMESPACE.endsWith('-dev') ||
  OPENSHIFT_APP_NAMESPACE.endsWith('-test') ||
  OPENSHIFT_APP_NAMESPACE.endsWith('-prod');

export const commonFormidableConfig: formidable.Options = {
  maxFileSize: 8000000,
  keepExtensions: false,
  uploadDir: isDeployedToOpenShift ? '/application/uploads' : undefined,
  allowEmptyFiles: true,
  minFileSize: 0,
};
