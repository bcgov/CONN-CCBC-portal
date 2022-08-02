/**
 * @generated SignedSource<<b9fd9f72888e18664e5a832347db0129>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type successQuery$variables = {
  rowId: number;
};
export type successQuery$data = {
  readonly applicationByRowId: {
    readonly status: string | null;
    readonly ccbcId: string | null;
    readonly intakeId: number | null;
  } | null;
  readonly allIntakes: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly rowId: number;
        readonly closeTimestamp: any | null;
      } | null;
    }>;
  } | null;
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "rowId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "rowId",
    "variableName": "rowId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ccbcId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "intakeId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rowId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "closeTimestamp",
  "storageKey": null
},
v7 = {
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
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "successQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Application",
        "kind": "LinkedField",
        "name": "applicationByRowId",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "IntakesConnection",
        "kind": "LinkedField",
        "name": "allIntakes",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "IntakesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Intake",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v7/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "successQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Application",
        "kind": "LinkedField",
        "name": "applicationByRowId",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v8/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "IntakesConnection",
        "kind": "LinkedField",
        "name": "allIntakes",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "IntakesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Intake",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v8/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v7/*: any*/)
    ]
  },
  "params": {
    "cacheID": "8bb1b78ae0f755774e01a596f8d0c067",
    "id": null,
    "metadata": {},
    "name": "successQuery",
    "operationKind": "query",
    "text": "query successQuery(\n  $rowId: Int!\n) {\n  applicationByRowId(rowId: $rowId) {\n    status\n    ccbcId\n    intakeId\n    id\n  }\n  allIntakes {\n    edges {\n      node {\n        rowId\n        closeTimestamp\n        id\n      }\n    }\n  }\n  session {\n    sub\n  }\n}\n"
  }
};
})();

(node as any).hash = "d8f243f253adad4cefc5c6f9698bf46b";

export default node;
