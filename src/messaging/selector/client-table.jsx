var React = require('react');

module.exports = () => (
  <table className="dynamic-table row-border table-hover">
    <thead>
      <tr>
        <th> Name </th>
        <th> Assigned Clinician </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td> Bart </td>
        <td> Marge </td>
      </tr>
      <tr>
        <td> Lisa </td>
        <td> Marge </td>
      </tr>
      <tr>
        <td> Maggie </td>
        <td> Homer </td>
      </tr>
    </tbody>
  </table>
);