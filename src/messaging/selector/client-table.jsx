var React = require('react');

module.exports = () => (
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
        <tr>
          <td>
            <div className="radio">
              <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" />
            </div>
          </td>
          <td> Simpson, Bart </td>
          <td> Marge </td>
        </tr>
        <tr>
          <td>
            <div className="radio">
              <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" />
            </div>
          </td>
          <td> Simpson, Lisa </td>
          <td> Marge </td>
        </tr>
        <tr>
          <td>
            <div className="radio">
              <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" />
            </div>
          </td>
          <td> Simpson, Maggie </td>
          <td> Homer </td>
        </tr>
      </tbody>
    </table>
  </form>
);