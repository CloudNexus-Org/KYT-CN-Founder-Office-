import NodeCard from "./NodeCard";

function TeamLeadCard({ person, highlighted }) {
  return <NodeCard person={person} variant="teamLead" highlighted={highlighted} compact />;
}

export default TeamLeadCard;
