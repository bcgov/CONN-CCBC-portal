/**
 * @generated SignedSource<<fdd80d837b51e7d30ea60243da493a76>>
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
        alias: null,
        args: [
          {
            kind: 'Variable',
            name: 'condition',
            variableName: 'formOwner',
          },
        ],
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
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'id',
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'rowId',
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'owner',
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'referenceNumber',
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'status',
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'projectName',
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'ccbcId',
                storageKey: null,
              },
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
      {
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
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Fragment',
      metadata: null,
      name: 'dashboardQuery',
      selections: v1 /*: any*/,
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Operation',
      name: 'dashboardQuery',
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: '1641a1fb2b0fdcdd48b9ffb286e7e477',
      id: null,
      metadata: {},
      name: 'dashboardQuery',
      operationKind: 'query',
      text: 'query dashboardQuery(\n  $formOwner: ApplicationCondition!\n) {\n  allApplications(condition: $formOwner) {\n    nodes {\n      id\n      rowId\n      owner\n      referenceNumber\n      status\n      projectName\n      ccbcId\n    }\n  }\n  session {\n    sub\n  }\n}\n',
    },
  };
})();

(node as any).hash = '97f26fe9c20bac9c2671dbfc2008d3e9';

export default node;
