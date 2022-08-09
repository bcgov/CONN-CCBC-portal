/**
 * @generated SignedSource<<eae57e33dacef0a1e79ea294be4eaea5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ApplicationCondition = {
  rowId?: number | null;
  referenceNumber?: number | null;
  owner?: any | null;
  formData?: any | null;
  status?: string | null;
  createdBy?: number | null;
  createdAt?: any | null;
  updatedBy?: number | null;
  updatedAt?: any | null;
  archivedBy?: number | null;
  archivedAt?: any | null;
  intakeId?: number | null;
  lastEditedPage?: string | null;
};
export type DashboardTestQuery$variables = {
  formOwner: ApplicationCondition;
};
export type DashboardTestQuery$data = {
  readonly allApplications: {
    readonly nodes: ReadonlyArray<{
      readonly id: string;
      readonly rowId: number;
      readonly owner: any;
      readonly referenceNumber: number | null;
      readonly status: string | null;
      readonly projectName: string | null;
      readonly ccbcId: string | null;
      readonly lastEditedPage: string | null;
      readonly intakeByIntakeId: {
        readonly ccbcIntakeNumber: number | null;
        readonly closeTimestamp: any | null;
        readonly openTimestamp: any | null;
      } | null;
    } | null>;
  } | null;
};
export type DashboardTestQuery = {
  variables: DashboardTestQuery$variables;
  response: DashboardTestQuery$data;
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
    "kind": "Variable",
    "name": "condition",
    "variableName": "formOwner"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rowId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "owner",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "referenceNumber",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "projectName",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ccbcId",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastEditedPage",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ccbcIntakeNumber",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "closeTimestamp",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "openTimestamp",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DashboardTestQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Intake",
                "kind": "LinkedField",
                "name": "intakeByIntakeId",
                "plural": false,
                "selections": [
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DashboardTestQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Intake",
                "kind": "LinkedField",
                "name": "intakeByIntakeId",
                "plural": false,
                "selections": [
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "52de75d412d5c1de3f5e3227c52d95ed",
    "id": null,
    "metadata": {},
    "name": "DashboardTestQuery",
    "operationKind": "query",
    "text": "query DashboardTestQuery(\n  $formOwner: ApplicationCondition!\n) {\n  allApplications(condition: $formOwner) {\n    nodes {\n      id\n      rowId\n      owner\n      referenceNumber\n      status\n      projectName\n      ccbcId\n      lastEditedPage\n      intakeByIntakeId {\n        ccbcIntakeNumber\n        closeTimestamp\n        openTimestamp\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c8108c6040db4faf4f242874b118c4ce";

export default node;
