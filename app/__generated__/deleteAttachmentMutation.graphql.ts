/**
 * @generated SignedSource<<4296600ccdcf814e9326e8a809fa428c>>
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
    "cacheID": "11c19a568429257fa1ebe259cc3568b8",
    "id": null,
    "metadata": {},
    "name": "deleteAttachmentMutation",
    "operationKind": "mutation",
    "text": "mutation deleteAttachmentMutation(\n  $input: UpdateAttachmentByRowIdInput!\n) {\n  updateAttachmentByRowId(input: $input) {\n    attachment {\n      rowId\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "42820a079963c2ec643f8ca366b7555e";

export default node;
