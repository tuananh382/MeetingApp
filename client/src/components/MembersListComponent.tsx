import React from 'react';

interface MembersListProps {
  members: string[];
}

const MembersListComponent: React.FC<MembersListProps> = ({ members }) => {
  return (
    <div className="members-list">
      <h2>Members</h2>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member}</li>
        ))}
      </ul>
    </div>
  );
};

export default MembersListComponent;
