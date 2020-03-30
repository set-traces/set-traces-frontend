import { Quill } from "react-quill"

const Delta = Quill.import("delta")
const Inline = Quill.import("blots/inline")
const Block = Quill.import("blots/block")

export class RoleBlot extends Inline {
  static blotName = "role"
  static className = "ql-role"
  static tagName = "span"

  static formats() {
    return true
  }
}

export class CommentBlot extends Inline {
  static blotName = "comment"
  static className = "ql-comment"
  static tagName = "span"

  static formats() {
    return true
  }
}

export const registerCustomBlots = () => {
  Quill.register("formats/role", RoleBlot)
  Quill.register("formats/role", CommentBlot)
}
