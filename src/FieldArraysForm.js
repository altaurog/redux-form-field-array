import React from "react";
import structure from "redux-form/lib/structure/plain";
import { Field, Fields, FieldArray, reduxForm } from "redux-form";

const renderField = ({ input, meta: { pristine, touched, dirty } }) => {
  const color = dirty ? "#B9D6D7" : "white";
  return (
    <div>
      <input
        style={{ backgroundColor: color }}
        {...input}
        type="text"
        placeholder={input.name}
      />
      &nbsp;
      {pristine && <span>p</span>}
      {touched && <span>t</span>}
      {dirty && <span>d</span>}
    </div>
  );
};

const Row = ({ member, index, names, removeMember, ...props }) => {
  const fields = {};
  names.forEach(n => (fields[n] = structure.getIn(props, n)));
  const meta = {
    pristine: Object.values(fields).every(({ meta }) => meta.pristine),
    touched: Object.values(fields).some(({ meta }) => meta.touched),
    dirty: Object.values(fields).some(({ meta }) => meta.dirty)
  };

  const color = meta.dirty ? "#CFD4C1" : "white";
  return (
    <tbody>
      <tr style={{ backgroundColor: color }}>
        <td style={{ textAlign: "center" }}>
          {member}
          &nbsp;
          {meta.pristine && <span>p</span>}
          {meta.touched && <span>t</span>}
          {meta.dirty && <span>d</span>}
        </td>
        <td style={{ textAlign: "center" }}>
          <Field name={`${member}.firstName`} component={renderField} />
        </td>
        <td style={{ textAlign: "center" }}>
          <Field name={`${member}.lastName`} component={renderField} />
        </td>
        <td>
          <a href="#remove" onClick={event => removeMember(event, index)}>
            delete
          </a>
        </td>
      </tr>
    </tbody>
  );
};

const renderMembers = ({
  fields,
  meta: { touched, dirty, error, submitFailed }
}) => {
  function addMember(event) {
    fields.push({});
    event.preventDefault();
  }
  function removeMember(event, index) {
    fields.remove(index);
    event.preventDefault();
  }
  return (
    <div>
      <div style={{ maxWidth: "none" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <td colSpan="4">
                <a href="#add" onClick={addMember}>
                  Add Member
                </a>
                &nbsp;{dirty && <span>d</span>}
              </td>
            </tr>
            <tr>
              <th>Path</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th />
            </tr>
          </thead>
          {fields.map((member, index) => {
            const names = [".firstName", ".lastName"].map(n => member + n);
            return (
              <Fields
                key={index}
                member={member}
                index={index}
                component={Row}
                names={names}
                removeMember={removeMember}
              />
            );
          })}
        </table>
      </div>
    </div>
  );
};

const FieldArraysForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <FieldArray name="members" component={renderMembers} />
    </form>
  );
};

export default reduxForm({
  form: "fieldArrays",
  initialValues: { members: [{ firstName: "Aryeh Leib", lastName: "Taurog" }] }
})(FieldArraysForm);
