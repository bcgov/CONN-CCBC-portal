/**
 * @generated SignedSource<<c6669f164bf0ede511a337695224638c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateApplicationInput = {
  clientMutationId?: string | null;
  application: ApplicationInput;
};
export type ApplicationInput = {
  referenceNumber?: string | null;
  owner?: any | null;
  formData?: any | null;
  status?: string | null;
};
export type createApplicationMutation$variables = {
  input: CreateApplicationInput;
};
export type createApplicationMutation$data = {
  readonly createApplication: {
    readonly clientMutationId: string | null;
  } | null;
};
export type createApplicationMutation = {
  variables: createApplicationMutation$variables;
  response: createApplicationMutation$data;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateApplicationPayload",
    "kind": "LinkedField",
    "name": "createApplication",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "clientMutationId",
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
    "name": "createApplicationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createApplicationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9c913ee0a278b8e6da7a7a763419588b",
    "id": null,
    "metadata": {},
    "name": "createApplicationMutation",
    "operationKind": "mutation",
    "text": "mutation createApplicationMutation(\n  $input: CreateApplicationInput!\n) {\n  createApplication(input: $input) {\n    clientMutationId\n  }\n}\n"
  }
};
})();

(node as any).hash = "e1ccf1dc120bf92eecdeca5f6f02dd44";

export default node;
