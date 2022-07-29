/**
 * @generated SignedSource<<4bcb1c149039344d6dbd3a4127c73047>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateApplicationByRowIdInput = {
  clientMutationId?: string | null;
  applicationPatch: ApplicationPatch;
  rowId: number;
};
export type ApplicationPatch = {
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
export type updateApplicationMutation$variables = {
  input: UpdateApplicationByRowIdInput;
};
export type updateApplicationMutation$data = {
  readonly updateApplicationByRowId: {
    readonly application: {
      readonly formData: any;
    } | null;
  } | null;
};
export type updateApplicationMutation = {
  variables: updateApplicationMutation$variables;
  response: updateApplicationMutation$data;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'input',
      },
    ],
    v1 = [
      {
        kind: 'Variable',
        name: 'input',
        variableName: 'input',
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'formData',
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Fragment',
      metadata: null,
      name: 'updateApplicationMutation',
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: 'UpdateApplicationPayload',
          kind: 'LinkedField',
          name: 'updateApplicationByRowId',
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: 'Application',
              kind: 'LinkedField',
              name: 'application',
              plural: false,
              selections: [v2 /*: any*/],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      type: 'Mutation',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Operation',
      name: 'updateApplicationMutation',
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: 'UpdateApplicationPayload',
          kind: 'LinkedField',
          name: 'updateApplicationByRowId',
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: 'Application',
              kind: 'LinkedField',
              name: 'application',
              plural: false,
              selections: [
                v2 /*: any*/,
                {
                  alias: null,
                  args: null,
                  kind: 'ScalarField',
                  name: 'id',
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: '6886ef4cd2980006d78030d327b0ab7a',
      id: null,
      metadata: {},
      name: 'updateApplicationMutation',
      operationKind: 'mutation',
      text: 'mutation updateApplicationMutation(\n  $input: UpdateApplicationByRowIdInput!\n) {\n  updateApplicationByRowId(input: $input) {\n    application {\n      formData\n      id\n    }\n  }\n}\n',
    },
  };
})();

(node as any).hash = '67da55730d7534b97a7f5d77484368f2';

export default node;
