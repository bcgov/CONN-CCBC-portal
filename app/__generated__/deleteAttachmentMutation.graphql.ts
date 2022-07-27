/**
 * @generated SignedSource<<d196343972351daddd6f7eeadd90af8a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateAttachmentByRowIdInput = {
  clientMutationId?: string | null;
  attachmentPatch: AttachmentPatch;
  rowId: number;
};
export type AttachmentPatch = {
  file?: any | null;
  description?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  fileSize?: string | null;
  applicationId?: number | null;
  applicationStatusId?: number | null;
  isDeleted?: boolean | null;
  deletedBy?: number | null;
  deletedAt?: any | null;
  createdBy?: number | null;
  createdAt?: any | null;
  updatedBy?: number | null;
  updatedAt?: any | null;
  archivedBy?: number | null;
  archivedAt?: any | null;
};
export type deleteAttachmentMutation$variables = {
  input: UpdateAttachmentByRowIdInput;
};
export type deleteAttachmentMutation$data = {
  readonly updateAttachmentByRowId: {
    readonly attachment: {
      readonly rowId: number;
      readonly isDeleted: boolean;
    } | null;
  } | null;
};
export type deleteAttachmentMutation = {
  variables: deleteAttachmentMutation$variables;
  response: deleteAttachmentMutation$data;
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
  "name": "rowId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isDeleted",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "deleteAttachmentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateAttachmentPayload",
        "kind": "LinkedField",
        "name": "updateAttachmentByRowId",
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
    "name": "deleteAttachmentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateAttachmentPayload",
        "kind": "LinkedField",
        "name": "updateAttachmentByRowId",
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
    "cacheID": "c167e39821f5e8aac1d4f4aa097a0f6a",
    "id": null,
    "metadata": {},
    "name": "deleteAttachmentMutation",
    "operationKind": "mutation",
    "text": "mutation deleteAttachmentMutation(\n  $input: UpdateAttachmentByRowIdInput!\n) {\n  updateAttachmentByRowId(input: $input) {\n    attachment {\n      rowId\n      isDeleted\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a8735822f2106d65d78526bf47449d83";

export default node;
