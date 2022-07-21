/**
 * @generated SignedSource<<838296245d40b637022c9137a5188d72>>
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
      readonly id: string;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "condition",
        "variableName": "formOwner"
      }
    ],
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
            "name": "rowId",
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
            "name": "projectName",
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
    "name": "getAllApplicationsByOwnerQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "getAllApplicationsByOwnerQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "62ef7cd6518b85fe3c2d855faafb8e6f",
    "id": null,
    "metadata": {},
    "name": "getAllApplicationsByOwnerQuery",
    "operationKind": "query",
    "text": "query getAllApplicationsByOwnerQuery(\n  $formOwner: ApplicationCondition!\n) {\n  allApplications(condition: $formOwner) {\n    nodes {\n      id\n      rowId\n      owner\n      referenceNumber\n      status\n      projectName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6292bd220f6c56d8a7accedf45820fca";

export default node;
