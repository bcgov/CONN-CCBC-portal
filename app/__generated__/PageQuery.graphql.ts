/**
 * @generated SignedSource<<0319cddfad2a8bf7450f809a7ade5a37>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PageQuery$variables = {
  rowId: number;
};
export type PageQuery$data = {
  readonly applicationByRowId: {
    readonly formData: any;
    readonly id: string;
    readonly owner: any;
    readonly referenceNumber: number | null;
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
    "name": "rowId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "rowId",
        "variableName": "rowId"
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
    "cacheID": "13be99f247e85d54a5906d0f65d60b65",
    "id": null,
    "metadata": {},
    "name": "PageQuery",
    "operationKind": "query",
    "text": "query PageQuery(\n  $rowId: Int!\n) {\n  applicationByRowId(rowId: $rowId) {\n    formData\n    id\n    owner\n    referenceNumber\n    status\n  }\n  session {\n    sub\n  }\n}\n"
  }
};
})();

(node as any).hash = "751892edbb04d0a900aedcfbbf1d352a";

export default node;
