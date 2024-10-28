/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import linkPreview from '../../../backend/lib/linkPreview';
import getAuthRole from '../../../utils/getAuthRole';
import { performQuery } from '../../../backend/lib/graphql';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

function FormDataMock() {
  this.append = jest.fn();
}

global.FormData = jest.fn(() => {
  return FormDataMock();
}) as jest.Mock;

jest.setTimeout(1000);

describe('The Link Preview', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', linkPreview);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post('/api/announcement/linkPreview');
    expect(response.status).toBe(404);
  });

  it('should return preview for allowed hostname with gov image', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () =>
          Promise.resolve(`
        <html>
          <head>
            <title>Test Title</title>
            <meta name="twitter:description" content="Test Description">
            <meta name="twitter:image" content="https://news.gov.bc.ca/testImage">
            <meta name="description" content="Test Description">
            <meta property="og:image" content="https://live.staticflickr.com/nonGovImage.jpg">
          </head>
          <body>
          </body>
        </html>`),
      })
    ) as jest.Mock;

    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: { updateAnnouncement: { announcement: { id: 1, rowId: 1 } } },
      };
    });

    const response = await request(app)
      .post('/api/announcement/linkPreview')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .send({
        url: 'https://news.gov.bc.ca/test-news',
        jsonData: {},
        rowId: 1,
        ccbcNumbers: 'CCBC-010001',
      })
      .expect(200);
    expect(response.body.title).toBe('Test Title');
    expect(response.body.description).toBe('Test Description');
    expect(response.body.image).toBe('https://news.gov.bc.ca/testImage');
    expect(response.status).toBe(200);
  });
  it('should return preview for allowed hostname with non-gov image', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () =>
          Promise.resolve(`
        <html>
          <head>
            <title>Test Title</title>
            <meta name="twitter:description" content="Test Description">
            <meta name="description" content="Test Description">
            <meta property="og:image" content="https://live.staticflickr.com/nonGovImage.jpg">
          </head>
          <body>
          </body>
        </html>`),
      })
    ) as jest.Mock;

    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: { updateAnnouncement: { announcement: { id: 1, rowId: 1 } } },
      };
    });

    const response = await request(app)
      .post('/api/announcement/linkPreview')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .send({
        url: 'https://news.gov.bc.ca/test-news',
        jsonData: {},
        rowId: 1,
        ccbcNumbers: 'CCBC-010001',
      })
      .expect(200);
    expect(response.body.title).toBe('Test Title');
    expect(response.body.description).toBe('Test Description');
    expect(response.body.image).toBe(
      'https://live.staticflickr.com/nonGovImage.jpg'
    );
    expect(response.status).toBe(200);
  });
  it('should return preview for allowed hostname with no image', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () =>
          Promise.resolve(`
        <html>
          <head>
            <title>Test Title</title>
            <meta name="twitter:description" content="Test Description">
            <meta name="description" content="Test Description">
          </head>
          <body>
          </body>
        </html>`),
      })
    ) as jest.Mock;

    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: { updateAnnouncement: { announcement: { id: 1, rowId: 1 } } },
      };
    });

    const response = await request(app)
      .post('/api/announcement/linkPreview')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .send({
        url: 'https://news.gov.bc.ca/test-news',
        jsonData: {},
        rowId: 1,
        ccbcNumbers: 'CCBC-010001',
      })
      .expect(200);
    expect(response.body.title).toBe('Test Title');
    expect(response.body.description).toBe('Test Description');
    expect(response.body.image).toBe('/images/noPreview.png');
    expect(response.status).toBe(200);
  });
  it('should return no preview for non allowed hostname', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: { updateAnnouncement: { announcement: { id: 1, rowId: 1 } } },
      };
    });

    const response = await request(app)
      .post('/api/announcement/linkPreview')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .send({
        url: 'https://a-news-outlet.ca/test-news',
        jsonData: {},
        rowId: 1,
        ccbcNumbers: 'CCBC-010001',
      })
      .expect(200);
    expect(response.body.title).toBe(null);
    expect(response.body.description).toBe('No preview available');
    expect(response.body.image).toBe('/images/noPreview.png');
    expect(response.status).toBe(200);
  });
  it('should return no preview for invalid URL', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: { updateAnnouncement: { announcement: { id: 1, rowId: 1 } } },
      };
    });

    const response = await request(app)
      .post('/api/announcement/linkPreview')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .send({
        url: 'i-am-not-a-url',
        jsonData: {},
        rowId: 1,
        ccbcNumbers: 'CCBC-010001',
      })
      .expect(400);
    expect(response.body.error).toBe('Invalid URL');
  });
});
