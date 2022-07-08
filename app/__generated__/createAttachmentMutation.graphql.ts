/**
 * @generated SignedSource<<b05a7e1b63de00c37e3424cc26328bb2>>
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
    readonly attachment: {
      readonly file: any | null;
    } | null;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "file",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "createAttachmentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateAttachmentPayload",
        "kind": "LinkedField",
        "name": "createAttachment",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Attachment",
            "kind": "LinkedField",
            "name": "attachment",
            "plural": false,
            "selections": [
              (v2/*: any*/)
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
    "name": "createAttachmentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateAttachmentPayload",
        "kind": "LinkedField",
        "name": "createAttachment",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Attachment",
            "kind": "LinkedField",
            "name": "attachment",
            "plural": false,
            "selections": [
              (v2/*: any*/),
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
    "cacheID": "f3949c3ab56fea8d6febe27d9bd35150",
    "id": null,
    "metadata": {},
    "name": "createAttachmentMutation",
    "operationKind": "mutation",
    "text": "mutation createAttachmentMutation(\n  $input: CreateAttachmentInput!\n) {\n  createAttachment(input: $input) {\n    attachment {\n      file\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c97483662411ea4c90c5172911185f20";

export default node;
