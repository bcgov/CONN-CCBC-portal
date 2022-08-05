/**
 * @generated SignedSource<<8af35c10e2001d30d4410ed12840a883>>
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
  referenceNumber?: number | null;
  owner: any;
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
export type createApplicationMutation$variables = {
  input: CreateApplicationInput;
};
export type createApplicationMutation$data = {
  readonly createApplication: {
    readonly clientMutationId: string | null;
    readonly application: {
      readonly rowId: number;
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
  "name": "clientMutationId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rowId",
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Application",
            "kind": "LinkedField",
            "name": "application",
            "plural": false,
            "selections": [
              (v3/*: any*/)
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Application",
            "kind": "LinkedField",
            "name": "application",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
    "cacheID": "e9d4fb4ef8b870b08582c85f4b3963af",
    "id": null,
    "metadata": {},
    "name": "createApplicationMutation",
    "operationKind": "mutation",
    "text": "mutation createApplicationMutation(\n  $input: CreateApplicationInput!\n) {\n  createApplication(input: $input) {\n    clientMutationId\n    application {\n      rowId\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ee1e5476b24d34cae6953025a5cc1d0b";

export default node;
