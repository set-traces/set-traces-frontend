
var fs = require('fs');
var path = require('path');

const tagPrefix = "<"
const tagPostfix = ">"

const wrapTag = s => `${tagPrefix}${s}${tagPostfix}`

const TITLE_TAG = wrapTag("title")
const ROLES_TAG = wrapTag("roles")
const DESCRIPTION_TAG = wrapTag("description")
const STAGE_GUIDE_TAG = wrapTag("stage guide")
const START_TAG = wrapTag("start")
const END_TAG = wrapTag("end")


const hasRole = (rawLine) => {
  return rawLine.includes(":")
}
const parseRole = (rawLine) => {
  const roleEndIndex = rawLine.indexOf(":")
  if (roleEndIndex !== -1) {
    const role = rawLine.substring(0, roleEndIndex).trim()
    const text = rawLine.substring(roleEndIndex+1).trim()
    return [role, text]
  }
  else {
    return null
  }
}

const parseScriptLine = rawLine => {
  // check if the line is an action
  const actionStartIndex = rawLine.indexOf("[")
  const actionEndIndex = rawLine.indexOf("]")
  if (actionEndIndex !== -1 && actionEndIndex !== -1) {
    const role = hasRole(rawLine) ? parseRole(rawLine)[0].trim() : ""
    const roles = role ? [role] : []
    const text = rawLine.substring(actionStartIndex, actionEndIndex).trim()
    return {
      type: "ACTION",
      roles,
      text
    }
  }

  // check if the line is a remark
  if (hasRole(rawLine)) {
    const [role, text] = parseRole(rawLine)
    return {
      type: "REMARK",
      role,
      text
    }
  }

  return null
}

const parseScript = (text) => {
  const lines = text.split("\n")
  const cleanLines = lines.map(line => line.trim())


  let prevTag = ""
  let title = ""
  let description = ""
  const rolesMeta = []
  const scriptLines = []

  for (let line of cleanLines) {
    if (line === "") {
      continue
    }

    // check if the line has a tag
    const postfixIndex = line.indexOf(tagPostfix)
    if (line.startsWith(tagPrefix) && postfixIndex !== -1) {
      prevTag = line.substring(0, postfixIndex + 1)
      continue
    }

    switch (prevTag) {
      case TITLE_TAG:
        title += line
        break
      case DESCRIPTION_TAG:
        description += line
        break
      case ROLES_TAG:
        const roleData = parseRole(line)
        if (roleData) {
          const [role, roleDescription] = roleData
          const roleMeta = {
            role,
            description: roleDescription,
            actor: ""
          }
          rolesMeta.push(roleMeta)
        }
        break
      case STAGE_GUIDE_TAG:
        break
      case START_TAG:
        const scriptLine = parseScriptLine(line)
        scriptLine && scriptLines.push(scriptLine)
        break
      case END_TAG:
        break
    }
  }

  return {
    id: "id",
    name: title,
    rolesMeta,
    description,
    type: "unknown",
    lines: scriptLines
  }
}

const loadAndParseScript = (filepath, relSavePath = null) => {
  var filePath = path.join(__dirname, filepath);
  const content = fs.readFileSync(filePath, "utf8")
  const script = parseScript(content)

  if (relSavePath) {
    const savePath = path.join(__dirname, relSavePath)
    fs.writeFileSync(savePath, JSON.stringify(script), "utf8")
  }

  return script
}


const script = loadAndParseScript("../SexToyStory.txt", "../scripts_data/SexToyStory.json")
console.log(script)
