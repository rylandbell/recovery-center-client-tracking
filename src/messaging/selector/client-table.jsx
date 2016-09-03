var React = require('react');

var ClientRow = require('./client-row.jsx');

module.exports = ({clientList}) => (
  <form className='form center-block' id='client-table' action='#' method='post' role='form' autoComplete='off' noValidate>
    <table className="table table-hover table-condensed " id="client-table">
      <tbody>
        {clientList.list.map(
          (client, index) =>
            <ClientRow client={client} key={index} />
          )
        }
      </tbody>
    </table>
  </form>
);