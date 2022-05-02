/**
 * @generated SignedSource<<088e22c1e138a3f74a2e616c735cf1af>>
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
      readonly owner: any | null;
      readonly referenceNumber: string | null;
      readonly status: string | null;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formData",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "owner",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "referenceNumber",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "createApplicationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createApplicationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c51182f8ef31a4bc70a32ff78715cd2a",
    "id": null,
    "metadata": {},
    "name": "createApplicationMutation",
    "operationKind": "mutation",
    "text": "mutation createApplicationMutation(\n  $input: CreateApplicationInput!\n) {\n  createApplication(input: $input) {\n    application {\n      formData\n      owner\n      referenceNumber\n      status\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "160f162e59b70c0d7e262abd8f424aa8";

export default node;
