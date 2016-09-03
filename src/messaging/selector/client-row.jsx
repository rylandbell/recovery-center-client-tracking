var React = require('react');

module.exports = ({client}) => (
  <tr>
    <td>
      <input type="radio" name="optionsRadios" id="optionsRadios1" value={client.id} />
    </td>
    <td> {client.lastName}, {client.firstName} </td>
  </tr>
);