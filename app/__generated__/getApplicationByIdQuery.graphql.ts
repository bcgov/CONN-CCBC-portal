/**
 * @generated SignedSource<<9db7594af44245fe1cd74993771d84df>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type getApplicationByIdQuery$variables = {
  applicationId: number;
};
export type getApplicationByIdQuery$data = {
  readonly applicationByRowId: {
    readonly formData: any;
    readonly id: string;
    readonly owner: any;
    readonly referenceNumber: string | null;
    readonly status: string | null;
  } | null;
};
export type getApplicationByIdQuery = {
  variables: getApplicationByIdQuery$variables;
  response: getApplicationByIdQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "applicationId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "rowId",
        "variableName": "applicationId"
      }
    ],
    "concreteType": "Application",
    "kind": "LinkedField",
    "name": "applicationByRowId",
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "status",
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
    "name": "getApplicationByIdQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "getApplicationByIdQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b6879c3770a67c136f9e75da6a1f6155",
    "id": null,
    "metadata": {},
    "name": "getApplicationByIdQuery",
    "operationKind": "query",
    "text": "query getApplicationByIdQuery(\n  $applicationId: Int!\n) {\n  applicationByRowId(rowId: $applicationId) {\n    formData\n    id\n    owner\n    referenceNumber\n    status\n  }\n}\n"
  }
};
})();

(node as any).hash = "7afbdceac3a83897f424571e3c62e2a2";

export default node;
