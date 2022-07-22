/**
 * @generated SignedSource<<d2a2abd71975a38024abd09df2b4aac4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type successQuery$variables = {};
export type successQuery$data = {
  readonly session: {
    readonly sub: any | null;
  } | null;
};
export type successQuery = {
  variables: successQuery$variables;
  response: successQuery$data;
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
    "name": "successQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "successQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "e55905a9e9fbd32b402da35f6c69d0aa",
    "id": null,
    "metadata": {},
    "name": "successQuery",
    "operationKind": "query",
    "text": "query successQuery {\n  session {\n    sub\n  }\n}\n"
  }
};
})();

(node as any).hash = "e78412f315623b082315560c29570533";

export default node;
