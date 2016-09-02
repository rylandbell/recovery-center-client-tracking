var React = require('react');

var ClientRow = require('./client-row.jsx');

module.exports = ({clientList}) => (
  <form className='form' id='add-correspondent' action='#' method='post' role='form' autoComplete='off' noValidate>
    <table className="dynamic-table row-border table-hover">
      <thead>
        <tr>
          <th></th>
          <th> Name </th>
          <th> Assigned Clinician </th>
        </tr>
      </thead>
      <tbody>
        {clientList.map(
          (client, index) =>
            <ClientRow client={client} key={index} />
          )
        }
      </tbody>
    </table>
  </form>
);