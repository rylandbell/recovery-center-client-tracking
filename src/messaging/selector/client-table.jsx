'use strict';

import React from 'react';

import ClientRow from './client-row.jsx';

const api = ({clientList, selectedClientRow, selectClientRow}) => (
  <form className='form center-block' id='client-table' action='#' method='post' role='form' autoComplete='off' noValidate>
    <table className="table table-hover table-condensed " id="client-table">
      <tbody>
        {clientList.list.map(
          (client, index) =>
            <ClientRow client={client} key={index} selectedClientRow={selectedClientRow} selectClientRow={selectClientRow} />
          )
        }
      </tbody>
    </table>
  </form>
);

export default api;