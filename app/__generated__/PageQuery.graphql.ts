/**
 * @generated SignedSource<<922d1299b94c891b2ec816cc7b72b9f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PageQuery$variables = {
  applicationId: number;
};
export type PageQuery$data = {
  readonly applicationByRowId: {
    readonly formData: any;
    readonly id: string;
    readonly owner: any;
    readonly referenceNumber: string | null;
    readonly status: string | null;
  } | null;
  readonly session: {
    readonly sub: any | null;
  } | null;
};
export type PageQuery = {
  variables: PageQuery$variables;
  response: PageQuery$data;
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
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "KeycloakJwt",
    "kind": "LinkedField",
    "name": "session",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "sub",
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
    "name": "PageQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PageQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "655bc92b096f6e901a5179f4b268503d",
    "id": null,
    "metadata": {},
    "name": "PageQuery",
    "operationKind": "query",
    "text": "query PageQuery(\n  $applicationId: Int!\n) {\n  applicationByRowId(rowId: $applicationId) {\n    formData\n    id\n    owner\n    referenceNumber\n    status\n  }\n  session {\n    sub\n  }\n}\n"
  }
};
})();

(node as any).hash = "880a31887c1ed26306df6065c2858d80";

export default node;
