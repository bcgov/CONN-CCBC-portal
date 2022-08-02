/**
 * @generated SignedSource<<6ec27213feb55e1416e7189d982cb0cb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ApplicationsAddCcbcIdInput = {
  clientMutationId?: string | null;
  applicationId: number;
};
export type addCcbcIdToApplicationMutation$variables = {
  input: ApplicationsAddCcbcIdInput;
};
export type addCcbcIdToApplicationMutation$data = {
  readonly applicationsAddCcbcId: {
    readonly application: {
      readonly ccbcId: string | null;
      readonly rowId: number;
    } | null;
  } | null;
};
export type addCcbcIdToApplicationMutation = {
  variables: addCcbcIdToApplicationMutation$variables;
  response: addCcbcIdToApplicationMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ccbcId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rowId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "addCcbcIdToApplicationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ApplicationsAddCcbcIdPayload",
        "kind": "LinkedField",
        "name": "applicationsAddCcbcId",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Application",
            "kind": "LinkedField",
            "name": "application",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "addCcbcIdToApplicationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ApplicationsAddCcbcIdPayload",
        "kind": "LinkedField",
        "name": "applicationsAddCcbcId",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Application",
            "kind": "LinkedField",
            "name": "application",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
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
    "cacheID": "eed8bab79efa3d8cfb0669897096b8ef",
    "id": null,
    "metadata": {},
    "name": "addCcbcIdToApplicationMutation",
    "operationKind": "mutation",
    "text": "mutation addCcbcIdToApplicationMutation(\n  $input: ApplicationsAddCcbcIdInput!\n) {\n  applicationsAddCcbcId(input: $input) {\n    application {\n      ccbcId\n      rowId\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c7b14209ccae858986959ac5f23e4f33";

export default node;
