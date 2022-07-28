/**
 * @generated SignedSource<<6fc1edf8c5c334bba9deed07a71295b6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type pagesQuery$variables = {};
export type pagesQuery$data = {
  readonly session: {
    readonly sub: any | null;
  } | null;
};
export type pagesQuery = {
  variables: pagesQuery$variables;
  response: pagesQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pagesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pagesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "1b0904d8382357799cd96531bd55995e",
    "id": null,
    "metadata": {},
    "name": "pagesQuery",
    "operationKind": "query",
    "text": "query pagesQuery {\n  session {\n    sub\n  }\n}\n"
  }
};
})();

(node as any).hash = "5885755c22f18feebf914e463c551401";

export default node;
