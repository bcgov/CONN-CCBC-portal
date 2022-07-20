/**
 * @generated SignedSource<<351739b04a3fe3cfee2a52950fe2ac1e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ApplicationCondition = {
  rowId?: number | null;
  referenceNumber?: string | null;
  owner?: any | null;
  formData?: any | null;
  status?: string | null;
  createdBy?: number | null;
  createdAt?: any | null;
  updatedBy?: number | null;
  updatedAt?: any | null;
  archivedBy?: number | null;
  archivedAt?: any | null;
};
export type getAllApplicationsByOwnerQuery$variables = {
  formOwner: ApplicationCondition;
};
export type getAllApplicationsByOwnerQuery$data = {
  readonly allApplications: {
    readonly nodes: ReadonlyArray<{
      readonly rowId: number;
      readonly owner: any;
      readonly referenceNumber: string | null;
      readonly status: string | null;
      readonly projectName: string | null;
    } | null>;
  } | null;
};
export type getAllApplicationsByOwnerQuery = {
  variables: getAllApplicationsByOwnerQuery$variables;
  response: getAllApplicationsByOwnerQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "formOwner"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "condition",
    "variableName": "formOwner"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rowId",
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
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "projectName",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "getAllApplicationsByOwnerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ApplicationsConnection",
        "kind": "LinkedField",
        "name": "allApplications",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Application",
            "kind": "LinkedField",
            "name": "nodes",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "getAllApplicationsByOwnerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ApplicationsConnection",
        "kind": "LinkedField",
        "name": "allApplications",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Application",
            "kind": "LinkedField",
            "name": "nodes",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
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
    "cacheID": "34bf05db4be518b2cf0081ee55c51ba6",
    "id": null,
    "metadata": {},
    "name": "getAllApplicationsByOwnerQuery",
    "operationKind": "query",
    "text": "query getAllApplicationsByOwnerQuery(\n  $formOwner: ApplicationCondition!\n) {\n  allApplications(condition: $formOwner) {\n    nodes {\n      rowId\n      owner\n      referenceNumber\n      status\n      projectName\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8e123e3b893714786889aa9316264516";

export default node;
