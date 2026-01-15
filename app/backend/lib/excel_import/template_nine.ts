import { Router } from 'express';
import fs from 'fs';
import XLSX, { WorkBook } from 'xlsx';
import formidable, { File } from 'formidable';
import { performQuery } from '../graphql';
import getAuthRole from '../../../utils/getAuthRole';
import limiter from './excel-limiter';
import { getByteArrayFromS3 } from '../s3client';
import { commonFormidableConfig, parseForm } from '../express-helper';
import { reportServerError } from '../emails/errorNotification';

const createTemplateNineDataMutation = `
  mutation createTemplateNineData($input: CreateApplicationFormTemplate9DataInput!) {
    createApplicationFormTemplate9Data(input: $input) {
      clientMutationId
    }
  }
  `;

const updateTemplateNineDataMutation = `
  mutation updateTemplateNineData($input: UpdateApplicationFormTemplate9DataByRowIdInput!) {
    updateApplicationFormTemplate9DataByRowId(input: $input) {
      clientMutationId
    }
  }
`;

const getTemplateNineQuery = `
  query getTemplateNine {
    allApplications(filter: {ccbcNumber: {isNull: false}}) {
      nodes {
        applicationFormDataByApplicationId {
          nodes {
            formDataByFormDataId {
              jsonData
            }
          }
        }
        rowId
      }
    }
  }
`;

const getTemplateNineRfiDataQuery = `
  query getTemplateNineRfiData {
    allApplicationRfiData(
      filter: {rfiDataByRfiDataId: {jsonData: {contains: {rfiAdditionalFiles: {geographicNames: []}}}, archivedAt: {isNull: true}}}
    ) {
      nodes {
        rfiDataByRfiDataId {
          jsonData
          rfiNumber
        }
        applicationId
      }
    }
  }
`;

const findTemplateNineDataQuery = `
  query findTemplateNineDataQuery($applicationId: Int!){
    allApplicationFormTemplate9Data(filter: {applicationId: {equalTo: $applicationId}}) {
      totalCount
      nodes {
        rowId
      }
    }
  }
`;

const readTemplateNineData = (
  wb: WorkBook,
  sheetName = 'Template 9 - GeoNames'
  // eslint-disable-next-line consistent-return
) => {
  const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
    header: 'A',
  });

  const result = {
    communitiesToBeServed: 0,
    indigenousCommunitiesToBeServed: 0,
    totalNumberOfHouseholds: 0,
    totalNumberOfIndigenousHouseholds: 0,
    geoNames: [],
    errors: [],
  };
  if (sheet.length < 15) {
    result.errors.push('Wrong number of rows on Template 9');
    return result;
  }
  // getting headings
  for (let row = 1; row < 30; row++) {
    const suspect = sheet[row]['D'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect !== 'string') {
      value = suspect.toString();
    } else {
      value = suspect;
      // getting communities to be served and total households
      if (value.indexOf('Number of Communities to be Served') > -1) {
        const communitiesToBeServed = sheet[row]['F'];
        if (typeof communitiesToBeServed !== 'number') {
          result.errors.push({
            level: 'cell',
            error: 'Invalid data: Number of Communities to be Served',
          });
        } else {
          result.communitiesToBeServed = communitiesToBeServed;
        }
        const totalNumberOfHouseholds = sheet[row]['P'];
        if (typeof totalNumberOfHouseholds !== 'number') {
          result.errors.push({
            level: 'cell',
            error: 'Invalid data: Total Number of Households',
          });
        } else {
          result.totalNumberOfHouseholds = totalNumberOfHouseholds;
        }
      }
      // getting indigenous communities to be served and total indigenous households
      if (
        value.indexOf('Number of Indigenous Communities to be Served:') > -1
      ) {
        const indigenousCommunitiesToBeServed = sheet[row]['F'];
        if (typeof indigenousCommunitiesToBeServed !== 'number') {
          result.errors.push({
            level: 'cell',
            error:
              'Invalid data: Number of Indigenous Communities to be Served',
          });
        } else {
          result.indigenousCommunitiesToBeServed =
            indigenousCommunitiesToBeServed;
        }
        const totalNumberOfIndigenousHouseholds = sheet[row]['P'];
        if (typeof totalNumberOfIndigenousHouseholds !== 'number') {
          result.errors.push({
            level: 'cell',
            error: 'Invalid data: Total Number of Indigenous Households',
          });
        } else {
          result.totalNumberOfIndigenousHouseholds =
            totalNumberOfIndigenousHouseholds;
        }
      }
    }
  }

  // getting geo names
  let tableDetected = false;
  for (let row = 5; row < sheet.length; row++) {
    const suspect = sheet[row]['C'];
    let value;
    if (suspect === undefined) continue;
    if (typeof suspect === 'string') {
      value = suspect.toString();
      if (value.indexOf('Project Zone') > -1) {
        tableDetected = true;
        continue;
      }
    }
    if (typeof suspect === 'number' && tableDetected === true) {
      const projectZone = sheet[row]['C'];
      const geoName = sheet[row]['D'];
      const type = sheet[row]['E'];
      const mapLink = sheet[row]['M'];
      const isIndigenous = sheet[row]['N'];
      const geoNameId = sheet[row]['G'];
      const regionalDistrict = sheet[row]['H'];
      const economicRegion = sheet[row]['I'];
      const pointOfPresenceId = sheet[row]['O'];
      const proposedSolution = sheet[row]['P'];
      const households = sheet[row]['Q'];
      const completed = sheet[row]['R'];

      if (
        typeof completed === 'string' &&
        completed.indexOf('Complete') === 0
      ) {
        result.geoNames.push({
          projectZone,
          geoName,
          type,
          mapLink,
          isIndigenous,
          geoNameId,
          regionalDistrict,
          economicRegion,
          pointOfPresenceId,
          proposedSolution,
          households,
        });
      }
    }
  }
  if (result.geoNames.length === 0) {
    result.errors.push({
      level: 'table',
      error: 'Invalid data: No completed Geographic Names rows found',
    });
  }
  if (result.errors.length === 0) delete result.errors;
  return result;
};

const loadTemplateNineData = async (
  wb,
  sheetName = 'Template 9 - GeoNames'
) => {
  const data = readTemplateNineData(wb, sheetName);
  return data;
};

XLSX.set_fs(fs);

const handleTemplateNine = async (
  uuid: string,
  applicationId: Number,
  req,
  update = false
) => {
  try {
    // find the record already exists
    const findResult = await performQuery(
      findTemplateNineDataQuery,
      { applicationId },
      req
    );
    // if it exists, and update is false do nothing
    // update should only be true for RFIs as form data is immutable
    if (
      findResult?.data?.allApplicationFormTemplate9Data.totalCount > 0 &&
      !update
    ) {
      return null;
    }
    // if it does not exist, get data from S3
    // then insert it into the database
    const file = await getByteArrayFromS3(uuid);
    const wb = XLSX.read(file);
    const result = await loadTemplateNineData(wb);
    return result;
  } catch (e) {
    reportServerError(e, { source: 'template-nine-handle' });
    return null;
    // throw new Error(`Error handling template nine: ${e}`);
  }
};

const templateNine = Router();

// Must pass the uuid of the file to be imported
// into the database, it must be a valid uuid
// and a template 9 Excel file
templateNine.get('/api/template-nine/all', limiter, async (req, res) => {
  const authRole = getAuthRole(req);
  const pgRole = authRole?.pgRole;
  const isRoleAuthorized = pgRole === 'ccbc_admin' || pgRole === 'super_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  }

  try {
    const allApplicationData = await performQuery(
      getTemplateNineQuery,
      {},
      req
    );
    allApplicationData.data.allApplications.nodes.forEach(
      async (application) => {
        const applicationId = application.rowId;
        const applicationData =
          application?.applicationFormDataByApplicationId?.nodes[0]
            ?.formDataByFormDataId?.jsonData?.templateUploads
            ?.geographicNames?.[0];
        const uuid = applicationData?.uuid || null;
        // if a uuid is found, handle the template
        if (uuid) {
          const templateNineData = await handleTemplateNine(
            uuid,
            applicationId,
            req
          );
          if (templateNineData) {
            await performQuery(
              createTemplateNineDataMutation,
              {
                input: {
                  applicationFormTemplate9Data: {
                    jsonData: templateNineData,
                    errors: templateNineData.errors || null,
                    source: { source: 'application', uuid },
                    applicationId,
                  },
                },
              },
              req
            );
          }
          // no uuid found, record this as an error in the database
        } else {
          await performQuery(
            createTemplateNineDataMutation,
            {
              input: {
                applicationFormTemplate9Data: {
                  errors: [{ error: 'No template 9 uploaded, uuid not found' }],
                  source: { source: 'application' },
                  applicationId,
                },
              },
            },
            req
          );
        }
      }
    );
    return res.status(200).json({ result: 'success' });
  } catch (e) {
    reportServerError(e, { source: 'template-nine-all', metadata: { route: 'all' } }, req);
    return res.status(500).json({ e });
  }
});

templateNine.get('/api/template-nine/rfi/all', limiter, async (req, res) => {
  const authRole = getAuthRole(req);
  const pgRole = authRole?.pgRole;
  const isRoleAuthorized = pgRole === 'ccbc_admin' || pgRole === 'super_admin';

  if (!isRoleAuthorized) {
    return res.status(404).end();
  }

  try {
    const allApplicationRfiData = await performQuery(
      getTemplateNineRfiDataQuery,
      {},
      req
    );

    allApplicationRfiData.data.allApplicationRfiData.nodes.forEach(
      async (application) => {
        const { applicationId } = application;
        const applicationData = application?.rfiDataByRfiDataId?.jsonData;
        const uuid =
          applicationData?.rfiAdditionalFiles?.geographicNames?.[0]?.uuid;
        // if a uuid is found, handle the template
        if (uuid) {
          const templateNineData = await handleTemplateNine(
            uuid,
            applicationId,
            req,
            true
          );
          if (templateNineData) {
            const findTemplateNineData = await performQuery(
              findTemplateNineDataQuery,
              { applicationId },
              req
            );
            if (
              findTemplateNineData.data.allApplicationFormTemplate9Data
                .totalCount > 0
            ) {
              // update
              await performQuery(
                updateTemplateNineDataMutation,
                {
                  input: {
                    rowId:
                      findTemplateNineData.data.allApplicationFormTemplate9Data
                        .nodes[0].rowId,
                    applicationFormTemplate9DataPatch: {
                      jsonData: templateNineData,
                      errors: templateNineData.errors || null,
                      source: {
                        source: 'rfi',
                        rfiNumber:
                          application?.rfiDataByRfiDataId?.rfiNumber || null,
                        uuid,
                      },
                      applicationId,
                    },
                  },
                },
                req
              );
              // else create new one
            } else {
              await performQuery(
                createTemplateNineDataMutation,
                {
                  input: {
                    applicationFormTemplate9Data: {
                      jsonData: templateNineData,
                      errors: templateNineData.errors || null,
                      source: {
                        source: 'rfi',
                        rfiNumber: application?.rfiDataByRfiDataId?.rfiNumber,
                        uuid,
                      },
                      applicationId,
                    },
                  },
                },
                req
              );
            }
          }
        }
      }
    );

    return res.status(200).json({ result: 'success' });
  } catch (e) {
    reportServerError(
      e,
      { source: 'template-nine-rfi', metadata: { route: 'rfi-all' } },
      req
    );
    return res.status(500).json({ e });
  }
});

templateNine.get(
  '/api/template-nine/:id/:uuid/:source/:rfiNumber?',
  limiter,
  async (req, res) => {
    const authRole = getAuthRole(req);
    const pgRole = authRole?.pgRole;
    const isRoleAuthorized =
      pgRole === 'ccbc_admin' || pgRole === 'super_admin' || pgRole === 'ccbc_auth_user';

    if (!isRoleAuthorized) {
      return res.status(404).end();
    }

    const { id, uuid, source } = req.params;
    let rfiNumber = null;
    if (
      !source ||
      !id ||
      !uuid ||
      (source !== 'application' && source !== 'rfi')
    ) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
    if (source === 'rfi') {
      if (!req.params.rfiNumber) {
        return res.status(400).json({ error: 'Invalid parameters' });
      }
      rfiNumber = req.params.rfiNumber || null;
    }
    const applicationId = parseInt(id, 10);
    const templateNineData = await handleTemplateNine(
      uuid,
      applicationId,
      req,
      true
    );
    if (templateNineData) {
      const findTemplateNineData = await performQuery(
        findTemplateNineDataQuery,
        { applicationId },
        req
      );
      if (
        findTemplateNineData?.data?.allApplicationFormTemplate9Data
          ?.totalCount > 0
      ) {
        // update
        await performQuery(
          updateTemplateNineDataMutation,
          {
            input: {
              rowId:
                findTemplateNineData.data.allApplicationFormTemplate9Data
                  .nodes[0].rowId,
              applicationFormTemplate9DataPatch: {
                jsonData: templateNineData,
                errors: templateNineData.errors || null,
                source: {
                  source,
                  rfiNumber: rfiNumber || null,
                  uuid,
                },
                applicationId,
              },
            },
          },
          req
        );
        // else create new one
      } else {
        await performQuery(
          createTemplateNineDataMutation,
          {
            input: {
              applicationFormTemplate9Data: {
                jsonData: templateNineData,
                errors: templateNineData.errors || null,
                source: { source: 'application' },
                applicationId,
              },
            },
          },
          req
        );
      }
    }
    return res.status(200).json({ result: 'success' });
  }
);

templateNine.post(
  '/api/template-nine/rfi/applicant/:id/:rfiNumber',
  limiter,
  async (req, res) => {
    const authRole = getAuthRole(req);
    const pgRole = authRole?.pgRole;
    const isRoleAuthorized = pgRole === 'ccbc_auth_user';
    if (!isRoleAuthorized) {
      return res.status(404).end();
    }

    const { id, rfiNumber } = req.params;

    const applicationId = parseInt(id, 10);

    if (!id || !rfiNumber || Number.isNaN(applicationId)) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
    const errorList = [];
    const form = formidable(commonFormidableConfig);

    let files;
    try {
      files = await parseForm(form, req);
    } catch (err) {
      errorList.push({ level: 'file', error: err });
      reportServerError(err, { source: 'template-nine-parse-form' }, req);
      return res.status(400).json({ errors: errorList }).end();
    }
    const filename = Object.keys(files)[0];
    const uploadedFilesArray = files[filename] as Array<File>;
    const uploaded = uploadedFilesArray?.[0];

    if (!uploaded) {
      return res.status(400).end();
    }
    const buf = fs.readFileSync(uploaded.filepath);
    const wb = XLSX.read(buf);
    let templateNineData;
    try {
      templateNineData = await loadTemplateNineData(wb);
    } catch (err) {
      errorList.push({ level: 'file', error: err });
      reportServerError(err, { source: 'template-nine-load-data' }, req);
      return res.status(400).json({ errors: errorList }).end();
    }

    if (templateNineData) {
      return res.status(200).json(templateNineData);
    }
    return res
      .status(400)
      .json({ error: 'Unknown error while parsing template nine' });
  }
);

templateNine.post(
  '/api/template-nine/rfi/:id/:rfiNumber',
  limiter,
  async (req, res) => {
    const authRole = getAuthRole(req);
    const pgRole = authRole?.pgRole;
    const isRoleAuthorized =
      pgRole === 'ccbc_admin' ||
      pgRole === 'super_admin' ||
      pgRole === 'ccbc_analyst';

    if (!isRoleAuthorized) {
      return res.status(404).end();
    }

    const { id, rfiNumber } = req.params;

    const applicationId = parseInt(id, 10);

    if (!id || !rfiNumber || Number.isNaN(applicationId)) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const errorList = [];
    const form = formidable(commonFormidableConfig);

    const files = await parseForm(form, req).catch((err) => {
      errorList.push({ level: 'file', error: err });
      return res.status(400).json(errorList).end();
    });

    const filename = Object.keys(files)[0];
    const uploadedFilesArray = files[filename] as Array<File>;

    const uploaded = uploadedFilesArray?.[0];
    if (!uploaded) {
      return res.status(400).end();
    }
    const buf = fs.readFileSync(uploaded.filepath);
    const wb = XLSX.read(buf);

    const templateNineData = await loadTemplateNineData(wb);

    if (
      !templateNineData ||
      (templateNineData.errors && templateNineData.errors.length > 0)
    ) {
      return res
        .status(400)
        .json({ error: 'failed to process template upload' })
        .end();
    }
    return res.status(200).json({
      ...templateNineData,
      originalFileName: uploaded.originalFilename,
    });
  }
);

export default templateNine;
