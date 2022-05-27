/**
 * @generated SignedSource<<98fa0dec0f215c0b2bce2d964a997f5a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateApplicationByOwnerInput = {
  clientMutationId?: string | null;
  applicationPatch: ApplicationPatch;
  owner: any;
};
export type ApplicationPatch = {
  referenceNumber?: string | null;
  owner?: any | null;
  formData?: any | null;
  status?: string | null;
};
export type updateApplicationMutation$variables = {
  input: UpdateApplicationByOwnerInput;
};
export type updateApplicationMutation$data = {
  readonly updateApplicationByOwner: {
    readonly clientMutationId: string | null;
    readonly application: {
      readonly formData: any;
      readonly id: string;
      readonly owner: any | null;
      readonly status: string | null;
      readonly referenceNumber: string | null;
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
    "name": "updateApplicationByOwner",
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
    "cacheID": "8b1f07d53dba2227d488baefc6861d8a",
    "id": null,
    "metadata": {},
    "name": "updateApplicationMutation",
    "operationKind": "mutation",
    "text": "mutation updateApplicationMutation(\n  $input: UpdateApplicationByOwnerInput!\n) {\n  updateApplicationByOwner(input: $input) {\n    clientMutationId\n    application {\n      formData\n      id\n      owner\n      status\n      referenceNumber\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "31f23c8f86b3a2c588d52ab439993cf8";

export default node;
