
import React, { CSSProperties } from 'react';

interface MembersListProps {
  members: string[];
}

const MembersListComponent: React.FC<MembersListProps> = ({ members }) => {
  // Inline CSS styles
  const styles: { [key: string]: CSSProperties } = {
    container: {
      padding: '10px',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '300px',
      margin: '0 auto',
    },
    heading: {
      fontSize: '1.5rem',
      textAlign: 'center',
      margin: '10px 0',
      color: '#007bff',
    },
    list: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    listItem: {
      padding: '8px',
      margin: '5px 0',
      borderRadius: '4px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      color: '#333',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Members</h2>
      <ul style={styles.list}>
        {members.map((member, index) => (
          <li key={index} style={styles.listItem}>
            {member}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MembersListComponent;
