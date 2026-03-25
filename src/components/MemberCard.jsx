import NodeCard from "./NodeCard";

function MemberCard({ member, highlighted }) {
  return <NodeCard person={member} highlighted={highlighted} />;
}

export default MemberCard;
