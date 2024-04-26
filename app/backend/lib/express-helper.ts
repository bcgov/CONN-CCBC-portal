import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
import IncomingForm from 'formidable/Formidable';

type AnyObject = Record<string, any>;
type TypedRequest<
  ReqBody = AnyObject & Request,
  QueryString = AnyObject
> = Request<AnyObject, AnyObject, ReqBody, Partial<QueryString>>;

export type ExpressMiddleware<
  ReqBody = AnyObject,
  Res = AnyObject | string,
  QueryString = AnyObject
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
