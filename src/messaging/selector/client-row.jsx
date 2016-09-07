'use strict';

import React from 'react';

const api = ({client, selectedClientRow, selectClientRow}) => {
  const handleClick = () => {
    selectClientRow(client.id);
  }
  return (
    <tr onClick={handleClick} className={(client.id===selectedClientRow?'active':'')}>
      <td>
        <input type="radio" name="optionsRadios" id="optionsRadios1" value={client.id} checked={client.id===selectedClientRow} />
      </td>
      <td> {client.lastName}, {client.firstName} </td>
    </tr>
  )
};

export default api;