import { Quill } from "react-quill"
import * as AllQuill from "quill"
import Parchment from "parchment"

console.log(Inline)

class RoleBlot extends Parchment.Inline {
  static create(value: any) {
    let node: HTMLElement = super.create(null) as HTMLElement
    console.log("RoleBlot got value: ", value)

    // node.setAttribute("href", url)
    // node.setAttribute("target", "_blank")
    // node.setAttribute("title", node.textContent)
    return node
  }

  static formats(domNode: HTMLElement) {
    return true
  }

  format(name: string, value: any) {
    super.format(name, value)
  }

  formats() {
    let formats = super.formats()
    formats["link"] = RoleBlot.formats(this.domNode)
    return formats
  }
}
RoleBlot.blotName = "role"
RoleBlot.tagName = "span"
RoleBlot.className = "ql-role"

const Inline = Quill.import("blots/inline")

class RBlot extends Inline {}
RBlot.blotName = "rblot"
RBlot.tagName = "strong"
// RBlot.className = "ql-role"

export const addRoleBlot = () => {
  // Quill.register(RoleBlot)
  Quill.register(RBlot)
}
