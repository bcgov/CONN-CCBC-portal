/**
 * @generated SignedSource<<fa65be1e074084d52d097941ead4e612>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type getApplicationByOwnerQuery$variables = {
  owner: any;
};
export type getApplicationByOwnerQuery$data = {
  readonly applicationByOwner: {
    readonly formData: any;
    readonly id: string;
    readonly owner: any | null;
    readonly referenceNumber: string | null;
    readonly status: string | null;
  } | null;
};
export type getApplicationByOwnerQuery = {
  variables: getApplicationByOwnerQuery$variables;
  response: getApplicationByOwnerQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "owner"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "owner",
        "variableName": "owner"
      }
    ],
    "concreteType": "Application",
    "kind": "LinkedField",
    "name": "applicationByOwner",
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
    "name": "getApplicationByOwnerQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "getApplicationByOwnerQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ca18dd280312226e35c6e8fcff5cb698",
    "id": null,
    "metadata": {},
    "name": "getApplicationByOwnerQuery",
    "operationKind": "query",
    "text": "query getApplicationByOwnerQuery(\n  $owner: UUID!\n) {\n  applicationByOwner(owner: $owner) {\n    formData\n    id\n    owner\n    referenceNumber\n    status\n  }\n}\n"
  }
};
})();

(node as any).hash = "a7dc2ca75de8b443ec43d8876e067119";

export default node;
