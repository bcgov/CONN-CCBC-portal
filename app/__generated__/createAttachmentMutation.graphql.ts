/**
 * @generated SignedSource<<46de817a8a0ca8b3e943b82440d04df9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateAttachmentInput = {
  clientMutationId?: string | null;
  attachment: AttachmentInput;
};
export type AttachmentInput = {
  file?: any | null;
  description?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  fileSize?: string | null;
  applicationId: number;
  applicationStatusId?: number | null;
  createdBy?: number | null;
  createdAt?: any | null;
  updatedBy?: number | null;
  updatedAt?: any | null;
  archivedBy?: number | null;
  archivedAt?: any | null;
};
export type createAttachmentMutation$variables = {
  input: CreateAttachmentInput;
};
export type createAttachmentMutation$data = {
  readonly createAttachment: {
    readonly clientMutationId: string | null;
  } | null;
};
export type createAttachmentMutation = {
  variables: createAttachmentMutation$variables;
  response: createAttachmentMutation$data;
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
    "concreteType": "CreateAttachmentPayload",
    "kind": "LinkedField",
    "name": "createAttachment",
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
    "name": "createAttachmentMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createAttachmentMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9bf929eb09b8147cf8cb4ffd05933d50",
    "id": null,
    "metadata": {},
    "name": "createAttachmentMutation",
    "operationKind": "mutation",
    "text": "mutation createAttachmentMutation(\n  $input: CreateAttachmentInput!\n) {\n  createAttachment(input: $input) {\n    clientMutationId\n  }\n}\n"
  }
};
})();

(node as any).hash = "780bb02be2d5c153a748ba794565dba7";

export default node;
