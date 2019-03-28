import React from 'react';

import Input from '../components/Input';

const ConfigureMedicationProducts = () => (
  <main className="container-fluid overflow-auto">
    <h1 className="text-center">Configure Medication Products</h1>
    <div className="lead">Create and modify medication products.</div>
    <div className="row">
      <div className="col">
        <section>
          <h2>Heading 2</h2>
          <form className="form">
            <fieldset>
              <legend>Choose</legend>
              Toggle between creating new product or editing existing product.
            </fieldset>
            <div className="form-row">
              <div className="col">
                <Input type="text" name="adcId" value="" label="ADC ID" />
              </div>
            </div>
            <div className="form-row">
              <div className="col">
                <Input
                  type="text"
                  name="medication"
                  value=""
                  label="Medication"
                />
              </div>
              <div className="col">
                <Input type="text" name="strength" value="" label="Strength" />
              </div>
              <div className="col">
                <Input type="text" name="units" value="" label="Units" />
              </div>
              <div className="col">
                <Input type="text" name="form" value="" label="Form" />
              </div>
            </div>
          </form>
        </section>
      </div>
      <div className="col">
        <section>
          <h2>Heading 2</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Medication</th>
                <th scope="col">Strength</th>
                <th scope="col">Form</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td span="4">Programmaticly populate rows here.</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </main>
);

export default ConfigureMedicationProducts;
