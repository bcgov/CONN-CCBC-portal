/**
 * @generated SignedSource<<27938a909b51e1f7d1cd606be03c35b6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type SessionExpiryHandlerQuery$variables = {};
export type SessionExpiryHandlerQuery$data = {
  readonly session: {
    readonly __typename: string;
  } | null;
};
export type SessionExpiryHandlerQuery = {
  variables: SessionExpiryHandlerQuery$variables;
  response: SessionExpiryHandlerQuery$data;
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
        "name": "__typename",
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
    "name": "SessionExpiryHandlerQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SessionExpiryHandlerQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "1cb5e5c8a3cc40fed34a105c62ce79f9",
    "id": null,
    "metadata": {},
    "name": "SessionExpiryHandlerQuery",
    "operationKind": "query",
    "text": "query SessionExpiryHandlerQuery {\n  session {\n    __typename\n  }\n}\n"
  }
};
})();

(node as any).hash = "2054b7bbb6a79c6651d748e0b67af1af";

export default node;
