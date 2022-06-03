/**
 * @generated SignedSource<<c02a8dd75aa3735faed7cf499d3aae6a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type getSessionQuery$variables = {};
export type getSessionQuery$data = {
  readonly session: {
    readonly sub: any | null;
  } | null;
};
export type getSessionQuery = {
  variables: getSessionQuery$variables;
  response: getSessionQuery$data;
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
    "name": "getSessionQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "getSessionQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "62eb03bbee01eba7c7997d2e4c2b13ab",
    "id": null,
    "metadata": {},
    "name": "getSessionQuery",
    "operationKind": "query",
    "text": "query getSessionQuery {\n  session {\n    sub\n  }\n}\n"
  }
};
})();

(node as any).hash = "17e9154b709ae94f9fb85840cca473e1";

export default node;
