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
};
export type updateApplicationMutation$variables = {
  input: UpdateApplicationByRowIdInput;
};
export type updateApplicationMutation$data = {
  readonly updateApplicationByRowId: {
    readonly clientMutationId: string | null;
    readonly application: {
      readonly formData: any;
      readonly id: string;
      readonly owner: any;
      readonly status: string | null;
      readonly referenceNumber: number | null;
      readonly rowId: number;
    } | null;
  } | null;
};
export type updateApplicationMutation = {
  variables: updateApplicationMutation$variables;
  response: updateApplicationMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdateApplicationPayload",
    "kind": "LinkedField",
    "name": "updateApplicationByRowId",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "clientMutationId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Application",
        "kind": "LinkedField",
        "name": "application",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "formData",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "owner",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "referenceNumber",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "rowId",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "updateApplicationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "updateApplicationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "07df4f07385cbcc0a04cd2cfb9ba97d1",
    "id": null,
    "metadata": {},
    "name": "updateApplicationMutation",
    "operationKind": "mutation",
    "text": "mutation updateApplicationMutation(\n  $input: UpdateApplicationByRowIdInput!\n) {\n  updateApplicationByRowId(input: $input) {\n    clientMutationId\n    application {\n      formData\n      id\n      owner\n      status\n      referenceNumber\n      rowId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "46685fe6c8963e572daa393f06e0c085";

export default node;
