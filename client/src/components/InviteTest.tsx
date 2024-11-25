import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface CreateInviteFormProps {
  saunaId: string;
}


const CreateInviteForm = ({ saunaId }: CreateInviteFormProps) => {
  const [email, setEmail] = useState('');
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently();

      const response = await fetch('http://localhost:5001/api/invite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
            email,
            saunaId 
        })
    });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Failed to create invite: ${JSON.stringify(errorData)}`);
    }

      if (response.ok) {
        console.log('Invite created successfully');
        setEmail('');
        
      } else {
        console.error('Failed to create invite:', response.status);
      }
    } catch (error) {
      console.error('Error creating invite:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Create Invite</button>
    </form>
  );
};

export default CreateInviteForm;