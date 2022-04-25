/**
 * @generated SignedSource<<75e71bf7290badc741fa4bce4c6e66e5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateApplicationInput = {
  clientMutationId?: string | null;
  application: ApplicationInput;
};
export type ApplicationInput = {
  referenceNumber?: string | null;
  owner?: any | null;
  formData?: any | null;
  status?: string | null;
};
export type createApplicationMutation$variables = {
  input: CreateApplicationInput;
};
export type createApplicationMutation$data = {
  readonly createApplication: {
    readonly application: {
      readonly formData: any;
      readonly id: string;
      readonly owner: any | null;
      readonly referenceNumber: string | null;
    } | null;
  } | null;
};
export type createApplicationMutation = {
  variables: createApplicationMutation$variables;
  response: createApplicationMutation$data;
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
    "concreteType": "CreateApplicationPayload",
    "kind": "LinkedField",
    "name": "createApplication",
    "plural": false,
    "selections": [
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
    "name": "createApplicationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createApplicationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3959eed2b630d220e257c918999fa4bc",
    "id": null,
    "metadata": {},
    "name": "createApplicationMutation",
    "operationKind": "mutation",
    "text": "mutation createApplicationMutation(\n  $input: CreateApplicationInput!\n) {\n  createApplication(input: $input) {\n    application {\n      formData\n      id\n      owner\n      referenceNumber\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "66de7c2edae663ff4aad418533e88614";

export default node;
