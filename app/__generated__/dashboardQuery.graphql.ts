/**
 * @generated SignedSource<<bffdbd02488882cb0cec3e3eab7fbb13>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ApplicationCondition = {
  rowId?: number | null;
  referenceNumber?: number | null;
  owner?: any | null;
  formData?: any | null;
  status?: string | null;
  createdBy?: number | null;
  createdAt?: any | null;
  updatedBy?: number | null;
  updatedAt?: any | null;
  archivedBy?: number | null;
  archivedAt?: any | null;
  intakeId?: number | null;
  lastEditedPage?: string | null;
};
export type dashboardQuery$variables = {
  formOwner: ApplicationCondition;
};
export type dashboardQuery$data = {
  readonly allApplications: {
    readonly nodes: ReadonlyArray<{
      readonly id: string;
      readonly rowId: number;
      readonly owner: any;
      readonly referenceNumber: number | null;
      readonly status: string | null;
      readonly projectName: string | null;
      readonly ccbcId: string | null;
      readonly lastEditedPage: string | null;
      readonly intakeByIntakeId: {
        readonly ccbcIntakeNumber: number | null;
        readonly closeTimestamp: any | null;
        readonly openTimestamp: any | null;
      } | null;
    } | null>;
  } | null;
  readonly session: {
    readonly sub: any | null;
  } | null;
};
export type dashboardQuery = {
  variables: dashboardQuery$variables;
  response: dashboardQuery$data;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'formOwner',
      },
    ],
    v1 = [
      {
        kind: 'Variable',
        name: 'condition',
        variableName: 'formOwner',
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'id',
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'rowId',
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'owner',
      storageKey: null,
    },
    v5 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'referenceNumber',
      storageKey: null,
    },
    v6 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'status',
      storageKey: null,
    },
    v7 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'projectName',
      storageKey: null,
    },
    v8 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'ccbcId',
      storageKey: null,
    },
    v9 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'lastEditedPage',
      storageKey: null,
    },
    v10 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'ccbcIntakeNumber',
      storageKey: null,
    },
    v11 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'closeTimestamp',
      storageKey: null,
    },
    v12 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'openTimestamp',
      storageKey: null,
    },
    v13 = {
      alias: null,
      args: null,
      concreteType: 'KeycloakJwt',
      kind: 'LinkedField',
      name: 'session',
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'sub',
          storageKey: null,
        },
      ],
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Fragment',
      metadata: null,
      name: 'dashboardQuery',
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: 'ApplicationsConnection',
          kind: 'LinkedField',
          name: 'allApplications',
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: 'Application',
              kind: 'LinkedField',
              name: 'nodes',
              plural: true,
              selections: [
                v2 /*: any*/,
                v3 /*: any*/,
                v4 /*: any*/,
                v5 /*: any*/,
                v6 /*: any*/,
                v7 /*: any*/,
                v8 /*: any*/,
                v9 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: 'Intake',
                  kind: 'LinkedField',
                  name: 'intakeByIntakeId',
                  plural: false,
                  selections: [v10 /*: any*/, v11 /*: any*/, v12 /*: any*/],
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
        v13 /*: any*/,
      ],
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Operation',
      name: 'dashboardQuery',
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: 'ApplicationsConnection',
          kind: 'LinkedField',
          name: 'allApplications',
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: 'Application',
              kind: 'LinkedField',
              name: 'nodes',
              plural: true,
              selections: [
                v2 /*: any*/,
                v3 /*: any*/,
                v4 /*: any*/,
                v5 /*: any*/,
                v6 /*: any*/,
                v7 /*: any*/,
                v8 /*: any*/,
                v9 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: 'Intake',
                  kind: 'LinkedField',
                  name: 'intakeByIntakeId',
                  plural: false,
                  selections: [
                    v10 /*: any*/,
                    v11 /*: any*/,
                    v12 /*: any*/,
                    v2 /*: any*/,
                  ],
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
        v13 /*: any*/,
      ],
    },
    params: {
      cacheID: '8a55698d2b51443044cf2c73764259bf',
      id: null,
      metadata: {},
      name: 'dashboardQuery',
      operationKind: 'query',
      text: 'query dashboardQuery(\n  $formOwner: ApplicationCondition!\n) {\n  allApplications(condition: $formOwner) {\n    nodes {\n      id\n      rowId\n      owner\n      referenceNumber\n      status\n      projectName\n      ccbcId\n      lastEditedPage\n      intakeByIntakeId {\n        ccbcIntakeNumber\n        closeTimestamp\n        openTimestamp\n        id\n      }\n    }\n  }\n  session {\n    sub\n  }\n}\n',
    },
  };
})();

(node as any).hash = '47a485efb36c5f78161a750911f6eb59';

export default node;
