import styled from "styled-components"
import React from "react"
import { Role as RoleType, Script } from "../../api/dataTypes"
import { DraftDecoratorComponentProps } from "../ScriptLinesEditor/customDraft/missingDraftTypes"

export const Wrapper = styled.div`
  //width: 100%;
`

export const BackgroundPaper = styled.div`
  background-color: #fff;
  box-shadow: 0px 0px 1px 1px rgba(214, 214, 214, 1);
  //padding: 0 10% 100px 10%;
  width: ${800 - 96 * 2}px;
  //min-width: 400px;
  //width: 100%;
  padding: 96px;
  box-sizing: border-box;
  //display: flex;
  //flex-direction: column;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  //font-size: 14px;
`

export const Title = styled.h1`
  color: ${(props) => props.theme.colors.undertone};
  margin-top: 0;
  margin-bottom: 32px;
`

export const Description = styled.span`
  margin-bottom: 32px;
`

export const RolesMetaContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-bottom: 24px;
  margin-bottom: 48px;
  border-bottom: 1px solid ${(props) => props.theme.colors.undertone};
`

type RemarkLineProps = DraftDecoratorComponentProps
export const InlineRole = styled.span<DraftDecoratorComponentProps>`
  background-color: ${(props) =>
    props.entityKey ? props.contentState.getEntity(props.entityKey).getData().color : "red"};
  padding: 2px;
  border-radius: 3px;
`

export const InlineComment = styled.span<DraftDecoratorComponentProps>`
  color: #000000b3;
  padding: 2px;
  border-radius: 3px;
`

export const Role = styled.span<{ color: string }>`
  //border-bottom: 2px solid ${(props) => props.color};
  background-color: ${(props) => props.color || "#8888ff"};

  padding: 2px;
  border-radius: 3px;
`

const RolesMetaRole = styled(Role)`
  margin: 5px;
`

type ScriptHeaderProps = {
  script: Script
  rolesColors: Record<RoleType, string>
}

export const ScriptHeader: React.FC<ScriptHeaderProps> = ({ script, rolesColors }) => {
  return (
    <span>
      <Title>{script.name}</Title>
      <RolesMetaRole color={"#00000000"}>
        <strong>Context:</strong>
      </RolesMetaRole>
      <Description>{script.description}</Description>
      <RolesMetaContainer>
        <RolesMetaRole color={"#00000000"}>
          <strong>Roles: </strong>
        </RolesMetaRole>
        {script.rolesMeta.map((roleMeta, i) => (
          <RolesMetaRole key={i} color={rolesColors[roleMeta.role]}>
            {roleMeta.role}
          </RolesMetaRole>
        ))}
      </RolesMetaContainer>
    </span>
  )
}
